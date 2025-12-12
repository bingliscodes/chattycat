// ChatContext.jsx
import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  fetchChannelUsers,
  findOrCreateDMRoom,
  fetchDirectMessageList,
  fetchThreadMessageHistory,
} from '../utils/js/apiCalls';

import { cleanMessages } from '../utils/js/helper';
import { UserContext } from './UserContext';

export const ChatContext = createContext({});

export const ChatContextProvider = ({ children }) => {
  const [channel, setChannel] = useState(null);
  const [directMessage, setDirectMessage] = useState(null);
  const [channelUsers, setChannelUsers] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [directMessageList, setDirectMessageList] = useState([]);
  const [thread, setThread] = useState();
  const [chatMode, setChatMode] = useState();

  const { userData, userSocket } = useContext(UserContext);

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

  const fetchDirectMessages = useCallback(async () => {
    if (!userData?.id) return;
    try {
      const res = await fetchDirectMessageList(userData.id);
      setDirectMessageList([...res.data]);
    } catch (err) {
      console.error('Failed to fetch DM list:', err);
    }
  }, [userData?.id]);

  useEffect(() => {
    fetchDirectMessages();
  }, [fetchDirectMessages]);

  useEffect(() => {
    if (!userSocket) return;

    const handleNewDM = async () => {
      await fetchDirectMessages(); // update sidebar
    };

    userSocket.on('new-dm', handleNewDM);

    return () => {
      userSocket.off('new-dm', handleNewDM);
    };
  }, [userSocket, fetchDirectMessages]);

  const handleSetDirectMessage = async (user) => {
    if (user === null) {
      setDirectMessage(null);
      setRoomId(null);
      return;
    }
    try {
      const res = await findOrCreateDMRoom(userData.id, user.id);
      setDirectMessage(user);
      setRoomId(res.data.id);
      setChannel(null);
      await fetchDirectMessages();
    } catch (err) {
      console.error('Failed to set DM room', err);
    }
  };

  const handleSetThread = async (msg) => {
    if (msg.parentMessageId) return;
    try {
      const res = await fetchThreadMessageHistory(msg.messageId);
      const cleanedMessages = cleanMessages(res.data);

      setThread({
        parentMessage: msg,
        replies: cleanedMessages || [],
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        channel,
        setChannel,
        directMessage,
        chatMode,
        setChatMode,
        roomId,
        channelUsers,
        setChannelUsers,
        handleSetDirectMessage,
        directMessageList,
        fetchDirectMessages,
        thread,
        setThread,
        handleSetThread,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
