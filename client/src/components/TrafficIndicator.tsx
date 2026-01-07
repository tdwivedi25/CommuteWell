import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TrafficIndicatorProps {
  status: "green" | "yellow" | "red";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function TrafficIndicator({ status, className, size = "lg" }: TrafficIndicatorProps) {
  const colors = {
    green: "bg-[hsl(var(--traffic-green))]",
    yellow: "bg-[hsl(var(--traffic-yellow))]",
    red: "bg-[hsl(var(--traffic-red))]",
  };
  
  const shadows = {
    green: "shadow-[0_0_40px_hsl(var(--traffic-green)/0.4)]",
    yellow: "shadow-[0_0_40px_hsl(var(--traffic-yellow)/0.4)]",
    red: "shadow-[0_0_40px_hsl(var(--traffic-red)/0.4)]",
  };

  const sizes = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-48 h-48",
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Outer pulsing ring 1 */}
      <motion.div
        className={cn("absolute rounded-full opacity-20", colors[status], sizes[size])}
        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Outer pulsing ring 2 - Delayed */}
      <motion.div
        className={cn("absolute rounded-full opacity-20", colors[status], sizes[size])}
        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
        transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main light */}
      <motion.div
        className={cn(
          "rounded-full z-10",
          colors[status], 
          shadows[status],
          sizes[size]
        )}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </div>
  );
}
