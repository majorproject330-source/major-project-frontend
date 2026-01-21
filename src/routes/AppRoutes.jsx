import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Personalize from "../pages/Personalize";
import Blank from "../pages/Blank";
import Register from "../pages/Register";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/personalize" element={<Personalize />} />
        {/* <Route path="/app" element={<Blank />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Blank />} />
      </Routes>
    </BrowserRouter>
  );
}