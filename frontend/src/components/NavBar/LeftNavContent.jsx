import { Flex, Box, Image } from '@chakra-ui/react';
import { NavLink } from 'react-router';

import logo from '../../assets/ChattyCatLogo.svg';

export default function LeftNavContent() {
  return (
    <Flex alignItems="center">
      {/* Left side: Logo / Home */}
      <NavLink to="/" style={{ textDecoration: 'none' }}>
        <Box
          fontSize="2xl"
          fontWeight="bold"
          color="logoColor"
          _hover={{ textDecoration: 'none', color: 'blue.400' }}
        >
          <Flex align="center">
            ChattyCat
            <Image
              marginLeft={4}
              src={logo}
              alt="ChattyCat Logo"
              boxSize="4rem"
            />
          </Flex>
        </Box>
      </NavLink>
    </Flex>
  );
}
