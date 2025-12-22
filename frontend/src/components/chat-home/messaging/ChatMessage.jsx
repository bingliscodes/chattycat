import { Box, Flex, Text } from '@chakra-ui/react';
import { useContext, useState, useRef } from 'react';
import { AiOutlineWechatWork } from 'react-icons/ai';

import UserAvatar from '../../common/Avatar';
import { ChatContext } from '@/contexts/ChatContext';
import MessageActions from './MessageActions';
import MessageAttachments from './MessageAttachments';

export default function ChatMessage({ msg, ...props }) {
  const { handleSetThread } = useContext(ChatContext);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const iconRef = useRef(null);

  const handleMessageClick = () => {
    handleSetThread(msg);
  };
  console.log(msg);
  return (
    <Flex flex="1" align="flex-start" gap={1}>
      <UserAvatar
        rounded="md"
        avatarUrl={msg.sender.avatarUrl}
        name={`${msg.sender.firstName} ${msg.sender.lastName}`}
        size="md"
      />
      <Box
        position="relative"
        w="full"
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
        <Text fontSize="sm">{msg.messageBody}</Text>
        {msg.isThread && (
          <Flex cursor="pointer" gap={1} align="center">
            <Text fontSize="xs">View thread</Text>
            <AiOutlineWechatWork />
          </Flex>
        )}
        <MessageAttachments attachments={msg.attachments} />
      </Box>
    </Flex>
  );
}
