"use client";
import { useContext } from "react";
import { Box, Text, Accordion, Span } from "@chakra-ui/react";

import { UserContext } from "../store/UserContext";
import { ChannelContext } from "../store/ChannelContext";

export default function UserSidebar() {
  const { userData, userSocket } = useContext(UserContext);
  const { channel, setChannel } = useContext(ChannelContext);

  const { channels, organization } = userData;

  if (!userData) return <h1>Loading...</h1>;
  const handleJoinChannel = (channel) => {
    if (!userSocket?.connected) {
      console.warn("Socket not connected yet.");
      return;
    }

    setChannel(channel);
    userSocket.emit("join-room", channel);
  };
  return (
    <Box rounded="md" width="260px" bg="bg.sideBar" p={4}>
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
                  bg={channel.id === ch.id ? "bg.primaryBtn" : undefined}
                  key={ch.id}
                  onClick={() => handleJoinChannel(ch)}
                >
                  {ch.channelName}
                </Accordion.ItemBody>
              ))}
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>

      {/* Direct Messages*/}
      <Accordion.Root multiple>
        <Accordion.Item value="Direct Messages">
          <Accordion.ItemTrigger bg="bg.menuItem">
            <Span flex="1" color="text">
              Direct Messages
            </Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          {/* //TODO: Replace this with DM chats */}
          <Accordion.ItemContent>
            {channels &&
              channels.map((channel) => (
                <Accordion.ItemBody key={channel.id}>
                  {channel.channelName}
                </Accordion.ItemBody>
              ))}
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </Box>
  );
}
