'use client';
import { useContext, useEffect, useState } from 'react';
import { Box, Text, Accordion, Span, Center } from '@chakra-ui/react';

import { UserContext } from '../store/UserContext';
import { ChatContext } from '../store/ChatContext';
import { fetchDirectMessageList } from '../utils/js/apiCalls';

export default function UserSidebar() {
  const { userData, userSocket } = useContext(UserContext);
  const { channel, setChannel, directMessage, setDirectMessage } =
    useContext(ChatContext);
  const [directMessageList, setDirectMessageList] = useState();
  const { channels, organization, id } = userData;

  useEffect(() => {
    if (!id) return;
    async function fetchDirectMessageListAsync() {
      try {
        const directMessageListRes = await fetchDirectMessageList(id);
        setDirectMessageList(directMessageListRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchDirectMessageListAsync();
  }, [id]);

  if (!userData) return <h1>Loading...</h1>;
  const handleJoinRoom = (data, mode) => {
    if (!userSocket?.connected) {
      console.warn('Socket not connected yet.');
      return;
    }

    if (mode === 'ch') {
      setChannel(data);
      setDirectMessage(null);
    }
    if (mode === 'dm') {
      setDirectMessage(data);
      setChannel(null);
    }

    userSocket.emit('join-room', data, mode, (ack) => {
      console.log(ack);
    });
  };

  return (
    <Box
      rounded="md"
      width="260px"
      bg="bg.sideBar"
      p={4}
      borderRight="solid 1px white"
    >
      <Text fontWeight="bold" fontSize="lg" mb={4}>
        {organization?.organizationName}
      </Text>

      {/* Channels */}
      <Accordion.Root multiple>
        <Accordion.Item value="Channels">
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
                  as={Center}
                  h="2rem"
                  bg={channel?.id === ch?.id ? 'bg.primaryBtn' : undefined}
                  rounded="md"
                  mt={1}
                  mb={2}
                  cursor="pointer"
                >
                  <Text fontSize="sm" color="text" lineHeight="1" m="0">
                    {ch.channelName}
                  </Text>
                </Accordion.ItemBody>
              ))}
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>

      {/* Since PMs are just created using rooms, we can likely handle the same way as channels, but will need to generate unique ids for each sender/receiver pair */}
      {/* Direct Messages */}
      <Accordion.Root multiple>
        <Accordion.Item value="Direct Messages">
          <Accordion.ItemTrigger bg="bg.menuItem">
            <Span flex="1" color="text">
              Direct Messages
            </Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            {directMessageList &&
              directMessageList.map((usr) => (
                <Accordion.ItemBody
                  key={usr.id}
                  onClick={() => handleJoinRoom(usr, 'dm')}
                  as={Center}
                  h="2rem"
                  bg={channel?.id === usr?.id ? 'bg.primaryBtn' : undefined}
                  rounded="md"
                  mt={1}
                  mb={2}
                  cursor="pointer"
                >
                  <Text fontSize="sm" color="text" lineHeight="1" m="0">
                    {`${usr.firstName} ${usr.lastName}`}
                  </Text>
                </Accordion.ItemBody>
              ))}
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </Box>
  );
}
