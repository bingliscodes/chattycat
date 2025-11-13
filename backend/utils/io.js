export const setupIO = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 [SERVER] User connected:', socket.id);

    socket.on('join-room', (roomId, cb) => {
      socket.join(roomId);
      console.log(`✅ [SERVER] Socket ${socket.id} joined room: ${roomId}`);
      if (cb) cb(`Joined room: ${roomId}`);
    });

    socket.on('send-message', (message, roomId) => {
      console.log(`📨 [SERVER] Message from ${socket.id}: ${message}`);
      if (roomId) {
        socket.broadcast
          .to(roomId)
          .emit('receive-message', `${socket.id}: message`); // ✅ Includes sender
        console.log(`📤 Broadcasted to room ${roomId}: ${message}`);
      } else {
        socket.broadcast.emit('receive-message', message);
        console.log('📤 Broadcasted globally:', message);
      }
    });
  });
};
