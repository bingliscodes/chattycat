import { Box, Flex, Text } from '@chakra-ui/react';
import { useContext } from 'react';

import { ChatContext } from '@/contexts/ChatContext';

export default function MessageThread() {
  const { thread } = useContext(ChatContext);
  console.log(thread);
  return (
    <Flex flex="1" h="100%" direction="column">
      <Text p={2} color="text" fontWeight="bold" fontSize="xl">
        Thread
      </Text>
      <Flex direction="column">
        {thread?.parentMessage?.messageBody}
        {thread?.replies?.map((reply) => (
          <Box key={reply.id}>{reply.messageContent}</Box>
        ))}
      </Flex>
    </Flex>
  );
}
