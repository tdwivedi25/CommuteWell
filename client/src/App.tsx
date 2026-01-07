import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/BottomNav";

import Home from "@/pages/Home";
import Prediction from "@/pages/Prediction";
import RouteSetup from "@/pages/RouteSetup";
import Alternates from "@/pages/Alternates";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/prediction" component={Prediction} />
      <Route path="/setup" component={RouteSetup} />
      <Route path="/alternates" component={Alternates} />
      <Route component={NotFound} />
    </Switch>
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
