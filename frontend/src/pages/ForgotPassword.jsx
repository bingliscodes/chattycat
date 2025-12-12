import { Flex, Text, Input, Field, Button } from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';
import { useState } from 'react';

import { sendResetEmail } from '../utils/js/authentication';

export default function ForgotPassword() {
  const [emailError, setEmailError] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const entries = Object.fromEntries(formData.entries());

    const resetEmailPromise = sendResetEmail(entries);

    toaster.promise(resetEmailPromise, {
      loading: {
        title: 'Sending reset email...',
        description: '',
      },
      success: {
        title: 'Reset Email Sent Successfully!',
        description: 'Check your inbox.',
      },
      error: (err) => ({
        title: 'Reset Email Failed',
        description: err.message || 'An unexpected error occured!',
      }),
    });

    try {
      await resetEmailPromise;
      setEmailError(false);
    } catch (err) {
      setEmailError(err);
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
            Enter email address
          </Text>
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
          {emailError && <Text>{emailError.message}</Text>}
          <Button
            mx={4}
            mt={2}
            type="submit"
            bg="bg.secondaryBtn"
            color="text.secondaryBtn"
            textStyle="xl"
            _hover={{ bg: 'bg.secondaryBtnHover' }}
          >
            Send reset email
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
