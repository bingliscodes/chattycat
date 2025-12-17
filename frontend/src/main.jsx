// Main.jsx
import { Provider } from '@/components/ui/provider';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import App from './App.jsx';

import { UserContextProvider } from '@/contexts/UserContext';
import { OrganizationContextProvider } from '@/contexts/OrganizationContext';
import { ChatContextProvider } from '@/contexts/ChatContext';

createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <OrganizationContextProvider>
      <ChatContextProvider>
        <BrowserRouter>
          <Provider>
            <App />
          </Provider>
        </BrowserRouter>
      </ChatContextProvider>
    </OrganizationContextProvider>
  </UserContextProvider>
);
