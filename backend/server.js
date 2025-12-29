import './config/env.js';
import { Server } from 'socket.io';
import { setupIO } from './utils/io.js';

import app from './app.js';

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! Shutting down...');
  console.log(err);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}...`);
  console.log(`mode is ${process.env.NODE_ENV}`);
});

const io = new Server(server, {
  maxHttpBufferSize: 10 * 1024 * 1024,
  cors: {
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://chattycat.netlify.app',
      'https://admin.socket.io',
    ],
    credentials: true,
  },
});

setupIO(io);

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection! Shutting down...');
  console.log(err);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated!');
  });
});

export default server;
