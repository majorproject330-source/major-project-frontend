import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./TrafficMonitoring.css";

export default function TrafficDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [traffic, setTraffic] = useState(null);
  const [error, setError] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [showTrafficLayer, setShowTrafficLayer] = useState(true);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const trafficLayerRef = useRef(null);

  /* ================= FORMAT DELAY ================= */
  const formatDelay = (seconds) => {
    if (!seconds || seconds <= 0) return "No Delay";
    if (seconds < 60) return `${seconds} sec`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = minutes / 60;
    return `${hours.toFixed(1)} hrs`;
  };

  /* ================= LOAD TRAFFIC ================= */
  useEffect(() => {
    loadTraffic();
  }, []);

  const loadTraffic = async (city = "") => {
    try {
      setLoading(true);
      setError("");
      setExplanation("");

      const url = city
        ? `${import.meta.env.VITE_API_URL}/api/trafficData?city=${city}`
        : `${import.meta.env.VITE_API_URL}/api/trafficData`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok || !data || data.error || !data.lat) {
        setError("Please enter a valid city name.");
        return;
      }

      setTraffic(data);

    } catch (err) {
      setError("Unable to fetch traffic data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchCity.trim()) {
      loadTraffic(searchCity);
      setSearchCity("");
    }
  };

  /* ================= MAP ================= */
  useEffect(() => {
    if (!traffic || !mapRef.current) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    mapInstance.current = L.map(mapRef.current).setView(
      [traffic.lat, traffic.lon],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(mapInstance.current);

    if (showTrafficLayer) {
      trafficLayerRef.current = L.tileLayer(
        `https://api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.png?key=${import.meta.env.VITE_TOMTOM_KEY}&t=${Date.now()}`,
        { opacity: 0.9 }
      ).addTo(mapInstance.current);
    }

    let color = "#2ecc71";
    if (traffic.congestion === "Slight") color = "#f1c40f";
    if (traffic.congestion === "Moderate") color = "#f39c12";
    if (traffic.congestion === "High") color = "#e74c3c";
    if (traffic.congestion === "Severe") color = "#8b0000";

    L.circleMarker([traffic.lat, traffic.lon], {
      radius: 12,
      color,
      fillColor: color,
      fillOpacity: 0.9
    }).addTo(mapInstance.current);

  }, [traffic, showTrafficLayer]);

  /* ================= AI ================= */
  const getExplanation = async () => {
    try {
      setAiLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trafficExplain`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(traffic)
        }
      );

      const data = await res.json();
      setExplanation(data.explanation || "No insight available.");
      setShowAIModal(true);

    } catch {
      setExplanation("AI explanation unavailable.");
      setShowAIModal(true);
    } finally {
      setAiLoading(false);
    }
  };

  const getBadgeClass = () => {
    if (!traffic) return "";
    return traffic.congestion.toLowerCase();
  };

  return (
    <div className="traffic-wrapper">

      {/* HEADER */}
      <div className="header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ⬅ Back
        </button>
        <h2>Traffic Intelligence</h2>
      </div>

      {/* SEARCH */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search city..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className={error ? "search-error" : ""}
        />
        <button className="primary-btn" onClick={handleSearch}>Search</button>
        <button className="secondary-btn" onClick={() => setShowTrafficLayer(p => !p)}>
          {showTrafficLayer ? "Hide Traffic" : "Show Traffic"}
        </button>
        <button className="guide-btn" onClick={() => setShowGuideModal(true)}>
          Traffic Guide
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {loading && <div className="loader"></div>}

      {traffic && !loading && (
        <>
          <div className="traffic-card-modern">
            <div className="card-header">
              <h3>{traffic.city}</h3>
              <span className={`congestion-badge ${getBadgeClass()}`}>
                {traffic.congestion}
              </span>
            </div>

            <div className="stats-modern">
              <div className="stat-box">
                <p>Current Speed</p>
                <h4>{traffic.current_speed} km/h</h4>
              </div>
              <div className="stat-box">
                <p>Normal Speed</p>
                <h4>{traffic.normal_speed} km/h</h4>
              </div>
              <div className="stat-box">
                <p>Delay</p>
                <h4>{formatDelay(traffic.delay)}</h4>
              </div>
            </div>

            <button className="ai-btn-modern" onClick={getExplanation}>
              {aiLoading ? "Analyzing..." : "Get AI Insight"}
            </button>
          </div>

          <div ref={mapRef} className="map-container"></div>
        </>
      )}

      {/* AI MODAL */}
      {showAIModal && (
        <div className="modal-overlay" onClick={() => setShowAIModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>🧠 AI Traffic Insight</h3>
            <p>{explanation}</p>
            <button onClick={() => setShowAIModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* GUIDE MODAL */}
      {showGuideModal && (
        <div className="modal-overlay" onClick={() => setShowGuideModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Traffic Status Guide</h3>

            <div className="guide-item"><span className="legend-color green"></span>Normal Traffic</div>
            <div className="guide-item"><span className="legend-color yellow"></span>Slight Congestion</div>
            <div className="guide-item"><span className="legend-color orange"></span>Moderate Congestion</div>
            <div className="guide-item"><span className="legend-color red"></span>Heavy Traffic</div>
            <div className="guide-item"><span className="legend-color darkred"></span>Severe Congestion</div>

            <button onClick={() => setShowGuideModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}