import { Button, Menu, Portal } from '@chakra-ui/react';
import { AiFillPlusCircle } from 'react-icons/ai';

export default function AddToChannelButton({ channels }) {
  console.log(channels);
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <AiFillPlusCircle cursor="pointer" size="1.5rem" />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {channels.map((ch) => (
              <Menu.Item key={ch.id} value={ch.id}>
                {ch.channelName}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
