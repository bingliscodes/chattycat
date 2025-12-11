import { Box, Flex, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { AiOutlineWechatWork } from 'react-icons/ai';

import { ChatContext } from '@/contexts/ChatContext';

export default function ChatMessage({ msg, ...props }) {
  const { handleSetThread, setChatMode } = useContext(ChatContext);

  const handleMessageClick = (msg) => {
    handleSetThread(msg);
    setChatMode('thread');
  };

  return (
    <Box
      onClick={() => handleMessageClick(msg)}
      textAlign="left"
      p={2}
      borderRadius="md"
      boxShadow="sm"
      mb={1}
      {...props}
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
      {msg.isThread && (
        <Flex
          cursor="pointer"
          gap={2}
          align="center"
          onClick={() => {
            console.log('TODO: show thread on click');
          }}
        >
          <Text fontSize="xs">View thread</Text>
          <AiOutlineWechatWork />
        </Flex>
      )}
    </Box>
  );
}
