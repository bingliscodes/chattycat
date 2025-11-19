import { Outlet } from 'react-router';
import { Flex } from '@chakra-ui/react';
import MainNavigation from '../components/NavBar/MainNavigation';

export default function RootLayout() {
  return (
    <Flex direction="column" height="100vh" w="full">
      <MainNavigation />
      <Flex flex="1" overflow="hidden">
        <Outlet />
      </Flex>
    </Flex>
  );
}
