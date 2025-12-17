// OrganizationBrowser.jsx
'use client';
import {
  Flex,
  Text,
  Listbox,
  createListCollection,
  Button,
} from '@chakra-ui/react';
import { NavLink } from 'react-router';
import { useContext } from 'react';

import { OrganizationContext } from '@/contexts/OrganizationContext';

export default function OrganizationBrowser() {
  const {
    userOrganizations,
    selectedOrganization,
    handleSetOrganization,
    handleLoadOrganizationData,
  } = useContext(OrganizationContext);

  //   const [selectedOrg, setSelectedOrg] = useState();
  const organizations = createListCollection({
    items: userOrganizations.map((org) => ({
      label: org.organizationName,
      value: org.id,
      org,
    })),
  });

  return (
    <Flex direction="column" flex="1" align="center">
      <Listbox.Root
        collection={organizations}
        value={selectedOrganization?.id ? [selectedOrganization.id] : []}
        onValueChange={(details) => {
          const org = details.items[0].org;
          handleSetOrganization(org);
        }}
        width="320px"
      >
        <Listbox.Label>Select Organization</Listbox.Label>
        <Listbox.Content>
          {organizations?.items.map((org) => (
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
        onClick={handleLoadOrganizationData}
        _hover={{ bg: 'bg.navHover' }}
      >
        {selectedOrganization ? 'Go to organization' : 'Select an organization'}
      </Button>
    </Flex>
  );
}
