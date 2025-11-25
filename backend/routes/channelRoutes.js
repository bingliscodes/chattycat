import express from 'express';
import {
  createChannel,
  deleteChannel,
  getAllChannels,
} from '../controllers/channelController.js';
import { getChannelMessages } from '../controllers/messageController.js';
import { getAllChannelUsers } from '../controllers/userChannelController.js';

const router = express.Router();

router.route('/').get(getAllChannels).post(createChannel);

router.route('/:id').delete(deleteChannel);
router.get('/:id/allUsers', getAllChannelUsers);
router.get('/:id/messages', getChannelMessages);

export default router;
