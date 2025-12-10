// hooks/useThreadRoom.js
import { useEffect } from 'react';
import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';

export function useThreadRoom(parentMessageId) {
  const { userSocket } = useContext(UserContext);

  useEffect(() => {
    if (!userSocket || !parentMessageId) return;

    // Join thread room on mount
    userSocket.emit('join-thread', { parentMessageId });

    console.log(`✅ Joined thread room: ${parentMessageId}`);

    return () => {
      // Leave thread room on unmount
      userSocket.emit('leave-thread', { parentMessageId });
      console.log(`🚪 Left thread room: ${parentMessageId}`);
    };
  }, [userSocket, parentMessageId]);
}
