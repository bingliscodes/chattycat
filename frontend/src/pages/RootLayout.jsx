import { Outlet } from 'react-router';
import { Flex } from '@chakra-ui/react';
import { Toaster } from '@/components/ui/toaster';
import MainNavigation from '../components/NavBar/MainNavigation';

export default function RootLayout() {
  return (
    <Flex direction="column" height="100vh" w="full">
      <MainNavigation />
      <Flex flex="1" justify="center">
        <Outlet />
      </Flex>
      <Toaster />
    </Flex>
  );
}
