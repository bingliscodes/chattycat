// ChatInterface.jsx
import {
  Box,
  Textarea,
  Field,
  Button,
  Text,
  HStack,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineSend } from 'react-icons/ai';

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
  const { channel, directMessage, directMessageList } = useContext(ChatContext);
  const { firstName, lastName, id } = userData;

  const isNewDM = !directMessageList.some(
    (user) => user.id === directMessage?.id
  );

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
      messageBody: message,
      sender: {
        firstName,
        lastName,
      },
      timestamp,
      datestamp,
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

    if (isNewDM)
      userSocket.emit('new-dm', {
        senderId: id,
        receiverId: directMessage?.id,
      });

    setMessages((prev) => [...prev, messageContent]);
    reset();
  });

  const messageMap = new Map();

  messages.forEach((msg) => {
    if (!messageMap.has(msg.datestamp)) messageMap.set(msg.datestamp, [msg]);
    else {
      messageMap.get(msg.datestamp).push(msg);
    }
  });

  return (
    <Flex direction="column" flex="1" minH="0">
      {/* Chat Header */}
      <Box p={3} borderBottom="1px solid" borderColor="borders">
        <Text fontWeight="bold" fontSize="xl">
          {chatName}
        </Text>
      </Box>

      {/* Messages (scrollable) */}
      <Box flex="1" overflowY="auto" minH="0" p={4}>
        {[...messageMap.entries()].map(([date, msgs]) => (
          <Box key={date} mb={6}>
            <Flex align="center" my={4}>
              <Box flex="1" h="1px" bg="gray.300" />
              <Text mx={3} fontSize="xs" color="gray.600">
                {date}
              </Text>
              <Box flex="1" h="1px" bg="gray.300" />
            </Flex>

            {msgs.map((msg, idx) => (
              <Box
                key={idx}
                textAlign="left"
                p={2}
                borderRadius="md"
                boxShadow="sm"
                mb={1}
              >
                <Flex align="flex-end" gap={2}>
                  <Text fontSize="sm" fontWeight="bold">
                    {`${msg.sender.firstName} ${msg.sender.lastName}`}
                  </Text>
                  <Text fontSize="xs" fontWeight="light">
                    {msg.timestamp}
                  </Text>
                </Flex>
                <Text>{msg.messageBody}</Text>
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {!socketReady && <Text mt={4}>Connecting to chat...</Text>}

      {/* Chat Input (fixed inside chat box) */}
      <Box
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
          <IconButton bg="bg.primaryBtn" type="submit" mr={2}>
            <AiOutlineSend />
          </IconButton>
        </HStack>
      </Box>
    </Flex>
  );
}
