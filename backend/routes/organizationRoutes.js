import express from 'express';
import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
  getAllOrganizationChannels,
  getAllOrganizationUsers,
} from '../controllers/organizationController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.get('/', getAllOrganizations);
router.get('/:id/channels', getAllOrganizationChannels);
router.get('/:id/users', getAllOrganizationUsers);

router.use(protect);
router.use(restrictTo('superuser'));
router.post('/', createOrganization);

router.route('/:id').delete(deleteOrganization);

export default router;
