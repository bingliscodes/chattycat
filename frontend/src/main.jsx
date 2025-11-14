import { Provider } from "@/components/ui/provider";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";

import { UserContextProvider } from "./store/UserContext.jsx";
import { ChannelContextProvider } from "./store/ChannelContext.jsx";

createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <ChannelContextProvider>
      <BrowserRouter>
        <Provider>
          <App />
        </Provider>
      </BrowserRouter>
    </ChannelContextProvider>
  </UserContextProvider>
);
