export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #EEF2FF, #F8FAFC, #ECFEFF)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "white",
          borderRadius: 16,
          padding: "40px 32px",
          boxShadow: "0 30px 60px rgba(0,0,0,0.1)",
          animation: "slideFade 0.6s ease",
        }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>{title}</h1>
        <p style={{ color: "#6B7280", marginBottom: 32 }}>{subtitle}</p>

        {children}
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes slideFade {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}