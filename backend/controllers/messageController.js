import { Op } from 'sequelize';

import { createOne } from './handlerFactory.js';
import { ChannelMessage, DirectMessage } from '../models/messageModel.js';
import catchAsync from '../utils/catchAsync.js';
import Channel from '../models/channelModel.js';
import User from '../models/userModel.js';

export const getAllMessages = catchAsync(async (req, res, next) => {
  const messages = await ChannelMessage.findAll({
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

export const createChannelMessage = createOne(ChannelMessage);
export const createDirectMessage = createOne(DirectMessage);

export const getChannelMessages = catchAsync(async (req, res, next) => {
  const channelId = req.params.id;

  const messages = await ChannelMessage.findAll({
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

export const getAllReceivedMessages = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);

  const messages = await user.getReceivedMessages({
    include: [
      {
        model: User,
        as: 'Sender',
        attributes: ['id', 'firstName', 'lastName'],
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: messages,
  });
});

export const getDirectMessagesWithUser = catchAsync(async (req, res, next) => {
  const senderId = req.params.userId;

  const user = await User.findByPk(req.user.id);

  const messages = await DirectMessage.findAll({
    where: {
      [Op.or]: [
        { [Op.and]: [{ senderId }, { receiverId: req.user.id }] },
        { [Op.and]: [{ senderId: req.user.id }, { receiverId: senderId }] },
      ],
    },
    order: [['createdAt', 'ASC']],
    include: [
      {
        model: User,
        as: 'Sender',
        attributes: ['id', 'firstName', 'lastName'],
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: messages,
  });
});
