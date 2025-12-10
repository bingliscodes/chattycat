// ChatInterface.jsx
import { Box, Text, Flex } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';

import { UserContext } from '@/contexts/UserContext';
import ChatMessage from '../ChatMessage';
import ChatInput from '../ChatInput';

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
              <ChatMessage key={idx} msg={msg} />
            ))}
          </Box>
        ))}
      </Box>

      {!socketReady && <Text mt={4}>Connecting to chat...</Text>}

      {/* Chat Input (fixed inside chat box) */}
      <ChatInput
        sendLocation={sendLocation}
        onMessageSent={handleMessageSent}
      />
    </Flex>
  );
}
