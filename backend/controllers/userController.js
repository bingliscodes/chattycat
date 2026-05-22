import { Op } from 'sequelize';

import User from '../models/userModel.js';
import Channel from '../models/channelModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Organization from '../models/organizationModel.js';
import { DirectMessageRoom } from '../models/messageModel.js';

export const getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

export const getMyOrganizations = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ['firstName', 'lastName', 'id'],
    include: {
      model: Organization,
      as: 'Organizations',
      attributes: ['organizationName', 'id'],
    },
  });

  res.status(200).json({
    status: 'success',
    results: user.Organizations.length,
    data: user.Organizations,
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'passwordConfirm', 'password'],
    },
    include: [
      { model: Channel, as: 'Channels', attributes: ['channelName', 'id'] },
      {
        model: Organization,
        as: 'Organizations',
        attributes: ['organizationName', 'id'],
      },
    ],
  });

  if (!user) return next(new AppError('No user found!', 404));

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  const orgId = req.query.orgId;

  const queryOptions = {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'passwordConfirm', 'password'],
    },
    include: [
      { model: Channel, as: 'Channels', attributes: ['channelName', 'id'] },
      {
        model: Organization,
        as: 'Organizations',
        attributes: ['organizationName'],
      },
    ],
  };

  if (orgId) queryOptions.where = { organizationId: orgId };

  const users = await User.findAll(queryOptions);

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
  // Retrieves a list of all users that the specified user has dm's with within the specified organization
  const orgId = req.query.orgId;
  const { userId } = req.params;

  if (!orgId) {
    return next(new AppError('Missing organization ID in query.', 400));
  }

  const rooms = await DirectMessageRoom.findAll({
    where: {
      organizationId: orgId,
      [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
    },
    include: [
      {
        model: User,
        as: 'User1',
        attributes: ['id', 'firstName', 'lastName', 'avatarUrl'],
      },
      {
        model: User,
        as: 'User2',
        attributes: ['id', 'firstName', 'lastName', 'avatarUrl'],
      },
    ],
  });

  const uniqueUsers = [];
  const seen = new Set();

  for (const room of rooms) {
    const other = room.user1Id === userId ? room.User2 : room.User1;
    if (other && !seen.has(other.id)) {
      seen.add(other.id);
      uniqueUsers.push(other);
    }
  }

  res.status(200).json({
    status: 'success',
    results: uniqueUsers.length,
    data: uniqueUsers,
  });
});
