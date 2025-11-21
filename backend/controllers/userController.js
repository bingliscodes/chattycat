import User from '../models/userModel.js';
import Channel from '../models/channelModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Organization from '../models/organizationModel.js';
import { DirectMessage } from '../models/messageModel.js';

export const getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['createdAt', 'updatedAt', 'passwordConfirm'] },
    include: [
      { model: Channel, attributes: ['channelName', 'id'] },
      { model: Organization, attributes: ['organizationName'] },
    ],
  });

  if (!user) return next(new AppError('No user found!', 404));

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'passwordConfirm'] },
    include: [
      { model: Channel, attributes: ['channelName', 'id'] },
      { model: Organization, attributes: ['organizationName'] },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('This route is not for password updates', 400));

  const user = await User.findByPk(req.user.id);

  const updatedUser = await user.update(req.body);

  res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

export const getDirectMessageList = catchAsync(async (req, res, next) => {
  // Retrieves a list of all users that the specified user has dm's with
  const user = await User.findByPk(req.params.userId);

  const messages = await user.getReceivedMessages({
    include: [
      {
        model: User,
        as: 'Sender',
        attributes: ['id', 'avatarUrl', 'firstName', 'lastName'],
      },
    ],
  });

  if (!messages) next(new AppError('Failed to fetch messages for user.'));

  const uniqueUsers = [];
  const userIds = new Set();

  for (const msg of messages) {
    const sender = msg.Sender;
    if (sender && !userIds.has(sender.id)) {
      userIds.add(sender.id);
      uniqueUsers.push(sender);
    }
  }

  res.status(200).json({
    status: 'success',
    results: uniqueUsers.length,
    data: uniqueUsers,
  });
});
