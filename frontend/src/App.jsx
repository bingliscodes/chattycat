import { ColorModeButton } from "./components/ui/color-mode";
import { Box, Flex, Stack, Button } from "@chakra-ui/react";
import "./App.css";

function App() {
  return (
    <Flex alignItems="center" gap={2}>
      <Stack direction="row" spacing={4} align="center">
        <ColorModeButton
          bg="bg.primaryBtn"
          color="text.primaryBtn"
          borderRadius="full"
          _hover={{ bg: "bg.navHover" }}
        />
      </Stack>
    </Flex>
  );
}

export default App;
