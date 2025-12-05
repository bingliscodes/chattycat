import { Dialog, Portal, CloseButton, VStack, Box } from '@chakra-ui/react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { Tooltip } from '@/components/ui/tooltip';

import UserSearch from '../UserSearch';

export default function AddToChannelButton({ channel }) {
  return (
    <VStack align="start">
      <Dialog.Root>
        <Dialog.Trigger as={Box}>
          <Tooltip
            showArrow
            content="add users to channel"
            positioning={{ placement: 'right-end' }}
          >
            <AiFillPlusCircle size="1.5rem" />
          </Tooltip>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>
                  Add people to #{channel.channelName}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <UserSearch mode="ch" />
              </Dialog.Body>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="xs" color="black" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </VStack>
  );
}
