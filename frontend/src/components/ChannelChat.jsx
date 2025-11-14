import {
  VStack,
  Box,
  Textarea,
  Field,
  Stack,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

import { UserContext } from "../store/UserContext";
import { ChannelContext } from "../store/ChannelContext";

export default function ChannelChat() {
  const { userData, socketReady, userSocket } = useContext(UserContext);
  const { channel } = useContext(ChannelContext);
  const { firstName, lastName } = userData;
  const [messages, setMessages] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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
    userSocket.emit("send-message", message, firstName, lastName, channel);
    setMessages((prev) => [...prev, `You: ${message}`]);
    reset();
  });

  return (
    <VStack>
      <Text mt={4}>Received messages</Text>
      <Text>Channel: {channel} </Text>
      <Box>
        {messages.map((msg, idx) => (
          <Text key={idx}>{msg}</Text>
        ))}
      </Box>
      {!socketReady && <Text mt={4}>Connecting to chat...</Text>}
      <form onSubmit={onSubmit}>
        <Stack mt={4} gap="4" align="flex-start" maxW="sm">
          <Field.Root invalid={!!errors.message}>
            <Field.Label>Message</Field.Label>
            <Textarea
              {...register("message", { required: "Message is required" })}
            />
            <Field.ErrorText>{errors.message?.message}</Field.ErrorText>
          </Field.Root>
          <Button type="submit">Send</Button>
        </Stack>
      </form>
    </VStack>
  );
}
