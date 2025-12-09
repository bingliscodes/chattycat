import { Box, Flex, Text } from '@chakra-ui/react';
import { useContext } from 'react';

import { ChatContext } from '@/contexts/ChatContext';

export default function ChatMessage({ msg }) {
  const { handleSetThread } = useContext(ChatContext);

  const handleMessageClick = (msg) => {
    handleSetThread(msg);
  };
  return (
    <Box
      onClick={() => handleMessageClick(msg)}
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
  );
}
