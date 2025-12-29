import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

import User from './models/userModel.js';
import Channel from './models/channelModel.js';
import Organization from './models/organizationModel.js';
import UserChannel from './models/userChannelModel.js';
import modelRelationships from './dataModeling/entityRelationships.js';

import AppError from './utils/appError.js';

import channelRouter from './routes/channelRoutes.js';
import userRouter from './routes/userRoutes.js';
import organizationRouter from './routes/organizationRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import authRouter from './routes/authRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';

const app = express();
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://chattycat.netlify.app',
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(compression());

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/channels', channelRouter);
app.use('/api/v1/organizations', organizationRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/uploads', uploadRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  res.status(statusCode).json({
    status,
    message: err.message,
  });
});

// Default error handling
app.get('/{*any}', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

export default app;
