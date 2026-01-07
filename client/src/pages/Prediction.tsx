import { useRoutes, usePrediction } from "@/hooks/use-commute";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from "recharts";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

export default function Prediction() {
  const { data: routes } = useRoutes();
  const activeRoute = routes?.[0];
  const { data: prediction, isLoading } = usePrediction(activeRoute?.id ?? null);

  if (isLoading || !prediction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const { forecast, currentStatus } = prediction;
  
  // Find peak congestion for display
  const peak = forecast.reduce((max, curr) => curr.congestion > max.congestion ? curr : max, forecast[0]);
  const isRising = forecast.length > 1 && forecast[1].congestion > forecast[0].congestion;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-xl shadow-xl">
          <p className="text-foreground font-bold mb-1">{label}</p>
          <p className="text-primary text-sm">
            Congestion: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background pb-32 p-6">
      <header className="pt-8 mb-8">
        <h1 className="text-3xl font-display font-bold">Traffic Forecast</h1>
        <p className="text-muted-foreground mt-1">
          Predicted congestion for the next few hours
        </p>
      </header>

      {/* Chart Card */}
      <div className="glass-panel p-6 rounded-3xl mb-8 border border-white/5">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Line 
                type="monotone" 
                dataKey="congestion" 
                stroke="hsl(var(--primary))" 
                strokeWidth={4}
                dot={false}
                activeDot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 0 }}
              />
              {/* Highlight best time window */}
              <ReferenceArea x1={prediction.bestDepartureTime} x2={prediction.bestDepartureTime} stroke="hsl(var(--traffic-green))" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-4">
        <div className="bg-card rounded-2xl p-5 border border-border flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Current Trend</p>
            <h3 className="text-xl font-bold flex items-center gap-2">
              {isRising ? "Traffic Rising" : "Traffic Clearing"}
              {isRising ? <TrendingUp className="text-red-400 w-5 h-5" /> : <TrendingDown className="text-green-400 w-5 h-5" />}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-3xl font-display font-bold text-primary">{currentStatus.congestionLevel}%</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2">Analysis</p>
          <p className="text-foreground leading-relaxed">
            {currentStatus.explanation}
          </p>
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-sm">
              <span className="text-muted-foreground">Expected Peak: </span>
              <span className="font-bold text-foreground">{peak.time} ({peak.congestion}%)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
