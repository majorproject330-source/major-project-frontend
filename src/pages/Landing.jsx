import "./Landing.css";
import airQualityImg from "../assets/airquality.png";
import traffic from "../assets/traffic.png";
import weather from "../assets/weather.png";
import rating from "../assets/rating.png";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();   // ✅ MOVE INSIDE COMPONENT

  return (
    <div className="landing">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>UrbanSense AI</h1>
          <h2>AI-Based Smart Urban Life Monitoring</h2>
          <p>
            Monitor air quality, traffic, and weather in real-time.
            Get an AI-powered Urban Life Rating for better living decisions.
          </p>

          <button
            className="primary-btn"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* AIR QUALITY */}
      <section className="section">
        <div className="section-text">
          <h3>🌫 Air Quality Intelligence</h3>
          <p>
            Real-time AQI monitoring, pollutant analysis, and health guidance
            powered by intelligent data processing.
          </p>
        </div>
        <div className="section-image">
          <img src={airQualityImg} alt="Air Quality Intelligence" />
        </div>
      </section>

      {/* TRAFFIC */}
      <section className="section reverse">
        <div className="section-text">
          <h3>🚦 Smart Traffic Monitoring</h3>
          <p>
            Analyze congestion patterns, road conditions, and peak hours
            to optimize mobility across the city.
          </p>
        </div>
        <div className="section-image">
          <img src={traffic} alt="Traffic Monitoring" />
        </div>
      </section>

      {/* WEATHER */}
      <section className="section">
        <div className="section-text">
          <h3>🌦 Weather Intelligence</h3>
          <p>
            Track temperature, humidity, wind speed and environmental
            conditions impacting urban comfort and pollution levels.
          </p>
        </div>
        <div className="section-image">
          <img src={weather} alt="Weather Intelligence" />
        </div>
      </section>

      {/* URBAN RATING */}
      <section className="section reverse">
        <div className="section-text">
          <h3>⭐ Urban Life Rating</h3>
          <p>
            Our AI rating engine combines Air, Traffic, and Weather data
            into a single smart Urban Score for better awareness.
          </p>
        </div>
        <div className="section-image">
          <img src={rating} alt="Urban Life Rating" />
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="cta">
        <h2>Built for Awareness. Designed for Smart Cities.</h2>
        <p>
          UrbanSense AI transforms raw city data into actionable intelligence
          for healthier and smarter urban living.
        </p>

        <button
          className="primary-btn"
          onClick={() => navigate("/login")}
        >
          Start Using UrbanSense AI
        </button>
      </section>

    </div>
  );
}

export default Landing;