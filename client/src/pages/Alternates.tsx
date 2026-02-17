import { ChevronRight, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

const WELLNESS_TIPS = [
  "Public transit commuters walk an average of 30 more minutes per day than drivers — that's 2.5 extra hours of movement per week!",
  "Train commuters report 33% lower stress levels than solo drivers on the same route.",
  "Carpooling cuts your driving fatigue in half and gives you social connection during your commute.",
  "Using transit instead of driving can save Central Valley commuters up to $8,000 per year in gas and car wear.",
  "Reading or resting on the train instead of driving reduces cortisol (stress hormone) levels significantly.",
  "Bus and train commuters tend to sleep better — less driving anxiety means better wind-down at night.",
];

export default function Alternates() {
  const cards = [
    {
      id: "ace",
      icon: "🚆",
      name: "ACE Train",
      description: "Altamont Corridor Express — commuter rail between Stockton and San Jose.",
      badge: "Most popular for Central Valley",
      badgeColor: "bg-teal-100 text-teal-700",
      url: "https://acerail.com/",
    },
    {
      id: "bart",
      icon: "🚇",
      name: "BART",
      description: "Bay Area Rapid Transit — regional heavy rail serving the Bay Area.",
      badge: "Best for Bay Area connections",
      badgeColor: "bg-blue-100 text-blue-700",
      url: "https://www.bart.gov/",
    },
    {
      id: "sanjoaquin",
      icon: "🚌",
      name: "San Joaquin RTD",
      description: "San Joaquin Regional Transit District — local and commuter bus services.",
      badge: "Affordable option",
      badgeColor: "bg-amber-100 text-amber-700",
      url: "https://www.sjrtd.com/",
    },
    {
      id: "511",
      icon: "🤝",
      name: "511 RideMatch",
      description: "511.org — carpool, vanpool and transit matching for Bay Area commuters.",
      badge: "Reduce driving fatigue",
      badgeColor: "bg-green-100 text-green-700",
      url: "https://511.org/",
    },
  ];

  // Rotate tip daily
  const tip = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return WELLNESS_TIPS[dayOfYear % WELLNESS_TIPS.length];
  }, []);

  return (
    <div className="min-h-screen pb-32 bg-gradient-to-b from-blue-50 to-teal-50">
      <div className="px-6 pt-8 pb-4 max-w-md mx-auto">

        {/* Header */}
        <motion.header
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-gray-800">🚇 Transit Hub</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Healthier ways to commute
          </p>
        </motion.header>

        {/* Wellness Tip Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-5 rounded-2xl p-4 border-l-4 border-teal-500 bg-white shadow-md"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-teal-600 mb-1">
                Wellness Tip
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {tip}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Transit Cards */}
        <div className="grid grid-cols-1 gap-4">
          {cards.map((card, i) => (
            <motion.a
              key={card.id}
              href={card.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="block overflow-hidden rounded-2xl p-5 bg-white shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                    {card.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">
                      {card.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                      {card.description}
                    </p>

                    {/* Health benefit badge */}
                    <span className={`inline-block mt-2 text-xs font-semibold px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                      ✓ {card.badge}
                    </span>
                  </div>
                </div>

                <div className="self-center flex-shrink-0">
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-center text-xs text-gray-400 mt-6 leading-relaxed"
        >
          Tap any option to visit their official website and plan your route.
        </motion.p>

      </div>
    </div>
  );
}