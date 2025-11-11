import express from 'express';
import { createOrganization } from '../controllers/organizationController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('Admin'));
router.post('/', createOrganization);

export default router;
