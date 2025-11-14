import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Channel from '../models/channelModel.js';
import { createOne, deleteOne, getAll } from './handlerFactory.js';

export const createChannel = createOne(Channel);

export const deleteChannel = deleteOne(Channel);

export const getAllChannels = getAll(Channel);
