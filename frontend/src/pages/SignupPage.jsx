'use client';

import { useState } from 'react';
import { Field, Input, Stack, Button, Flex, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router';
import { useContext } from 'react';

import { UserContext } from '@/contexts/UserContext';
import { toaster } from '@/components/ui/toaster';
import { signup } from '../utils/js/authentication';

export default function SignupCard() {
  const [signupError, setSignupError] = useState(false);
  const { refreshUserData } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const entries = Object.fromEntries(formData.entries());

    const signupPromise = signup(entries);

    toaster.promise(signupPromise, {
      loading: {
        title: 'Signing up...',
        description: 'Creating your account..',
      },
      success: {
        title: 'Signup Successful!',
        description: 'Redirecting to homepage.',
      },
      error: {
        title: 'Signup Failed',
        description: 'An unexpected error has occurred! Please try again later',
      },
    });

    try {
      await signupPromise;
      setSignupError(false);

      await refreshUserData();
    } catch (err) {
      console.error(err); // exit early if signup fails
    }
  }
  return (
    <Flex direction="column" py={2} align="center" flex="1">
      <Text fontSize="lg" fontWeight="bold">
        Create an account to get started
      </Text>
      <Flex as="form" onSubmit={handleSubmit} w="100%" justify="center">
        <Flex
          mt={2}
          direction="column"
          gap={4}
          py={6}
          w="50%"
          bg="bg.form"
          p={4}
          borderRadius="1rem"
        >
          <Field.Root zIndex={1}>
            <Field.Label>First Name</Field.Label>
            <Input type="text" placeholder="first name" name="firstName" />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>

          <Field.Root>
            <Field.Label>Last Name</Field.Label>
            <Input type="text" placeholder="last name" name="lastName" />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>

          <Field.Root>
            <Field.Label>Email Address</Field.Label>
            <Input type="email" placeholder="email address" name="email" />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>

          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input type="text" placeholder="password" name="password" />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>

          <Field.Root>
            <Field.Label>Confirm Password</Field.Label>
            <Input
              type="text"
              placeholder="confirm password"
              name="passwordConfirm"
            />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>

          <Button type="submit">Sign Up</Button>
          <Stack pt={6}>
            Already a user? <NavLink to="/login">Login</NavLink>
          </Stack>
        </Flex>
      </Flex>
    </Flex>
  );
}
