export const setupIO = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 [SERVER] User connected:', socket.id);

    socket.on('join-room', ({ id: channelId, channelName }, cb) => {
      socket.join(channelId);
      console.log(
        `✅ [SERVER] Socket ${socket.id} joined room: ${channelName}`,
      );
      if (cb) cb(`Joined room: ${channelName}`);
    });

    socket.on('send-message', ({ messageBody, sender, channel, timestamp }) => {
      console.log(`📨 [SERVER] Message from ${socket.id}: ${messageBody}`);
      if (channel) {
        socket.broadcast
          .to(channel)
          .emit('receive-message', { messageBody, sender, channel, timestamp });
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
    });
  });
};
