import {
  Text,
  Container,
  Button,
  Flex,
  Heading,
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

  if (!userData) return <h1>Loading user data...</h1>;
  console.log(userData.avatarUrl);
  return (
    <Container maxW="lg" py={10}>
      <Heading>User Settings</Heading>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={10}
        justifyContent="center"
      >
        {/* Avatar Section */}
        <VStack spacing={4}>
          <UserAvatar
            size="2xl"
            avatarUrl={userData.avatarUrl}
            name={`${userData.firstName} ${userData.lastName}`}
          />
          <FileUploadButton uploadFn={updateAvatar} />
        </VStack>
      </Flex>

      {/* Settings Form */}
      <UserSettings />
    </Container>
  );
}
