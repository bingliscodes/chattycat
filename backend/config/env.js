// config/env.js
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Emulate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Now safely resolve the .env file
dotenv.config({
  path: path.resolve(__dirname, '../config.env'), // Adjust path if .env is in root or backend
});

console.log('[env] Loaded AWS bucket:', process.env.AWS_S3_BUCKET_NAME);
console.log('[ENV] AWS region:', process.env.AWS_REGION);
