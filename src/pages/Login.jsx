import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ===========================
     NORMAL LOGIN
  ============================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);

        const decoded = jwtDecode(data.token);

        /* ADMIN REDIRECT */
        if (decoded.role === "admin") {
          navigate("/Admin");
          return;
        }

        /* NORMAL USER REDIRECT */
        if (!data.isPersonalized) {
          navigate("/personalize");
        } else {
          navigate("/dashboard");
        }

      } else {
        alert(data.message || "Login failed");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  };

  /* ===========================
     GOOGLE LOGIN
  ============================ */
  const handleGoogleLogin = () => {
    window.location.href =
      `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p>Login to your UrbanSense AI account</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ margin: "20px 0", textAlign: "center" }}>
          <span>OR</span>
        </div>

        {/* Google Button */}
       
<button
  type="button"
  className="google-btn"
  onClick={handleGoogleLogin}
>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    alt="Google"
    className="google-icon"
  />
  <span>Continue with Google</span>
</button>

        <p className="switch-text">
          Don't have an account?
          <span onClick={() => navigate("/register")}> Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;