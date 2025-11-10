import React, { useState, useMemo, useEffect } from "react";

const USER_ID = "demoUser123"; // replace with real user id after adding auth
const API_BASE = "http://localhost:5000/api/journals";

export default function JournalPage() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [entries, setEntries] = useState({});
  const [stats, setStats] = useState({
    totalEntries: 0,
    streak: 0,
    moodCounts: {},
    mostFrequentMood: "🙂 Neutral",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("🙂 Neutral");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMood, setFilterMood] = useState("All");
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const today = startOfDay(new Date());

  // Load journals and stats
  useEffect(() => {
    loadJournals();
  }, []);

  const loadJournals = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/user/${USER_ID}`);
      if (!res.ok) throw new Error(`Failed to load journals: ${res.statusText}`);
      const data = await res.json();

      const mapped = {};
      data.forEach((j) => (mapped[isoDate(j.date)] = j));
      setEntries(mapped);

      // Fetch stats
      const statsRes = await fetch(`${API_BASE}/user/${USER_ID}/stats`);
      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (err) {
      console.error("Error loading journals:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const { monthLabel, grid } = useMemo(
    () => buildCalendarGrid(monthOffset),
    [monthOffset]
  );

  const allEntries = Object.values(entries)
    .filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMood = filterMood === "All" || entry.mood === filterMood;
      return matchesSearch && matchesMood;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const openModal = () => {
    const entry = entries[isoDate(selectedDate)];
    setTitle(entry?.title || "");
    setContent(entry?.content || "");
    setMood(entry?.mood || "🙂 Neutral");
    setModalOpen(true);
  };

  // ✅ Save or Update Journal Entry
  const saveEntry = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      alert("Title & content are required");
      return;
    }

    const selectedKey = isoDate(selectedDate);
    const existingEntry = entries[selectedKey];

    const payload = {
      userId: USER_ID,
      title: trimmedTitle,
      content: trimmedContent,
      mood,
      date: new Date(isoDate(selectedDate)),
    };

    try {
      let res;
      if (existingEntry && existingEntry._id) {
        // Update
        res = await fetch(`${API_BASE}/${existingEntry._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create
        res = await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Failed: ${res.status}`);
      }

      await loadJournals();
      setModalOpen(false);
      setShowConfetti(true);
    } catch (err) {
      console.error("Error saving entry:", err);
      alert("❌ " + err.message);
    }
  };

  // ✅ Delete Entry
  const deleteEntry = async () => {
    const entry = entries[isoDate(selectedDate)];
    if (!entry || !entry._id) {
      alert("No entry found to delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await fetch(`${API_BASE}/${entry._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete journal: ${res.status}`);
      await loadJournals();
      setModalOpen(false);
    } catch (err) {
      console.error("Error deleting journal:", err);
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 md:p-6 relative overflow-hidden">
      {/* Loading */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <p className="text-lg font-medium text-gray-600">⏳ Loading your journals...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-md z-50">
          ⚠️ {error}
        </div>
      )}

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10px",
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            >
              {["🎉", "⭐", "✨", "🎊", "💫"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="📝" label="Total Entries" value={stats.totalEntries} color="pink" />
        <StatCard icon="🔥" label="Day Streak" value={stats.streak} color="purple" />
        <StatCard
          icon={stats.mostFrequentMood?.split(" ")[0] || "🙂"}
          label="Most Frequent Mood"
          value={stats.mostFrequentMood || "None"}
          color="blue"
        />
        <StatCard
          icon="📅"
          label="Current Month"
          value={new Date().toLocaleString("en", { month: "long" })}
          color="green"
        />
      </div>

      {/* Calendar */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-pink-100">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setMonthOffset((m) => m - 1)}
            className="p-3 hover:bg-pink-100 rounded-xl text-2xl transition-all hover:scale-110"
          >
            ←
          </button>
          <h2 className="font-bold text-xl text-gray-800">{monthLabel}</h2>
          <button
            onClick={() => setMonthOffset((m) => m + 1)}
            className="p-3 hover:bg-pink-100 rounded-xl text-2xl transition-all hover:scale-110"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-gray-600 font-semibold py-2">
              {d}
            </div>
          ))}
          {grid.map((day, i) => {
            const entry = entries[isoDate(day.date)];
            const isSelected = isoDate(day.date) === isoDate(selectedDate);
            const isToday = isoDate(day.date) === isoDate(today);
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day.date)}
                className={[
                  "h-14 flex items-center justify-center rounded-xl relative transition-all",
                  isSelected
                    ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg scale-110"
                    : entry
                    ? "bg-green-100 hover:bg-green-200 text-gray-800"
                    : "hover:bg-gray-100",
                  isToday && !isSelected ? "ring-2 ring-pink-400" : "",
                ].join(" ")}
              >
                <span>{day.date.getDate()}</span>
                {entry && <span className="absolute bottom-1 text-xs">{entry.mood.split(" ")[0]}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Entry */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-purple-100 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{formatHumanDate(selectedDate)}</h2>
          <button
            onClick={openModal}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3 rounded-xl hover:shadow-lg"
          >
            {entries[isoDate(selectedDate)] ? "✏️ Edit Entry" : "➕ Write Entry"}
          </button>
        </div>

        {entries[isoDate(selectedDate)] ? (
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {entries[isoDate(selectedDate)].title}
            </h3>
            <p className="mt-2 text-gray-700 whitespace-pre-wrap">
              {entries[isoDate(selectedDate)].content}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Mood: {entries[isoDate(selectedDate)].mood}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 italic">No entry yet for this date.</p>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          mood={mood}
          setMood={setMood}
          saveEntry={saveEntry}
          deleteEntry={deleteEntry}
          close={() => setModalOpen(false)}
          existing={entries[isoDate(selectedDate)]}
        />
      )}

      {/* Confetti Styles */}
      <style>{`
        @keyframes confetti { 
          0% { transform: translateY(0) rotate(0deg); opacity: 1; } 
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-confetti { animation: confetti 3s ease-out forwards; }
      `}</style>
    </div>
  );
}

/* --- Modal Component --- */
function Modal({ title, setTitle, content, setContent, mood, setMood, saveEntry, deleteEntry, close, existing }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">✍️ Journal Entry</h3>
          <button onClick={close} className="text-gray-400 hover:text-gray-600 text-2xl">
            ✕
          </button>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your entry a title..."
          className="w-full border-2 border-pink-200 rounded-xl px-4 py-3 mb-4 text-lg focus:ring-2 focus:ring-pink-500"
        />
        <textarea
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind today?"
          className="w-full border-2 border-pink-200 rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-pink-500 resize-none"
        />

        {/* Mood Picker */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">
            How are you feeling? 💭
          </label>
          <div className="flex flex-wrap gap-3">
            {Moods.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`px-4 py-2 rounded-xl border-2 transition-all ${
                  mood === m
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                    : "bg-white border-gray-300 hover:border-pink-300"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={saveEntry}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg font-semibold"
          >
            💾 {existing ? "Update Entry" : "Save Entry"}
          </button>

          {existing && (
            <button
              onClick={deleteEntry}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg font-semibold"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* --- Helper Functions --- */
const Moods = ["😄 Happy", "😢 Sad", "🙂 Neutral", "😡 Angry", "🤩 Excited"];
const StatCard = ({ icon, label, value, color }) => (
  <div
    className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 border border-${color}-100 hover:scale-105 transition-transform`}
  >
    <div className="text-3xl mb-1">{icon}</div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function isoDate(d) {
  return new Date(d).toISOString().split("T")[0];
}
function buildCalendarGrid(offset = 0) {
  const base = startOfDay(new Date());
  const firstOfMonth = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const monthLabel = firstOfMonth.toLocaleString("default", { month: "long", year: "numeric" });
  const start = new Date(firstOfMonth);
  start.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());
  const grid = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    grid.push({ date: d });
  }
  return { monthLabel, grid };
}
function formatHumanDate(d) {
  return new Date(d).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
