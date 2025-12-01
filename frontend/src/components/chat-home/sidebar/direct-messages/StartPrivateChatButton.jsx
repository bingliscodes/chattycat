// StartPrivateChatButton.jsx
import { Dialog, Portal, CloseButton, VStack } from '@chakra-ui/react';
import { AiFillPlusCircle } from 'react-icons/ai';

import UserSearch from '../UserSearch';

export default function StartPrivateChatButton() {
  return (
    <VStack alignItems="start">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <AiFillPlusCircle size="1.5rem" cursor="pointer" />
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Select user to start chat with:</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <UserSearch mode="dm" />
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
