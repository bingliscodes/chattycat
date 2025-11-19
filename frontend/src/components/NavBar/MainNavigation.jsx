'use client';

import { HStack, Box, Container } from '@chakra-ui/react';

import LeftNavContent from './LeftNavContent';
import RightNavContent from './RightNavContent';

export default function MainNavigation() {
  return (
    <Box
      as="header"
      bg="bg.nav"
      w="full"
      position="sticky"
      borderBottom="solid 1px white"
    >
      <Container maxW="8xl">
        <HStack h="100%" justifyContent="space-between" alignItems="center">
          <LeftNavContent />
          <RightNavContent />
        </HStack>
      </Container>
    </Box>
  );
}
