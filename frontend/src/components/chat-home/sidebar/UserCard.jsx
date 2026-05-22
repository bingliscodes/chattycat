import { Flex, Text } from '@chakra-ui/react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useContext, useState } from 'react';

import { addUserToChannel } from '@/utils/js/apiCalls';
import { toaster } from '@/components/ui/toaster';
import { ChatContext } from '@/contexts/ChatContext';
import UserAvatar from '@/components/common/Avatar';
import { OrganizationContext } from '@/contexts/OrganizationContext';

export default function UserCard({ user, mode }) {
  const { channel, channelUsers, handleSetDirectMessage } =
    useContext(ChatContext);
  const [error, setError] = useState(false);

  const { selectedOrganization } = useContext(OrganizationContext);

  const isInChannel = channelUsers?.includes(user.id);

  async function handleAddUserToChannel(e) {
    e.preventDefault();

    const addUserPromise = addUserToChannel(
      user.id,
      channel.id,
      selectedOrganization.id,
    );

    toaster.promise(addUserPromise, {
      loading: {
        title: 'Adding user to channel...',
        description: 'Checking that a user with entered email exists...',
      },
      success: {
        title: 'Successfully added user to your channel!',
        description:
          'Have them login to their ChattyCat account and go to your organization to to access the new channel.',
      },
      error: (err) => ({
        title: 'Failed to add user to channel',
        description: err.message || 'An unexpected error occured!',
      }),
    });

    try {
      await addUserPromise;
      setError(false);
    } catch (err) {
      setError(err);
      console.error(err);
    }
  }

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
          onClick={handleAddUserToChannel}
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
