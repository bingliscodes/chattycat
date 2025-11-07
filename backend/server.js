import dotenv from 'dotenv';
import sequelize from './utils/database.js';

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! Shutting down...');
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
import app from './app.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}...`);
  console.log(`mode is ${process.env.NODE_ENV}`);
});

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
