
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/BottomNav";

import WellnessPlan from "@/pages/WellnessPlan";
import Home from "@/pages/Home";
import Prediction from "@/pages/Prediction";
import CommuteSetup from "@/pages/CommuteSetup";
import Alternates from "@/pages/Alternates";
import Progress from "@/pages/Progress";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";

function Router() {
  const VALID = ["today", "checkin", "progress", "setup"];
  const [tab, setTab] = useState<string>(() => {
    try {
      const h = window.location.hash.replace("#", "");
      return VALID.includes(h) ? h : "today";
    } catch (e) {
      return "today";
    }
  });

  useEffect(() => {
    function onHashChange() {
      const h = window.location.hash.replace("#", "");
      setTab(VALID.includes(h) ? h : "today");
    }
    window.addEventListener("hashchange", onHashChange);
    // ensure default
    if (!window.location.hash || !VALID.includes(window.location.hash.replace("#", ""))) {
      window.location.hash = "#today";
    }
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <div className="relative min-h-screen pb-28">{/* pb for bottom nav */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${tab === "today" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <WellnessPlan />
      </div>
      <div className={`absolute inset-0 transition-opacity duration-300 ${tab === "checkin" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <Prediction />
      </div>
      <div className={`absolute inset-0 transition-opacity duration-300 ${tab === "progress" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <Progress />
      </div>
      <div className={`absolute inset-0 transition-opacity duration-300 ${tab === "setup" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <CommuteSetup />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="antialiased min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
          <Toaster />
          <Router />
          <BottomNav />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
