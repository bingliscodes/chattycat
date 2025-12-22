import { AiOutlinePaperClip } from 'react-icons/ai';
import { Button, FileUpload, Flex } from '@chakra-ui/react';

export default function ChatFileUploadButton({ setAttachments }) {
  return (
    <Flex>
      <FileUpload.Root
        maxFiles={5}
        accept={['*']}
        onFileAccept={async ({ files }) => {
          if (files.length > 0) {
            setAttachments(files);
          }
        }}
      >
        <FileUpload.HiddenInput />
        <FileUpload.Trigger asChild>
          <Button
            size="sm"
            bg="bg.primaryBtn"
            color="text.primaryBtn"
            _hover={{
              bg: 'bg.navHover',
            }}
          >
            <AiOutlinePaperClip />
          </Button>
        </FileUpload.Trigger>
        <FileUpload.List asChild bg="bg.primaryBtn" clearable />
      </FileUpload.Root>
    </Flex>
  );
}
