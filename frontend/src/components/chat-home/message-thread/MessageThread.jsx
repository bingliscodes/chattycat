import { Flex, Text, Box, CloseButton } from '@chakra-ui/react';
import { useContext } from 'react';

import { ChatContext } from '@/contexts/ChatContext';
import ChatMessage from '../messaging/ChatMessage';
import ChatInput from '../messaging/ChatInput';
import { useThreadRoom } from '@/hooks/useThreadRoom';
import MessageLayout from '../messaging/MessageLayout';
import DividerText from '../../common/DividerText';

export default function MessageThread() {
  const { thread, setThread, setChatMode, directMessage, channel } =
    useContext(ChatContext);
  useThreadRoom(thread?.parentMessage.messageId);

  const handleThreadReply = (message) => {
    setThread((prevThread) => ({
      ...prevThread,
      replies: [...prevThread.replies, message],
    }));

    thread.parentMessage.isThread = true;
  };

  const handleClickThreadChat = () => {
    setChatMode('thread');
  };

  const handleCloseThread = () => {
    setThread(null);
    if (directMessage) setChatMode('dm');
    if (channel) setChatMode('ch');
  };

  if (!thread) return;
  return (
    <Flex h="95vh" direction="column">
      {/* Chat Header*/}
      <Flex align="center" justify="space-between" px={2}>
        <Text p={2} color="text" fontWeight="bold" fontSize="xl">
          Thread
        </Text>
        <CloseButton
          size="2xs"
          bg="bg.primaryBtn"
          onClick={handleCloseThread}
        />
      </Flex>

      <Flex direction="column" flex="1" overflow="hidden">
        <Flex direction="column" flex="1" overflowY="auto" py={2} gap={2}>
          <Box p={4}>
            <DividerText>{thread?.parentMessage.datestamp}</DividerText>
            <ChatMessage msg={thread?.parentMessage} />
            <DividerText style="left">Replies </DividerText>
          </Box>

          <MessageLayout messages={thread?.replies} />
        </Flex>

        {/* Chat Input */}
        <Box my={2}>
          <ChatInput
            onClick={handleClickThreadChat}
            onMessageSent={handleThreadReply}
          />
        </Box>
      </Flex>
    </Flex>
  );
}
