import User from '../models/userModel.js';
import Channel from '../models/channelModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { findOrCreateDMRoom } from '../utils/createRoom.js';
import userChannelMap from '../utils/userChannelMap.js';

export const addToChannel = catchAsync(async (req, res, next) => {
  const { userId, channelId } = req.body;
  const user = await User.findByPk(userId);

  if (!user) return next(new AppError(`No user found with id ${userId}!`), 404);

  const channel = await Channel.findByPk(channelId);

  if (!channel)
    return next(new AppError(`No channel found with id ${channelId}`), 404);

  await user.addChannels(channel);
  const updatedChannels = await user.getChannels({ attributes: ['id'] });
  const channelIds = updatedChannels.map((ch) => ch.id);
  userChannelMap.data.set(userId, channelIds);

  res.status(200).json({
    status: 'success',
    message: `Added user ${user.firstName} to channel ${channelId}`,
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
  const updatedChannels = await user.getChannels({ attributes: ['id'] });
  const channelIds = updatedChannels.map((ch) => ch.id);

  // Set the channels as the new channels a user is a part of
  userChannelMap.data.set(userId, channelIds);

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

  res.status(200).json({
    status: 'success',
    results: channel.users.length,
    data: channel.users,
  });
});

export const getPrivateMessageRoomId = catchAsync(async (req, res, next) => {
  const { user1Id, user2Id } = req.body;

  const roomId = await findOrCreateDMRoom(user1Id, user2Id);
  if (!roomId)
    return next(
      new AppError(
        `An unexpected error has occured creating the room. Please try again later`,
      ),
      400,
    );

  return res.status(200).json({
    status: 'success',
    data: roomId,
  });
});
