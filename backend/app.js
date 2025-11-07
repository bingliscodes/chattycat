import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

import AppError from './utils/appError.js';

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173'],
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
// Default error handling
app.get('/{*any}', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

export default app;
