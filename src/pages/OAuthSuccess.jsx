import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function OAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Store JWT
    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);

    // Admin redirect
    if (decoded.role === "admin") {
      navigate("/Admin");
      return;
    }

    // For normal users we check personalization
    checkPersonalization(token);

  }, []);

  const checkPersonalization = async (token) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!data.isPersonalized) {
        navigate("/personalize");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      navigate("/dashboard");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Logging you in...</h2>
    </div>
  );
}

export default OAuthSuccess;