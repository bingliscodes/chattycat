import multer from 'multer';
import catchAsync from './catchAsync.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { MessageAttachment } from '../models/messageModel.js';
import User from '../models/userModel.js';
import AppError from './appError.js';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
}).single('avatar');

export const uploadUserAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No avatar uploaded!', 400));
  }

  const ext = path.extname(req.file.originalname);
  const fileName = `avatars/${uuidv4()}${ext}`;

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);

  const avatarUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

  // Update user in DB
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.update({ avatarUrl });

  res.status(200).json({
    status: 'success',
    data: { avatarUrl },
  });
});

export const uploadFiles = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
}).array('files', 3);

export const uploadAndSaveAttachments = async (files, messageId) => {
  const results = [];

  for (const file of files) {
    const ext = path.extname(file.name) || '';
    const fileName = `messageFiles/${uuidv4()}${ext}`;

    const buffer = Buffer.from(file.base64, 'base64'); // Assumes base64 input

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      name: file.name,
      Key: fileName,
      Body: buffer,
      ContentType: file.mimeType,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    const record = await MessageAttachment.create({
      fileName: file.name,
      messageId,
      fileUrl,
      mimeType: file.mimeType,
    });

    results.push(record);
  }

  return results;
};

export const saveAttachmentRecords = async (attachments, messageId) => {
  // Save to your Attachment model
  const records = attachments.map((att) => ({
    fileName: att.fileName,
    fileUrl: att.fileUrl,
    mimeType: att.mimeType,
    messageId,
  }));

  await MessageAttachment.bulkCreate(records);
};
