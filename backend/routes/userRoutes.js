import express from 'express';
import {
  signup,
  protect,
  login,
  logout,
} from '../controllers/authController.js';
import {
  addToChannel,
  getAllUsers,
  getMe,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/logout', logout);

router.get('/', getAllUsers);
router.post('/addToChannel', addToChannel);

router.use(protect);
router.get('/me', getMe);

export default router;
