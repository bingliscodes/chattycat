import { Flex } from '@chakra-ui/react';
import { useContext } from 'react';

import Sidebar from '../sidebar/Sidebar';
import ChannelChat from './ChannelChat';
import DirectMessages from './DirectMessages';
import { ChatContext } from '@/contexts/ChatContext';

import ComponentSplitter from '../../common/ComponentSplitter';
export default function ChatLayout() {
  const { directMessage, channel } = useContext(ChatContext);

  return (
    <Flex w="100vw" h="100vh">
      <ComponentSplitter>
        <Sidebar />
        <Flex overflowY="auto">
          {channel && <ChannelChat />}
          {directMessage && <DirectMessages />}
        </Flex>
      </ComponentSplitter>
    </Flex>
  );
}
