import {
  VStack,
  Box,
  Textarea,
  Field,
  Button,
  Text,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

import { UserContext } from "../store/UserContext";
import { ChannelContext } from "../store/ChannelContext";
import { sendMessage, fetchChannelMessageHistory } from "../utils/js/apiCalls";

export default function ChannelChat() {
  const { userData, socketReady, userSocket } = useContext(UserContext);
  const { channel } = useContext(ChannelContext);
  const { firstName, lastName, id } = userData;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!channel) return;
    async function fetchMessageHistoryAsync() {
      try {
        setLoading(true);
        const res = await fetchChannelMessageHistory(channel.id);
        const mappedMessages = res.data.map((msg) => ({
          messageBody: msg.messageContent,
          sender: {
            firstName: msg.user.firstName,
            lastName: msg.user.lastName,
          },
          channel: msg.channel,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
        }));

        setMessages(mappedMessages);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMessageHistoryAsync();
  }, [channel]);

  useEffect(() => {
    if (!userSocket) return;

    const handleReceiveMessage = (msg) => {
      console.log("📥 [UI] Received:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    userSocket.on("receive-message", handleReceiveMessage);

    return () => {
      userSocket.off("receive-message", handleReceiveMessage);
    };
  }, [userSocket]);

  const onSubmit = handleSubmit((data) => {
    if (!userSocket?.connected) {
      console.warn("Socket not connected yet.");
      return;
    }
    const { message } = data;
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const messageContent = {
      messageBody: message,
      sender: {
        firstName,
        lastName,
      },
      timestamp,
    };
    userSocket.emit("send-message", messageContent);
    sendMessage(message, id, channel.id);
    setMessages((prev) => [...prev, messageContent]);
    reset();
  });

  return (
    <Flex flex="1" direction="column">
      <Box bg="bg.nav" p={4} borderBottom="1px solid #e2e8f0">
        <Text fontWeight="bold">{channel?.channelName}</Text>
      </Box>
      <VStack
        flex="1"
        spacing={4}
        overflowY="auto"
        p={4}
        align="stretch"
        bg="bg.nav"
      >
        {loading && <Text>Loading messages...</Text>}
        {error && <Text>Error loading messages!</Text>}
        {messages &&
          messages.map((msg, idx) => (
            <Box
              textAlign="left"
              key={idx}
              p={2}
              borderRadius="md"
              boxShadow="sm"
            >
              <Text fontSize="sm">
                {`${msg.sender.firstName} ${msg.sender.lastName}   ·  ${msg.timestamp}`}
              </Text>
              <Text>{msg.messageBody}</Text>
            </Box>
          ))}
      </VStack>
      {!socketReady && <Text mt={4}>Connecting to chat...</Text>}
      <form onSubmit={onSubmit}>
        <HStack p={4} borderTop="1px solid #e2e8f0">
          <Field.Root invalid={!!errors.message}>
            <Textarea
              {...register("message", { required: "Message is required" })}
            />
            <Field.ErrorText>{errors.message?.message}</Field.ErrorText>
          </Field.Root>
          <Button type="submit">Send</Button>
        </HStack>
      </form>
    </Flex>
  );
}
