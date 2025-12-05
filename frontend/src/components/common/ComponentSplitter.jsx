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
      gap={1}
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
              borderRadius="0"
              padding="3px"
              bg="none"
              _hover={{ bg: 'blue.300' }}
              cursor="col-resize"
            />
          )}
        </>
      ))}
    </Splitter.Root>
  );
}
