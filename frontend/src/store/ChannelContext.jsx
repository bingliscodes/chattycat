import { createContext, useState } from "react";

export const ChannelContext = createContext({});

export const ChannelContextProvider = ({ children }) => {
  const [channel, setChannel] = useState(null);

  return (
    <ChannelContext.Provider value={{ channel, setChannel }}>
      {children}
    </ChannelContext.Provider>
  );
};
