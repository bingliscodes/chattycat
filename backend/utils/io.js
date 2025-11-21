import sequelize from './database.js';
import { ChannelMessage, DirectMessage } from '../models/messageModel.js';

export const setupIO = (io) => {
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

    socket.on(
      'send-message',
      ({ messageBody, sender, channel, timestamp }, messageData, mode) => {
        // Send message to DB
        createMessage(messageData, mode);

        console.log(`📨 [SERVER] Message from ${socket.id}: ${messageBody}`);
        if (channel) {
          socket.broadcast.to(channel).emit('receive-message', {
            messageBody,
            sender,
            channel,
            timestamp,
          });
          console.log(`📤 Broadcasted to room ${channel}: ${messageBody}`);
        } else {
          socket.broadcast.emit('receive-message', {
            messageBody,
            sender,
            channel,
            timestamp,
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
