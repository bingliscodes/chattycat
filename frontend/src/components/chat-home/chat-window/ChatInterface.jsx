// ChatInterface.jsx
import {
  VStack,
  Box,
  Textarea,
  Field,
  Button,
  Text,
  HStack,
  Flex,
  Splitter,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { UserContext } from '@/contexts/UserContext';
import { ChatContext } from '@/contexts/ChatContext';

export default function ChatInterface({
  messages,
  setMessages,
  chatName,
  sendLocation,
  mode,
}) {
  const { userData, socketReady, userSocket } = useContext(UserContext);
  const { channel, directMessage } = useContext(ChatContext);
  const { firstName, lastName, id } = userData;
  const [sizes, setSizes] = useState([50, 50]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!userSocket) return;

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    userSocket.on('receive-message', handleReceiveMessage);

    return () => {
      userSocket.off('receive-message', handleReceiveMessage);
    };
  }, [userSocket, setMessages]);

  const onSubmit = handleSubmit((data) => {
    if (!userSocket?.connected) {
      console.warn('Socket not connected yet.');
      return;
    }
    const { message } = data;
    const timestamp = new Date().toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const messageContent = {
      messageBody: message,
      sender: {
        firstName,
        lastName,
      },
      timestamp,
    };

    let messageData;

    if (mode === 'ch') {
      messageData = {
        messageContent: message,
        userId: id,
        channelId: sendLocation,
      };
    }
    if (mode === 'dm') {
      messageData = {
        messageContent: message,
        senderId: id,
        receiverId: directMessage?.id,
        roomId: sendLocation,
      };
    }

    userSocket.emit('send-message', messageContent, messageData, mode);

    setMessages((prev) => [...prev, messageContent]);
    reset();
  });

  return (
    <Flex flex="1" direction="column">
      <Box bg="bg.nav" p={4} borderBottom="1px solid #e2e8f0">
        <Text fontWeight="bold">{chatName}</Text>
      </Box>
      <VStack
        flex="1"
        spacing={4}
        overflowY="auto"
        p={4}
        align="stretch"
        bg="bg.nav"
      >
        {messages &&
          messages.map((msg, idx) => (
            <Box
              textAlign="left"
              key={idx}
              p={2}
              borderRadius="md"
              boxShadow="sm"
            >
              <Text fontSize="sm">
                {`${msg.sender.firstName} ${msg.sender.lastName}   ·  ${msg.timestamp}`}
              </Text>
              <Text>{msg.messageBody}</Text>
            </Box>
          ))}
      </VStack>
      {!socketReady && <Text mt={4}>Connecting to chat...</Text>}

      {/* Chat Input*/}
      <form onSubmit={onSubmit}>
        <HStack p={4} borderTop="1px solid #e2e8f0">
          <Field.Root invalid={!!errors.message}>
            <Textarea
              {...register('message', { required: 'Message is required' })}
            />
            <Field.ErrorText>{errors.message?.message}</Field.ErrorText>
          </Field.Root>
          <Button type="submit">Send</Button>
        </HStack>
      </form>
    </Flex>
  );
}
