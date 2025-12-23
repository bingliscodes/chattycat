import { Message } from '../models/messageModel.js';
import userChannelMap from '../utils/userChannelMap.js';
import { uploadAndSaveAttachments } from './multerS3.js';

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
      const senderSocketId = userSocketMap.get(senderId);
      if (senderSocketId) {
        console.log(
          `[SERVER] Notifying ${senderId} of new DM from ${receiverId}`,
        );
        io.to(senderSocketId).emit('new-dm', { receiverId });
      }
    });

    socket.on('send-message', async (messageContent, messageData) => {
      // Security: Ensure user has permission to send message to the channel
      if (!validateUserPermissions(messageData.senderId, messageData.channelId))
        return;
      // Send message to DB
      const createdMessage = await createMessage(messageData);
      const messageId = createdMessage.id;

      let attachments = [];
      if (messageContent.attachments?.length) {
        attachments = await uploadAndSaveAttachments(
          messageContent.attachments,
          messageId,
        );
      }

      // TODO: Determine if we need to add tempId to messageContent, or if it's fine in messageData alone. Also make sure
      // I understand what tempId is doing
      console.log(
        `📨 [SERVER] Message from ${socket.id}: ${messageContent.messageBody}`,
      );
      if (messageContent.channel) {
        socket.broadcast
          .to(messageContent.channel)
          .emit('receive-message', messageContent);
        console.log(
          `📤 Broadcasted to room ${messageContent.channel}: ${messageContent.messageBody}`,
        );
      } else {
        socket.broadcast.emit('receive-message', messageContent);
        console.log('📤 Broadcasted globally:', messageContent.messageBody);
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
