import { Op } from 'sequelize';

import { createOne } from './handlerFactory.js';
import {
  ChannelMessage,
  DirectMessage,
  Message,
} from '../models/messageModel.js';
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

export const createChannelMessage = createOne(ChannelMessage);
export const createDirectMessage = createOne(DirectMessage);

export const createMessage = catchAsync(async (req, res, next) => {
  console.log('creating message:', req.body);
  const newMsg = await Message.create(req.body);

  if (req.body.parentMessageId) {
    await Message.increment('replyCount', {
      by: 1,
      where: { id: req.body.parentMessageId },
    });
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: newMsg,
    },
  });
});

export const getChannelMessages = catchAsync(async (req, res, next) => {
  const channelId = req.params.id;

  const messages = await Message.findAll({
    where: { [Op.and]: [{ channelId }, { parentMessageId: null }] },
    include: [
      {
        model: Channel,
        as: 'Channel',
        attributes: ['channelName', 'id'],
      },
      { model: User, as: 'Sender', attributes: ['firstName', 'lastName'] },
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

  const messages = await Message.findAll({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { [Op.and]: [{ senderId }, { receiverId: req.user.id }] },
            { [Op.and]: [{ senderId: req.user.id }, { receiverId: senderId }] },
          ],
        },
        { parentMessageId: null },
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

export const getThreadMessages = catchAsync(async (req, res, next) => {
  const parentMessageId = req.params.id;

  const messages = await Message.findAll({
    where: { parentMessageId },
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
