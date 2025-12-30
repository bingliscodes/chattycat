// OrganizationBrowser.jsx

'use client';
import {
  Flex,
  Listbox,
  createListCollection,
  Button,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router';
import { useContext } from 'react';

import { OrganizationContext } from '@/contexts/OrganizationContext';

// If a user is not part of an organization, display a separate visual
export default function OrganizationBrowser() {
  const nav = useNavigate();
  const {
    userOrganizations,
    selectedOrganization,
    handleSetOrganization,
    isLoadingUserOrganizations,
  } = useContext(OrganizationContext);

  if (isLoadingUserOrganizations) {
    return (
      <Center flex="1">
        <Spinner size="xl" color="primary.500" />
      </Center>
    );
  }
  if (!userOrganizations.length) nav('/createOrganization');

  const organizations = createListCollection({
    items: userOrganizations.map((org) => ({
      label: org.organizationName,
      value: org.id,
      org,
    })),
  });

  return (
    <Flex direction="column" flex="1" align="center" mt={4} gap={2}>
      <Listbox.Root
        collection={organizations}
        value={selectedOrganization?.id ? [selectedOrganization.id] : []}
        onValueChange={(details) => {
          const org = details.items[0].org;
          handleSetOrganization(org);
        }}
        width="320px"
      >
        <Listbox.Label fontSize="lg" fontWeight="bold">
          Select Organization
        </Listbox.Label>

        <Listbox.Content mt={2}>
          {organizations?.items.map((org) => (
            <Listbox.Item item={org} key={org.value}>
              <Listbox.ItemText>{org.label}</Listbox.ItemText>
              <Listbox.ItemIndicator />
            </Listbox.Item>
          ))}
        </Listbox.Content>
      </Listbox.Root>
      <Flex direction="column" gap={2}>
        <Button
          to="createOrganization"
          as={NavLink}
          bg="bg.primaryBtn"
          _hover={{ bg: 'bg.navHover' }}
        >
          Create a new organization
        </Button>
        <Button
          to="/client"
          as={NavLink}
          bg="bg.primaryBtn"
          _hover={{ bg: 'bg.navHover' }}
        >
          {selectedOrganization
            ? 'Go to organization'
            : 'Select an organization'}
        </Button>
      </Flex>
    </Flex>
  );
}
