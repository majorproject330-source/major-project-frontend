export default function FeatureSection({
  icon,
  title,
  description,
  image,
  reverse = false,
}) {
  return (
    <section style={{ width: "100vw", padding: "80px 40px", background: "#F8FAFC" }}>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          flexDirection: reverse ? "row-reverse" : "row",
          alignItems: "center",
          gap: "60px",
        }}
      >
        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <div style={{ marginRight: 12 }}>{icon}</div>
            <h3 style={{ fontSize: 24 }}>{title}</h3>
          </div>
          <p style={{ color: "#6B7280", fontSize: 18 }}>
            {description}
          </p>
        </div>

        {/* Image */}
        <div style={{ flex: 1 }}>
          <img
            src={image}
            alt={title}
            style={{
              width: "100%",
              height: 280,
              objectFit: "cover",
              borderRadius: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      </div>
    </section>
  );
}