import { Flex } from '@chakra-ui/react';
import { useContext } from 'react';

import Sidebar from '../sidebar/Sidebar';
import ChannelChat from './ChannelChat';
import DirectMessages from './DirectMessages';
import { ChatContext } from '@/contexts/ChatContext';
import MessageThread from '../message-thread/MessageThread';
import ComponentSplitter from '../../common/ComponentSplitter';

export default function ChatLayout() {
  const { directMessage, channel, thread } = useContext(ChatContext);

  return (
    <Flex flex="1" w="100%">
      <ComponentSplitter>
        <Sidebar />
        <Flex flex="1" h="100%">
          {channel && <ChannelChat />}
          {directMessage && <DirectMessages />}
        </Flex>
        {thread && <MessageThread />}
      </ComponentSplitter>
    </Flex>
  );
}
