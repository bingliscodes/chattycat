import { Routes, Route } from "react-router";

import RootLayout from "./pages/RootLayout";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
