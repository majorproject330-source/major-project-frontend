import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import {api} from "../api/api";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    await api.post("/auth/register", { email, password });
    navigate("/login");
  } catch (err) {
    alert(err.response?.data?.message || "Registration failed");
  }
};

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start using AirGuard AI today"
    >
      <form onSubmit={handleRegister}>
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
          Register
        </button>
      </form>

      <p style={{ marginTop: 24, fontSize: 14 }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#2563EB" }}>
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}