import express from 'express';
import {
  signup,
  protect,
  login,
  logout,
  restrictTo,
} from '../controllers/authController.js';
import {
  getAllUsers,
  getMe,
  getUser,
  getDirectMessageList,
  updateMe,
} from '../controllers/userController.js';
import {
  addToChannel,
  removeFromChannel,
} from '../controllers/userChannelController.js';
import { uploadAvatar, uploadUserAvatar } from '../utils/multerS3.js';
import {
  getAllReceivedMessages,
  getDirectMessagesWithUser,
} from '../controllers/messageController.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/logout', logout);

router.get('/', getAllUsers);

router.get('/:userId/directMessageList', getDirectMessageList);

router.use(protect);
router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.post('/avatar', uploadAvatar, uploadUserAvatar);
router.get('/received', getAllReceivedMessages);
router.get('/received/:userId', getDirectMessagesWithUser);

router.use(restrictTo('superuser'));
router.post('/addToChannel', addToChannel);
router.post('/removeFromChannel', removeFromChannel);

export default router;
