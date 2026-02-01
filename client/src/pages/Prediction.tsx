import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type RatingKey = "energy" | "stress" | "comfort";

type Checkin = {
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO
  ratings: Partial<Record<RatingKey, number>>;
  note?: string;
  averageRating: number;
};

const STORAGE_KEY = "commutewell-checkins";

const TIPS = [
  "Rest stops every 90min reduce fatigue by 40%",
  "5-minute stretches can reduce back pain significantly",
  "Deep breathing exercises lower stress hormones",
  "Staying hydrated improves focus and energy",
];

function todayISO(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function loadCheckins(): Checkin[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Checkin[];
  } catch {
    return [];
  }
}

function saveCheckins(all: Checkin[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Failed to save checkins", e);
  }
}

export default function Prediction(): JSX.Element {
  const dateKey = todayISO();
  const [ratings, setRatings] = useState<Partial<Record<RatingKey, number>>>({});
  const [note, setNote] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tip, setTip] = useState<string>(TIPS[0]);

  const mountedRef = useRef(false);

  useEffect(() => {
    // pick random tip
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
    // load today's checkin
    const all = loadCheckins();
    const today = all.find((c) => c.date === dateKey);
    if (today) {
      setRatings(today.ratings || {});
      setNote(today.note || "");
      setCharCount((today.note || "").length);
    }
    mountedRef.current = true;
  }, [dateKey]);

  const setRating = useCallback((key: RatingKey, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const averageRating = useMemo(() => {
    const vals = Object.values(ratings).filter((v): v is number => typeof v === "number");
    if (vals.length === 0) return 0;
    return Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10;
  }, [ratings]);

  const valid = useMemo(() => Object.values(ratings).some((v) => typeof v === "number"), [ratings]);

  const onNoteChange = useCallback((v: string) => {
    const truncated = v.slice(0, 200);
    setNote(truncated);
    setCharCount(truncated.length);
  }, []);

  const submit = useCallback(async () => {
    if (!valid) return;
    setLoading(true);
    // simulate save delay
    await new Promise((r) => setTimeout(r, 600));

    const all = loadCheckins();
    const existingIndex = all.findIndex((c) => c.date === dateKey);
    const payload: Checkin = {
      date: dateKey,
      timestamp: new Date().toISOString(),
      ratings,
      note: note || undefined,
      averageRating,
    };

    if (existingIndex >= 0) {
      all[existingIndex] = payload;
    } else {
      all.push(payload);
    }
    saveCheckins(all);
    setLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  }, [valid, ratings, note, averageRating, dateKey]);

  return (
    <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-50 px-6 py-8 pb-safe">
      <div className="max-w-md mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">How are you feeling?</h1>
          <p className="text-sm font-medium text-gray-600">Quick daily check-in</p>
        </header>

        {/* Energy */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <div className="text-lg font-semibold text-gray-700 mb-4">⚡ Energy Level</div>
          <div className="flex justify-center items-center gap-3">
            {[1, 2, 3, 4, 5].map((n) => {
              const filled = (ratings.energy ?? 0) >= n;
              return (
                <button
                  key={n}
                  aria-pressed={filled}
                  aria-label={`Set energy ${n}`}
                  onClick={() => setRating("energy", n)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setRating("energy", n);
                    }
                  }}
                  className={clsx(
                    "w-12 h-12 min-w-[48px] min-h-[48px] rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer",
                    filled ? "bg-teal-500" : "bg-gray-200 border-2 border-gray-300",
                    "hover:scale-110 active:scale-95"
                  )}
                >
                  <span className={clsx(filled ? "text-white" : "text-gray-700")}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stress */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <div className="text-lg font-semibold text-gray-700 mb-4">😰 Stress Level</div>
          <div className="flex justify-center items-center gap-3">
            {[1, 2, 3, 4, 5].map((n) => {
              const filled = (ratings.stress ?? 0) >= n;
              return (
                <button
                  key={n}
                  aria-pressed={filled}
                  aria-label={`Set stress ${n}`}
                  onClick={() => setRating("stress", n)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setRating("stress", n);
                    }
                  }}
                  className={clsx(
                    "w-12 h-12 min-w-[48px] min-h-[48px] rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer",
                    filled ? "bg-orange-500" : "bg-gray-200 border-2 border-gray-300",
                    "hover:scale-110 active:scale-95"
                  )}
                >
                  <span className={clsx(filled ? "text-white" : "text-gray-700")}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Comfort */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <div className="text-lg font-semibold text-gray-700 mb-4">🧘 Physical Comfort</div>
          <div className="flex justify-center items-center gap-3">
            {[1, 2, 3, 4, 5].map((n) => {
              const filled = (ratings.comfort ?? 0) >= n;
              return (
                <button
                  key={n}
                  aria-pressed={filled}
                  aria-label={`Set comfort ${n}`}
                  onClick={() => setRating("comfort", n)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setRating("comfort", n);
                    }
                  }}
                  className={clsx(
                    "w-12 h-12 min-w-[48px] min-h-[48px] rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer",
                    filled ? "bg-purple-500" : "bg-gray-200 border-2 border-gray-300",
                    "hover:scale-110 active:scale-95"
                  )}
                >
                  <span className={clsx(filled ? "text-white" : "text-gray-700")}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <div className="text-lg font-semibold text-gray-700 mb-3">Add a note (optional)</div>
          <textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="How was your commute today?"
            className="w-full bg-white border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-xl p-4 text-base text-gray-700 min-h-[96px] max-h-[120px] resize-none placeholder:text-gray-400"
            maxLength={200}
            aria-label="Add a note about your commute"
          />
          <div className="text-xs text-gray-500 mt-1 text-right">{charCount}/200</div>
        </div>

        {/* Tip */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6 flex items-start gap-3">
          <div className="text-xl flex-shrink-0">💡</div>
          <div className="text-sm font-medium text-gray-700 leading-relaxed">{tip}</div>
        </div>

        {/* Submit */}
        <div>
          <button
            onClick={submit}
            disabled={!valid || loading}
            className={clsx(
              "w-full py-4 px-8 rounded-xl text-lg font-semibold text-white shadow-lg transition-all duration-200",
              loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl hover:scale-[1.02] active:scale-95",
              !valid && "opacity-50 cursor-not-allowed",
              "bg-gradient-to-r from-teal-500 to-blue-500"
            )}
            aria-disabled={!valid || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Quick Log"
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 max-w-md z-50"
          >
            <div className="bg-green-500 text-white p-4 rounded-xl shadow-xl text-center">
              <div className="text-lg font-semibold">✅ Check-in saved!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
