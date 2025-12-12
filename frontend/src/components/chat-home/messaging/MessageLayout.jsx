import { Box } from '@chakra-ui/react';

import ChatMessage from './ChatMessage';
import DividerText from '../../common/DividerText';

export default function MessageLayout({ messages }) {
  const messageMap = new Map();

  messages.forEach((msg) => {
    if (!messageMap.has(msg.datestamp)) messageMap.set(msg.datestamp, [msg]);
    else {
      messageMap.get(msg.datestamp).push(msg);
    }
  });

  return (
    <Box flex="1" h="100vh" p={4}>
      {[...messageMap.entries()].map(([date, msgs]) => (
        <Box key={date} mb={6}>
          <DividerText>{date}</DividerText>

          {msgs.map((msg, idx) => (
            <ChatMessage key={idx} msg={msg} />
          ))}
        </Box>
      ))}
    </Box>
  );
}
