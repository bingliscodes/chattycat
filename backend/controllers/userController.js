import User from '../models/userModel.js';
import Channel from '../models/channelModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Organization from '../models/organizationModel.js';

export const getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);

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
      { model: Channel, attributes: ['channelName'] },
      { model: Organization, attributes: ['organizationName'] },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});
