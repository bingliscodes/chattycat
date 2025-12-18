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
    include: {
      model: User,
      attributes: ['id', 'firstName', 'lastName', 'avatarUrl'],
    },
  });

  res.status(200).json({
    status: 'success',
    results: orgRes.users.length,
    data: orgRes.users,
  });
});
