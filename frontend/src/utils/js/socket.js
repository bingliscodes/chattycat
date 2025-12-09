import { io } from 'socket.io-client';

export const createConnection = (userId, roomId = 'chatroom-1') => {
  return new Promise((resolve, reject) => {
    const socket = io(import.meta.env.VITE_SERVER_URL, {
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('🔌 [CLIENT] Connected with socket ID:', socket.id);

      socket.emit('register-user', userId);

      // JOIN room AFTER connect
      socket.emit('join-room', roomId, 'ch', (ack) => {
        console.log('✅', ack); // should log: "Joined room: chatroom-1"
      });

      resolve(socket); // Only resolve when ready
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connect_error:', err);
      reject(err);
    });

    // You can attach message listener here or in component
    socket.on('connect_error', (err) => {
      console.error('Socket connect_error:', err);
      reject(err);
    });

    socket.on('receive-message', ({ messageBody, sender }) => {
      console.log(
        `[CLIENT] Message received from ${sender.firstName} ${sender.lastName}: ${messageBody}`
      );
    });
  });
};
