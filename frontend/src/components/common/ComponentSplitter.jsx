import React from 'react';
import { Box, Splitter } from '@chakra-ui/react';

export default function ComponentSplitter({ children, ...props }) {
  const panelCount = React.Children.count(children);

  if (panelCount < 2) {
    console.error('ComponentSplitter expects at least 2 children.');
    return null;
  }

  const panelIds = Array.from({ length: panelCount }, (_, i) => `${i}`);

  return (
    <Splitter.Root
      {...props}
      display="flex"
      w="100%"
      h="100%"
      panels={panelIds.map((id) => ({ id }))}
    >
      {React.Children.map(children, (child, index) => (
        <>
          <Splitter.Panel
            id={`${index}`}
            as={Box}
            flex="1"
            minW="1px"
            minH="0"
            h="100%"
          >
            <Box w="100%" h="100%">
              {child}
            </Box>
          </Splitter.Panel>

          {index < panelCount - 1 && (
            <Splitter.ResizeTrigger
              id={`${index}:${index + 1}`}
              width="4px"
              minW="4px"
              padding="0"
              border="none"
              borderRadius="0"
              bg="gray.600"
              _hover={{ bg: 'gray.400' }}
              cursor="col-resize"
              sx={{
                WebkitAppearance: 'none', // ensure minimal appearance
                MozAppearance: 'none',
              }}
            />
          )}
        </>
      ))}
    </Splitter.Root>
  );
}
