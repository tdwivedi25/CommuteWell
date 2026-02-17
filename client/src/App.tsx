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
import { useEffect, useState, useMemo } from "react";

// ✨ NEW IMPORTS
import { useSyncToPi } from "@/hooks/useSyncToPi";
import {
  calculateWellnessScore,
  calculateStreak,
  getTasksCompleted,
  getTotalTasks,
  getWeeklyCommuteHours,
  getTrends,
  getTodaysFocus,
} from "@/lib/wellnessCalculations";

function Router() {
  const VALID = ["home", "today", "checkin", "progress", "setup", "transit"];
  const [tab, setTab] = useState<string>(() => {
    try {
      const h = window.location.hash.replace("#", "");
      return VALID.includes(h) ? h : "home";
    } catch (e) {
      return "home";
    }
  });

  useEffect(() => {
    function onHashChange() {
      const h = window.location.hash.replace("#", "");
      setTab(VALID.includes(h) ? h : "home");
    }
    window.addEventListener("hashchange", onHashChange);
    if (!window.location.hash || !VALID.includes(window.location.hash.replace("#", ""))) {
      window.location.hash = "#home";
    }
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Track localStorage changes to trigger re-sync
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const handleStorageChange = () => setUpdateTrigger(prev => prev + 1);

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("wellness-data-updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("wellness-data-updated", handleStorageChange);
    };
  }, []);

  // Recalculate wellnessData whenever updateTrigger changes
  const wellnessData = useMemo(() => ({
    wellnessScore: calculateWellnessScore(),
    streak: calculateStreak(),
    tasksCompleted: getTasksCompleted(),
    totalTasks: getTotalTasks(),
    commuteTime: getWeeklyCommuteHours(),
    trends: getTrends(),
    todaysFocus: getTodaysFocus(),
  }), [updateTrigger]);

  // Sync the latest data to Pi
  useSyncToPi(wellnessData);

  return (
    <div className="relative min-h-screen pb-28">{/* pb for bottom nav */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${tab === "today" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <WellnessPlan />
      </div>
      <div className={`absolute inset-0 transition-opacity duration-300 ${tab === "home" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <Home />
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
      <div className={`absolute inset-0 transition-opacity duration-300 ${tab === "transit" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <Alternates />
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