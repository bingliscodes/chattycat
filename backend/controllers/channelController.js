import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Channel from '../models/channelModel.js';

export const createChannel = catchAsync(async (req, res, next) => {
  const newChannel = await Channel.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newChannel,
    },
  });
});
