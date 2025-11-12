import express from 'express';

import { protect, sendUser } from '../controllers/authController.js';

const router = express.Router();

router.get('/me', protect, sendUser);

export default router;
