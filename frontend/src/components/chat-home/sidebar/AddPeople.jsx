import { Flex, IconButton } from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import { BsFillPersonPlusFill } from 'react-icons/bs';

export default function AddPeople() {
  const handleAddMembers = () => {};
  return (
    <Flex
      flex="1"
      w="full"
      px={2}
      py={1}
      align="flex-end"
      justify="space-between"
    >
      <Tooltip
        showArrow
        content="invite members to the organization"
        positioning={{ placement: 'right-end' }}
      >
        <IconButton onClick={handleAddMembers}>
          <BsFillPersonPlusFill />
        </IconButton>
      </Tooltip>
    </Flex>
  );
}
