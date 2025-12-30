import express from 'express';
import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
  getAllOrganizationChannels,
  getAllOrganizationUsers,
  addUserToOrganization,
} from '../controllers/organizationController.js';
import { protect, requireOrgRole } from '../controllers/authController.js';

const router = express.Router();

router.get('/', getAllOrganizations);
router.get('/:id/channels', getAllOrganizationChannels);
router.get('/:id/users', getAllOrganizationUsers);

router.use(protect);
router.post('/', createOrganization);
router.post('/addUser', addUserToOrganization);

router.use(requireOrgRole(['admin', 'owner', 'superuser']));
router.route('/:id').delete(deleteOrganization);

export default router;
