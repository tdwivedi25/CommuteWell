import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in on mount
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleGetStarted = () => {
    window.location.hash = "#setup";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #6b8f6e 0%, #8fa888 35%, #a8c5ab 60%, #c8e3f0 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative circles */}
      <div style={{
        position: "absolute",
        top: "-80px",
        right: "-80px",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.08)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-60px",
        left: "-60px",
        width: "250px",
        height: "250px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.06)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        top: "40%",
        left: "-40px",
        width: "180px",
        height: "180px",
        borderRadius: "50%",
        background: "rgba(200,227,240,0.15)",
        pointerEvents: "none",
      }} />

      {/* Main content card */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "420px",
          width: "100%",
          zIndex: 1,
        }}
      >
        {/* Logo compass ring */}
        <div style={{
          width: "110px",
          height: "110px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.25)",
          backdropFilter: "blur(8px)",
          border: "2px solid rgba(255,255,255,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2rem",
          boxShadow: "0 8px 32px rgba(44,62,50,0.18)",
        }}>
          {/* Inner circle */}
          <div style={{
            width: "76px",
            height: "76px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #c8e3f0 0%, #a8d4e8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.2rem",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.1)",
          }}>
            🧘
          </div>
        </div>

        {/* App name */}
        <h1 style={{
          fontSize: "2.8rem",
          fontWeight: "800",
          color: "#1e3320",
          letterSpacing: "-0.5px",
          marginBottom: "0.4rem",
          lineHeight: 1.1,
          textShadow: "0 2px 8px rgba(255,255,255,0.3)",
          fontFamily: "'Georgia', serif",
        }}>
          CommuteWell
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: "1.05rem",
          color: "#2c3e2c",
          fontStyle: "italic",
          letterSpacing: "0.5px",
          marginBottom: "2.5rem",
          fontFamily: "'Georgia', serif",
          opacity: 0.85,
        }}>
          Your Health, Every Mile.
        </p>

        {/* Divider */}
        <div style={{
          width: "60px",
          height: "2px",
          background: "rgba(30,51,32,0.3)",
          borderRadius: "2px",
          marginBottom: "2.5rem",
        }} />

        {/* Welcome message */}
        <div style={{
          background: "rgba(255,255,255,0.22)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.35)",
          borderRadius: "20px",
          padding: "1.8rem 2rem",
          marginBottom: "2.5rem",
          boxShadow: "0 4px 24px rgba(44,62,50,0.12)",
        }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#1e3320",
            marginBottom: "0.75rem",
            fontFamily: "'Georgia', serif",
          }}>
            Welcome to CommuteWell
          </h2>
          <p style={{
            fontSize: "0.95rem",
            color: "#2c3e2c",
            lineHeight: 1.7,
            fontFamily: "'Georgia', serif",
            opacity: 0.85,
          }}>
            Your personal health assistant designed for Central Valley to Bay Area super-commuters.
            Track wellness, build habits, and feel better — one commute at a time.
          </p>
        </div>

        {/* Feature pills */}
        <div style={{
          display: "flex",
          gap: "0.6rem",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "2.5rem",
        }}>
          {[
            { icon: "✅", text: "Daily Tasks" },
            { icon: "💙", text: "Check-ins" },
            { icon: "📊", text: "Progress" },
            { icon: "🖥️", text: "Home Display" },
          ].map((pill) => (
            <div
              key={pill.text}
              style={{
                background: "rgba(255,255,255,0.28)",
                border: "1px solid rgba(255,255,255,0.4)",
                borderRadius: "999px",
                padding: "0.4rem 1rem",
                fontSize: "0.82rem",
                fontWeight: "600",
                color: "#1e3320",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                backdropFilter: "blur(6px)",
              }}
            >
              <span>{pill.icon}</span>
              <span>{pill.text}</span>
            </div>
          ))}
        </div>

        {/* Get Started button */}
        <button
          onClick={handleGetStarted}
          style={{
            width: "100%",
            maxWidth: "320px",
            padding: "1.1rem 2rem",
            borderRadius: "16px",
            border: "none",
            background: "#1e3320",
            color: "white",
            fontSize: "1.1rem",
            fontWeight: "700",
            fontFamily: "'Georgia', serif",
            letterSpacing: "0.5px",
            cursor: "pointer",
            boxShadow: "0 6px 24px rgba(30,51,32,0.35)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(30,51,32,0.45)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(30,51,32,0.35)";
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)";
          }}
        >
          Get Started
          <span style={{ fontSize: "1.2rem" }}>→</span>
        </button>

        {/* Privacy note */}
        <p style={{
          marginTop: "1.25rem",
          fontSize: "0.75rem",
          color: "#2c3e2c",
          opacity: 0.65,
          fontFamily: "'Georgia', serif",
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
        }}>
          🔒 Your data stays on your device. No cloud required.
        </p>
      </div>
    </div>
  );
}