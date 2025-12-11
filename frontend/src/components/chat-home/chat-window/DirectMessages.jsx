// DirectMessages.jsx
import { Text, Spinner } from '@chakra-ui/react';
import { useState, useContext, useEffect } from 'react';

import { ChatContext } from '@/contexts/ChatContext';
import ChatInterface from './ChatInterface';
import { fetchUserMessageHistory } from '../../../utils/js/apiCalls';

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

        const mappedMessages = res.data.map((msg) => ({
          messageBody: msg.messageContent,
          sender: {
            firstName: msg.Sender.firstName,
            lastName: msg.Sender.lastName,
          },
          channel: msg.roomId,
          datestamp: new Date(msg.createdAt).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          timestamp: new Date(msg.createdAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
          messageId: msg.id,
          isThread: msg.replyCount > 0,
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
