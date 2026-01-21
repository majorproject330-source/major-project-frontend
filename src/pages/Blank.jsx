import { useEffect, useState } from "react";
import { getAQIData } from "../api/api";
import "./dashboard.css";

/* ===== CONSTANTS ===== */

const SAFE_LIMITS = {
  pm2_5: 60,
  pm10: 100,
  no2: 80,
  co: 2000,
  o3: 100,
  so2: 80,
};

const ICONS = {
  pm2_5: "🌫️",
  pm10: "🔥",
  no2: "🧪",
  co: "☁️",
  o3: "🌤️",
  so2: "🏭",
};

/* ===== HELPERS ===== */

const getPercent = (value, limit) =>
  Math.min(150, Math.round((value / limit) * 100));

const getBarColorByPercent = (percent) => {
  if (percent <= 50) return "#22c55e"; // green
  if (percent <= 80) return "#facc15"; // yellow
  if (percent <= 100) return "#fb923c"; // orange
  return "#ef4444"; // red
};

const getHealthInfo = (aqi) => {
  if (aqi <= 50)
    return {
      color: "#22c55e",
      text: "Air quality is good. Enjoy outdoor activities.",
    };
  if (aqi <= 100)
    return {
      color: "#84cc16",
      text: "Air quality is acceptable. Sensitive people should be cautious.",
    };
  if (aqi <= 200)
    return {
      color: "#facc15",
      text: "People with respiratory issues should limit outdoor exposure.",
    };
  if (aqi <= 300)
    return {
      color: "#fb923c",
      text: "Everyone should reduce prolonged outdoor activities.",
    };
  return {
    color: "#ef4444",
    text: "Health warning! Avoid outdoor activities.",
  };
};

/* ===== COMPONENT ===== */

export default function Blank() {
  const [data, setData] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(false);

  /* Initial load */
  useEffect(() => {
    getAQIData().then(setData);
  }, []);

  /* Search handler */
  const handleSearch = async () => {
    if (!searchCity.trim()) return;

    try {
      setLoading(true);
      const res = await getAQIData(searchCity);
      setData(res);
      setSearchCity("");
    } catch (err) {
      alert("City not found or API error");
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <div className="loading">Loading...</div>;

  const health = getHealthInfo(data.aqi.value);
  const healthBarWidth = Math.min(100, (data.aqi.value / 500) * 100);

  return (
    <div className="dashboard">
      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        <div className="nav-left">AirGuard AI</div>

        <div className="nav-right">
          <input
            className="search-input"
            placeholder="Search city"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>

          <button className="city-btn">{data.location}</button>
          <button className="profile-btn">👤</button>
        </div>
      </nav>

      <div className="nav-gap" />

      <div className="container">
        <div className="main-grid">
          {/* ===== LEFT SECTION ===== */}
          <div>
            {/* AQI CARD */}
            <div className="aqi-card">
              <div>
                <div className="aqi-title">Current Air Quality</div>
                <div className="city-name">{data.location}</div>
                <div className="updated">
                  Updated:{" "}
                  {new Date(data.last_updated).toLocaleTimeString()}
                </div>

                <div className="dominant">
                  Dominant Pollutant: <b>{data.dominant_pollutant}</b>
                </div>
              </div>

              <div className="aqi-visual">
                <div
                  className="aqi-circle"
                  style={{ background: health.color }}
                >
                  <div className="aqi-value">{data.aqi.value}</div>
                  <div className="aqi-label">AQI</div>
                </div>

                <div
                  className="aqi-category"
                  style={{ background: health.color }}
                >
                  {data.aqi.category}
                </div>
              </div>
            </div>

            {/* POLLUTANT CARDS */}
            <div className="pollutants">
              {Object.entries(data.pollutants.values).map(([key, value]) => {
                const limit = SAFE_LIMITS[key];
                const percent = getPercent(value, limit);
                const color = getBarColorByPercent(percent);

                return (
                  <div className="pollutant-card" key={key}>
                    <div className="pollutant-header">
                      <span className="pollutant-icon">{ICONS[key]}</span>
                      <span>{key.replace("_", ".").toUpperCase()}</span>
                    </div>

                    <div className="pollutant-value">{value}</div>
                    <div className="safe-text">
                      Safe limit: {limit} µg/m³
                    </div>

                    <div className="pollutant-bar">
                      <span
                        style={{
                          width: `${Math.min(percent, 100)}%`,
                          background: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== RIGHT SECTION ===== */}
          <div className="right-panel">
            {/* HEALTH CARD */}
            <div className="health-card">
              <div className="health-title">⚠ Health Risk</div>

              <div className="risk-bar">
                <span
                  style={{
                    width: `${healthBarWidth}%`,
                    background: health.color,
                  }}
                />
              </div>

              <div
                className="health-msg"
                style={{ borderLeft: `6px solid ${health.color}` }}
              >
                {health.text}
              </div>

              <div className="health-stats">
                <div>
                  <b>{data.aqi.value}</b>
                  <span>Current AQI</span>
                </div>
                <div>
                  <b>500</b>
                  <span>Max AQI</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="actions">
              <button className="btn primary">Explain Air Quality</button>
              <button className="btn success">View Precautions</button>
              <button className="btn outline">Compare Cities</button>
              <button className="btn outline">Generate Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}