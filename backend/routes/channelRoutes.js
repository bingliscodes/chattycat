import express from 'express';
import {
  createChannel,
  deleteChannel,
} from '../controllers/channelController.js';

const router = express.Router();

router.post('/', createChannel);

router.route('/:id').delete(deleteChannel);
export default router;
