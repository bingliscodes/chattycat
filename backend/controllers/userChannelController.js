import User from '../models/userModel.js';
import Channel from '../models/channelModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Organization from '../models/organizationModel.js';

export const addToChannel = catchAsync(async (req, res, next) => {
  const { userId, channelName } = req.body;
  const user = await User.findByPk(userId);

  if (!user) return next(new AppError(`No user found with id ${userId}!`), 404);

  const channel = await Channel.findOne({
    where: { channelName: channelName, organizationId: user.organizationId },
  });

  if (!channel)
    return next(
      new AppError(`No channel found by the name of ${channelName}`, 400),
    );

  await user.addChannels(channel);

  res.status(200).json({
    status: 'success',
    message: `Added user ${user.firstName} to channel ${channelName}`,
    data: null,
  });
  next();
});

export const removeFromChannel = catchAsync(async (req, res, next) => {
  const { userId, channelName } = req.body;

  const user = await User.findByPk(userId);

  if (!user) return next(new AppError(`No user found with id ${userId}!`), 404);

  const channel = await Channel.findOne({
    where: { channelName, organizationId: user.organizationId },
  });

  if (!channel)
    return next(
      new AppError(`No channel found by the name of ${channelName}`, 400),
    );

  await user.removeChannels(channel);

  res.status(204).json({
    status: 'success',
    message: `Removed user ${user.firstName} from channel ${channelName}`,
    data: null,
  });
});
