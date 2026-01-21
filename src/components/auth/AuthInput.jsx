export default function AuthInput({ label, type, value, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          display: "block",
          marginBottom: 6,
          fontSize: 14,
          color: "#374151",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 10,
          border: "1px solid #D1D5DB",
          fontSize: 16,
          outline: "none",
        }}
        onFocus={(e) =>
          (e.target.style.border = "1px solid #2563EB")
        }
        onBlur={(e) =>
          (e.target.style.border = "1px solid #D1D5DB")
        }
      />
    </div>
  );
}