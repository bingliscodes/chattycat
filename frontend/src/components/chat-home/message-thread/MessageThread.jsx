import { Flex, Text } from '@chakra-ui/react';
import { useContext } from 'react';

import { ChatContext } from '@/contexts/ChatContext';
import ChatMessage from '../ChatMessage';
import ChatInput from '../ChatInput';
import { useThreadRoom } from '@/hooks/useThreadRoom';

export default function MessageThread() {
  const { thread, setThread } = useContext(ChatContext);
  useThreadRoom(thread?.parentMessage.messageId);

  const handleThreadReply = (message) => {
    setThread((prevThread) => ({
      ...prevThread,
      replies: [...prevThread.replies, message],
    }));
  };
  if (!thread) return;
  return (
    <Flex flex="1" h="100%" direction="column">
      <Text p={2} color="text" fontWeight="bold" fontSize="xl">
        Thread
      </Text>

      <Flex direction="column">
        <ChatMessage
          key={thread?.parentMessage.messageId}
          msg={thread?.parentMessage}
        />
        {thread.replies?.map((reply) => (
          <ChatMessage key={reply.messageId} msg={reply} />
        ))}
        <ChatInput onMessageSent={handleThreadReply} />
      </Flex>
    </Flex>
  );
}
