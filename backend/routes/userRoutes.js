import express from 'express';
import { signup, protect, login } from '../controllers/authController.js';
import {
  addToChannel,
  getAllUsers,
  getMe,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/login', login);
router.post('/signup', signup);
router.post('/addToChannel', addToChannel);

router.use(protect);
router.get('/me', getMe);

export default router;
