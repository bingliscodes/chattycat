import Organization from '../models/organizationModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { createOne } from './handlerFactory.js';

export const createOrganization = createOne(Organization);
