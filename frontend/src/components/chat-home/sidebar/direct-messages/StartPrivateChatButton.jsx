// StartPrivateChatButton.jsx
import { AiFillPlusCircle } from 'react-icons/ai';
import { useContext } from 'react';

import { ChatContext } from '@/contexts/ChatContext';

export default function StartPrivateChatButton() {
  const { setNewChat, setDirectMessage, setChannel } = useContext(ChatContext);

  const handleStartPrivateChat = () => {
    setDirectMessage(null);
    setChannel(null);
    setNewChat(true);
  };
  return (
    <AiFillPlusCircle
      size="1.5rem"
      cursor="pointer"
      onClick={handleStartPrivateChat}
    />
  );
}
