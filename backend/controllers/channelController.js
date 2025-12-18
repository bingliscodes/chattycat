import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Channel from '../models/channelModel.js';
import { createOne, deleteOne, getAll } from './handlerFactory.js';

export const createChannel = catchAsync(async (req, res, next) => {
  const newChannel = await Channel.create(req.body);

  await newChannel.addUser(req.user.id);

  res.status(201).json({
    status: 'success',
    data: {
      data: newChannel,
    },
  });
});

export const deleteChannel = deleteOne(Channel);

export const getAllChannels = getAll(Channel);
