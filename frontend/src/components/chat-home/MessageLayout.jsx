import { Box, Flex, Text } from '@chakra-ui/react';

import ChatMessage from './ChatMessage';

export default function MessageLayout({ messages }) {
  const messageMap = new Map();

  messages.forEach((msg) => {
    if (!messageMap.has(msg.datestamp)) messageMap.set(msg.datestamp, [msg]);
    else {
      messageMap.get(msg.datestamp).push(msg);
    }
  });

  return (
    <Box flex="1" overflowY="auto" minH="0" p={4}>
      {[...messageMap.entries()].map(([date, msgs]) => (
        <Box key={date} mb={6}>
          <Flex align="center" my={4}>
            <Box flex="1" h="1px" bg="gray.300" />
            <Text mx={3} fontSize="xs" color="gray.600">
              {date}
            </Text>
            <Box flex="1" h="1px" bg="gray.300" />
          </Flex>

          {msgs.map((msg, idx) => (
            <ChatMessage key={idx} msg={msg} />
          ))}
        </Box>
      ))}
    </Box>
  );
}
