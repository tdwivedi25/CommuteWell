import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Alternates() {
  const cards = [
    {
      id: "ace",
      name: "ACE Train",
      description: "Altamont Corridor Express — commuter rail between Stockton and San Jose.",
      url: "https://acerail.com/",
    },
    {
      id: "bart",
      name: "BART",
      description: "Bay Area Rapid Transit — regional heavy rail serving the Bay Area.",
      url: "https://www.bart.gov/",
    },
    {
      id: "sanjoaquin",
      name: "San Joaquin RTD",
      description: "San Joaquin Regional Transit District — local and commuter bus services.",
      url: "https://www.sjrtd.com/",
    },
    {
      id: "511",
      name: "511 RideMatch",
      description: "511.org — carpool, vanpool and transit matching for Bay Area commuters.",
      url: "https://511.org/",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-32 p-6">
      <header className="pt-8 mb-6">
        <h1 className="text-3xl font-display font-bold">Transit Hub</h1>
        <p className="text-muted-foreground mt-1">Official transit providers and resources</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {cards.map((card, i) => (
          <motion.a
            key={card.id}
            href={card.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="block overflow-hidden rounded-2xl p-5 border bg-card border-border hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{card.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{card.description}</p>
              </div>

              <div className="self-center">
                <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
