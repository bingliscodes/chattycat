// useChatMessage.js
import { useContext } from 'react';
import { ChatContext } from '@/contexts/ChatContext';
import { UserContext } from '@/contexts/UserContext';

export const useChatMessage = () => {
  const { userData, userSocket } = useContext(UserContext);
  const { channel, directMessage, chatMode, thread } = useContext(ChatContext);

  const sendMessage = async ({ messageBody, attachments = [] }) => {
    if (!userSocket?.connected) return;

    const now = new Date();
    const datestamp = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timestamp = now.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const messageContent = {
      messageBody,
      attachments, // include uploaded file metadata here
      sender: { firstName: userData.firstName, lastName: userData.lastName },
      timestamp,
      datestamp,
    };

    const messageData = {
      messageContent: messageBody,
      senderId: userData.id,
      type: chatMode === 'ch' ? 'channel' : 'direct',
    };

    if (chatMode === 'ch') messageData.channelId = channel?.id;
    if (chatMode === 'dm') {
      messageData.receiverId = directMessage?.id;
      messageData.roomId = channel?.id;
    }
    if (chatMode === 'thread') {
      messageData.parentMessageId = thread?.parentMessage?.messageId;
      userSocket.emit('send-thread-message', messageContent, messageData);
    } else {
      userSocket.emit('send-message', messageContent, messageData);
    }

    return messageContent;
  };

  return { sendMessage };
};
