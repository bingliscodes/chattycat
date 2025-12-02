import { Text, Flex } from '@chakra-ui/react';

import UserAvatar from '@/components/common/Avatar';

export default function DirectMessageRecipient({
  firstName,
  lastName,
  avatarUrl,
}) {
  return (
    <Flex w="full" gap={2} mb={1} mx={3} pt={3} align="center" h="1rem">
      <UserAvatar
        shape="rounded"
        size="sm"
        name={`${firstName} ${lastName}`}
        avatarUrl={avatarUrl}
      ></UserAvatar>
      <Text fontSize="md" color="text" lineHeight="1" m="0">
        {firstName} {lastName}
      </Text>
    </Flex>
  );
}
