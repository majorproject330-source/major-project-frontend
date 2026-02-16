import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Airquality.css";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/airQualityData`;
const EXPLAIN_API = `${import.meta.env.VITE_API_URL}/api/explainAirQuality`;

const SAFE_LIMITS = {
  pm2_5: 60,
  pm10: 100,
  no2: 80,
  so2: 80,
  o3: 100,
  co: 2,
};

const UNITS = {
  pm2_5: "µg/m³",
  pm10: "µg/m³",
  no2: "µg/m³",
  so2: "µg/m³",
  o3: "µg/m³",
  co: "mg/m³",
};

const ICONS = {
  pm2_5: "🌫️",
  pm10: "🔥",
  no2: "🧪",
  co: "☁️",
  o3: "🌤️",
  so2: "🏭",
};

const getPercent = (value, limit) =>
  Math.min(150, Math.round((value / limit) * 100));

const getBarColor = (percent) => {
  if (percent <= 50) return "#22c55e";
  if (percent <= 80) return "#facc15";
  if (percent <= 100) return "#fb923c";
  return "#ef4444";
};

const getHealthInfo = (aqi) => {
  if (aqi <= 50)
    return { color: "#22c55e", text: "Air quality is good." };
  if (aqi <= 100)
    return { color: "#84cc16", text: "Air quality is acceptable." };
  if (aqi <= 200)
    return {
      color: "#facc15",
      text: "Sensitive groups should reduce outdoor exposure.",
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

export default function AirQuality() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [explainLoading, setExplainLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH AQI ================= */
  const fetchData = async (city = "") => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const url = city ? `${API_BASE}?city=${city}` : API_BASE;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Enter a valid city name.");
        return; // keep old data
      }

      setData(result);
      setExplanation("");

    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    if (!searchCity.trim()) {
      setError("Please enter a city name.");
      return;
    }

    fetchData(searchCity);
    setSearchCity("");
  };

  /* ================= AI EXPLAIN ================= */
  const handleExplain = async () => {
    try {
      setExplainLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch(EXPLAIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError("Failed to generate explanation.");
        return;
      }

      setExplanation(result.explanation);

    } catch {
      setError("AI service unavailable.");
    } finally {
      setExplainLoading(false);
    }
  };

  if (!data)
    return <div className="loading">Loading Air Quality...</div>;

  const health = getHealthInfo(data.aqi.value);
  const healthWidth = Math.min(100, (data.aqi.value / 500) * 100);

  return (
    <div className="dashboard">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              backgroundColor: "#1a2c45",
              color: "#ffffff",
              border: "none",
              padding: "8px 14px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px"
            }}
          >
            ⬅ Back
          </button>
          AirGuard AI
        </div>

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

          <button className="city-btn">
            {data.location}
          </button>
        </div>
      </nav>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      <div className="nav-gap" />

      <div className="container">
        <div className="main-grid">

          {/* LEFT PANEL */}
          <div>
            <div className="aqi-card">
              <div>
                <div className="aqi-title">Current Air Quality</div>
                <div className="city-name">{data.location}</div>
                <div className="updated">
                  Updated:{" "}
                  {new Date(data.last_updated).toLocaleTimeString()}
                </div>
                <div className="dominant">
                  Dominant Pollutant:{" "}
                  <b>{data.dominant_pollutant}</b>
                </div>
              </div>

              <div className="aqi-visual">
                <div
                  className="aqi-circle"
                  style={{ background: health.color }}
                >
                  <div className="aqi-value">
                    {data.aqi.value}
                  </div>
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

            <div className="pollutants">
              {Object.entries(data.pollutants.values).map(
                ([key, value]) => {
                  const limit = SAFE_LIMITS[key];
                  const percent = getPercent(value, limit);
                  const color = getBarColor(percent);

                  return (
                    <div className="pollutant-card" key={key}>
                      <div className="pollutant-header">
                        <span>{ICONS[key]}</span>
                        <span>
                          {key.replace("_", ".").toUpperCase()}
                        </span>
                      </div>

                      <div className="pollutant-value">
                        {value} {UNITS[key]}
                      </div>

                      <div className="safe-text">
                        Safe limit: {limit} {UNITS[key]}
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
                }
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">
            <div className="health-card">
              <div className="health-title">⚠ Health Risk</div>

              <div className="risk-bar">
                <span
                  style={{
                    width: `${healthWidth}%`,
                    background: health.color,
                  }}
                />
              </div>

              <div
                className="health-msg"
                style={{
                  borderLeft: `6px solid ${health.color}`,
                }}
              >
                {health.text}
              </div>
            </div>

            <div className="actions">
              <button
                className="btn primary"
                onClick={handleExplain}
                disabled={explainLoading}
              >
                {explainLoading
                  ? "Generating..."
                  : "Explain Air Quality"}
              </button>

              {explanation && (
                <div className="explanation-box">
                  {explanation}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}