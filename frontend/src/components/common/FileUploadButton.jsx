import { Button, FileUpload, Icon, Box, Flex } from '@chakra-ui/react';
import { HiUpload } from 'react-icons/hi';
import { LuUpload } from 'react-icons/lu';

export function FileUploadButton({ uploadFn }) {
  return (
    <Flex>
      <FileUpload.Root
        accept={['image/png', 'image/jpeg']}
        onFileAccept={async ({ files }) => {
          if (files.length > 0) {
            await uploadFn(files[0]);
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
            <HiUpload /> Change Avatar
          </Button>
        </FileUpload.Trigger>
        <FileUpload.List />
      </FileUpload.Root>
    </Flex>
  );
}

export function FileUploadDropZone() {
  return (
    <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={10}>
      <FileUpload.HiddenInput />
      <FileUpload.Dropzone>
        <Icon size="md" color="fg.muted">
          <LuUpload />
        </Icon>
        <FileUpload.DropzoneContent>
          <Box>Drag and drop files here</Box>
          <Box color="fg.muted">.png, .jpg up to 5MB</Box>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
      <FileUpload.List />
    </FileUpload.Root>
  );
}
