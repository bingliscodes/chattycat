import { Flex, Text } from '@chakra-ui/react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useContext } from 'react';

import { addUserToChannel } from '@/utils/js/apiCalls';
import { ChatContext } from '@/contexts/ChatContext';
import UserAvatar from '@/components/common/Avatar';

export default function UserCard({ user, mode }) {
  const { channel, channelUsers, handleSetDirectMessage } =
    useContext(ChatContext);

  const isInChannel = channelUsers?.includes(user.id);

  return mode === 'ch' ? (
    <Flex align="center" gap={2}>
      <UserAvatar
        avatarUrl={user.avatarUrl}
        name={`${user.firstName} ${user.lastName}`}
        size="sm"
      />
      <Text>
        {user.firstName} {user.lastName}
      </Text>

      {isInChannel && (
        <Text fontStyle="italic" fontWeight="light" fontIt>
          user already in channel
        </Text>
      )}

      {!isInChannel && (
        <AiFillPlusCircle
          cursor="pointer"
          size="1.5rem"
          onClick={() => addUserToChannel(user.id, channel.id)}
        />
      )}
    </Flex>
  ) : (
    <Flex align="center" gap={2}>
      <UserAvatar
        avatarUrl={user.avatarUrl}
        name={`${user.firstName} ${user.lastName}`}
        size="sm"
      />
      <Text>
        {user.firstName} {user.lastName}
      </Text>

      <AiFillPlusCircle
        cursor="pointer"
        size="1.5rem"
        onClick={() => handleSetDirectMessage(user)}
      />
    </Flex>
  );
}
