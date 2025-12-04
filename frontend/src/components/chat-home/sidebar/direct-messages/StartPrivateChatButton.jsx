// StartPrivateChatButton.jsx
import { Dialog, Portal, CloseButton, VStack } from '@chakra-ui/react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { Tooltip } from '@/components/ui/tooltip';

import UserSearch from '../UserSearch';

export default function StartPrivateChatButton() {
  return (
    <VStack alignItems="start">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Tooltip
            showArrow
            content="start a new chat with a user in your organization"
            positioning={{ placement: 'right-end' }}
          >
            <AiFillPlusCircle size="1.5rem" cursor="pointer" />
          </Tooltip>
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
