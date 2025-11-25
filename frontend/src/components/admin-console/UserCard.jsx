import { Flex, Text } from '@chakra-ui/react';

import UserAvatar from '../common/Avatar';
import AddToChannelButton from './AddToChannelButton';

const userData = {
  firstName: 'Cannoli',
  lastName: 'Garcia',
  avatarUrl: '...',
  channels: [
    { id: 'ch-1', channelName: 'Test Channel' },
    { id: 'ch-2', channelName: 'Test Channel 2' },
  ],
};
export default function UserCard() {
  return (
    <Flex align="center" gap={1}>
      <UserAvatar size="md" avatarUrl={userData.avatarUrl} />
      <Text>
        {userData.firstName} {userData.lastName}
      </Text>
      <Text>Channels: (display active channels here)</Text>

      <AddToChannelButton channels={userData.channels} />
    </Flex>
  );
}
