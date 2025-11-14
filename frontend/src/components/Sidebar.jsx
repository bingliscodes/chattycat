"use client";

import { useContext } from "react";
import {
  Flex,
  Text,
  Button,
  AbsoluteCenter,
  Box,
  Circle,
  HStack,
  IconButton,
  Link,
  Stack,
} from "@chakra-ui/react";

import { Tooltip } from "../components/ui/tooltip.jsx";
import { UserContext } from "../store/UserContext";
import { ChannelContext } from "../store/ChannelContext";
import { useSidebarContext } from "../store/SidebarContext";

export default function UserSidebar() {
  const { userData, userSocket } = useContext(UserContext);
  const { setChannel } = useContext(ChannelContext);

  const { channels, organization } = userData;

  if (!userData) return <h1>Loading...</h1>;

  const { firstName } = userData;

  const handleJoinChannel = (channelName) => {
    if (!userSocket?.connected) {
      console.warn("Socket not connected yet.");
      return;
    }
    setChannel(channelName);
    userSocket.emit("join-room", channelName);
  };
  return (
    <Stack flex={1}>
      <Text fontSize="2xl" fontWeight="bold">
        {organization?.organizationName}
      </Text>
      <Text fontSize="xl">Channels:</Text>

      {channels &&
        channels.map((channel, idx) => (
          <Button
            key={channel.channelName}
            onClick={() => handleJoinChannel(channel.channelName)}
          >
            {channel.channelName}
          </Button>
        ))}
    </Stack>
  );
}

export function Sidebar() {
  const { sideBarVisible, toggleSidebar } = useSidebarContext();

  return (
    <Box
      bg="bg.muted"
      w={!sideBarVisible ? "0" : "260px"}
      overflow="hidden"
      transition=" width 0.3s"
    >
      <Stack h="full" px="3" py="2">
        <Flex justify="space-between">
          <Tooltip
            content="Close sidebar"
            positioning={{ placement: "right" }}
            showArrow
          >
            <IconButton variant="ghost" onClick={toggleSidebar}></IconButton>
          </Tooltip>

          <Tooltip content="New chat" showArrow>
            <IconButton variant="ghost"></IconButton>
          </Tooltip>
        </Flex>

        <Stack px="2" gap="0" flex="1">
          <HStack
            position="relative"
            className="group"
            _hover={{
              layerStyle: "fill.muted",
              textDecor: "none",
            }}
            px="1"
            h="10"
            borderRadius="lg"
            w="100%"
            whiteSpace="nowrap"
          >
            <Link href="#" variant="plain" _hover={{ textDecor: "none" }}>
              <Circle size="6" bg="bg" borderWidth="1px"></Circle>
              <Text fontSize="sm" fontWeight="md">
                ChatGPT
              </Text>
            </Link>
            <AbsoluteCenter
              axis="vertical"
              right="2"
              display="none"
              _groupHover={{ display: "initial" }}
            >
              <Tooltip
                content="New chat"
                positioning={{ placement: "right" }}
                showArrow
              ></Tooltip>
            </AbsoluteCenter>
          </HStack>

          <HStack
            _hover={{
              layerStyle: "fill.muted",
              textDecor: "none",
            }}
            px="1"
            h="10"
            borderRadius="lg"
            w="100%"
            whiteSpace="nowrap"
          >
            <Link href="#" variant="plain" _hover={{ textDecor: "none" }}>
              <Text fontSize="sm" fontWeight="md">
                Explore GPTs
              </Text>
            </Link>
          </HStack>
        </Stack>

        <Link
          href="#"
          _hover={{ textDecor: "none", layerStyle: "fill.muted" }}
          borderRadius="lg"
          px="1"
          py="2"
        >
          <HStack whiteSpace="nowrap">
            <Circle size="8" fontSize="lg" borderWidth="1px"></Circle>
            <Stack gap="0" fontWeight="medium">
              <Text fontSize="sm">Upgrade plan</Text>
              <Text fontSize="xs" color="fg.subtle">
                More access to the best models
              </Text>
            </Stack>
          </HStack>
        </Link>
      </Stack>
    </Box>
  );
}
