import { Box, Flex, Text, IconButton } from '@chakra-ui/react';
import { useContext, useState, useRef } from 'react';
import { AiOutlineWechatWork } from 'react-icons/ai';

import { ChatContext } from '@/contexts/ChatContext';
import MessageActions from './MessageActions';

export default function ChatMessage({ msg, ...props }) {
  const { handleSetThread } = useContext(ChatContext);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const iconRef = useRef(null);

  const handleMessageClick = () => {
    handleSetThread(msg);
  };

  return (
    <Box
      position="relative"
      onClick={handleMessageClick}
      textAlign="left"
      p={2}
      borderRadius="md"
      boxShadow="sm"
      mb={1}
      onMouseEnter={() => setMenuIsOpen(true)}
      onMouseLeave={() => setMenuIsOpen(false)}
      {...props}
    >
      <Box position="absolute" top={1} right={1} ref={iconRef}></Box>
      <MessageActions
        anchorRef={iconRef}
        menuIsOpen={menuIsOpen}
        setMenuIsOpen={setMenuIsOpen}
      />
      <Flex align="flex-end" gap={2}>
        <Text fontSize="sm" fontWeight="bold">
          {`${msg.sender.firstName} ${msg.sender.lastName}`}
        </Text>
        <Text fontSize="xs" fontWeight="light">
          {msg.timestamp}
        </Text>
      </Flex>
      <Text>{msg.messageBody}</Text>
      {msg.isThread && (
        <Flex cursor="pointer" gap={2} align="center">
          <Text fontSize="xs">View thread</Text>
          <AiOutlineWechatWork />
        </Flex>
      )}
    </Box>
  );
}
