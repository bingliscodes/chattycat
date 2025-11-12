export const setupIO = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
  });
};
