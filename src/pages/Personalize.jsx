import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Personalize.css";

function Personalize() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    location: "",
    ageRange: "",
    disease: "",
  });

  /* ------------------ STEP HANDLERS ------------------ */

  const handleAgeSelect = (age) => {
    setFormData({ ...formData, ageRange: age });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/personalize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        navigate("/dashboard");
      } else {
        alert("Error saving personalization");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="personalize-container">
      <div className="card">

        <h1>Personalize Your Experience</h1>

        <div className="progress">
          <div className="bar" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        {/* ================= STEP 1 - AGE ================= */}
        {step === 1 && (
          <>
            <h3>What is your age range?</h3>

            {["0-18 years", "19-35 years", "36-60 years", "60+ years"].map((age) => (
              <button
                key={age}
                className={`option ${formData.ageRange === age ? "active" : ""}`}
                onClick={() => handleAgeSelect(age)}
              >
                {age}
              </button>
            ))}

            <div className="actions">
              <button className="skip-btn" onClick={handleSkip}>Skip</button>
              <button
                onClick={() => setStep(2)}
                disabled={!formData.ageRange}
              >
                Continue
              </button>
            </div>
          </>
        )}

        {/* ================= STEP 2 - LOCATION ================= */}
        {step === 2 && (
          <>
            <h3>Which city do you want to monitor?</h3>

            <input
              type="text"
              placeholder="Enter your city"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />

            <div className="actions">
              <button className="skip-btn" onClick={handleSkip}>Skip</button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.location}
              >
                Continue
              </button>
            </div>
          </>
        )}

        {/* ================= STEP 3 - DISEASE ================= */}
        {step === 3 && (
          <>
            <h3>Do you have any health conditions?</h3>

            {/* Predefined quick select */}
            <div className="quick-options">
              {["Asthma", "Heart Disease", "Diabetes", "Respiratory Issues", "None"].map(
                (d) => (
                  <button
                    key={d}
                    className={`mini-option ${formData.disease === d ? "active" : ""}`}
                    onClick={() =>
                      setFormData({ ...formData, disease: d })
                    }
                  >
                    {d}
                  </button>
                )
              )}
            </div>

            {/* Custom disease input */}
            <input
              type="text"
              placeholder="Other (optional)"
              value={
                ["Asthma", "Heart Disease", "Diabetes", "Respiratory Issues", "None"].includes(formData.disease)
                  ? ""
                  : formData.disease
              }
              onChange={(e) =>
                setFormData({ ...formData, disease: e.target.value })
              }
            />

            <div className="actions">
              <button className="skip-btn" onClick={handleSkip}>Skip</button>
              <button onClick={handleSubmit}>
                Finish
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Personalize;