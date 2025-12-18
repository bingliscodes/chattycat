// CreateOrganization.jsx
// Flow to create a new organization

'use client';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Field, Input, Button, Flex, Text } from '@chakra-ui/react';
import { useContext } from 'react';

import { toaster } from '@/components/ui/toaster';
import { createOrganization } from '@/utils/js/apiCalls';
import { OrganizationContext } from '../../contexts/OrganizationContext';

export default function CreateOrganization() {
  const nav = useNavigate();
  const [createOrgError, setCreateOrgError] = useState(false);
  const { handleSetOrganization } = useContext(OrganizationContext);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const entries = Object.fromEntries(formData.entries());

    const createOrgPromise = createOrganization(entries);

    toaster.promise(createOrgPromise, {
      loading: {
        title: 'Creating organization...',
        description: '',
      },
      success: {
        title: 'Organization created successfully!',
        description: 'Redirecting to homepage.',
      },
      error: (err) => ({
        title: 'Organization creation failed',
        description: err.message || 'An unexpected error occurred!',
      }),
    });

    try {
      const newOrg = await createOrgPromise;
      setCreateOrgError(false);
      handleSetOrganization(newOrg.data);
      nav('/client');
    } catch (err) {
      setCreateOrgError(err);
      console.error(err);
    }
  }

  return (
    <Flex
      direction="column"
      py={2}
      align="center"
      mt="-12rem"
      flex="1"
      justify="center"
    >
      <Flex as="form" onSubmit={handleSubmit} w="100%" justify="center">
        <Flex
          mt={2}
          direction="column"
          gap={4}
          py={6}
          w="50%"
          p={6}
          borderRadius="1rem"
          bgGradient="sidebar"
        >
          <Text fontSize="xl" fontWeight="bold" color="text.sidebar">
            Create an Organization to get started!
          </Text>
          <Field.Root px={4} color="text.sidebar">
            <Field.Label>Organization Name</Field.Label>
            <Input
              borderColor="borders"
              type="text"
              placeholder="organization name"
              _placeholder={{
                color: 'text.sidebar/60',
              }}
              name="organizationName"
              _focus={{ borderColor: 'bg.primaryBtn' }}
            />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>

          {createOrgError && (
            <Text fontSize="sm" color="red.400">
              {createOrgError.message}
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
            Create My Organization
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
