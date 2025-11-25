import { Input, Center, Box, Menu, Portal } from '@chakra-ui/react';
import { useRef, useState, useContext } from 'react';
import { debounce } from 'lodash';

import { fetchUsers } from '@/utils/apiCalls';

export default function UserSearch() {
  const [searchResults, setSearchResults] = useState();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const inputRef = useRef();

  const fetchSearchResults = () => {};
  const debounceOnChange = debounce(async (e) => {
    const searchRes = await fetchSearchResults(e.target.value);
    setSearchResults(searchRes.slice(0, 10));
    setMenuIsOpen(searchRes.length === 0 ? false : true);
  }, 500);

  const getAnchorRect = () => inputRef.current.getBoundingClientRect();

  return (
    <Center flexDirection="column" w="full">
      <Box textAlign="left">
        <Box position="relative">
          <Input
            placeholder="Search for a user"
            variant="outline"
            size="lg"
            ref={inputRef}
            onChange={debounceOnChange}
            _focus={{
              borderColor: 'blue.400',
              boxShadow: '0 0 0 1px blue.400',
            }}
            _hover={{ borderColor: 'gray.400' }}
          />

          <Menu.Root
            open={menuIsOpen}
            positioning={{ getAnchorRect }}
            onOpenChange={(change) => setMenuIsOpen(change.open)}
            onInteractOutside={() => setMenuIsOpen(false)}
            onEscapeKeyDown={() => setMenuIsOpen(false)}
          >
            <Portal>
              <Menu.Positioner w="width.form">
                <Menu.Content bg="bg.menu" boxShadow="xl" borderRadius="md">
                  {searchResults &&
                    searchResults.map((res) => (
                      <Menu.Item
                        key={res.id}
                        value={res.id}
                        onClick={() => {
                          setMenuIsOpen(false);
                        }}
                        onSelect={(e) => e.preventDefault()}
                      ></Menu.Item>
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
