import { Car, Train, Users, ChevronRight, Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function Alternates() {
  // Mock data for alternates since API might not return this fully yet
  // In a real app, this would come from `usePrediction` or a dedicated `useAlternates` hook
  const options = [
    {
      id: 1,
      mode: "drive",
      name: "Highway 580",
      time: "1h 45m",
      cost: "$15.00",
      recommended: false,
      icon: Car,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
    {
      id: 2,
      mode: "transit",
      name: "ACE Train",
      time: "1h 20m",
      cost: "$12.50",
      recommended: true,
      icon: Train,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      id: 3,
      mode: "transit",
      name: "BART (Dublin/Pleasanton)",
      time: "1h 55m",
      cost: "$8.20",
      recommended: false,
      icon: Train,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      id: 4,
      mode: "carpool",
      name: "Casual Carpool",
      time: "1h 30m",
      cost: "$5.00",
      recommended: false,
      icon: Users,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-32 p-6">
      <header className="pt-8 mb-8">
        <h1 className="text-3xl font-display font-bold">Commute Options</h1>
        <p className="text-muted-foreground mt-1">
          Comparing route alternatives
        </p>
      </header>

      <div className="space-y-4">
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              relative overflow-hidden rounded-2xl p-5 border transition-all duration-300
              ${option.recommended 
                ? "bg-gradient-to-br from-primary/20 to-primary/5 border-primary/50 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)]" 
                : "bg-card border-border hover:border-border/80"}
            `}
          >
            {option.recommended && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Recommended
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${option.bg} ${option.color}`}>
                <option.icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-lg">{option.name}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{option.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>{option.cost}</span>
                  </div>
                </div>
              </div>

              <div className="self-center">
                <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
