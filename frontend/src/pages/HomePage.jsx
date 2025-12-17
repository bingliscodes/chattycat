import { Flex } from '@chakra-ui/react';
import { useContext } from 'react';

import OrganizationBrowser from '../components/organization-browser/OrganizationBrowser';
import { UserContext } from '@/contexts/UserContext';
import SignupPage from './SignupPage';

export default function HomePage() {
  const { isLoggedIn } = useContext(UserContext);

  // If not logged in, display sign up page
  // If logged in, homepage should be view orgs or create org
  return (
    <Flex flex="1" h="full" w="full">
      {isLoggedIn ? <OrganizationBrowser /> : <SignupPage />}
    </Flex>
  );
}
