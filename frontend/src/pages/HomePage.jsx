import { HStack, Container } from "@chakra-ui/react";
import UserSidebar from "../components/Sidebar";
import ChannelChat from "../components/ChannelChat";

export default function HomePage() {
  return (
    <HStack mt={2}>
      <Container w="25%">
        <UserSidebar />
      </Container>

      <Container>
        <ChannelChat />
      </Container>
    </HStack>
  );
}
