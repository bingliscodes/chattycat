import { Avatar } from '@chakra-ui/react';

export default function UserAvatar({ size, avatarUrl, name }) {
  return (
    <Avatar.Root size={size}>
      <Avatar.Fallback name={name} />
      <Avatar.Image src={avatarUrl} />
    </Avatar.Root>
  );
}
