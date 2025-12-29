import express from 'express';

import { generateUploadUrls } from '../controllers/uploadController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

router.use(protect);
router.post('/generateUploadUrls', generateUploadUrls);

export default router;
