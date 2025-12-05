import { Input, Flex, Menu } from '@chakra-ui/react';
import { useRef, useState, useContext, useEffect } from 'react';
import { debounce } from 'lodash';

import { fetchOrganizationUsers } from '@/utils/js/apiCalls';
import { UserContext } from '@/contexts/UserContext';
import UserCard from './UserCard';

export default function UserSearch({ mode }) {
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [organizationUsers, setOrganizationUsers] = useState([]);
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
    const input = e.target.value.trim().toLowerCase();
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
    setMenuIsOpen(filteredResults.length === 0 ? false : true);
  }, 500);

  const getAnchorRect = () => inputRef.current.getBoundingClientRect();

  return (
    <Flex direction="column">
      <Input
        placeholder="Enter a name or email"
        ref={inputRef}
        onBlur={(e) => e.target.focus()}
        onChange={debounceOnChange}
      />

      <Menu.Root
        open={menuIsOpen}
        positioning={{ getAnchorRect }}
        onOpenChange={(change) => setMenuIsOpen(change.open)}
        onInteractOutside={() => setMenuIsOpen(false)}
        onEscapeKeyDown={() => setMenuIsOpen(false)}
      >
        <Menu.Positioner>
          <Menu.Content>
            {searchResults &&
              searchResults.map((usr) => (
                <Menu.Item key={usr.id} value={usr.id}>
                  <UserCard user={usr} mode={mode} />
                </Menu.Item>
              ))}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </Flex>
  );
}
