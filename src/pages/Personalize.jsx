import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {api} from "../api/api";

export default function Personalize() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [ageRange, setAgeRange] = useState("");
  const [location, setLocation] = useState("");
  const [diseases, setDiseases] = useState([]);
  const [otherDisease, setOtherDisease] = useState("");

  const diseaseOptions = [
    "Asthma",
    "Heart Disease",
    "Diabetes",
    "Respiratory Issues",
    "None",
  ];

  const toggleDisease = (value) => {
    setDiseases((prev) =>
      prev.includes(value)
        ? prev.filter((d) => d !== value)
        : [...prev, value]
    );
  };

  const handleFinish = async () => {
    const token = localStorage.getItem("token");

    const finalDiseases =
      otherDisease.trim() !== ""
        ? [...diseases, otherDisease]
        : diseases;

    try {
      await api.post(
        "/auth/personalize",
        {
          ageRange,
          location,
          disease: finalDiseases.join(", "),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/dashboard");
    } catch (err) {
      alert("Failed to save personalization");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: 4 }}>Personalize Your Experience</h2>
        <p style={{ color: "#6B7280", marginBottom: 20 }}>
          Step {step} of 3 · Optional
        </p>

        {/* Progress Bar */}
        <div style={progressBg}>
          <div
            style={{
              ...progressFill,
              width: `${(step / 3) * 100}%`,
            }}
          />
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h4 style={question}>What is your age range?</h4>
            {["0-18", "19-35", "36-60", "60+"].map((age) => (
              <Option
                key={age}
                label={`${age} years`}
                selected={ageRange === age}
                onClick={() => setAgeRange(age)}
              />
            ))}
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h4 style={question}>Which city do you want to monitor?</h4>
            <input
              placeholder="Enter your city"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={input}
            />
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h4 style={question}>Do you have any health conditions?</h4>

            {diseaseOptions.map((d) => (
              <Checkbox
                key={d}
                label={d}
                checked={diseases.includes(d)}
                onChange={() => toggleDisease(d)}
              />
            ))}

            <input
              placeholder="Other (optional)"
              value={otherDisease}
              onChange={(e) => setOtherDisease(e.target.value)}
              style={{ ...input, marginTop: 12 }}
            />

            <div style={infoBox}>
              🔒 Your data is used only to personalize health advice and is
              never shared.
            </div>
          </>
        )}

        {/* ACTION BUTTONS */}
        <div style={buttonRow}>
          <button style={skipBtn} onClick={() => setStep(step + 1)}>
            Skip
          </button>

          {step < 3 ? (
            <button
              style={primaryBtn}
              onClick={() => setStep(step + 1)}
            >
              Continue
            </button>
          ) : (
            <button style={primaryBtn} onClick={handleFinish}>
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================== SMALL COMPONENTS ================== */

function Option({ label, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "12px 14px",
        borderRadius: 10,
        border: selected
          ? "2px solid #2563EB"
          : "1px solid #E5E7EB",
        marginBottom: 10,
        cursor: "pointer",
        background: selected ? "#EEF2FF" : "white",
      }}
    >
      {label}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{ display: "block", marginBottom: 8 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ marginRight: 8 }}
      />
      {label}
    </label>
  );
}

/* ================== STYLES ================== */

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(to bottom right, #EEF2FF, #F8FAFC, #ECFEFF)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};

const cardStyle = {
  width: "100%",
  maxWidth: 480,
  background: "white",
  borderRadius: 16,
  padding: 32,
  boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
};

const progressBg = {
  height: 6,
  background: "#E5E7EB",
  borderRadius: 999,
  marginBottom: 24,
};

const progressFill = {
  height: "100%",
  borderRadius: 999,
  background: "linear-gradient(to right, #2563EB, #10B981)",
  transition: "width 0.4s ease",
};

const question = {
  marginBottom: 16,
};

const input = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #D1D5DB",
  fontSize: 16,
};

const infoBox = {
  marginTop: 16,
  padding: 12,
  background: "#ECFDF5",
  borderRadius: 10,
  fontSize: 14,
  color: "#065F46",
};

const buttonRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 30,
};

const skipBtn = {
  padding: "12px 20px",
  borderRadius: 999,
  border: "1px solid #D1D5DB",
  background: "white",
  cursor: "pointer",
};

const primaryBtn = {
  padding: "12px 26px",
  borderRadius: 999,
  background: "#2563EB",
  color: "white",
  border: "none",
  cursor: "pointer",
};