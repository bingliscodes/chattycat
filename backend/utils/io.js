import User from '../models/userModel.js';
import { ChannelMessage, DirectMessage } from '../models/messageModel.js';
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
      const senderSocketId = userSocketMap.get(senderId);
      if (senderSocketId) {
        console.log(
          `[SERVER] Notifying ${senderId} of new DM from ${receiverId}`,
        );
        io.to(senderSocketId).emit('new-dm', { receiverId });
      }
    });

    socket.on(
      'send-message',
      (
        { messageBody, sender, channel, timestamp, datestamp },
        messageData,
        mode,
      ) => {
        // Security: Ensure user has permission to send message to a channel

        if (
          !validateUserPermissions(
            messageData.senderId ?? messageData.userId,
            messageData.channelId ?? messageData.roomId,
          )
        )
          return;
        // Send message to DB
        createMessage(messageData, mode);

        console.log(`📨 [SERVER] Message from ${socket.id}: ${messageBody}`);
        if (channel) {
          socket.broadcast.to(channel).emit('receive-message', {
            messageBody,
            sender,
            channel,
            timestamp,
            datestamp,
          });
          console.log(`📤 Broadcasted to room ${channel}: ${messageBody}`);
        } else {
          socket.broadcast.emit('receive-message', {
            messageBody,
            sender,
            channel,
            timestamp,
            datestamp,
          });
          console.log('📤 Broadcasted globally:', messageBody);
        }
      },
    );
  });
};

const createMessage = async (messageData, mode) => {
  if (mode === 'ch') {
    const { messageContent, userId, channelId } = messageData;
    try {
      await ChannelMessage.create({ messageContent, userId, channelId });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  if (mode === 'dm') {
    const { messageContent, senderId, receiverId, roomId } = messageData;
    try {
      await DirectMessage.create({
        messageContent,
        senderId,
        receiverId,
        roomId,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
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
