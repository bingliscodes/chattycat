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
import ChatInterface from './ChatInterface';
import { fetchUserMessageHistory } from '../../../utils/js/apiCalls';

export default function DirectMessageChat() {
  const { directMessage, roomId } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!directMessage) return;
    async function fetchUserMessageHistoryAsync() {
      try {
        setLoading(true);
        const res = await fetchUserMessageHistory(directMessage.id);
        const options = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        };
        const mappedMessages = res.data.map((msg) => ({
          messageBody: msg.messageContent,
          sender: {
            firstName: msg.Sender.firstName,
            lastName: msg.Sender.lastName,
          },
          channel: msg.roomId,
          timestamp: new Date(msg.createdAt).toLocaleTimeString(
            'en-US',
            options
          ),
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

  if (loading) return <Spinner />;
  if (error) return <Text color="red.500">Error loading messages</Text>;
  return (
    messages && (
      <ChatInterface
        messages={messages}
        setMessages={setMessages}
        chatName={`${directMessage?.firstName} ${directMessage?.lastName}`}
        sendLocation={roomId}
        mode="dm"
      />
    )
  );
}
