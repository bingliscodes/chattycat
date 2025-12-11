import { Flex, Text } from '@chakra-ui/react';
import { useContext } from 'react';

import { ChatContext } from '@/contexts/ChatContext';
import ChatMessage from '../ChatMessage';
import ChatInput from '../ChatInput';
import { useThreadRoom } from '@/hooks/useThreadRoom';
import MessageLayout from '../MessageLayout';

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
        <Flex direction="column" mb={2}>
          <ChatMessage msg={thread?.parentMessage} />
          <MessageLayout messages={thread?.replies} />
        </Flex>
        <ChatInput onMessageSent={handleThreadReply} />
      </Flex>
    </Flex>
  );
}
