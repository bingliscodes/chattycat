import { Group, Menu, Portal } from '@chakra-ui/react';
import { BsChat } from 'react-icons/bs';

const horizontalMenuItems = [
  { label: 'Reply in thread', value: 'reply', icon: <BsChat /> },
];

export default function MessageActions({
  anchorRef,
  menuIsOpen,
  setMenuIsOpen,
}) {
  const getAnchorRect = () => anchorRef.current?.getBoundingClientRect();
  return (
    <Menu.Root
      size="md"
      open={menuIsOpen}
      onOpenChange={(change) => setMenuIsOpen(change.open)}
      positioning={{
        getAnchorRect,
        placement: 'top-end',
        offset: { mainAxis: 4, crossAxis: 0 },
      }}
    >
      <Menu.Trigger asChild></Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Group grow gap="0">
              {horizontalMenuItems.map((item) => (
                <Menu.Item
                  key={item.value}
                  value={item.value}
                  flexDirection="column"
                  justifyContent="center"
                >
                  {item.icon}
                </Menu.Item>
              ))}
            </Group>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
