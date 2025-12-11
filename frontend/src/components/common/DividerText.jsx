import { Flex, Box, Text } from '@chakra-ui/react';

export default function DividerText({ style, children, ...props }) {
  return (
    <Flex align="center" my={2} mx={1} {...props}>
      {style !== 'left' && <Box flex="1" h="1px" bg="gray.300" />}
      <Text mx={3} fontSize="xs" color="gray.600">
        {children}
      </Text>
      <Box flex="1" h="1px" bg="gray.300" />
    </Flex>
  );
}
