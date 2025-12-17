import Organization from '../models/organizationModel.js';
import Channel from '../models/channelModel.js';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { createOne, deleteOne, getAll } from './handlerFactory.js';

export const createOrganization = createOne(Organization);
export const deleteOrganization = deleteOne(Organization);
export const getAllOrganizations = getAll(Organization);

export const getAllOrganizationChannels = catchAsync(async (req, res, next) => {
  const orgId = req.params.id;
  console.log('orgId:', orgId);
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
      attributes: ['id', 'firstName', 'lastName', 'avatarUrl', 'role'],
    },
  });

  res.status(200).json({
    status: 'success',
    results: orgRes.users.length,
    data: orgRes.users,
  });
});
