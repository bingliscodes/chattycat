'use client';
import { useState, useContext, useRef } from 'react';
import { Text, Flex, Field, Input, Button } from '@chakra-ui/react';

import { addUserToOrganization } from '@/utils/js/apiCalls';
import { toaster } from '@/components/ui/toaster';
import { UserContext } from '@/contexts/UserContext';
import { OrganizationContext } from '@/contexts/OrganizationContext';

export default function AddMemberForm() {
  const [error, setError] = useState(false);
  const { refreshUserData } = useContext(UserContext);
  const { selectedOrganization } = useContext(OrganizationContext);
  const emailInput = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const entries = Object.fromEntries(formData.entries());

    const addUserPromise = addUserToOrganization(
      entries,
      selectedOrganization.id
    );

    toaster.promise(addUserPromise, {
      loading: {
        title: 'Adding user to organization...',
        description: 'Checking that a user with entered email exists...',
      },
      success: {
        title: 'Successfully added user to your organization!',
        description:
          'Have them login to their ChattyCat account to access their new organization.',
      },
      error: (err) => ({
        title: 'Failed to add user to organization',
        description: err.message || 'An unexpected error occured!',
      }),
    });

    try {
      await addUserPromise;
      setError(false);
      emailInput.current.value = '';
      await refreshUserData();
    } catch (err) {
      setError(err);
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
              ref={emailInput}
              _placeholder={{
                color: 'text.sidebar/60',
              }}
              name="email"
              _focus={{ borderColor: 'bg.primaryBtn' }}
            />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>

          {error && (
            <Text textAlign="center" fontSize="sm" color="red.400">
              {error.message}
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
