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
    <Flex flex="1" minH="0" w="100%">
      <ComponentSplitter>
        <Sidebar />
        <Flex flex="1" minH="0" h="100%">
          {channel && <ChannelChat />}
          {directMessage && <DirectMessages />}
        </Flex>
        <Flex flex="1" h="100%"></Flex>
      </ComponentSplitter>
    </Flex>
  );
}
