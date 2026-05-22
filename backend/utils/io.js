import { Message } from '../models/messageModel.js';
import userChannelMap from '../utils/userChannelMap.js';
import { saveAttachmentRecords } from './multerS3.js';

export const setupIO = (io) => {
  const userSocketMap = new Map(); // socketId -> userId

  io.on('connection', (socket) => {
    console.log('🔌 [SERVER] User connected:', socket.id);

    socket.on('join-room', (data, mode, cb) => {
      socket.join(data.id);
      if (mode === 'ch') {
        const { channelName } = data;
        console.log(
          `✅ [SERVER] Socket ${socket.id} joined room: ${channelName}`,
        );
        if (cb) cb(`Joined room: ${channelName}`);
      }
      if (mode === 'dm') {
        const { firstName, lastName } = data;
        console.log(
          `✅ [SERVER] Socket ${socket.id} joined private chat with: ${firstName} ${lastName}`,
        );
        if (cb) cb(`Joined private chat with: ${firstName} ${lastName}`);
      }
    });

    socket.on('register-user', (userId) => {
      userSocketMap.set(userId, socket.id);
    });

    socket.on('new-dm', ({ senderId, receiverId }) => {
      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        console.log(
          `[SERVER] Notifying ${receiverId} of new DM from ${senderId}`,
        );
        io.to(receiverSocketId).emit('new-dm', { senderId });
      }
    });

    socket.on('send-message', async (messageContent, messageData) => {
      // Security: Ensure user has permission to send message to the channel
      if (!validateUserPermissions(messageData.senderId, messageData.channelId))
        return;

      // Send message to DB
      const createdMessage = await createMessage(messageData);
      const messageId = createdMessage.id;

      if (messageContent.attachments?.length) {
        const attachments = await saveAttachmentRecords(
          messageContent.attachments,
          messageId,
        );
      }

      // Build confirmed message with real ID
      const confirmedMessage = {
        ...messageContent,
        id: messageId,
        tempId: messageData.tempId,
        status: 'sent',
      };

      // Send confirmation to sender
      socket.emit('message-confirmed', confirmedMessage);

      // Broadcast to others in the room
      if (messageData.type === 'channel' && messageData.channelId) {
        socket.broadcast
          .to(messageData.channelId)
          .emit('receive-message', confirmedMessage);
      } else if (messageData.type === 'direct' && messageData.roomId) {
        socket.broadcast
          .to(messageData.roomId)
          .emit('receive-message', confirmedMessage);
      }
    });

    socket.on('join-thread', ({ parentMessageId }) => {
      socket.join(parentMessageId);
      console.log(
        `[JOIN] Socket ${socket.id} joined thread ${parentMessageId}`,
      );
    });

    socket.on('leave-thread', ({ parentMessageId }) => {
      socket.leave(parentMessageId);
      console.log(`[LEAVE] Socket ${socket.id} left thread ${parentMessageId}`);
    });

    socket.on('send-thread-message', (messageContent, messageData) => {
      const { parentMessageId, senderId } = messageData;

      createMessage(messageData);

      socket.to(parentMessageId).emit('receive-thread-message', messageContent);

      console.log(
        `📨 Thread Reply from ${senderId}: ${messageContent.messageBody}`,
      );
    });
  });
};

const createMessage = async (messageData) => {
  try {
    const newMessage = await Message.create(messageData);

    if (messageData.parentMessageId) {
      await Message.increment('replyCount', {
        by: 1,
        where: { id: messageData.parentMessageId },
      });
    }

    return newMessage;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const validateUserPermissions = (userId, channelId) => {
  if (!channelId) return true;
  const channels = userChannelMap.data.get(userId);
  return channels.includes(channelId);
};

// TODO: Figure out why members added to channel get an error trying to send a message:
// TypeError: Cannot read properties of undefined (reading 'includes')
//     at validateUserPermissions (file:///opt/render/project/src/backend/utils/io.js:129:19)
//     at Socket.<anonymous> (file:///opt/render/project/src/backend/utils/io.js:45:12)
//     at Socket.emit (node:events:518:28)
//     at Socket.emitUntyped (/opt/render/project/src/backend/node_modules/socket.io/dist/typed-events.js:69:22)
//     at /opt/render/project/src/backend/node_modules/socket.io/dist/socket.js:697:39
//     at process.processTicksAndRejections (node:internal/process/task_queues:85:11)
