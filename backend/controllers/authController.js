import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import AppError from '../utils/appError.js';

import catchAsync from '../utils/catchAsync.js';
import User from '../models/userModel.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, passwordConfirm } = req.body;

  if (!firstName || !lastName || !email || !password || !passwordConfirm) {
    return next(
      new AppError(
        'One or more fields are missing, please check the form and try again!',
        400,
      ),
    );
  }

  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, req, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password are populated
  if (!email || !password)
    return next(new AppError('Please provide email and password!', 400));

  // 2) Check if user exists && password is valid
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3) Send token to client
  createSendToken(user, 200, req, res);
});

export const logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  });
  res.status(200).json({ status: 'success' });
};

export const protect = catchAsync(async (req, res, next) => {
  // 1) Get token and check if it's there
  const token = req.cookies.jwt;

  if (!token)
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser)
    return next(
      new AppError('The user belonging to this token no longer exists', 401),
    );

  // 4) Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  // Finally grant access to protected route and add user to the request
  req.user = currentUser;
  next();
});

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      next(
        new AppError('You do not have permission to perform this action', 403),
      );
    next();
  };

export const sendUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: req.user,
  });

  next();
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Find user by POSTed email
  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user)
    return next(new AppError('There is no user with that email address.', 404));

  // 2) Generate Reset Token
  const resetToken = user.createPasswordResetToken();
  await user.save();

  // 3) Send to user's email
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500,
    );
  }

  // 3) Send to user's email
});
