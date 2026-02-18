import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // ✅ ALWAYS force home screen on refresh/mount
    window.location.hash = "#home";
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
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #c8e3f0 0%, #a8d4e8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0  2px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}>
            <img 
              src="/favicon.png" 
              alt="CommuteWell Logo"
              style={{
              width: "100%",
              height: "100%",
            objectFit: "cover",
            }}
          />
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

        {/* ✅ CLICKABLE FEATURE BUTTONS (2x2 grid) */}
        {[
          { icon: "✅", text: "Daily Tasks", description: "Morning, drive & evening checklists", hash: "#today" },
          { icon: "💙", text: "Check-ins", description: "Track energy, stress & comfort daily", hash: "#checkin" },
          { icon: "📊", text: "Progress", description: "View trends, streaks & wellness score", hash: "#progress" },
          { icon: "🖥️", text: "Home Display", description: "Raspberry Pi dashboard syncs your score", hash: "#setup" },
        ].reduce((rows: JSX.Element[][], item, i) => {
          if (i % 2 === 0) rows.push([]);
          rows[rows.length - 1].push(
            <button
              key={item.text}
              onClick={() => { window.location.hash = item.hash; }}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.28)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.45)",
                borderRadius: "16px",
                padding: "0.9rem 0.75rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.35rem",
                transition: "transform 0.15s ease, background 0.15s ease",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = "scale(1.04)";
                el.style.background = "rgba(255,255,255,0.42)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = "scale(1)";
                el.style.background = "rgba(255,255,255,0.28)";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.96)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)";
              }}
            >
              <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1e3320", fontFamily: "'Georgia', serif" }}>
                {item.text}
              </span>
              <span style={{ fontSize: "0.7rem", color: "#2c3e2c", opacity: 0.75, fontFamily: "'Georgia', serif", lineHeight: 1.4 }}>
                {item.description}
              </span>
            </button>
          );
          return rows;
        }, []).map((row, i) => (
          <div key={i} style={{ display: "flex", gap: "0.75rem", width: "100%", marginBottom: "0.75rem" }}>
            {row}
          </div>
        ))}

        {/* Spacing */}
        <div style={{ marginBottom: "1rem" }} />

        {/* ✅ RENAMED BUTTON */}
        <button
          onClick={handleGetStarted}
          style={{
            width: "100%",
            maxWidth: "340px",
            padding: "1.1rem 2rem",
            borderRadius: "16px",
            border: "none",
            background: "#1e3320",
            color: "white",
            fontSize: "1rem",
            fontWeight: "700",
            fontFamily: "'Georgia', serif",
            letterSpacing: "0.3px",
            cursor: "pointer",
            boxShadow: "0 6px 24px rgba(30,51,32,0.35)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.transform = "scale(1.03)";
            el.style.boxShadow = "0 8px 32px rgba(30,51,32,0.45)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.transform = "scale(1)";
            el.style.boxShadow = "0 6px 24px rgba(30,51,32,0.35)";
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)";
          }}
        >
          🗺️ Set Up Your Commute Route
          <span style={{ fontSize: "1.1rem" }}>→</span>
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