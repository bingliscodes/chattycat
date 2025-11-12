import { useContext } from "react";
import { UserContext } from "../store/UserContext";
import { useForm } from "react-hook-form";
import { createConnection } from "../utils/js/socket";
import {
  Textarea,
  Text,
  Stack,
  Field,
  Input,
  Button,
  Box,
} from "@chakra-ui/react";

export default function HomePage() {
  const { userData } = useContext(UserContext);

  const { firstName, lastName } = userData;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleConnect = async () => {
    await createConnection("test");
    console.log("connection created");
  };

  const onSubmit = handleSubmit((data) => console.log(data));
  return (
    <>
      <Text mt={4}>
        Welcome, {firstName} {lastName}
      </Text>

      <form onSubmit={onSubmit}>
        <Stack gap="4" align="flex-start" maxW="sm">
          <Field.Root invalid={!!errors.username}>
            <Field.Label>Username</Field.Label>
            <Input
              placeholder="@username"
              {...register("username", { required: "Username is required" })}
            />
            <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.bio}>
            <Field.Label>Message</Field.Label>
            <Textarea
              placeholder="I am ..."
              {...register("bio", { required: "Bio is required" })}
            />
            <Field.ErrorText>{errors.bio?.message}</Field.ErrorText>
          </Field.Root>
          <Button type="submit">Send</Button>
        </Stack>
      </form>
      <Button onClick={handleConnect}>Connect </Button>
      <Stack>
        <Text>Received messages</Text>
        <Box></Box>
      </Stack>
    </>
  );
}
