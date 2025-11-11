import { Flex, Button, Stack } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { NavLink, useNavigate } from "react-router";
import { HiMiniUserCircle } from "react-icons/hi2";

export default function RightNavContent() {
  const isLoggedIn = true;
  const nav = useNavigate();

  const logout = () => {};

  return (
    <Flex alignItems="center" gap={2}>
      <Stack direction="row" spacing={4} align="center">
        <ColorModeButton
          bg="bg.primaryBtn"
          color="text.primaryBtn"
          borderRadius="full"
          _hover={{ bg: "bg.navHover" }}
        />

        {!isLoggedIn && (
          <Button
            bg="bg.primaryBtn"
            color="text.primaryBtn"
            _hover={{ bg: "bg.navHover" }}
            borderRadius="full"
            onClick={() => nav("/login")}
          >
            Log In / Sign Up
          </Button>
        )}

        {isLoggedIn && (
          <>
            <Button
              bg="bg.primaryBtn"
              color="text.primaryBtn"
              borderRadius="full"
              _hover={{ bg: "bg.navHover" }}
              onClick={logout}
            >
              Log Out
            </Button>

            <NavLink to="/me">
              <Button
                bg="bg.primaryBtn"
                variant="ghost"
                color="text.primaryBtn"
                _hover={{ bg: "bg.navHover" }}
              >
                <HiMiniUserCircle />
              </Button>
            </NavLink>
          </>
        )}
      </Stack>
    </Flex>
  );
}
