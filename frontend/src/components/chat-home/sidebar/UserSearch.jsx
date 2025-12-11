import { Input, Flex, Box } from '@chakra-ui/react';
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
    setMenuIsOpen(filteredResults.length > 0);
  }, 500);

  const getAnchorRect = () => inputRef.current.getBoundingClientRect();

  useEffect(() => {
    if (
      menuIsOpen &&
      inputRef.current &&
      document.activeElement !== inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [menuIsOpen]);
  return (
    <Flex direction="column">
      <Input
        placeholder="Enter a name or email"
        ref={inputRef}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          debounceOnChange(e);
        }}
        onFocus={() => {
          if (searchResults.length > 0) setMenuIsOpen(true);
        }}
      />
      {menuIsOpen && searchResults.length > 0 && (
        <Flex
          positioning={{ getAnchorRect }}
          direction="column"
          border="1px solid"
          borderColor="bg.sidebar"
          rounded="md"
          mt={1}
          w="full"
          boxShadow="sm"
          maxH="240px"
          overflowY="auto"
          zIndex={999}
        >
          {searchResults.map((usr) => (
            <Box
              key={usr.id}
              cursor="default"
              px={3}
              py={2}
              _hover={{
                bg: 'bg.secondaryBtnHover',
              }}
            >
              <UserCard user={usr} mode={mode} />
            </Box>
          ))}
        </Flex>
      )}
    </Flex>
  );
}
