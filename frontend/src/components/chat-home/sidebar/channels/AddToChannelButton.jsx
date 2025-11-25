import { Dialog, Portal, CloseButton, VStack } from '@chakra-ui/react';
import { AiFillPlusCircle } from 'react-icons/ai';

import UserSearch from './UserSearch';

export default function AddToChannelButton({ channel }) {
  return (
    <VStack alignItems="start">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <AiFillPlusCircle size="1.5rem" />
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
                <UserSearch channel={channel} />
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
