import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

import airQualityImg from "../assets/airquality.png";
import trafficImg from "../assets/traffic.png";
import weatherImg from "../assets/weather.png";
import ratingImg from "../assets/rating.png";
import cityImg from "../assets/city.png";
import Aiagent from "../assets/Aiagent.png";
 
function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">

      {/* NAVBAR */}
      <div className="navbar">
        <div 
          className="logo"
          onClick={() => navigate("/dashboard")}
        >
          UrbanSense AI
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* PAGE TITLE */}
      <div className="page-title">
        <h1>Smart Urban Monitoring Dashboard</h1>
      </div>

      {/* CARDS */}
      <div className="cards-container">

        <div className="card" onClick={() => navigate("/Airquality")}>
          <img src={airQualityImg} alt="Air Quality" />
          <h3>Air Quality</h3>
          <p>Live AQI monitoring & pollution insights.</p>
        </div>

        <div className="card" onClick={() => navigate("/TrafficMonitoring")}>
          <img src={trafficImg} alt="Traffic" />
          <h3>Traffic Monitoring</h3>
          <p>Smart congestion tracking & route analysis.</p>
        </div>

        <div className="card" onClick={() => navigate("/Weather")}>
          <img src={weatherImg} alt="Weather" />
          <h3>Weather Intelligence</h3>
          <p>Real-time weather and climate updates.</p>
        </div>

        <div className="card" onClick={() => navigate("/Cityfeed")}>
          <img src={cityImg} alt="Urban Rating" />
          <h3>City Public Feed</h3>
<p>Stay connected with live posts, alerts, and updates shared by people in your city.</p>
        </div>

        <div className="card" onClick={() => navigate("/AiAgent")}>
  <img src={Aiagent} alt="Smart City Agentic Assistant" />

  <h3>Smart City Agentic Assistant</h3>

  <p>
    Ask about weather, air quality, traffic, and public city reports. 
    Get real-time insights and alerts powered by AI.
  </p>
</div>
      </div>

    </div>
  );
}

export default Dashboard;