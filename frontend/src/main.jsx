import { Provider } from "@/components/ui/provider";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";

import { UserContextProvider } from "./store/UserContext.jsx";
import { ChannelContextProvider } from "./store/ChannelContext.jsx";
import { SidebarProvider } from "./store/SidebarContext.jsx";

createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <ChannelContextProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Provider>
            <App />
          </Provider>
        </BrowserRouter>
      </SidebarProvider>
    </ChannelContextProvider>
  </UserContextProvider>
);
