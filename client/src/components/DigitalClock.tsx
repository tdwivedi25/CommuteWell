import { useState, useEffect } from "react";
import { format } from "date-fns";

export function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-foreground tabular-nums">
        {format(time, "h:mm")}
        <span className="text-2xl md:text-4xl text-muted-foreground ml-2 font-medium">
          {format(time, "a")}
        </span>
      </h1>
      <p className="text-muted-foreground uppercase tracking-[0.2em] text-sm mt-2 font-medium">
        {format(time, "EEEE, MMMM do")}
      </p>
    </div>
  );
}
