import { AiOutlinePaperClip } from 'react-icons/ai';
import { Button, Flex, Text, Input, Box } from '@chakra-ui/react';

export default function ChatFileUploadButton({ attachments, setAttachments }) {
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...selectedFiles]);
    e.target.value = null; // allow re‑uploading same file name
  };

  const handleRemoveFile = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box w="100%">
      <Flex align="center" gap={2}>
        <Input
          type="file"
          multiple
          display="none"
          id="chat-file-input"
          onChange={handleFileChange}
        />

        <Button
          as="label"
          htmlFor="chat-file-input"
          rounded="full"
          w="1rem"
          marginLeft={2}
          size="sm"
          bg="bg.primaryBtn"
          color="text.primaryBtn"
          _hover={{ bg: 'bg.navHover' }}
        >
          <AiOutlinePaperClip />
        </Button>
      </Flex>

      {attachments.length > 0 && (
        <Flex direction="column" gap={2} mt={2}>
          {attachments.map((file, idx) => (
            <Flex key={idx} align="center" gap={2}>
              <Text fontSize="sm" flex="1">
                {file.name}
              </Text>
              <Button
                fontSize="sm"
                p={0}
                size="2xs"
                onClick={() => handleRemoveFile(idx)}
              >
                x
              </Button>
            </Flex>
          ))}
        </Flex>
      )}
    </Box>
  );
}
