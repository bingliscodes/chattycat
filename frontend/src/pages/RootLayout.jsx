import { Outlet } from "react-router";
import { Center } from "@chakra-ui/react";
import MainNavigation from "../components/NavBar/MainNavigation";

export default function RootLayout() {
  return (
    <>
      <Center>
        <MainNavigation />
      </Center>
      <main>
        <Outlet />
      </main>
    </>
  );
}
