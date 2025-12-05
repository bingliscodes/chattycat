import { Text, Flex } from '@chakra-ui/react';

import UserAvatar from '@/components/common/Avatar';

export default function DirectMessageRecipient({
  firstName,
  lastName,
  avatarUrl,
  isSelected,
}) {
  return (
    <Flex w="full" gap={2} ml={6} mt={2} align="center" h="1rem">
      <UserAvatar
        shape="rounded"
        size="sm"
        name={`${firstName} ${lastName}`}
        avatarUrl={avatarUrl}
      ></UserAvatar>
      <Text
        fontSize="md"
        color={isSelected ? 'text.selectedItem' : 'text.sidebar'}
        lineHeight="1"
      >
        {firstName} {lastName}
      </Text>
    </Flex>
  );
}
