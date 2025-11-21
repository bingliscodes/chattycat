import {
  Center,
  Container,
  Flex,
  Heading,
  Box,
  VStack,
} from '@chakra-ui/react';
import { useContext } from 'react';

import UserAvatar from '../../common/Avatar';
import UserSettings from '../UserSettings';
import { FileUploadButton } from '../../common/FileUploadButton';
import { updateAvatar } from '../../../utils/js/apiCalls';

import { UserContext } from '../../../contexts/UserContext';

export default function UserDataDisplay() {
  const { userData } = useContext(UserContext);

  return (
    <Container maxW="full" py={12}>
      <Heading mb={8} textAlign="center">
        User Settings
      </Heading>

      <Flex direction="column" w="full" gap={4} align="center">
        {/* Avatar */}
        <Box
          borderRadius="full"
          boxSize={{ base: '160px', md: '200px', lg: '240px' }}
        >
          <UserAvatar
            size="full"
            avatarUrl={userData.avatarUrl}
            name={`${userData.firstName} ${userData.lastName}`}
          />
        </Box>

        {/* Upload Button */}
        <Box>
          <FileUploadButton uploadFn={updateAvatar} />
        </Box>
        <Box w="50%">
          <UserSettings userData={userData} />
        </Box>
        {/* Settings Form - center inputs too */}
      </Flex>
    </Container>
  );
}
