import { useForm } from 'react-hook-form';
import { Field, HStack, IconButton, Textarea, Box } from '@chakra-ui/react';
import { AiOutlineSend } from 'react-icons/ai';
import { useContext } from 'react';

import { ChatContext } from '@/contexts/ChatContext';
import { UserContext } from '@/contexts/UserContext';

export default function ChatInput({ sendLocation, onMessageSent, ...props }) {
  const { userData, socketReady, userSocket } = useContext(UserContext);
  const { channel, directMessage, directMessageList, chatMode, thread } =
    useContext(ChatContext);
  const { firstName, lastName, id } = userData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const isNewDM =
    chatMode === 'dm' &&
    !directMessageList.some((user) => user.id === directMessage?.id);

  const onSubmit = handleSubmit((data) => {
    if (!userSocket?.connected) return;

    const now = new Date();

    const datestamp = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const timestamp = now.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const messageContent = {
      messageBody: data.message,
      sender: { firstName, lastName },
      timestamp,
      datestamp,
    };

    let messageData = {
      messageContent: data.message,
      senderId: id,
      type: chatMode === 'ch' ? 'channel' : 'direct',
    };

    if (chatMode === 'ch') messageData.channelId = sendLocation;

    if (chatMode === 'dm') {
      messageData.receiverId = directMessage?.id;
      messageData.roomId = sendLocation;
    }

    if (chatMode === 'thread') {
      messageData.parentMessageId = thread.parentMessage.messageId;
      userSocket.emit('send-thread-message', messageContent, messageData);
    } else userSocket.emit('send-message', messageContent, messageData);

    if (isNewDM) {
      userSocket.emit('new-dm', {
        senderId: id,
        receiverId: directMessage?.id,
      });
    }

    onMessageSent(messageContent); // Call back to parent
    reset();
  });
  return (
    <>
      {!socketReady && <Text mt={4}>Connecting to chat...</Text>}
      <Box
        {...props}
        as="form"
        onSubmit={onSubmit}
        py={2}
        px={1}
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
              placeholder={`Message ${
                (directMessage && directMessage.firstName) ||
                (channel && channel.channelName)
              } `}
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
      </Box>
    </>
  );
}
