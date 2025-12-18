import {
  Dialog,
  Portal,
  CloseButton,
  VStack,
  Box,
  Field,
  Input,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { useState, useContext } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { Tooltip } from '@/components/ui/tooltip';
import { toaster } from '@/components/ui/toaster';

import { OrganizationContext } from '@/contexts/OrganizationContext';
import { createChannel } from '@/utils/js/apiCalls';

export default function CreateChannelButton() {
  const nav = useNavigate();
  const { selectedOrganization, refreshOrganizationData } =
    useContext(OrganizationContext);
  const [createChannelError, setCreateChannelError] = useState(false);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  if (!selectedOrganization) return;
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const entries = Object.fromEntries(formData.entries());
    entries.organizationId = selectedOrganization.id;

    const createChannelPromise = createChannel(
      entries,
      selectedOrganization.id
    );

    toaster.promise(createChannelPromise, {
      loading: {
        title: 'Creating new channel...',
        description: '',
      },
      success: {
        title: 'Channel created successfully!',
        description: 'Redirecting to chat homepage.',
      },
      error: (err) => ({
        title: 'Channel creation failed',
        description: err.message || 'An unexpected error occurred!',
      }),
    });

    try {
      await createChannelPromise;
      setCreateChannelError(false);
      setDialogIsOpen(false);
      await refreshOrganizationData();
      nav('/client');
    } catch (err) {
      setCreateChannelError(err);
      console.error(err);
    }
  }
  // We also want to immediately add the user to the channel
  return (
    <VStack align="start">
      <Dialog.Root
        open={dialogIsOpen}
        onOpenChange={(details) => {
          setDialogIsOpen(details.open);
          if (!details.open) setCreateChannelError(false);
        }}
      >
        <Dialog.Trigger as={Box} color="text.sidebar">
          <Tooltip
            showArrow
            content="create a new channel"
            positioning={{ placement: 'right-end' }}
          >
            <AiFillPlusCircle
              size="2rem"
              cursor="pointer"
              onClick={() => setDialogIsOpen(true)}
            />
          </Tooltip>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Flex as="form" flex="1" onSubmit={(e) => handleSubmit(e)}>
              <Dialog.Content>
                <Dialog.Body mt={2}>
                  <Field.Root px={4} color="text.sidebar">
                    <Field.Label>Enter new channel name:</Field.Label>
                    <Input
                      borderColor="borders"
                      type="text"
                      placeholder="#channel name"
                      _placeholder={{
                        color: 'text.sidebar/60',
                      }}
                      name="channelName"
                      _focus={{ borderColor: 'bg.primaryBtn' }}
                    />
                    <Field.ErrorText></Field.ErrorText>
                  </Field.Root>
                  {createChannelError && (
                    <Text fontSize="sm" color="red.400">
                      {createChannelError.message}
                    </Text>
                  )}
                  <Button
                    mx={4}
                    mt={2}
                    type="submit"
                    bg="bg.secondaryBtn"
                    color="text.secondaryBtn"
                    textStyle="sm"
                    _hover={{ bg: 'bg.secondaryBtnHover' }}
                  >
                    Create new channel
                  </Button>
                </Dialog.Body>
                <Dialog.CloseTrigger asChild>
                  <CloseButton
                    size="2xs"
                    color="black"
                    onClick={() => setDialogIsOpen(false)}
                  />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Flex>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </VStack>
  );
}
