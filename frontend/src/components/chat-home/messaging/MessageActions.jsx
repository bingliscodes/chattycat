import { Group, Menu, Portal, IconButton, HStack } from '@chakra-ui/react';
import { BsChat } from 'react-icons/bs';
import { useContext } from 'react';
import { ChatContext } from '@/contexts/ChatContext';

export default function MessageActions() {
  const { handleSetThread } = useContext(ChatContext);
  return (
    <HStack
      bg="bg.chatActionsMenu"
      borderStyle="1px solid"
      borderColor="borders.chatActionsMenu"
      borderRadius="md"
      shadow="sm"
      p={1}
      gap={1}
    >
      <IconButton
        size="sm"
        bg="none"
        aria-label="Reply in thread"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering handleMessageClick
          // Your thread reply logic here
          // If you need the message, you can pass it as a prop
        }}
      >
        <BsChat />
      </IconButton>

      {/* Add more action buttons here as needed */}
    </HStack>
  );
}

const horizontalMenuItems = [
  { label: 'Reply in thread', value: 'reply', icon: <BsChat /> },
];

export const MessageActionsV1 = ({ anchorRef, menuIsOpen, setMenuIsOpen }) => {
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
};
