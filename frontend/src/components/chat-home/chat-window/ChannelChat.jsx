import { useState, useContext, useEffect } from 'react';

import { ChatContext } from '@/contexts/ChatContext';
import ChatInterface from './ChatInterface';
import { fetchChannelMessageHistory } from '../../../utils/js/apiCalls';

export default function ChannelChat() {
  const { channel } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!channel) return;
    async function fetchMessageHistoryAsync() {
      try {
        setLoading(true);
        const res = await fetchChannelMessageHistory(channel.id);
        const mappedMessages = res.data.map((msg) => ({
          messageBody: msg.messageContent,
          sender: {
            firstName: msg.user.firstName,
            lastName: msg.user.lastName,
          },
          channel: msg.channel,
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
    fetchMessageHistoryAsync();
  }, [channel]);

  return (
    <ChatInterface
      messages={messages}
      setMessages={setMessages}
      chatName={channel?.channelName}
      sendLocation={channel?.id}
      mode="ch"
    />
  );
}
