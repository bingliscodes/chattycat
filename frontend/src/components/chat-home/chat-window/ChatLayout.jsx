import { Flex } from '@chakra-ui/react';
import { useContext } from 'react';

import Sidebar from '../sidebar/Sidebar';
import ChannelChat from './ChannelChat';
import DirectMessages from './DirectMessages';
import { ChatContext } from '../../../contexts/ChatContext';

export default function ChatLayout() {
  const { directMessage, channel } = useContext(ChatContext);

  return (
    <Flex flex="1" overflow="hidden">
      <Sidebar />
      <Flex flex="1" overflowY="auto">
        {channel && <ChannelChat />}
        {directMessage && <DirectMessages />}
      </Flex>
    </Flex>
  );
}
