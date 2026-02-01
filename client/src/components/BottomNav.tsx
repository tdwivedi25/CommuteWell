import { useEffect, useState } from "react";

const TABS = [
  { id: "today", label: "Today", emoji: "📋" },
  { id: "checkin", label: "Check-in", emoji: "💭" },
  { id: "progress", label: "Progress", emoji: "📊" },
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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 pb-6 bg-background/90 backdrop-blur-lg border-t border-white/5">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {TABS.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => go(t.id)}
              aria-current={isActive}
              className={`group flex flex-col items-center gap-1 min-w-[72px] md:min-w-[84px] focus:outline-none`}
            >
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_6px_20px_rgba(59,130,246,0.18)]"
                    : "text-muted-foreground hover:bg-white/5"
                }`}
              >
                <span className="leading-none">{t.emoji}</span>
              </div>
              <span className={`text-[11px] font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
