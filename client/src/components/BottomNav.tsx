import { useEffect, useState } from "react";

const TABS = [
  { id: "today", label: "Today", emoji: "📋" },
  { id: "checkin", label: "Check-in", emoji: "💭" },
  { id: "progress", label: "Progress", emoji: "📊" },
  { id: "setup", label: "Setup", emoji: "⚙️" },
  { id: "transit", label: "Transit", emoji: "🚇" },
];

export function BottomNav() {
  const [active, setActive] = useState<string>(() => {
    try {
      const h = window.location.hash.replace("#", "");
      return h || "today";
    } catch (e) {
      return "today";
    }
  });

  useEffect(() => {
    function onHash() {
      const h = window.location.hash.replace("#", "");
      setActive(h || "today");
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function go(id: string) {
    if (window.location.hash !== `#${id}`) window.location.hash = `#${id}`;
    else setActive(id);
  }

  return (
    // ✅ CHANGED: p-3 pb-6 → p-1.5 pb-3 (reduces overall navbar height)
    <div className="fixed bottom-0 left-0 right-0 z-50 p-1.5 pb-3 bg-background/90 backdrop-blur-lg border-t border-white/5">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {TABS.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => go(t.id)}
              aria-current={isActive}
              // ✅ CHANGED: min-w-[72px] → min-w-[52px] (narrower buttons)
              className={`group flex flex-col items-center gap-0.5 min-w-[52px] md:min-w-[64px] focus:outline-none`}
            >
              <div
                // ✅ CHANGED: w-12 h-12 md:w-14 md:h-14 → w-9 h-9 md:w-10 md:h-10 (smaller icon box)
                className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(59,130,246,0.18)]"
                    : "text-muted-foreground hover:bg-white/5"
                }`}
              >
                <span className="leading-none">{t.emoji}</span>
              </div>
              {/* ✅ CHANGED: text-[11px] → text-[10px] (slightly smaller label) */}
              <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}