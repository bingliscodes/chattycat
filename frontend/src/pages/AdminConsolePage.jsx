import { Flex, Text } from '@chakra-ui/react';
import UserCard from '../components/admin-console/UserCard';

export default function AdminConsole() {
  return (
    <Flex direction="column">
      <Text fontWeight="bold" fontSize="2xl" py={2}>
        Welcome to admin console
      </Text>

      <UserCard />
    </Flex>
  );
}
