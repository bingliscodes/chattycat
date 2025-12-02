'use client';

import { HStack, Box, Container } from '@chakra-ui/react';

import LeftNavContent from './LeftNavContent';
import RightNavContent from './RightNavContent';

export default function MainNavigation() {
  return (
    <Box bg="bg.nav" position="sticky" borderBottom="solid 1px white">
      <HStack justify="space-between" mx={4}>
        <LeftNavContent />
        <RightNavContent />
      </HStack>
    </Box>
  );
}
