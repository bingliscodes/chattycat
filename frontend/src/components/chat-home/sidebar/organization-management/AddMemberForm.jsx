'use client';
import { useState, useContext } from 'react';
import { Text, Flex, Field, Input, Button } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router';

import { toaster } from '@/components/ui/toaster';
import { UserContext } from '@/contexts/UserContext';

export default function AddMemberForm() {
  const login = () => {};
  const [loginError, setLoginError] = useState(false);
  const { refreshUserData } = useContext(UserContext);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const entries = Object.fromEntries(formData.entries());

    const loginPromise = login(entries);

    toaster.promise(loginPromise, {
      loading: {
        title: 'Logging In...',
        description: 'Checking your credentials.',
      },
      success: {
        title: 'Login Successful!',
        description: 'Redirecting to homepage.',
      },
      error: (err) => ({
        title: 'Login Failed',
        description: err.message || 'An unexpected error occured!',
      }),
    });

    try {
      await loginPromise;
      setLoginError(false);
      await refreshUserData();
      nav('/');
    } catch (err) {
      setLoginError(err);
      console.error(err);
    }
  }

  return (
    <Flex direction="column" gap={4} align="center" justify="center" flex="1">
      <Flex as="form" onSubmit={handleSubmit} justify="center" w="100%">
        <Flex
          justify="center"
          direction="column"
          gap={4}
          py={6}
          w="60%"
          bgGradient="sidebar"
          borderRadius="1rem"
        >
          <Field.Root px={4} color="text.sidebar">
            <Field.Label>Email Address</Field.Label>
            <Input
              borderColor="borders"
              type="email"
              placeholder="email address"
              _placeholder={{
                color: 'text.sidebar/60',
              }}
              name="email"
              _focus={{ borderColor: 'bg.primaryBtn' }}
            />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>

          {loginError && (
            <Text fontSize="sm" color="red.400">
              {loginError.message}
            </Text>
          )}
          <Button
            mx={4}
            mt={2}
            type="submit"
            bg="bg.secondaryBtn"
            color="text.secondaryBtn"
            textStyle="xl"
            _hover={{ bg: 'bg.secondaryBtnHover' }}
          >
            Send Invitation
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
