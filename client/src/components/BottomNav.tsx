import { Link, useLocation } from "wouter";
import { Home, Map, Settings, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/prediction", icon: Zap, label: "Forecast" },
    { href: "/alternates", icon: Map, label: "Options" },
    { href: "/setup", icon: Settings, label: "Setup" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-background/80 backdrop-blur-lg border-t border-white/5">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = location === href;
          return (
            <Link key={href} href={href} className="group flex flex-col items-center gap-1 min-w-[64px]">
              <div
                className={cn(
                  "p-2.5 rounded-2xl transition-all duration-300",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                    : "text-muted-foreground group-hover:text-foreground group-hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
