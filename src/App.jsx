import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Personalize from "./pages/Personalize";
import Dashboard from "./pages/Dashboard";
import Blank from "./pages/Blank";
import Airquality from "./pages/Airquality";
import TrafficMonitoring  from "./pages/TrafficMonitoring";
import Weather from "./pages/Weather";
import Cityfeed from "./pages/Cityfeed";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/personalize" element={<Personalize />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/blank" element={<Blank />} />
        <Route path="/Airquality" element={<Airquality />} />
        <Route path="/TrafficMonitoring" element={<TrafficMonitoring />} />
        <Route path="/Weather" element={<Weather />} />
        <Route path="/Cityfeed" element={<Cityfeed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;