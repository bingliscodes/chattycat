//DirectMessages.jsx

import {
  Input,
  Box,
  VStack,
  Text,
  Button,
  Spinner,
  Menu,
  Flex,
} from '@chakra-ui/react';
import { useState, useContext, useEffect } from 'react';

import { ChatContext } from '@/contexts/ChatContext';
import { UserContext } from '@/contexts/UserContext';
import ChatInterface from './ChatInterface';
import {
  fetchUserMessageHistory,
  fetchOrganizationUsers,
} from '../../../utils/js/apiCalls';

export default function DirectMessageChat() {
  const { directMessage, setDirectMessage, newChat, setNewChat, roomId } =
    useContext(ChatContext);
  const { userData } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!userData) return;
    async function fetchOrganizationUsersAsync() {
      try {
        setLoading(true);
        const res = await fetchOrganizationUsers(userData.organizationId);
        setUsers(res);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrganizationUsersAsync();
  }, [userData, setUsers]);

  useEffect(() => {
    if (!directMessage) return;
    async function fetchUserMessageHistoryAsync() {
      try {
        setLoading(true);
        const res = await fetchUserMessageHistory(directMessage.id);
        const mappedMessages = res.data.map((msg) => ({
          messageBody: msg.messageContent,
          sender: {
            firstName: msg.Sender.firstName,
            lastName: msg.Sender.lastName,
          },
          channel: msg.roomId,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
        }));

        setMessages(mappedMessages);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserMessageHistoryAsync();
  }, [directMessage]);

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner />;
  if (error) return <Text color="red.500">Error loading messages</Text>;
  return (
    <>
      {newChat ? (
        <ChatInterface
          key={newChat ? 'new' : directMessage.id}
          messages={[]}
          setMessages={setMessages}
          chatName={`New chat with ${directMessage?.firstName} ${directMessage?.lastName}`}
          sendLocation={roomId} // need to create a room?
          mode="dm"
        />
      ) : (
        messages && (
          <ChatInterface
            key={newChat ? 'new' : directMessage.id}
            messages={messages}
            setMessages={setMessages}
            chatName={`${directMessage?.firstName} ${directMessage?.lastName}`}
            sendLocation={roomId}
            mode="dm"
          />
        )
      )}
    </>
  );
}
