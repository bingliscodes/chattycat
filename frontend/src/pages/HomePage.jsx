import { Flex } from '@chakra-ui/react';
import { useContext } from 'react';

import ChatLayout from '../components/chat-home/chat-window/ChatLayout';
import { UserContext } from '@/contexts/UserContext';
import SignupPage from './SignupPage';

export default function HomePage() {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <Flex flex="1" h="full" w="full">
      {isLoggedIn ? <ChatLayout /> : <SignupPage />}
    </Flex>
  );
}
