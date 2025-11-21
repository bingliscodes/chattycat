import { Avatar } from '@chakra-ui/react';

export default function UserAvatar({ avatarUrl, name, ...props }) {
  return (
    <Avatar.Root {...props}>
      <Avatar.Fallback name={name} />
      <Avatar.Image src={avatarUrl} />
    </Avatar.Root>
  );
}
