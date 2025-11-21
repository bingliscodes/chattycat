import { useContext } from 'react';

import ChatLayout from '../components/chat-home/chat-window/ChatLayout';
import { UserContext } from '../contexts/UserContext';
import SignupPage from './SignupPage';

export default function HomePage() {
  const { isLoggedIn } = useContext(UserContext);

  return isLoggedIn ? <ChatLayout /> : <SignupPage />;
}
