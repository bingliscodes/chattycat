'use client';

import { useState, useContext } from 'react';
import { Text, Flex, Field, Input, Stack, Button } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router';

import { toaster } from '@/components/ui/toaster';
import { login } from '../utils/js/authentication';
import { UserContext } from '@/contexts/UserContext';

export default function LoginCard() {
  const [logInError, setLoginError] = useState(false);
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
      error: {
        title: 'Login Failed',
        description: 'Invalid email or password.',
      },
    });

    try {
      await loginPromise;
      setLoginError(false);
      await refreshUserData();
      nav('/');
    } catch (err) {
      setLoginError(true);
      console.error(err);
    }
  }

  return (
    <Flex
      direction="column"
      gap={4}
      py={2}
      align="center"
      justify="center"
      flex="1"
      mt="-8rem"
    >
      <Flex as="form" onSubmit={handleSubmit} justify="center" w="100%">
        <Flex
          mt={2}
          justify="center"
          direction="column"
          gap={4}
          py={6}
          w="50%"
          bg="bg.form"
          p={6}
          borderRadius="1rem"
        >
          <Text fontSize="3xl" fontWeight="bold">
            Login
          </Text>
          <Field.Root px={4}>
            <Field.Label>Email Address</Field.Label>
            <Input type="email" placeholder="email address" name="email" />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>

          <Field.Root px={4}>
            <Field.Label>Password</Field.Label>
            <Input type="text" placeholder="password" name="password" />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>
          <div>{logInError && <p>Username or password is invalid.</p>}</div>

          <Button mx={4} type="submit">
            Log In
          </Button>
          <Stack pt={6}>
            Don't have an account yet? <NavLink to="/signup">Signup</NavLink>
          </Stack>
        </Flex>
      </Flex>
    </Flex>
  );
}
