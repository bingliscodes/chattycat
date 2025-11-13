import { useContext } from "react";
import { UserContext } from "../store/UserContext";
import { useForm } from "react-hook-form";
import {
  Textarea,
  Text,
  Stack,
  Field,
  Input,
  Button,
  Box,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const { userData, socketReady, userSocket } = useContext(UserContext);
  const { firstName, lastName } = userData;
  const [messages, setMessages] = useState([]);
  const {
    register,
    handleSubmit,
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
    userSocket.emit("send-message", message, "chatroom-1");
    setMessages((prev) => [...prev, message]);
  });
  console.log(messages);
  return (
    <>
      <Text mt={4}>
        Welcome, {firstName} {lastName}
      </Text>
      {!socketReady && <Text mt={4}>Connecting to chat...</Text>}
      <form onSubmit={onSubmit}>
        <Stack gap="4" align="flex-start" maxW="sm">
          <Field.Root invalid={!!errors.username}>
            <Field.Label>Username</Field.Label>
            <Input placeholder="@username" {...register("username")} />
            <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.bio}>
            <Field.Label>Message</Field.Label>
            <Textarea
              placeholder="I am ..."
              {...register("message", { required: "Bio is required" })}
            />
            <Field.ErrorText>{errors.bio?.message}</Field.ErrorText>
          </Field.Root>
          <Button type="submit">Send</Button>
        </Stack>
      </form>
      <Stack>
        <Text>Received messages</Text>
        <Box>
          {messages.map((msg, idx) => (
            <Text key={idx}>{msg}</Text>
          ))}
        </Box>
      </Stack>
    </>
  );
}
