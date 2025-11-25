import User from '../models/userModel.js';
import Channel from '../models/channelModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const addToChannel = catchAsync(async (req, res, next) => {
  const { userId, channelId } = req.body;
  const user = await User.findByPk(userId);

  if (!user) return next(new AppError(`No user found with id ${userId}!`), 404);

  const channel = await Channel.findByPk(channelId);

  if (!channel)
    return next(new AppError(`No channel found with id ${channelId}`), 404);

  await user.addChannels(channel);

  res.status(200).json({
    status: 'success',
    message: `Added user ${user.firstName} to channel ${channelName}`,
    data: null,
  });
  next();
});

export const removeFromChannel = catchAsync(async (req, res, next) => {
  const { userId, channelId } = req.body;

  const user = await User.findByPk(userId);

  if (!user) return next(new AppError(`No user found with id ${userId}!`), 404);

  const channel = await Channel.findByPk(channelId);

  if (!channel)
    return next(new AppError(`No channel found with id ${channelId}`, 404));

  await user.removeChannels(channel);

  res.status(200).json({
    status: 'success',
    message: `Removed user ${user.firstName} from channel ${channelId}`,
    data: null,
  });
  next();
});

export const getAllChannelUsers = catchAsync(async (req, res, next) => {
  const channelId = req.params.id;

  const channel = await Channel.findByPk(channelId, {
    include: { model: User },
  });

  if (!channel)
    return next(new AppError(`No channel found with id ${channelId}!`), 404);

  // const channelUsers = channel.map((ch) => ch.users);

  res.status(200).json({
    status: 'success',
    results: channel.users.length,
    data: channel.users,
  });
});
