import { Routes, Route } from "react-router";

import RootLayout from "./pages/RootLayout";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}></Route>
    </Routes>
  );
}

export default App;
