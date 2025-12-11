// ChatInterface.jsx
import { Box, Text, Flex } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';

import { UserContext } from '@/contexts/UserContext';
import ChatInput from '../ChatInput';
import MessageLayout from '../MessageLayout';

export default function ChatInterface({
  messages,
  setMessages,
  chatName,
  sendLocation,
}) {
  const { socketReady, userSocket } = useContext(UserContext);

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

  const handleMessageSent = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  return (
    <Flex direction="column" flex="1" minH="0">
      {/* Chat Header */}
      <Box p={3} borderBottom="1px solid" borderColor="borders">
        <Text fontWeight="bold" fontSize="xl">
          {chatName}
        </Text>
      </Box>

      {/* Messages (scrollable) */}
      <MessageLayout messages={messages} />
      {!socketReady && <Text mt={4}>Connecting to chat...</Text>}

      {/* Chat Input (fixed inside chat box) */}
      <ChatInput
        sendLocation={sendLocation}
        onMessageSent={handleMessageSent}
      />
    </Flex>
  );
}
