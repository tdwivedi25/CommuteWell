import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { format, subDays } from "date-fns";

type Checkin = {
  date: string; // YYYY-MM-DD
  timestamp: string;
  ratings?: Record<string, number>;
  note?: string;
  averageRating?: number; // 0-5 or 0-100
  commuteMinutes?: number; // optional
};

const STORAGE_KEY = "commutewell-checkins";

async function fetchCheckinsFromFirestore(): Promise<Checkin[]> {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "checkins"));
    const items: Checkin[] = [];
    snap.forEach((doc) => {
      items.push(doc.data() as Checkin);
    });
    return items;
  } catch (e) {
    console.warn("Failed to fetch checkins from Firestore", e);
    return [];
  }
}

function loadLocalCheckins(): Checkin[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Checkin[];
  } catch {
    return [];
  }
}

function lastNDates(n: number): string[] {
  const arr: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    arr.push(format(subDays(new Date(), i), "yyyy-MM-dd"));
  }
  return arr;
}

export default function Progress(): JSX.Element {
  const [checkins, setCheckins] = useState<Checkin[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // try firestore first
      const fromFs = await fetchCheckinsFromFirestore();
      if (mounted && fromFs.length > 0) {
        setCheckins(fromFs);
        return;
      }
      // fallback to local
      if (mounted) setCheckins(loadLocalCheckins());
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const last7 = useMemo(() => lastNDates(7), []);

  // map date->checkin
  const mapByDate = useMemo(() => {
    const m = new Map<string, Checkin>();
    checkins.forEach((c) => m.set(c.date, c));
    return m;
  }, [checkins]);

  // This Week's Impact
  const totalCommute = useMemo(() => {
    let sum = 0;
    let found = false;
    last7.forEach((d) => {
      const c = mapByDate.get(d);
      if (c && typeof c.commuteMinutes === "number") {
        sum += c.commuteMinutes;
        found = true;
      }
    });
    return found ? sum : null;
  }, [mapByDate, last7]);

  const tasksCompletedVsTotal = useMemo(() => {
    // try reading wellness task keys per day in localStorage
    let completed = 0;
    let total = 0;
    last7.forEach((d) => {
      try {
        const raw = window.localStorage.getItem(`commutewell-tasks-${d}`);
        if (!raw) return;
        const p = JSON.parse(raw);
        const t = p?.tasks;
        if (!t) return;
        const allTasks = [...(t.morning || []), ...(t.drive || []), ...(t.evening || [])];
        total += allTasks.length;
        completed += allTasks.filter((x: any) => x.completed).length;
      } catch {
        // ignore
      }
    });
    return { completed, total };
  }, [last7]);

  const currentStreak = useMemo(() => {
    // count consecutive days up to today with a checkin
    let streak = 0;
    for (let i = last7.length - 1; i >= 0; i--) {
      const d = last7[i];
      if (mapByDate.has(d)) streak++; else break;
    }
    return streak;
  }, [mapByDate, last7]);

  // Trends: compare avg of this week vs last week
  const trends = useMemo(() => {
    const thisWeekDates = last7;
    const lastWeekDates = lastNDates(14).slice(0, 7);

    function avgFor(dates: string[], key: string) {
      let sum = 0;
      let count = 0;
      dates.forEach((dd) => {
        const c = mapByDate.get(dd);
        const v = c?.ratings?.[key] ?? c?.averageRating;
        if (typeof v === "number") {
          sum += v;
          count++;
        }
      });
      return count === 0 ? null : sum / count;
    }

    const keys = ["energy", "stress", "comfort"];
    const out: Record<string, string> = {};
    keys.forEach((k) => {
      const a = avgFor(thisWeekDates, k);
      const b = avgFor(lastWeekDates, k);
      if (a === null || b === null) {
        out[k] = "Stable →";
        return;
      }
      const diff = a - b;
      if (diff > 0.2) out[k] = "Improving ↗️";
      else if (diff < -0.2) out[k] = "Declining ↘️";
      else out[k] = "Stable →";
    });
    return out;
  }, [mapByDate, last7]);

  const weeklyScores = useMemo(() => {
    return last7.map((d) => {
      const c = mapByDate.get(d);
      const v = c?.averageRating;
      if (typeof v === "number") {
        // assume 0-5 scale -> map to 0-100
        return Math.round((v / 5) * 100);
      }
      return 0;
    });
  }, [mapByDate, last7]);

  return (
    <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-50 px-6 py-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">This Week's Impact</h2>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">🚗 Total commute time</div>
              <div className="text-lg font-bold text-gray-800">{totalCommute === null ? "—" : `${Math.round(totalCommute/60)} hr ${totalCommute%60} min`}</div>
            </div>
            <div className="text-sm text-gray-500">(last 7 days)</div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">✅ Tasks completed</div>
              <div className="text-lg font-bold text-gray-800">{tasksCompletedVsTotal.completed}/{tasksCompletedVsTotal.total || "—"}</div>
            </div>
            <div className="text-sm text-gray-500">(this week)</div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">🔥 Current streak</div>
              <div className="text-lg font-bold text-gray-800">{currentStreak} days</div>
            </div>
            <div className="text-sm text-gray-500">Keep it up!</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">Your Trends</h2>
        <div className="bg-white rounded-2xl shadow-md p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">Energy trend</div>
            <div className="text-sm font-semibold text-gray-800">{trends.energy}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">Stress trend</div>
            <div className="text-sm font-semibold text-gray-800">{trends.stress}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">Comfort trend</div>
            <div className="text-sm font-semibold text-gray-800">{trends.comfort}</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">This Week's Challenge</h2>
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <div className="text-sm font-semibold text-gray-700 mb-3">Take 3 walking breaks</div>
          <div className="flex gap-3">
            {[0,1,2].map((i) => (
              <div key={i} className={clsx("flex-1 p-3 rounded-lg text-center", i < (tasksCompletedVsTotal.completed >= 3 ? 3 : tasksCompletedVsTotal.completed) ? "bg-green-100" : "bg-gray-100")}>
                {i < (tasksCompletedVsTotal.completed >= 3 ? 3 : tasksCompletedVsTotal.completed) ? "✅" : "⬜"}
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">This Week</h2>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <div className="text-sm text-gray-600 mb-4">Wellness score (last 7 days)</div>
          <div className="flex items-end gap-2 h-32">
            {weeklyScores.map((s, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                  <rect x="0" y={100 - s} width="100" height={s} fill="#06b6d4" rx="4" />
                </svg>
                <div className="text-xs text-gray-500 mt-2">{format(new Date(last7[idx]), "EEE")}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.main>
  );
}
