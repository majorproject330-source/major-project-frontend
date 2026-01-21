import { useNavigate } from "react-router-dom";
import {
  Wind,
  Brain,
  Shield,
  BarChart3,
  MessageCircle,
  FileText,
} from "lucide-react";
import FeatureSection from "./FeatureSection";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "#F8FAFC",
        color: "#111827",
        overflowX: "hidden",
      }}
    >
      {/* ================= HERO ================= */}
      <section
  style={{
    position: "relative",
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 40,
    overflow: "hidden",
  }}
>
  {/* Background image + gradient */}
  <div
  style={{
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(
        to bottom right,
        rgba(238,242,255,0.55),
        rgba(248,250,252,0.6),
        rgba(236,254,255,0.6)
      ),
      url('/images/hero-bg.png')
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 0,
  }}
/>

  {/* Content */}
  <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <Wind size={64} color="#2563EB" />
      <h1 style={{ fontSize: 48, marginLeft: 16 }}>AirGuard AI</h1>
    </div>

    <h2 style={{ fontSize: 32, marginBottom: 20 }}>
      Understand the Air You Breathe.
    </h2>

    <p
      style={{
        fontSize: 18,
        color: "#6B7280",
        marginBottom: 32,
        lineHeight: 1.6,
      }}
    >
      An AI-powered air quality intelligence platform that transforms
      pollution data into clear insights and actionable health guidance
      for Indian cities.
    </p>

    <button
      onClick={() => navigate("/login")}
      style={{
        padding: "14px 36px",
        background: "#2563EB",
        color: "white",
        borderRadius: 999,
        border: "none",
        fontSize: 18,
        cursor: "pointer",
        boxShadow: "0 10px 25px rgba(37, 99, 235, 0.35)",
      }}
    >
      Get Started
    </button>
  </div>
</section>

      {/* ================= FEATURES ================= */}
      <FeatureSection
        icon={<Wind color="#2563EB" />}
        title="Real-time Air Quality Dashboard"
        description="Live AQI and pollutant levels presented in a simple, understandable way."
        image="/images/1.png"
      />

      <FeatureSection
        reverse
        icon={<Brain color="#2563EB" />}
        title="AI-Powered Explanations"
        description="AI explains what today’s air quality actually means for your health."
        image="/images/ai-explain.png"
      />

      <FeatureSection
        icon={<Shield color="#2563EB" />}
        title="Personalized Health Precautions"
        description="Recommendations tailored to your age, location, and health conditions."
        image="/images/precautions.png"
      />

      <FeatureSection
        reverse
        icon={<BarChart3 color="#2563EB" />}
        title="City-to-City Comparison"
        description="Compare air quality across Indian cities instantly."
        image="/images/city-compare.png"
      />

      <FeatureSection
        icon={<MessageCircle color="#2563EB" />}
        title="AI Chat Assistant"
        description="Ask questions about air quality and get instant AI answers."
        image="/images/chat.png"
      />

      <FeatureSection
        reverse
        icon={<FileText color="#2563EB" />}
        title="AI-Generated Reports"
        description="Download city-level air quality reports with trends and risks."
        image="/images/report.png"
      />

      {/* ================= FINAL CTA ================= */}
      <section
        style={{
          width: "100vw",
          padding: "120px 40px",
          background: "#FFFFFF",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 36,
            fontWeight: 600,
            marginBottom: 16,
            color: "#111827",
          }}
        >
          Built for Awareness. Designed for India.
        </h2>

        <p
          style={{
            maxWidth: 720,
            margin: "0 auto 40px",
            fontSize: 18,
            color: "#6B7280",
            lineHeight: 1.6,
          }}
        >
          AirGuard AI transforms raw pollution data into intelligence that helps
          people make safer, healthier decisions every day.
        </p>

        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "16px 44px",
            background: "#2563EB",
            color: "white",
            borderRadius: 999,
            border: "none",
            fontSize: 18,
            cursor: "pointer",
            boxShadow: "0 14px 32px rgba(37, 99, 235, 0.35)",
          }}
        >
          Start Using AirGuard AI
        </button>
      </section>
    </div>
  );
}