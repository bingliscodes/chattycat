import Organization from '../models/organizationModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { createOne, deleteOne, getAll } from './handlerFactory.js';

export const createOrganization = createOne(Organization);
export const deleteOrganization = deleteOne(Organization);
export const getAllOrganizations = getAll(Organization);
