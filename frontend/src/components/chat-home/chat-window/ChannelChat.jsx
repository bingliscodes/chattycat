import { useState, useContext, useEffect } from 'react';

import { ChatContext } from '@/contexts/ChatContext';
import ChatInterface from './ChatInterface';
import { fetchChannelMessageHistory } from '@/utils/js/apiCalls';
import { cleanMessages } from '@/utils/js/helper';

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
        const cleanedMessages = cleanMessages(res.data, 'ch');

        setMessages(cleanedMessages);
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
