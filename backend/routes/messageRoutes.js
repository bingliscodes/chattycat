import express from 'express';
import {
  getAllMessages,
  createChannelMessage,
  createDirectMessage,
} from '../controllers/messageController.js';
import { getPrivateMessageRoomId } from '../controllers/userChannelController.js';

const router = express.Router();

router.route('/').get(getAllMessages);

router.post('/privateRoomId', getPrivateMessageRoomId);
router.post('/channelMessage', createChannelMessage);
router.post('/directMessage', createDirectMessage);

export default router;
