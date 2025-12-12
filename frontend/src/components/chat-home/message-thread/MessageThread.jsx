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
  };

  const handleClickThreadChat = () => {
    console.log('clicked');
    setChatMode('thread');
  };
  const handleCloseThread = () => {
    setThread(null);
    if (directMessage) setChatMode('dm');
    if (channel) setChatMode('ch');
  };

  if (!thread) return;
  return (
    <Flex flex="1" h="100%" direction="column">
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

      <Flex direction="column">
        <Box p={4}>
          <DividerText>{thread?.parentMessage.datestamp}</DividerText>
          <ChatMessage msg={thread?.parentMessage} />
          <DividerText style="left">Replies </DividerText>
        </Box>
        <MessageLayout messages={thread?.replies} />

        <ChatInput
          onClick={handleClickThreadChat}
          onMessageSent={handleThreadReply}
        />
      </Flex>
    </Flex>
  );
}
