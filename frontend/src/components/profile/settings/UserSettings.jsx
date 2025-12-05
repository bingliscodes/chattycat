import { useState } from 'react';
import { Flex, Field, Input, Button, Stack } from '@chakra-ui/react';

import { updateSettings } from '@/utils/js/apiCalls';

export default function UserSettings({ userData }) {
  const [userSettingsError, setUserSettingsError] = useState(false);

  const { firstName, lastName, email } = userData;

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const entries = Object.fromEntries(formData.entries());

    try {
      await updateSettings(entries);
      setUserSettingsError(false);
    } catch (err) {
      console.error(err);
      setUserSettingsError(true);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="4" py={6} w="full">
        <Field.Root>
          <Field.Label>First Name</Field.Label>
          <Input type="text" placeholder={firstName} name="firstName" />
          <Field.ErrorText></Field.ErrorText>
        </Field.Root>
        <Field.Root>
          <Field.Label>Last Name</Field.Label>
          <Input type="text" placeholder={lastName} name="lastName" />
          <Field.ErrorText></Field.ErrorText>
        </Field.Root>
        <Field.Root>
          <Field.Label>Email Address</Field.Label>
          <Input type="email" placeholder={email} name="email" />
          <Field.ErrorText></Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          bg="bg.primaryBtn"
          color="text.primaryBtn"
          _hover={{
            bg: 'bg.navHover',
          }}
        >
          Update Settings
        </Button>
        <Stack pt={6}></Stack>
      </Flex>
    </form>
  );
}
