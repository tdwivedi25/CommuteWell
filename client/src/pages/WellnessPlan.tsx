import React, { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
// Persist locally using localStorage instead of Firestore

type Task = { id: string; name: string; completed: boolean };

export default function WellnessPlan() {
  const today = new Date();
  const displayDate = format(today, "EEEE, MMMM d");
  const isoDate = format(today, "yyyy-MM-dd");

  const [tasks, setTasks] = useState({
    morning: [
      { id: "stretch", name: "5-min stretch routine", completed: false },
      { id: "breakfast", name: "Healthy breakfast packed", completed: false },
    ] as Task[],
    drive: [
      { id: "posture", name: "Posture check (alert @45min)", completed: false },
      { id: "breathing", name: "Breathing exercise at rest stop", completed: false },
    ] as Task[],
    evening: [{ id: "walk", name: "10-min walk before dinner", completed: false }] as Task[],
  });

  const totalCount = useMemo(() => {
    return tasks.morning.length + tasks.drive.length + tasks.evening.length;
  }, [tasks]);

  const completedCount = useMemo(() => {
    return (
      tasks.morning.filter((t) => t.completed).length +
      tasks.drive.filter((t) => t.completed).length +
      tasks.evening.filter((t) => t.completed).length
    );
  }, [tasks]);

  const wellnessScore = useMemo(() => {
    const base = 50;
    const added = Math.min(5, completedCount) * 10;
    return Math.min(100, base + added);
  }, [completedCount]);

  const statusMessage = useMemo(() => {
    if (wellnessScore >= 80) return "Thriving! 💪";
    if (wellnessScore >= 60) return "Doing great! 📈";
    if (wellnessScore >= 40) return "Keep going! 🌱";
    return "Let's build momentum! 💙";
  }, [wellnessScore]);

  const saveTimeoutRef = useRef<number | null>(null);
  const [scorePulse, setScorePulse] = useState(false);

  useEffect(() => {
    // Load saved state from localStorage if present
    try {
      const key = `commutewell-tasks-${isoDate}`;
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.tasks) {
          setTasks(parsed.tasks);
        }
      }
    } catch (e) {
      // ignore parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveToLocalDebounced() {
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      const payload = {
        userId: "currentUser",
        date: isoDate,
        tasks: {
          morning: tasks.morning.map(({ id, name, completed }) => ({ id, name, completed })),
          drive: tasks.drive.map(({ id, name, completed }) => ({ id, name, completed })),
          evening: tasks.evening.map(({ id, name, completed }) => ({ id, name, completed })),
        },
        wellnessScore,
        completedCount,
        totalCount,
      };
      try {
        const key = `commutewell-tasks-${isoDate}`;
        window.localStorage.setItem(key, JSON.stringify(payload));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Failed to save to localStorage", e);
      }
    }, 300);
  }

  // Save anytime tasks change (debounced)
  useEffect(() => {
    saveToLocalDebounced();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  // Pulse animation when score updates
  useEffect(() => {
    setScorePulse(true);
    const t = window.setTimeout(() => setScorePulse(false), 700);
    return () => window.clearTimeout(t);
  }, [wellnessScore]);

  function toggleTask(group: keyof typeof tasks, taskId: string) {
    setTasks((prev) => {
      const next = { ...prev } as typeof prev;
      next[group] = next[group].map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      return next;
    });
    // schedule local save
    saveToLocalDebounced();
  }

  function renderTask(group: keyof typeof tasks, t: Task, isLast: boolean) {
    return (
      <label
        key={t.id}
        className={
          "flex items-center py-3 min-h-[44px] transition-all duration-200 hover:scale-105 active:scale-95 " +
          (isLast ? "" : "border-b border-gray-100")
        }
      >
        <input
          type="checkbox"
          aria-label={t.name}
          checked={t.completed}
          onChange={() => toggleTask(group, t.id)}
          className={
            "w-6 h-6 mr-3 rounded-md border-2 border-teal-400 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 " +
            (t.completed
              ? "bg-teal-500 checked:accent-white text-white transform scale-105"
              : "bg-white")
          }
        />
        <span
          className={
            "text-base font-medium transition-all duration-200 " +
            (t.completed ? "text-gray-400 line-through" : "text-gray-700")
          }
        >
          {t.name}
        </span>
      </label>
    );
  }

  return (
    <div className="min-h-screen pt-safe pb-safe px-6 py-8 bg-gradient-to-br from-blue-50 to-teal-50 font-sans text-base">
      <div className="max-w-md mx-auto">
        <div className="opacity-100">
          <header>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-teal-700">🚗</div>
              <h1 className="font-bold text-2xl text-teal-700">CommuteWell</h1>
            </div>
            <div className="mt-1 text-sm font-medium text-gray-600">{displayDate}</div>
            <div className="mt-4 mb-6 inline-block bg-white/50 backdrop-blur px-4 py-2 rounded-full text-base text-gray-700">
              Your 2hr 15min commute today
            </div>
          </header>

          {/* MORNING */}
          <section className="mb-4 p-5 rounded-2xl shadow-md bg-white bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-xl transition-shadow duration-300">
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wide text-teal-600">MORNING 7:00 AM</div>
                <div className="text-xl">☀️</div>
              </div>
            </div>
            <div>
              {tasks.morning.map((t, i) => renderTask("morning", t, i === tasks.morning.length - 1))}
            </div>
          </section>

          {/* DURING DRIVE */}
          <section className="mb-4 p-5 rounded-2xl shadow-md bg-white bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-shadow duration-300">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wide text-teal-600">DURING DRIVE</div>
              <div className="text-xl">🚗</div>
            </div>
            <div>
              {tasks.drive.map((t, i) => renderTask("drive", t, i === tasks.drive.length - 1))}
            </div>
          </section>

          {/* EVENING */}
          <section className="mb-4 p-5 rounded-2xl shadow-md bg-white bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-shadow duration-300">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wide text-teal-600">EVENING</div>
              <div className="text-xl">🌙</div>
            </div>
            <div>
              {tasks.evening.map((t, i) => renderTask("evening", t, i === tasks.evening.length - 1))}
            </div>
          </section>

          {/* Wellness Score Card */}
          <div className="mt-6 p-6 rounded-2xl shadow-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white">
              <div className="text-sm uppercase tracking-wide opacity-90 mb-2">Wellness Score</div>
              <div className="flex items-baseline gap-3">
                <div className={`text-5xl font-bold transition-transform ${scorePulse ? "scale-105" : ""}`}>{wellnessScore}/100</div>
              </div>
              <div className="text-lg font-medium mt-2">{statusMessage}</div>

            <div className="mt-4">
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full bg-white transition-all duration-500`
                  }
                  style={{ width: `${wellnessScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
