import express from 'express';
import {
  getAllMessages,
  createMessage,
  getThreadMessages,
} from '../controllers/messageController.js';
import { getPrivateMessageRoomId } from '../controllers/userChannelController.js';

const router = express.Router();

router.route('/').get(getAllMessages).post(createMessage);
router.route('/:id').get(getThreadMessages);

router.post('/privateRoomId', getPrivateMessageRoomId);

export default router;
