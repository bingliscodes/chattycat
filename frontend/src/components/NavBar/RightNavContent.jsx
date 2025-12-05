import { Flex, Button, Stack } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router';
import { useContext, useState } from 'react';

import { ColorModeButton } from '@/components/ui/color-mode';
import { toaster } from '@/components/ui/toaster';
import { UserContext } from '@/contexts/UserContext';
import { logout } from '../../utils/js/authentication';
import UserAvatar from '../common/Avatar';

export default function RightNavContent() {
  let { isLoggedIn, disconnectSocket, userData, refreshUserData } =
    useContext(UserContext);
  const [logoutError, setLogoutError] = useState(false);

  const nav = useNavigate();

  async function handleLogout() {
    const logoutPromise = logout();

    toaster.promise(logoutPromise, {
      loading: {
        title: 'Logging Out...',
        description: 'Processing logout request.',
      },
      success: {
        title: 'Logout Successful!',
        description: 'Redirecting to homepage',
      },
      error: {
        title: 'Logout Failed!',
        description: 'Oh no, an error has occurred while logging out!',
      },
    });

    try {
      await logoutPromise;
      setLogoutError(false);
      await refreshUserData();
      nav('/');
    } catch (err) {
      setLogoutError(true);
      console.error(err);
    }
  }

  return (
    <Flex>
      <Stack direction="row" align="center">
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
                handleLogout();
              }}
            >
              Log Out
            </Button>

            <NavLink to="/me">
              <UserAvatar
                bg="bg.primaryBtn"
                size="lg"
                avatarUrl={userData.avatarUrl}
                name={`${userData.firstName} ${userData.lastName}`}
                _hover={{ bg: 'bg.navHover' }}
              />
            </NavLink>
          </>
        )}
      </Stack>
    </Flex>
  );
}
