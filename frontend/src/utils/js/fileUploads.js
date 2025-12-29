import axios from 'axios';

// Step 1: Get presigned URLs from backend
const getPresignedUrls = async (files) => {
  const fileMetadata = files.map((file) => ({
    name: file.name,
    mimeType: file.type,
  }));

  const res = await axios.post(
    `${import.meta.env.VITE_DEV_API_BASE_URL}uploads/generateUploadUrls`,
    {
      files: fileMetadata,
    },
    { withCredentials: true }
  );
  return res.data.data;
};

// Step 2: Upload files directly to S3 using presigned URLs
const uploadToS3 = async (file, uploadUrl) => {
  const blob =
    file instanceof File ? file : await fetch(file).then((r) => r.blob());

  await axios.put(uploadUrl, blob, {
    headers: {
      'Content-Type': file.type,
    },
  });
};

// Main function to handle the entire upload process
export const uploadAttachments = async (files, messageId) => {
  try {
    // Get presigned URLs from backend
    const presignedData = await getPresignedUrls(files);

    if (!presignedData || !Array.isArray(presignedData)) {
      throw new Error('Invalid presigned URLs response');
    }
    // Upload each file to S3 using presigned URLs
    await Promise.all(
      files.map((file, index) =>
        uploadToS3(file, presignedData[index].uploadUrl)
      )
    );

    // Return the file records to save in DB
    return presignedData.map((data) => ({
      fileName: data.fileName,
      messageId,
      fileUrl: data.fileUrl,
      mimeType: data.mimeType,
    }));
  } catch (error) {
    console.error('Error uploading attachments:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
    throw error;
  }
};
