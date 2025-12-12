// App.jsx
import { Routes, Route } from 'react-router';

import RootLayout from './pages/RootLayout';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import HomePage from './pages/HomePage';
import UserProfile from './pages/UserProfile';
import ForgotPassword from './pages/ForgotPassword';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/me" element={<UserProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
