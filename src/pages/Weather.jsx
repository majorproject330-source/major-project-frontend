import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Weather.css";

export default function WeatherModule() {
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchWeather();
  }, []);

  /* ================= FETCH WEATHER ================= */
  const fetchWeather = async (searchCity = null) => {
    try {
      setLoading(true);
      setError("");
      setExplanation("");

      const url = searchCity
        ? `${import.meta.env.VITE_API_URL}/api/weather?city=${searchCity}`
        : `${import.meta.env.VITE_API_URL}/api/weather`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        // 🔥 Do NOT clear old weather
        setError(data.message || "Enter a valid city name.");
        return;
      }

      setWeather(data);

    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    fetchWeather(city);
    setCity("");
  };

  /* ================= AI ================= */
  const getExplanation = async () => {
    try {
      setAiLoading(true);
      setError("");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/weather/explain`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(weather)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError("AI explanation failed.");
        return;
      }

      setExplanation(data.explanation);

    } catch {
      setError("AI service unavailable.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className={`weather-wrapper ${weather?.description}`}>

      {/* HEADER */}
      <div className="header">
        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ⬅ Back
        </button>
      </div>

      {/* SEARCH */}
      <div className="top-bar">
        <h1>Weather Intelligence</h1>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search another city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {loading && <div className="loader"></div>}

      {weather && !loading && (
        <div className="weather-card">
          <h2>{weather.city}</h2>

          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
            alt="weather icon"
          />

          <div className="temp">{weather.temperature}°C</div>
          <div className="condition">{weather.description}</div>

          <div className="details">
            <div>Feels Like: {weather.feels_like}°C</div>
            <div>Humidity: {weather.humidity}%</div>
            <div>Wind: {weather.wind_speed} m/s</div>
            <div>Pressure: {weather.pressure} hPa</div>
          </div>

          <button className="ai-btn" onClick={getExplanation}>
            {aiLoading ? "Analyzing..." : "Get AI Insight"}
          </button>
        </div>
      )}

      {explanation && (
        <div className="ai-box">
          <h3>AI Insight</h3>
          <p>{explanation}</p>
        </div>
      )}

      <div className="cloud cloud1"></div>
      <div className="cloud cloud2"></div>
    </div>
  );
}