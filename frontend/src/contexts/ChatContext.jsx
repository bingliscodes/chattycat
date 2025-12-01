// ChatContext.jsx
import { useContext, createContext, useState, useEffect } from 'react';

import { fetchChannelUsers, findOrCreateDMRoom } from '../utils/js/apiCalls';
import { UserContext } from './UserContext';

export const ChatContext = createContext({});

export const ChatContextProvider = ({ children }) => {
  const [channel, setChannel] = useState(null);
  const [directMessage, setDirectMessage] = useState(null);
  const [channelUsers, setChannelUsers] = useState(null);
  const [newChat, setNewChat] = useState(false);
  const [roomId, setRoomId] = useState(null);

  const { userData } = useContext(UserContext);
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
  }, [channel]);

  const handleSetDirectMessage = async (user) => {
    if (user === null) {
      setDirectMessage(null);
      return;
    }
    try {
      const roomId = await findOrCreateDMRoom(userData.id, user.id);
      setDirectMessage(user);
      setRoomId(roomId);
      setChannel(null);
      setNewChat(true);
    } catch (err) {
      console.error('Failed to set DM room', err);
    }
  };
  return (
    <ChatContext.Provider
      value={{
        channel,
        setChannel,
        directMessage,
        roomId,
        channelUsers,
        setChannelUsers,
        newChat,
        setNewChat,
        handleSetDirectMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
