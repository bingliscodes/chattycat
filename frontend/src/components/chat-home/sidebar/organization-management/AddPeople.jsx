import {
  Flex,
  IconButton,
  Dialog,
  Portal,
  CloseButton,
} from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import { BsFillPersonPlusFill } from 'react-icons/bs';

import AddMemberForm from './AddMemberForm';

export default function AddPeople() {
  return (
    <Flex
      flex="1"
      w="full"
      px={2}
      py={1}
      align="flex-end"
      justify="space-between"
    >
      <Dialog.Root size={{ mdDown: 'full', md: 'lg' }}>
        <Tooltip
          showArrow
          content="Invite members to the organization"
          positioning={{ placement: 'right-end' }}
        >
          <Dialog.Trigger asChild>
            <IconButton>
              <BsFillPersonPlusFill />
            </IconButton>
          </Dialog.Trigger>
        </Tooltip>

        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Flex flex="1" justify="center">
                  <Dialog.Title>Add Users to your Organization </Dialog.Title>
                </Flex>
              </Dialog.Header>

              <Dialog.Body>
                <AddMemberForm />
              </Dialog.Body>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" color="black" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
}
