'use client';
import {
  Flex,
  Text,
  Listbox,
  createListCollection,
  Button,
} from '@chakra-ui/react';
import { NavLink } from 'react-router';
import { useContext, useState } from 'react';

import { UserContext } from '@/contexts/UserContext';
import { ChatContext } from '@/contexts/ChatContext';
import { OrganizationContext } from '@/contexts/OrganizationContext';

export default function OrganizationBrowser() {
  const { organizationData } = useContext(UserContext);
  const { handleSetOrganization } = useContext(OrganizationContext);
  const [selectedOrg, setSelectedOrg] = useState();

  const organizations = createListCollection({
    items: organizationData.map((org) => ({
      label: org.organizationName,
      value: org.id,
      org,
    })),
  });

  return (
    <Flex direction="column" flex="1" align="center">
      <Listbox.Root
        collection={organizations}
        value={selectedOrg}
        onValueChange={(details) => {
          setSelectedOrg(details.value);
          handleSetOrganization(details.items[0].org);
        }}
        width="320px"
      >
        <Listbox.Label>Select Organization</Listbox.Label>
        <Listbox.Content>
          {organizations.items.map((org) => (
            <Listbox.Item item={org} key={org.value}>
              <Listbox.ItemText>{org.label}</Listbox.ItemText>
              <Listbox.ItemIndicator />
            </Listbox.Item>
          ))}
        </Listbox.Content>
      </Listbox.Root>

      <Button
        to="/client"
        as={NavLink}
        bg="bg.primaryBtn"
        _hover={{ bg: 'bg.navHover' }}
      >
        {selectedOrg ? 'Go to organization' : 'Select an organization'}
      </Button>
    </Flex>
  );
}
