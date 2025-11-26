import { createContext, useState, useEffect } from 'react';

import { fetchChannelUsers } from '../utils/js/apiCalls';

export const ChatContext = createContext({});

export const ChatContextProvider = ({ children }) => {
  const [channel, setChannel] = useState(null);
  const [directMessage, setDirectMessage] = useState(null);
  const [channelUsers, setChannelUsers] = useState(null);
  const [newChat, setNewChat] = useState(false);

  useEffect(() => {
    if (!channel) return;
    async function fetchChannelUsersAsync() {
      try {
        const res = await fetchChannelUsers(channel.id);
        const channelUserIds = res.data.map((usr) => usr.id);
        setChannelUsers(channelUserIds);
      } catch (err) {
        console.error(err);
      }
    }
    fetchChannelUsersAsync();
  }, [channel, setChannelUsers]);

  return (
    <ChatContext.Provider
      value={{
        channel,
        setChannel,
        directMessage,
        setDirectMessage,
        channelUsers,
        setChannelUsers,
        newChat,
        setNewChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
