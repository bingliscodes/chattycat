// MessageAttachments.jsx
import { Box, Image, Link } from '@chakra-ui/react';

export default function MessageAttachments({ attachments }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <Box mt={2} display="flex" flexDir="column" gap={2}>
      {attachments.map((file, idx) => {
        const isImage = (file.mimeType || file.type)?.startsWith('image/');
        const src = file.fileUrl || file.preview;

        return (
          <Box key={idx} borderRadius="md" overflow="hidden">
            {isImage ? (
              <Image
                src={src}
                alt={file.name || 'attachment'}
                maxH="200px"
                borderRadius="md"
              />
            ) : (
              <Link href={src} isExternal color="blue.400">
                📎 {file.name || 'Download file'}
              </Link>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
