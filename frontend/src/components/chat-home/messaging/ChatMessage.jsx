// ChatMessage.jsx
import { Box, Flex, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { AiOutlineWechatWork } from 'react-icons/ai';

import UserAvatar from '../../common/Avatar';
import { ChatContext } from '@/contexts/ChatContext';
import MessageActions from './MessageActions';
import MessageAttachments from './MessageAttachments';

export default function ChatMessage({ msg, ...props }) {
  const { handleSetThread } = useContext(ChatContext);
  // const [menuIsOpen, setMenuIsOpen] = useState(false);

  const handleMessageClick = () => {
    handleSetThread(msg);
  };

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
        role="group"
        css={{
          '&:hover .message-actions': {
            opacity: 1,
            pointerEvents: 'auto',
          },
        }}
        {...props}
      >
        <Box
          className="message-actions"
          position="absolute"
          top={-2}
          right={2}
          opacity={0}
          transition="opacity 0.2s ease"
          pointerEvents="none"
        >
          <MessageActions />
        </Box>

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
