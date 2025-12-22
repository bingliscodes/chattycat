import express from 'express';
import {
  getAllMessages,
  createChannelMessage,
  createDirectMessage,
  createMessage,
  getThreadMessages,
} from '../controllers/messageController.js';
import { getPrivateMessageRoomId } from '../controllers/userChannelController.js';
import { uploadFiles, uploadMessageFiles } from '../utils/multerS3.js';

const router = express.Router();

router.route('/').get(getAllMessages).post(createMessage);
router.route('/:id').get(getThreadMessages);

router.post('/messageFiles', uploadFiles, uploadMessageFiles);

router.post('/privateRoomId', getPrivateMessageRoomId);
router.post('/channelMessage', createChannelMessage);
router.post('/directMessage', createDirectMessage);

export default router;
