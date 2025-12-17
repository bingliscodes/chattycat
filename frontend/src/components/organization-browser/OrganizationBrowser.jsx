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

export default function OrganizationBrowser() {
  const { userData } = useContext(UserContext);
  const { setOrganization } = useContext(ChatContext);
  const [selectedOrg, setSelectedOrg] = useState([]);

  const organizations = createListCollection({
    items: userData.organizations.map((org) => ({
      label: org.organizationName,
      value: org.UserOrganization.organizationId,
    })),
  });

  const handleSetOrganization = () => {
    setOrganization(selectedOrg);
  };

  return (
    <Flex direction="column" flex="1" align="center">
      <Listbox.Root
        collection={organizations}
        value={selectedOrg}
        onValueChange={(details) => setSelectedOrg(details.value)}
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
      <Text>Selected Value: {selectedOrg}</Text>

      <Button
        to="/client"
        as={NavLink}
        bg="bg.primaryBtn"
        onClick={handleSetOrganization}
        _hover={{ bg: 'bg.navHover' }}
      >
        Go to organization
      </Button>
    </Flex>
  );
}
