// DirectMessages.jsx
import { Text, Spinner } from '@chakra-ui/react';
import { useState, useContext, useEffect } from 'react';

import { ChatContext } from '@/contexts/ChatContext';
import ChatInterface from './ChatInterface';
import { fetchUserMessageHistory } from '@/utils/js/apiCalls';
import { cleanMessages } from '@/utils/js/helper';

export default function DirectMessageChat() {
  const { directMessage, roomId, setChatMode } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!directMessage) return;
    async function fetchUserMessageHistoryAsync() {
      try {
        setLoading(true);
        const res = await fetchUserMessageHistory(directMessage.id);
        const cleanedMessages = cleanMessages(res.data, 'dm');

        setMessages(cleanedMessages);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserMessageHistoryAsync();
  }, [directMessage]);

  const handleClickMainArea = () => {
    setChatMode('dm');
  };
  if (loading) return <Spinner />;
  if (error) return <Text color="red.500">Error loading messages</Text>;
  return (
    messages && (
      <ChatInterface
        messages={messages}
        setMessages={setMessages}
        chatName={`${directMessage?.firstName} ${directMessage?.lastName}`}
        sendLocation={roomId}
        onClickMainArea={handleClickMainArea}
      />
    )
  );
}
