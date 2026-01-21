import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import {api} from "../api/api";


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.token);

    if (res.data.isPersonalized) {
      navigate("/dashboard");        // 👈 skip personalization
    } else {
      navigate("/personalize"); // 👈 first-time users
    }
  } catch (err) {
    alert("Login failed");
  }
};

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to your AirGuard AI account"
    >
      <form onSubmit={handleLogin}>
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            background: "#2563EB",
            color: "white",
            borderRadius: 999,
            border: "none",
            fontSize: 16,
            cursor: "pointer",
            marginTop: 10,
          }}
        >
          Login
        </button>
      </form>

      <p style={{ marginTop: 24, fontSize: 14 }}>
        Don’t have an account?{" "}
        <Link to="/register" style={{ color: "#2563EB" }}>
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}