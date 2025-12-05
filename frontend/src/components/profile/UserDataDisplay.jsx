import { Container, Flex, Heading, Box, Text, Spinner } from '@chakra-ui/react';
import { useContext } from 'react';

import UserAvatar from '../common/Avatar';
import UserSettings from './settings/UserSettings';
import { FileUploadButton } from '../common/FileUploadButton';
import { updateAvatar } from '../../utils/js/apiCalls';

import { UserContext } from '@/contexts/UserContext';

export default function UserDataDisplay() {
  const { userData } = useContext(UserContext);

  if (!userData) return <Spinner />;
  return (
    <Container maxW="full" py={12}>
      <Heading fontSize="3xl" mb={8} textAlign="center">
        User Settings
      </Heading>

      <Flex direction="column" w="full" gap={4} align="center">
        {/* Avatar */}
        <Box
          borderRadius="full"
          fontSize="3xl"
          boxSize={{ base: '160px', md: '200px', lg: '240px' }}
        >
          <UserAvatar
            size="full"
            avatarUrl={userData.avatarUrl}
            name={`${userData.firstName} ${userData.lastName}`}
          />
        </Box>

        {/* Upload Button */}
        <FileUploadButton uploadFn={updateAvatar} />

        <Flex gap={1} align="center">
          <Text fontSize="lg" fontWeight="bold">
            Role:
          </Text>
          <Text>{userData.role}</Text>
        </Flex>
        <Box w="50%">
          <UserSettings userData={userData} />
        </Box>
      </Flex>
    </Container>
  );
}
