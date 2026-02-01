import { useState, useEffect, useRef } from "react";
import { useCreateRoute, useRoutes, useUpdateRoute } from "@/hooks/use-commute";
import { Loader2, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function RouteSetup() {
  const [_, setLocation] = useLocation();
  const { data: routes } = useRoutes();
  const { mutate: createRoute, isPending: isCreating } = useCreateRoute();
  const { mutate: updateRoute, isPending: isUpdating } = useUpdateRoute();
  
  const existingRoute = routes?.[0];
  const isPending = isCreating || isUpdating;

  const [formData, setFormData] = useState({
    origin: existingRoute?.origin || "",
    destination: existingRoute?.destination || "",
    departureStart: existingRoute?.departureStart || "17:00",
    departureEnd: existingRoute?.departureEnd || "19:00",
  });

  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<string[]>([]);
  const originTimer = useRef<number | null>(null);
  const destTimer = useRef<number | null>(null);

  const searchAddresses = async (query: string) => {
    if (!query) return [];
    try {
      const res = await fetch(`/api/address/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.map((d: any) => d.display_name as string);
    } catch (e) {
      return [];
    }
  };

  useEffect(() => {
    if (originTimer.current) window.clearTimeout(originTimer.current);
    if (!formData.origin) {
      setOriginSuggestions([]);
    } else {
      originTimer.current = window.setTimeout(async () => {
        const results = await searchAddresses(formData.origin);
        setOriginSuggestions(results);
      }, 300);
    }
    return () => {
      if (originTimer.current) window.clearTimeout(originTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.origin]);

  useEffect(() => {
    if (destTimer.current) window.clearTimeout(destTimer.current);
    if (!formData.destination) {
      setDestSuggestions([]);
    } else {
      destTimer.current = window.setTimeout(async () => {
        const results = await searchAddresses(formData.destination);
        setDestSuggestions(results);
      }, 300);
    }
    return () => {
      if (destTimer.current) window.clearTimeout(destTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.destination]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      name: `${formData.origin} to ${formData.destination}`,
      isActive: true,
    };

    if (existingRoute) {
      updateRoute({ id: existingRoute.id, ...payload }, {
        onSuccess: () => setLocation("/")
      });
    } else {
      createRoute(payload, {
        onSuccess: () => setLocation("/")
      });
    }
  };

  

  return (
    <div className="min-h-screen bg-background pb-32 p-6">
      <header className="pt-8 mb-8">
        <h1 className="text-3xl font-display font-bold">Route Setup</h1>
        <p className="text-muted-foreground mt-1">
          Customize your daily commute parameters
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Locations */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Locations</h2>
          <div className="space-y-4 bg-card p-5 rounded-2xl border border-border">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-medium">Start Location</label>
              <input
                required
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="e.g. Lathrop"
                value={formData.origin}
                onChange={e => setFormData({ ...formData, origin: e.target.value })}
                autoComplete="off"
              />
              {originSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-card border border-border rounded-xl overflow-hidden z-20">
                  {originSuggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, origin: s }));
                        setOriginSuggestions([]);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-primary/5"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-center -my-2 relative z-10">
              <div className="bg-border p-2 rounded-full text-muted-foreground">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-medium">Destination</label>
              <input
                required
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="e.g. San Francisco"
                value={formData.destination}
                onChange={e => setFormData({ ...formData, destination: e.target.value })}
                autoComplete="off"
              />
              {destSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-card border border-border rounded-xl overflow-hidden z-20">
                  {destSuggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, destination: s }));
                        setDestSuggestions([]);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-primary/5"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Time Window */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Typical Departure Window</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-medium">Earliest</label>
              <input
                type="time"
                required
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.departureStart}
                onChange={e => setFormData({ ...formData, departureStart: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-medium">Latest</label>
              <input
                type="time"
                required
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.departureEnd}
                onChange={e => setFormData({ ...formData, departureEnd: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Transport modes removed per request */}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold text-lg py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPending ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Save Route Settings"}
        </button>
      </form>
    </div>
  );
}
