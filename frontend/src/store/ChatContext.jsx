import { createContext, useState } from "react";

export const ChatContext = createContext({});

export const ChatContextProvider = ({ children }) => {
  const [channel, setChannel] = useState(null);
  const [directMessage, setDirectMessage] = useState(null);

  return (
    <ChatContext.Provider
      value={{ channel, setChannel, directMessage, setDirectMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
};
