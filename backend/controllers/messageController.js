import { createOne } from './handlerFactory.js';
import Message from '../models/messageModel.js';
import catchAsync from '../utils/catchAsync.js';
import Channel from '../models/channelModel.js';
import User from '../models/userModel.js';

export const getAllMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.findAll({
    include: [
      { model: Channel, attributes: ['channelName', 'id'] },
      { model: User, attributes: ['firstName', 'lastName'] },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: messages,
  });
});

export const createMessage = createOne(Message);

export const getChannelMessages = catchAsync(async (req, res, next) => {
  const channelId = req.params.id;

  const messages = await Message.findAll({
    where: { channelId },
    include: [
      { model: Channel, attributes: ['channelName', 'id'] },
      { model: User, attributes: ['firstName', 'lastName'] },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: messages,
  });
});
