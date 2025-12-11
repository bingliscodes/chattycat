import User from '../models/userModel.js';
import { Message } from '../models/messageModel.js';
import Channel from '../models/channelModel.js';

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
      console.log('new dm emitted', senderId, receiverId);
      const senderSocketId = userSocketMap.get(senderId);
      if (senderSocketId) {
        console.log(
          `[SERVER] Notifying ${senderId} of new DM from ${receiverId}`,
        );
        io.to(senderSocketId).emit('new-dm', { receiverId });
      }
    });

    socket.on('send-message', (messageContent, messageData) => {
      // Security: Ensure user has permission to send message to a channel
      if (
        !validateUserPermissions(
          messageData.senderId,
          messageData.channelId ?? messageData.roomId,
        )
      )
        return;

      // Send message to DB
      createMessage(messageData);

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
    await Message.create(messageData);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const validateUserPermissions = async (userId, channelId) => {
  /* Will check if the user has permission to send messages to the channel */
  try {
    const user = await User.findByPk(userId, { include: Channel });

    const channelIds = user.channels.map((ch) => ch.id);

    return channelIds.includes(channelId);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
