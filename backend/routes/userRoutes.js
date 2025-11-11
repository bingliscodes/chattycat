import express from 'express';
import {
  signup,
  protect,
  login,
  logout,
  restrictTo,
} from '../controllers/authController.js';
import { getAllUsers, getMe, getUser } from '../controllers/userController.js';
import {
  addToChannel,
  removeFromChannel,
} from '../controllers/userChannelController.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/logout', logout);

router.get('/', getAllUsers);

router.use(protect);
router.get('/me', getMe, getUser);

router.use(restrictTo('superuser'));
router.post('/addToChannel', addToChannel);
router.post('/removeFromChannel', removeFromChannel);

export default router;
