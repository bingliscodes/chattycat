import { useState, useContext, useEffect } from 'react';

import { ChatContext } from '../../../contexts/ChatContext';
import ChatInterface from './ChatInterface';
import { fetchUserMessageHistory } from '../../../utils/js/apiCalls';

export default function DirectMessageChat() {
  const { directMessage } = useContext(ChatContext);
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

  if (loading || error) return <h1>Loading...</h1>;
  return (
    messages && (
      <ChatInterface
        messages={messages}
        setMessages={setMessages}
        chatName={`${directMessage?.firstName} ${directMessage?.lastName}`}
        sendLocation={messages[0]?.channel}
        mode="dm"
      />
    )
  );
}
