import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Channel from '../models/channelModel.js';
import { createOne } from './handlerFactory.js';

export const createChannel = createOne(Channel);
