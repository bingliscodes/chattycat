import { Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import ChannelChat from './ChannelChat';
import DirectMessages from './DirectMessages';
export default function ChatLayout() {
  return (
    <Flex h="100vh">
      <Sidebar />
      <ChannelChat />
      <DirectMessages />
    </Flex>
  );
}
