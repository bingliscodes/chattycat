"use client";

import { useState } from "react";
import { Center, Field, Input, Stack, Button, Flex } from "@chakra-ui/react";
import { NavLink } from "react-router";

import { signup } from "../utils/js/authentication";

export default function SignupCard() {
  const [signupError, setSignupError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const entries = Object.fromEntries(formData.entries());

    try {
      await signup(entries);
    } catch (err) {
      console.error(err);
      setSignupError(true);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Center width="width">
        <Flex direction="column" gap="4" py={6} w="50%">
          <Field.Root>
            <Field.Label>First Name</Field.Label>
            <Input type="text" placeholder="first name" name="firstName" />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>

          <Field.Root>
            <Field.Label>Last Name</Field.Label>
            <Input type="text" placeholder="last name" name="lastName" />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>

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

          <Field.Root>
            <Field.Label>Confirm Password</Field.Label>
            <Input
              type="text"
              placeholder="confirm password"
              name="passwordConfirm"
            />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>

          <Button type="submit">Sign Up</Button>
          <Stack pt={6}>
            Already a user? <NavLink to="/login">Login</NavLink>
          </Stack>
        </Flex>
      </Center>
    </form>
  );
}
