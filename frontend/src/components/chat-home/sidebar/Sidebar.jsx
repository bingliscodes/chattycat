// Sidebar.jsx
'use client';
import { useContext } from 'react';
import { Flex, Box, Text, Accordion, Span, Center } from '@chakra-ui/react';

import { UserContext } from '@/contexts/UserContext';
import { ChatContext } from '@/contexts/ChatContext';
import DirectMessageRecipient from './direct-messages/DirectMessageRecipient';
import AddToChannelButton from './channels/AddToChannelButton';
import StartPrivateChatButton from './direct-messages/StartPrivateChatButton';

export default function UserSidebar() {
  const { userData, userSocket } = useContext(UserContext);
  const {
    channel,
    setChannel,
    handleSetDirectMessage,
    directMessageList,
    directMessage,
  } = useContext(ChatContext);
  const { channels, organization } = userData;

  if (!userData) return <h1>Loading...</h1>;

  const handleJoinRoom = (data, mode) => {
    if (!userSocket?.connected) {
      console.warn('Socket not connected yet.');
      return;
    }

    if (mode === 'ch') {
      setChannel(data);
      handleSetDirectMessage(null);
    }
    if (mode === 'dm') {
      handleSetDirectMessage(data);
      setChannel(null);
    }

    userSocket.emit('join-room', data, mode, (ack) => {
      console.log(ack);
    });
  };

  return (
    <Box rounded="md" bg="bg.sideBar" p={4} h="100%">
      <Text fontWeight="bold" fontSize="lg" mb={4}>
        {organization?.organizationName}
      </Text>

      {/* Channels */}
      <Accordion.Root multiple mb={2}>
        <Accordion.Item value="Channels" border="none">
          <Accordion.ItemTrigger bg="bg.menuItem">
            <Span flex="1" color="text">
              Channels
            </Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            {channels &&
              channels.map((ch) => (
                <Accordion.ItemBody
                  key={ch.id}
                  onClick={() => handleJoinRoom(ch, 'ch')}
                  bg={channel?.id === ch?.id ? 'bg.primaryBtn' : undefined}
                  rounded="md"
                  cursor="pointer"
                >
                  <Flex mb={1} mx={3} pt={3} gap={2} align="center" h="1rem">
                    <Text fontSize="md" color="text" lineHeight="1">
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
      <Accordion.Root multiple>
        <Accordion.Item value="Direct Messages" border="none">
          <Accordion.ItemTrigger bg="bg.menuItem">
            <Span flex="1" color="text">
              Direct Messages
            </Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Flex align="center" gap={2} h="1rem" mb={1} mx={3} pt={3}>
                <Text cursor="default">Start new conversation</Text>
                <StartPrivateChatButton cursor="pointer" />
              </Flex>
            </Accordion.ItemBody>
            {directMessageList &&
              directMessageList.map((usr) => (
                <Accordion.ItemBody
                  key={usr.id}
                  onClick={() => handleJoinRoom(usr, 'dm')}
                  bg={
                    directMessage?.id === usr?.id ? 'bg.primaryBtn' : undefined
                  }
                  rounded="md"
                  cursor="pointer"
                >
                  <DirectMessageRecipient
                    firstName={usr.firstName}
                    lastName={usr.lastName}
                    avatarUrl={usr.avatarUrl ?? undefined}
                  />
                </Accordion.ItemBody>
              ))}
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </Box>
  );
}
