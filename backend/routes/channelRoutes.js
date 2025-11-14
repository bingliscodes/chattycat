import express from 'express';
import {
  createChannel,
  deleteChannel,
  getAllChannels,
} from '../controllers/channelController.js';

const router = express.Router();

router.route('/').get(getAllChannels).post(createChannel);

router.route('/:id').delete(deleteChannel);
export default router;
