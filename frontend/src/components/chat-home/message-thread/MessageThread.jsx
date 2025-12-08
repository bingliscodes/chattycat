import { Flex, Text } from '@chakra-ui/react';

export default function MessageThread() {
  return (
    <Flex flex="1" h="100%">
      <Text p={2} color="text" fontWeight="bold" fontSize="xl">
        Thread
      </Text>
    </Flex>
  );
}
