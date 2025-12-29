// useChatMessage.js
import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ChatContext } from '@/contexts/ChatContext';
import { UserContext } from '@/contexts/UserContext';
import { processAttachments } from '@/utils/js/helper';

export const useChatMessage = () => {
  const { userData, userSocket } = useContext(UserContext);
  const { channel, directMessage, chatMode, thread } = useContext(ChatContext);

  const createOptimisticMessage = ({ messageBody, attachments }) => {
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

    return {
      tempId: uuidv4(),
      messageBody,
      attachments: attachments.map((file) => ({
        name: file.name,
        type: file.type,
        preview: URL.createObjectURL(file),
      })),
      sender: {
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
      timestamp,
      datestamp,
      status: 'sending',
    };
  };

  const sendMessage = async ({ messageBody, attachments = [], tempId }) => {
    if (!userSocket?.connected) return;

    const processedAttachments = attachments.length
      ? await processAttachments(attachments)
      : [];

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
      attachments: processedAttachments || [],
      sender: { firstName: userData.firstName, lastName: userData.lastName },
      timestamp,
      datestamp,
    };

    const messageData = {
      messageContent: messageBody,
      senderId: userData.id,
      tempId,
      type: chatMode === 'ch' ? 'channel' : 'direct',
    };

    console.log(
      'pre event emission...',
      'chatMode is',
      chatMode,
      'channelId: ',
      channel?.id
    );
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

  return { sendMessage, createOptimisticMessage };
};
