import express from 'express';
import {
  getAllMessages,
  createChannelMessage,
  createDirectMessage,
} from '../controllers/messageController.js';

const router = express.Router();

router.route('/').get(getAllMessages);

router.post('/channelMessage', createChannelMessage);
router.post('/directMessage', createDirectMessage);

export default router;
