import express from 'express';
import {
  signup,
  protect,
  login,
  logout,
  restrictTo,
} from '../controllers/authController.js';
import {
  addToChannel,
  getAllUsers,
  getMe,
  getUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/logout', logout);

router.get('/', getAllUsers);

router.use(protect);
router.get('/me', getMe, getUser);

router.use(restrictTo('Admin'));
router.post('/addToChannel', addToChannel);

export default router;
