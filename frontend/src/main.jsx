import { Provider } from "@/components/ui/provider";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";

import { UserContextProvider } from "./store/UserContext.jsx";
import { ChatContextProvider } from "./store/ChatContext.jsx";

createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <ChatContextProvider>
      <BrowserRouter>
        <Provider>
          <App />
        </Provider>
      </BrowserRouter>
    </ChatContextProvider>
  </UserContextProvider>
);
