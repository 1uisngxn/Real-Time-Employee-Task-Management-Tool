import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ValidatePage from "./pages/ValidatePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/validate" element={<ValidatePage />} />
        <Route path="/dashboard" element={<div>Dashboard (protected)</div>} />
      </Routes>
    </BrowserRouter>
  );
}
