"use client";

import { useState } from "react";
import { Center, Flex, Field, Input, Stack, Button } from "@chakra-ui/react";
import { NavLink } from "react-router";

import { login } from "../utils/js/authentication";

export default function LoginCard() {
  const [logInError, setLoginError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const entries = Object.fromEntries(formData.entries());

    try {
      await login(entries);
    } catch (err) {
      console.error(err);
      setLoginError(true);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Center>
        <Flex direction="column" gap="4" py={6} width="width.form">
          <Field.Root>
            <Field.Label>Email Address</Field.Label>
            <Input type="email" placeholder="email address" name="email" />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>

          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input type="text" placeholder="password" name="password" />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>
          <div>{logInError && <p>Username or password is invalid.</p>}</div>

          <Button type="submit">Log In</Button>
          <Stack pt={6}>
            Don't have an account yet? <NavLink to="/signup">Signup</NavLink>
          </Stack>
        </Flex>
      </Center>
    </form>
  );
}
