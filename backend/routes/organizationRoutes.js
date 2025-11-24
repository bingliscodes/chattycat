import express from 'express';
import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
} from '../controllers/organizationController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.get('/', getAllOrganizations);

router.use(protect);
router.use(restrictTo('superuser'));
router.post('/', createOrganization);

router.route('/:id').delete(deleteOrganization);

export default router;
