import express from 'express';
import {
  getAllMessages,
  createMessage,
} from '../controllers/messageController.js';

const router = express.Router();

router.route('/').get(getAllMessages).post(createMessage);

export default router;
