import { Flex, Text } from '@chakra-ui/react';
import { useContext } from 'react';

import { ChatContext } from '@/contexts/ChatContext';
import ChatMessage from '../ChatMessage';
import ChatInput from '../ChatInput';

export default function MessageThread() {
  const { thread } = useContext(ChatContext);

  if (!thread) return;
  return (
    <Flex flex="1" h="100%" direction="column">
      <Text p={2} color="text" fontWeight="bold" fontSize="xl">
        Thread
      </Text>

      <Flex direction="column">
        <ChatMessage msg={thread?.parentMessage} />
        {thread.replies?.map((reply) => (
          <ChatMessage key={reply.messageId} msg={reply} />
        ))}
        <ChatInput sendLocation="test" />
      </Flex>
    </Flex>
  );
}
