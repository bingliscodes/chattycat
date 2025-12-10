import { Outlet } from 'react-router';
import { Flex } from '@chakra-ui/react';
import { Toaster } from '@/components/ui/toaster';
import MainNavigation from '../components/NavBar/MainNavigation';

export default function RootLayout() {
  return (
    <Flex direction="column" h="100vh" w="full" overflowY="auto" minH="0">
      <MainNavigation />
      <Flex flex="1">
        <Outlet />
      </Flex>
      <Toaster />
    </Flex>
  );
}
