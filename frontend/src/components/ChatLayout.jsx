import { Flex } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import ChannelChat from "./ChannelChat";
export default function ChatLayout() {
  return (
    <Flex h="100vh">
      <Sidebar />
      <ChannelChat />
    </Flex>
  );
}
