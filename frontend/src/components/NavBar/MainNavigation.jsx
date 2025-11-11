"use client";

import { VStack, HStack, Center } from "@chakra-ui/react";

import LeftNavContent from "./LeftNavContent";
import RightNavContent from "./RightNavContent";

export default function MainNavigation() {
  return (
    <Center>
      <VStack bg="bg.nav" h={"5rem"} boxShadow="sm" px={2} w="90vw" spacing={0}>
        <HStack
          w="full"
          alignItems="center"
          p={2}
          justifyContent="space-between"
        >
          <LeftNavContent />

          <RightNavContent />
        </HStack>
      </VStack>
    </Center>
  );
}
