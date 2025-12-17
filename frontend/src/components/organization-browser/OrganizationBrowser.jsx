'use client';
import { Flex, Text, Listbox, createListCollection } from '@chakra-ui/react';
import { useContext } from 'react';

import { UserContext } from '@/contexts/UserContext';
export default function OrganizationBrowser() {
  const { userData } = useContext(UserContext);

  const orgs = [userData.organization];
  console.log(orgs);
  const organizations = createListCollection({
    items: orgs.map((org) => ({
      label: org.organizationName,
      value: org.organizationName,
    })),
  });

  console.log(userData);
  return (
    <Flex direction="column" flex="1" align="center">
      <Listbox.Root collection={organizations} width="320px">
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
    </Flex>
  );
}
