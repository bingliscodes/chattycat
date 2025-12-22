// ChatInput.jsx
import { useForm } from 'react-hook-form';
import { Field, HStack, IconButton, Textarea, Box } from '@chakra-ui/react';
import { AiOutlineSend } from 'react-icons/ai';
import { useState } from 'react';

import { useChatMessage } from '@/hooks/useChatMessage';
import ChatFileUploadButton from './chat-input-actions/ChatFileUploadButton';

export default function ChatInput({ onMessageSent, ...props }) {
  const [attachments, setAttachments] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { sendMessage } = useChatMessage();

  const onSubmit = handleSubmit(async (data) => {
    const msg = await sendMessage({ messageBody: data.message, attachments });
    console.log(msg);
    if (onMessageSent) onMessageSent(msg);
    setAttachments([]);
    reset();
  });

  return (
    <>
      <Box
        {...props}
        as="form"
        onSubmit={onSubmit}
        paddingTop={2}
        border="1px solid"
        borderColor="borders"
        bg="bg.chatBox"
        rounded="lg"
        mx={4}
        mb={3}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            onSubmit(e);
          }
        }}
      >
        <HStack>
          <Field.Root invalid={!!errors.message}>
            <Textarea
              border={0}
              outline={0}
              resize="none"
              {...register('message', { required: 'Message is required' })}
            />
            <Field.ErrorText ml={3}>{errors.message?.message}</Field.ErrorText>
          </Field.Root>
          <IconButton
            color="text.primaryBtn"
            bg="bg.primaryBtn"
            type="submit"
            mr={2}
          >
            <AiOutlineSend />
          </IconButton>
        </HStack>
        <ChatFileUploadButton
          attachments={attachments}
          setAttachments={setAttachments}
        />
      </Box>
    </>
  );
}
