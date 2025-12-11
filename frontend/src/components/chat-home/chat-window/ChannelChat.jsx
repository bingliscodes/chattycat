import { useState, useContext, useEffect } from 'react';

import { ChatContext } from '@/contexts/ChatContext';
import ChatInterface from './ChatInterface';
import { fetchChannelMessageHistory } from '../../../utils/js/apiCalls';

export default function ChannelChat() {
  const { channel, setChatMode } = useContext(ChatContext);
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
            firstName: msg.Sender.firstName,
            lastName: msg.Sender.lastName,
          },
          channel: msg.channel,
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
    fetchMessageHistoryAsync();
  }, [channel]);
  const handleClickMainArea = () => {
    setChatMode('ch');
  };
  return (
    <ChatInterface
      messages={messages}
      setMessages={setMessages}
      chatName={channel?.channelName}
      sendLocation={channel?.id}
      onClickMainArea={handleClickMainArea}
    />
  );
}
