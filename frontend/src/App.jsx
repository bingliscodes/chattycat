import { Routes, Route } from 'react-router';

import RootLayout from './pages/RootLayout';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import HomePage from './pages/HomePage';
import UserProfile from './pages/UserProfile';
import './App.css';
import AdminConsole from './pages/AdminConsolePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/me" element={<UserProfile />} />
        <Route path="admin-console" element={<AdminConsole />} />
      </Route>
    </Routes>
  );
}

export default App;
