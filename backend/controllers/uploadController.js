import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const generateUploadUrls = catchAsync(async (req, res, next) => {
  const { files } = req.body; // Array of {name, mimeType}

  if (!files || !Array.isArray(files))
    return next(new AppError('Files array is required', 400));

  const presignedUrls = await Promise.all(
    files.map(async (file) => {
      const ext = path.extname(file.name) || '';
      const key = `messageFiles/${uuidv4()}${ext}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        ContentType: file.mimeType,
      });

      // Generate presigned URL (valid for 5 minutes)
      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

      if (!uploadUrl)
      // The final public URL after upload
      const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      return {
        uploadUrl, // Use this to upload
        fileUrl, // This is the final URL to save in DB
        fileName: file.name,
        mimeType: file.mimeType,
      };
    }),
  );

  res.status(200).json({ status: 'success', data: presignedUrls });
});
