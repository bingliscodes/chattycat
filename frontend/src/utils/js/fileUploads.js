import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

// Helper function to convert base64 to ArrayBuffer (browser-compatible)
const base64ToArrayBuffer = (base64) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Helper function to get file extension (browser-compatible)
const getFileExtension = (filename) => {
  const lastDot = filename.lastIndexOf('.');
  return lastDot === -1 ? '' : filename.substring(lastDot);
};

export const uploadAttachments = async (files, messageId) => {
  const results = [];

  for (const file of files) {
    const ext = getFileExtension(file.name);
    const fileName = `messageFiles/${uuidv4()}${ext}}`;

    const arrayBuffer = base64ToArrayBuffer(file.base64);

    const uploadParams = {
      Bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: arrayBuffer,
      ContentType: file.mimeType,
    };
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    const fileUrl = `https://${import.meta.env.VITE_AWS_S3_BUCKET_NAME}.s3.${
      import.meta.env.VITE_AWS_REGION
    }.amazonaws.com/${fileName}`;

    const record = {
      fileName: file.name,
      messageId,
      fileUrl,
      mimeType: file.mimeType,
    };

    results.push(record);
  }
  return results;
};
