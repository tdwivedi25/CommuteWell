import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

type CommuteEntry = {
  date: string;
  timestamp: string;
  fromCity: string;
  toCity: string;
  commuteHours: number;
  commuteMinutes: number;
  daysPerWeek: number;
  notes: string;
};

type CommuteConfig = {
  fromCity: string;
  toCity: string;
  commuteHours: number;
  commuteMinutes: number;
  daysPerWeek: number;
};

const STORAGE_KEY = "commutewell-setup";
const ENTRIES_KEY = "commutewell-entries";

const FROM_CITIES = [
  "Tracy",
  "Stockton",
  "Modesto",
  "Livermore",
  "Manteca",
  "Lathrop",
  "Other Central Valley",
];

const TO_CITIES = [
  "San Jose",
  "San Francisco",
  "Oakland",
  "Fremont",
  "Palo Alto",
  "Mountain View",
  "Other Bay Area",
];

function loadConfig(): CommuteConfig {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        fromCity: "",
        toCity: "",
        commuteHours: 0,
        commuteMinutes: 15,
        daysPerWeek: 5,
      };
    }
    return JSON.parse(raw) as CommuteConfig;
  } catch {
    return {
      fromCity: "",
      toCity: "",
      commuteHours: 0,
      commuteMinutes: 15,
      daysPerWeek: 5,
    };
  }
}

function saveConfig(config: CommuteConfig) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn("Failed to save config", e);
  }
}

function loadEntries(): CommuteEntry[] {
  try {
    const raw = window.localStorage.getItem(ENTRIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CommuteEntry[];
  } catch {
    return [];
  }
}

function saveEntries(entries: CommuteEntry[]) {
  try {
    window.localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch (e) {
    console.warn("Failed to save entries", e);
  }
}

export default function CommuteSetup() {
  const today = new Date();
  const displayDate = format(today, "EEEE, MMMM d");
  const isoDate = format(today, "yyyy-MM-dd");
  
  const [config, setConfig] = useState<CommuteConfig>(loadConfig());
  const [entries, setEntries] = useState<CommuteEntry[]>(loadEntries());
  const [notes, setNotes] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Load today's entry
    const todayEntry = entries.find((e) => e.date === isoDate);
    if (todayEntry) {
      setNotes(todayEntry.notes || "");
      setCharCount((todayEntry.notes || "").length);
    }
  }, [isoDate, entries]);

  const handleConfigChange = <K extends keyof CommuteConfig>(
    key: K,
    value: CommuteConfig[K]
  ) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleSaveLog = () => {
    if (!config.fromCity || !config.toCity) {
      alert("Please set commute cities first");
      return;
    }

    const newEntries = [...entries];
    const existingIndex = newEntries.findIndex((e) => e.date === isoDate);
    const entry: CommuteEntry = {
      date: isoDate,
      timestamp: new Date().toISOString(),
      fromCity: config.fromCity,
      toCity: config.toCity,
      commuteHours: config.commuteHours,
      commuteMinutes: config.commuteMinutes,
      daysPerWeek: config.daysPerWeek,
      notes: "",
    };

    if (existingIndex >= 0) {
      newEntries[existingIndex] = entry;
    } else {
      newEntries.push(entry);
    }

    setEntries(newEntries);
    saveEntries(newEntries);
    
    // Dispatch custom event to update other components
    window.dispatchEvent(new CustomEvent("commuteLogged", { detail: entry }));
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const commuteDisplay =
    config.fromCity && config.toCity
      ? `${config.fromCity} → ${config.toCity} (${config.commuteHours}h ${config.commuteMinutes}m)`
      : "Set your commute details";

  return (
    <div className="min-h-screen pt-safe pb-safe px-6 py-8 bg-gradient-to-br from-blue-50 to-teal-50 font-sans text-base">
      <div className="max-w-md mx-auto">
        <header>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-teal-700">⚙️</div>
            <h1 className="font-bold text-2xl text-teal-700">Setup</h1>
          </div>
          <div className="mt-1 text-sm font-medium text-gray-600">{displayDate}</div>
          <div className="mt-4 mb-6 inline-block bg-white/50 backdrop-blur px-4 py-2 rounded-full text-base text-gray-700">
            {commuteDisplay}
          </div>
        </header>

        {/* Commute Configuration */}
        <section className="mb-4 p-5 rounded-2xl shadow-md bg-white bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-wide text-teal-600">Commute Details</div>
              <div className="text-xl">🚗</div>
            </div>
          </div>

          <div className="space-y-4">
            {/* From City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commute from
              </label>
              <select
                value={config.fromCity}
                onChange={(e) =>
                  handleConfigChange("fromCity", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
              >
                <option value="">Select city</option>
                {FROM_CITIES.map((city) => (
                  <option key={city} value={city} className="text-black">
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* To City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commute to
              </label>
              <select
                value={config.toCity}
                onChange={(e) =>
                  handleConfigChange("toCity", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
              >
                <option value="">Select city</option>
                {TO_CITIES.map((city) => (
                  <option key={city} value={city} className="text-black">
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commute time (one way)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={config.commuteHours}
                  onChange={(e) =>
                    handleConfigChange(
                      "commuteHours",
                      Math.max(0, parseInt(e.target.value) || 0)
                    )
                  }
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-center text-black"
                  placeholder="0"
                />
                <span className="text-gray-600 py-2">hrs</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  step="5"
                  value={config.commuteMinutes}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                    handleConfigChange("commuteMinutes", val);
                  }}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-center text-black"
                  placeholder="0"
                />
                <span className="text-gray-600 py-2">min</span>
              </div>
            </div>

            {/* Days per week */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days per week
              </label>
              <select
                value={config.daysPerWeek}
                onChange={(e) =>
                  handleConfigChange("daysPerWeek", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
              >
                {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day} className="text-black">
                    {day} day{day !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <button
          onClick={handleSaveLog}
          className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          Save Route
        </button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-8 right-8 max-w-sm z-50"
          >
            <div className="bg-green-500 text-white p-4 rounded-xl shadow-xl text-center">
              <div className="text-lg font-semibold">✅ Route saved!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
