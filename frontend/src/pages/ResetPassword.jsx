'use client';

import { useState, useContext } from 'react';
import {
  Checkbox,
  Text,
  Flex,
  Field,
  Input,
  Stack,
  Button,
} from '@chakra-ui/react';
import { useParams } from 'react-router';
import { NavLink, useNavigate } from 'react-router';

import { toaster } from '@/components/ui/toaster';
import { resetPassword } from '../utils/js/authentication';
import { UserContext } from '@/contexts/UserContext';

export default function ResetPassword() {
  const { token } = useParams();
  const [resetPasswordError, setResetPasswordError] = useState(false);
  const { refreshUserData } = useContext(UserContext);
  const [checked, setChecked] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const entries = Object.fromEntries(formData.entries());

    const resetPasswordPromise = resetPassword(entries, token);

    toaster.promise(resetPasswordPromise, {
      loading: {
        title: 'Updating password...',
        description: '',
      },
      success: {
        title: 'Password Updated Successfully!',
        description: 'Redirecting to homepage.',
      },
      error: (err) => ({
        title: 'Password Reset Failed',
        description: err.message || 'An unexpected error occured!',
      }),
    });

    try {
      await resetPasswordPromise;
      setResetPasswordError(false);
      await refreshUserData();
      nav('/');
    } catch (err) {
      setResetPasswordError(err);
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
          bgGradient="sidebar"
          p={6}
          borderRadius="1rem"
        >
          <Text fontSize="3xl" fontWeight="bold" color="text.sidebar">
            Enter new password
          </Text>
          <Field.Root px={4} color="text.sidebar">
            <Field.Label>Password</Field.Label>
            <Input
              borderColor="borders"
              type={checked ? 'text' : 'password'}
              placeholder="password"
              _placeholder={{
                color: 'text.sidebar/60',
              }}
              name="password"
              _focus={{ borderColor: 'bg.primaryBtn' }}
            />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>

          <Field.Root px={4} color="text.sidebar">
            <Field.Label>Confirm password</Field.Label>
            <Input
              borderColor="borders"
              type={checked ? 'text' : 'password'}
              placeholder="confirm password"
              _placeholder={{
                color: 'text.sidebar/60',
              }}
              name="passwordConfirm"
              _focus={{ borderColor: 'bg.primaryBtn' }}
            />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>
          <Checkbox.Root
            color="text.sidebar"
            px={4}
            checked={checked}
            onCheckedChange={(e) => setChecked(!!e.checked)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Show password</Checkbox.Label>
          </Checkbox.Root>
          {resetPasswordError && (
            <Text fontSize="sm" color="red.400">
              {resetPasswordError.message}
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
            Reset Password
          </Button>

          <Stack pt={3} color="text.sidebar">
            Don't have an account yet? <NavLink to="/signup">Signup</NavLink>
          </Stack>
        </Flex>
      </Flex>
    </Flex>
  );
}
