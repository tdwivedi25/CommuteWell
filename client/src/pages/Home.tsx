import { useEffect } from "react";
import { useRoutes, usePrediction, useSyncDevice } from "@/hooks/use-commute";
import { TrafficIndicator } from "@/components/TrafficIndicator";
import { DigitalClock } from "@/components/DigitalClock";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const { data: routes, isLoading: loadingRoutes } = useRoutes();
  // For MVP, just grab the first route. In real app, user selects active route.
  const activeRoute = routes?.[0];
  
  const { data: prediction, isLoading: loadingPrediction } = usePrediction(activeRoute?.id ?? null);
  const { mutate: syncDevice } = useSyncDevice();

  useEffect(() => {
    if (prediction?.currentStatus.status) {
      // Sync the physical device whenever we get new status
      syncDevice(prediction.currentStatus.status as any);
    }
  }, [prediction?.currentStatus.status, syncDevice]);

  if (loadingRoutes || (activeRoute && loadingPrediction)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!activeRoute) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
          <MapIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Welcome to Commute Cue</h2>
        <p className="text-muted-foreground mb-8 max-w-xs">
          Set up your first commute to start tracking traffic and get departure alerts.
        </p>

      </div>
    );
  }

  const status = (prediction?.currentStatus.status as "green" | "yellow" | "red") || "green";
  const statusMessages = {
    green: "Good to leave",
    yellow: "Traffic building",
    red: "Better wait"
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 text-center">
        <DigitalClock />
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-8">
        {/* Route Info */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-muted-foreground">
            <span>{activeRoute.origin}</span>
            <ArrowRight className="w-3 h-3" />
            <span>{activeRoute.destination}</span>
          </div>
        </div>

        {/* Traffic Light */}
        <div className="py-8 flex flex-col items-center justify-center relative">
          <TrafficIndicator status={status} />
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={status}
            className="mt-8 text-center"
          >
            <h2 className="text-3xl font-display font-bold tracking-tight">
              {statusMessages[status]}
            </h2>
            <p className="text-muted-foreground mt-2">
              Best time: <span className="text-foreground font-semibold">{prediction?.bestDepartureTime || "--:--"}</span>
            </p>
          </motion.div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 gap-4">
          {prediction?.currentStatus.recommendation && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-5 rounded-2xl flex items-start gap-4"
            >
              <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg mb-1">Recommendation</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {prediction.currentStatus.explanation || "Traffic is flowing smoothly. It's a great time to hit the road."}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

function MapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" x2="9" y1="3" y2="18" />
      <line x1="15" x2="15" y1="6" y2="21" />
    </svg>
  );
}
