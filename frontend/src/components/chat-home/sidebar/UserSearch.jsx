import { Input, Center, Box, Menu, Portal } from '@chakra-ui/react';
import { useRef, useState, useContext, useEffect } from 'react';
import { debounce } from 'lodash';

import { fetchOrganizationUsers } from '@/utils/js/apiCalls';
import { UserContext } from '../../../contexts/UserContext';

export default function UserSearch() {
  const [searchResults, setSearchResults] = useState();
  const [organizationUsers, setOrganizationUsers] = useState();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef();

  const { userData } = useContext(UserContext);

  useEffect(() => {
    if (!userData) return;
    async function fetchOrganizationUsersAsync() {
      try {
        setLoading(true);
        const res = await fetchOrganizationUsers(userData.organizationId);

        setOrganizationUsers(res);
        setSearchResults(res);
        setMenuIsOpen(true);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrganizationUsersAsync();
  }, [userData, setOrganizationUsers]);

  const debounceOnChange = debounce(async (e) => {
    const input = e.target.value.trim();

    const filteredResults = organizationUsers.filter((usr) => {
      const firstName = usr.firstName?.toLowerCase() || '';
      const lastName = usr.lastName?.toLowerCase() || '';
      const fullName = `${firstName} ${lastName}`;
      const email = usr.email?.toLowerCase() || '';

      return (
        firstName.includes(input) ||
        lastName.includes(input) ||
        fullName.includes(input) ||
        email.includes(input)
      );
    });
    setSearchResults(filteredResults);
    setMenuIsOpen(organizationUsers.length === 0 ? false : true);
  }, 500);

  const getAnchorRect = () => inputRef.current.getBoundingClientRect();

  return (
    <Center flexDirection="column">
      <Box>
        <Box>
          <Input
            placeholder="Search for a user"
            ref={inputRef}
            onChange={debounceOnChange}
          />

          <Menu.Root
            open={menuIsOpen}
            positioning={{ getAnchorRect }}
            onOpenChange={(change) => setMenuIsOpen(change.open)}
            onInteractOutside={() => setMenuIsOpen(false)}
            onEscapeKeyDown={() => setMenuIsOpen(false)}
          >
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  {searchResults &&
                    searchResults.map((res) => (
                      <Menu.Item
                        key={res.id}
                        value={res.id}
                        onClick={() => {
                          setMenuIsOpen(false);
                        }}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {res.firstName} {res.lastName}
                      </Menu.Item>
                    ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Box>
      </Box>
    </Center>
  );
}
