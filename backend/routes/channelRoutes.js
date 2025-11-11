import express from 'express';
import { createChannel } from '../controllers/channelController.js';

const router = express.Router();

router.post('/', createChannel);

export default router;
