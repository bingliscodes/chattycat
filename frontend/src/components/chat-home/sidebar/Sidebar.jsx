// Sidebar.jsx
'use client';
import { useContext } from 'react';
import { Flex, Text, Accordion, Span } from '@chakra-ui/react';

import { UserContext } from '@/contexts/UserContext';
import { ChatContext } from '@/contexts/ChatContext';
import { OrganizationContext } from '@/contexts/OrganizationContext';
import DirectMessageRecipient from './direct-messages/DirectMessageRecipient';
import AddToChannelButton from './channels/AddToChannelButton';
import StartPrivateChatButton from './direct-messages/StartPrivateChatButton';
import CreateChannelButton from './channels/CreateChannelButton';
import AddPeople from './AddPeople';

export default function UserSidebar() {
  const { userData, userSocket } = useContext(UserContext);
  const {
    channel,
    setChannel,
    handleSetDirectMessage,
    directMessageList,
    directMessage,
    setChatMode,
  } = useContext(ChatContext);

  const { organizationData, selectedOrganization } =
    useContext(OrganizationContext);

  const { channels } = organizationData || [];

  if (!organizationData) return <p>Loading Organization Data...</p>;
  if (!userData) return <p>Loading...</p>;
  const handleJoinRoom = (data, mode) => {
    if (!userSocket?.connected) {
      console.warn('Socket not connected yet.');
      return;
    }

    if (mode === 'ch') {
      setChannel(data);
      handleSetDirectMessage(null);
      setChatMode('ch');
    }

    if (mode === 'dm') {
      handleSetDirectMessage(data);
      setChannel(null);
      setChatMode('dm');
    }

    userSocket.emit('join-room', data, mode, (ack) => {
      console.log(ack);
    });
  };

  return (
    <Flex
      align="flex-start"
      direction="column"
      bgGradient="sidebar"
      pt={2}
      h="100%"
    >
      <Text ml={4} fontWeight="bold" fontSize="4xl" mb={4} color="text.sidebar">
        {selectedOrganization?.organizationName}
      </Text>

      {/* Channels */}
      <Accordion.Root multiple px={2}>
        <Accordion.Item value="Channels" border="none">
          <Accordion.ItemTrigger
            bg="none"
            rounded="lg"
            _hover={{ bg: 'bg.itemHover' }}
          >
            <Accordion.ItemIndicator />
            <Flex flex="1" align="center">
              <Span flex="1" color="text.sidebar" textStyle="2xl">
                Channels
              </Span>
              <CreateChannelButton />
            </Flex>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            {channels &&
              channels.map((ch) => (
                <Accordion.ItemBody
                  key={ch.id}
                  onClick={() => handleJoinRoom(ch, 'ch')}
                  bg={channel?.id === ch?.id ? 'bg.selectedItem' : undefined}
                  rounded="lg"
                  cursor="pointer"
                  mx={3}
                  mb={1}
                  _hover={{ bg: 'bg.itemHover', rounded: 'lg' }}
                >
                  <Flex ml={6} gap={2} align="center" h="1rem" mt={2}>
                    <Text
                      fontSize="md"
                      color={
                        channel?.id === ch?.id
                          ? 'text.selectedItem'
                          : 'text.sidebar'
                      }
                      lineHeight="1"
                    >
                      # {ch.channelName}
                    </Text>
                    <AddToChannelButton channel={ch} />
                  </Flex>
                </Accordion.ItemBody>
              ))}
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>

      {/* Direct Messages */}
      <Accordion.Root multiple px={2}>
        <Accordion.Item value="Direct Messages" border="none">
          <Accordion.ItemTrigger
            bg="none"
            rounded="lg"
            _hover={{ bg: 'bg.itemHover' }}
          >
            <Accordion.ItemIndicator />
            <Span flex="1" color="text.sidebar" textStyle="2xl">
              Direct Messages
            </Span>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody
              _hover={{ bg: 'bg.itemHover' }}
              rounded="lg"
              mx={3}
              mb={1}
            >
              <Flex ml={6} align="center" gap={2} mt={2} h="1rem">
                <Text cursor="default" fontSize="md" color="text.sidebar">
                  Start new conversation
                </Text>
                <StartPrivateChatButton cursor="pointer" />
              </Flex>
            </Accordion.ItemBody>
            {directMessageList &&
              directMessageList.map((usr) => (
                <Accordion.ItemBody
                  key={usr.id}
                  onClick={() => handleJoinRoom(usr, 'dm')}
                  bg={
                    directMessage?.id === usr?.id
                      ? 'bg.selectedItem'
                      : undefined
                  }
                  _hover={{ bg: 'bg.itemHover' }}
                  rounded="lg"
                  cursor="pointer"
                  mx={3}
                >
                  <DirectMessageRecipient
                    firstName={usr.firstName}
                    lastName={usr.lastName}
                    avatarUrl={usr.avatarUrl ?? undefined}
                    isSelected={directMessage?.id === usr?.id}
                  />
                </Accordion.ItemBody>
              ))}
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
      <AddPeople />
    </Flex>
  );
}
