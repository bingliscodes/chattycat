// ChatInterface.jsx
import { Box, Text, Flex } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';

import { UserContext } from '@/contexts/UserContext';
import ChatInput from '../messaging/ChatInput';
import MessageLayout from '../messaging/MessageLayout';
import { insertAndSortMessages } from '@/utils/js/helper';

// TODO: Figure out why messages dissapear after sending
export default function ChatInterface({
  messages,
  setMessages,
  chatName,
  onClickMainArea,
}) {
  const { socketReady, userSocket } = useContext(UserContext);

  useEffect(() => {
    if (!userSocket) return;

    const handleReceiveMessage = (msg) => {
      setMessages((prev) =>
        insertAndSortMessages([
          ...prev.filter((m) => m.tempId !== msg.tempId),
          msg,
        ])
      );
    };

    userSocket.on('receive-message', handleReceiveMessage);

    return () => {
      userSocket.off('receive-message', handleReceiveMessage);
    };
  }, [userSocket, setMessages]);

  const handleMessageSent = (msg) => {
    setMessages((prev) =>
      insertAndSortMessages([
        ...prev.filter((m) => m.tempId !== msg.tempId),
        msg,
      ])
    );
  };

  return (
    <Flex direction="column" flex="1" h="95vh" onClick={onClickMainArea}>
      {/* Chat Header */}
      <Box p={3} borderBottom="1px solid" borderColor="borders">
        <Text fontWeight="bold" fontSize="xl">
          {chatName}
        </Text>
      </Box>

      <Flex direction="column" flex="1" overflow="hidden">
        <Flex direction="column" flex="1" overflowY="auto" py={2} gap={2}>
          {/* Messages (scrollable) */}
          <MessageLayout messages={messages} />
          {!socketReady && <Text mt={4}>Connecting to chat...</Text>}
        </Flex>

        {/* Chat Input (fixed inside chat box) */}
        <Box my={2}>
          <ChatInput onMessageSent={handleMessageSent} />
        </Box>
      </Flex>
    </Flex>
  );
}
