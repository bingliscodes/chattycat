import ChatLayout from '../components/chat-home/chat-window/ChatLayout';
import { useContext } from 'react';
import { OrganizationContext } from '../contexts/OrganizationContext';
export default function ChatHomePage() {
  const { handleLoadOrganizationData } = useContext(OrganizationContext);
  //  handleLoadOrganizationData();

  return <ChatLayout />;
}
