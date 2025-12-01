import { Flex, Button, Stack } from '@chakra-ui/react';
import { ColorModeButton } from '@/components/ui/color-mode';
import { NavLink, useNavigate } from 'react-router';
import { DiAptana } from 'react-icons/di';

import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';
import { logout } from '../../utils/js/authentication';
import UserAvatar from '../common/Avatar';

export default function RightNavContent() {
  let { isLoggedIn, disconnectSocket, userData } = useContext(UserContext);
  const nav = useNavigate();

  return (
    <Flex alignItems="center" gap={2}>
      <Stack direction="row" spacing={4} align="center">
        <ColorModeButton
          bg="bg.primaryBtn"
          color="text.primaryBtn"
          borderRadius="full"
          _hover={{ bg: 'bg.navHover' }}
        />

        {!isLoggedIn && (
          <Button
            bg="bg.primaryBtn"
            color="text.primaryBtn"
            _hover={{ bg: 'bg.navHover' }}
            borderRadius="full"
            onClick={() => nav('/login')}
          >
            Log In / Sign Up
          </Button>
        )}

        {isLoggedIn && (
          <>
            <Button
              bg="bg.primaryBtn"
              color="text.primaryBtn"
              borderRadius="full"
              _hover={{ bg: 'bg.navHover' }}
              onClick={() => {
                disconnectSocket();
                logout();
              }}
            >
              Log Out
            </Button>

            <NavLink to="/me">
              <UserAvatar
                size="lg"
                avatarUrl={userData.avatarUrl}
                name={`${userData.firstName} ${userData.lastName}`}
              />
            </NavLink>

            {userData?.role === 'superuser' && (
              <NavLink to="/admin">
                <DiAptana size="2rem" />
              </NavLink>
            )}
          </>
        )}
      </Stack>
    </Flex>
  );
}
