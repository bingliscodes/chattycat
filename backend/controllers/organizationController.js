import Organization from '../models/organizationModel.js';
import Channel from '../models/channelModel.js';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { deleteOne, getAll } from './handlerFactory.js';

export const createOrganization = catchAsync(async (req, res, next) => {
  const newOrg = await Organization.create(req.body);

  await newOrg.addUser(req.user.id, {
    through: { role: 'owner' },
  });

  res.status(201).json({
    status: 'success',
    data: {
      data: newOrg,
    },
  });
});

export const addUserToOrganization = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  const orgId = req.headers['x-organization-id'];
  if (!user)
    return next(new AppError('No user found with that email address.', 404));

  const org = await Organization.findByPk(orgId);

  const isUserInOrg = await org.hasUser(user.id);

  if (isUserInOrg)
    return next(
      new AppError('User is already a member of this organization!', 400),
    );

  await org.addUser(user.id, {
    through: { role: 'member' },
  });

  res.status(200).json({
    status: 'success',
    message: `User ${user.firstName} ${user.lastName} successfully added to organization ${org.organizationName} and assigned default role of member`,
  });
});

export const deleteOrganization = deleteOne(Organization);
export const getAllOrganizations = getAll(Organization);

export const getAllOrganizationChannels = catchAsync(async (req, res, next) => {
  const orgId = req.params.id;
  const orgRes = await Organization.findByPk(orgId, {
    include: { model: Channel },
  });
  res.status(200).json({
    status: 'success',
    results: orgRes.channels.length,
    data: orgRes.channels,
  });
});

export const getAllOrganizationUsers = catchAsync(async (req, res, next) => {
  const orgId = req.params.id;

  const orgRes = await Organization.findByPk(orgId, {
    include: [
      {
        model: User,
        as: 'Users',
        attributes: ['id', 'firstName', 'lastName', 'avatarUrl'],
        through: { attributes: [] }, // optional: hide join table fields
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: orgRes.Users.length,
    data: orgRes.Users,
  });
});
