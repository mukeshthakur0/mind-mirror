import React, { useState, useMemo, useEffect } from "react";

const USER_ID = "demoUser123"; // replace when you add auth
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

  useEffect(() => {
    loadJournals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadJournals = async () => {
    try {
      setLoading(true);
      setError(null);

      // fetch user journals
      const res = await fetch(`${API_BASE}/user/${USER_ID}`);
      if (!res.ok) throw new Error(`Failed to load journals: ${res.statusText}`);
      const data = await res.json();

      const mapped = {};
      data.forEach((j) => (mapped[isoDate(j.date)] = j));
      setEntries(mapped);

      // fetch stats
      const statsRes = await fetch(`${API_BASE}/user/${USER_ID}/stats`);
      if (statsRes.ok) {
        const s = await statsRes.json();
        setStats(s);
      }
    } catch (err) {
      console.error("Error loading journals:", err);
      setError(err.message || "Failed to load journals");
      setEntries({});
    } finally {
      setLoading(false);
    }
  };

  const { monthLabel, grid } = useMemo(() => buildCalendarGrid(monthOffset), [monthOffset]);

  // build allEntries (used in sidebar)
  const allEntries = Object.values(entries)
    .filter((entry) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (entry.title && entry.title.toLowerCase().includes(q)) ||
        (entry.content && entry.content.toLowerCase().includes(q));
      const matchesMood = filterMood === "All" || entry.mood === filterMood;
      return matchesSearch && matchesMood;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showConfetti]);

  const openModal = () => {
    const entry = entries[isoDate(selectedDate)];
    setTitle(entry?.title || "");
    setContent(entry?.content || "");
    setMood(entry?.mood || "🙂 Neutral");
    setModalOpen(true);
  };

  // Save (create or update)
  const saveEntry = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) {
      alert("Title & content are required");
      return;
    }

    const selectedKey = isoDate(selectedDate);
    const existing = entries[selectedKey];

    const payload = {
      userId: USER_ID,
      title: trimmedTitle,
      content: trimmedContent,
      mood,
      date: new Date(isoDate(selectedDate)),
    };

    try {
      let res;
      if (existing && existing._id) {
        res = await fetch(`${API_BASE}/${existing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error((body && (body.error || body.message)) || `Save failed: ${res.status}`);
      }

      await loadJournals();
      setModalOpen(false);
      setShowConfetti(true);
    } catch (err) {
      console.error("Error saving entry:", err);
      alert("❌ " + (err.message || "Failed to save"));
    }
  };

  const deleteEntry = async () => {
    const entry = entries[isoDate(selectedDate)];
    if (!entry || !entry._id) {
      alert("No entry to delete");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await fetch(`${API_BASE}/${entry._id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error((body && body.error) || `Delete failed: ${res.status}`);
      }
      await loadJournals();
      setModalOpen(false);
    } catch (err) {
      console.error("Error deleting entry:", err);
      alert("❌ " + (err.message || "Failed to delete"));
    }
  };

  const totalEntries = Object.keys(entries).length;
  const moodCounts = Object.values(entries).reduce((acc, e) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 md:p-6 relative overflow-hidden">
      {/* loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg">⏳ Loading...</div>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md z-50">
          ⚠️ {error} <button onClick={() => setError(null)} className="ml-3">✕</button>
        </div>
      )}

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1.5 + Math.random() * 2}s`,
              }}
            >
              {["🎉", "✨", "⭐", "🎊", "💫"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 rounded-2xl p-4 shadow">{/* Total entries */}
            <div className="text-2xl font-bold">{totalEntries}</div>
            <div className="text-sm text-gray-600">Total Entries</div>
          </div>
          <div className="bg-white/80 rounded-2xl p-4 shadow">{/* Streak */}
            <div className="text-2xl font-bold">{stats.streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="bg-white/80 rounded-2xl p-4 shadow">{/* Top mood */}
            <div className="text-2xl font-bold">{stats.mostFrequentMood?.split(" ")[0] || "🙂"}</div>
            <div className="text-sm text-gray-600">Top Mood</div>
          </div>
          <div className="bg-white/80 rounded-2xl p-4 shadow">{/* Month */}
            <div className="text-2xl font-bold">{new Date().toLocaleString("en", { month: "long" })}</div>
            <div className="text-sm text-gray-600">Current Month</div>
          </div>
        </div>

        {/* Grid layout: calendar + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar & Selected */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">📔 My Journal</h1>
              <div className="flex gap-2">
                <button onClick={() => { setMonthOffset(0); setSelectedDate(today); }} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl">Today</button>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white/80 rounded-3xl p-6 shadow">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => setMonthOffset((m) => m - 1)} className="p-2">←</button>
                <div className="font-bold">{monthLabel}</div>
                <button onClick={() => setMonthOffset((m) => m + 1)} className="p-2">→</button>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="text-gray-600">{d}</div>)}
                {grid.map((day, i) => {
                  const entry = entries[isoDate(day.date)];
                  const isSelected = isoDate(day.date) === isoDate(selectedDate);
                  const isToday = isoDate(day.date) === isoDate(today);
                  return (
                    <button key={i} onClick={() => setSelectedDate(day.date)}
                      className={[
                        "h-14 flex items-center justify-center rounded-xl relative transition",
                        isSelected ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white" : entry ? "bg-green-100" : "hover:bg-gray-100",
                        isToday && !isSelected ? "ring-2 ring-pink-400" : ""
                      ].join(" ")}>
                      <span>{day.date.getDate()}</span>
                      {entry && <span className="absolute bottom-1 text-xs">{entry.mood.split(" ")[0]}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Entry */}
            <div className="bg-white/80 rounded-3xl p-6 shadow">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">{formatHumanDate(selectedDate)}</h2>
                  {entries[isoDate(selectedDate)] && (
                    <p className="text-xs text-gray-500 mt-1">Created {new Date(entries[isoDate(selectedDate)].createdAt).toLocaleTimeString()}</p>
                  )}
                </div>
                <button onClick={openModal} className="px-4 py-2 bg-blue-500 text-white rounded-xl">
                  {entries[isoDate(selectedDate)] ? "✏️ Edit" : "➕ Write"}
                </button>
              </div>

              {entries[isoDate(selectedDate)] ? (
                <>
                  <h3 className="text-2xl font-bold">{entries[isoDate(selectedDate)].title}</h3>
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">{entries[isoDate(selectedDate)].content}</p>
                  <p className="mt-4 text-sm text-gray-500">Mood: {entries[isoDate(selectedDate)].mood}</p>
                </>
              ) : (
                <div className="text-gray-400 italic">No entry for this day. Click Write to create one.</div>
              )}
            </div>
          </div>

          {/* Sidebar: search, filters, list */}
          <div className="bg-white/80 rounded-3xl p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">📚 All Entries</h3>
            </div>

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search entries..."
              className="w-full border rounded-xl px-4 py-2 mb-3"
            />

            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <button onClick={() => setFilterMood("All")} className={`px-3 py-1 rounded-lg ${filterMood === "All" ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" : "bg-gray-100"}`}>All</button>
              {Moods.map((m) => (
                <button key={m} onClick={() => setFilterMood(m)} className={`px-3 py-1 rounded-lg ${filterMood === m ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" : "bg-gray-100"}`}>
                  {m.split(" ")[0]}
                </button>
              ))}
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {allEntries.length === 0 && <div className="text-center text-gray-400 italic py-8">No entries found</div>}
              {allEntries.map((entry) => (
                <button key={entry._id} onClick={() => setSelectedDate(new Date(entry.date))} className="w-full text-left p-4 rounded-xl bg-gradient-to-br from-white to-pink-50 border">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold">{entry.title}</span>
                    <span className="text-2xl">{entry.mood.split(" ")[0]}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{entry.content}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                    <span className="text-xs bg-purple-100 px-2 py-1 rounded-full text-purple-700">{entry.mood.split(" ")[1] || ""}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal component */}
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

      <style>{`
        @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1 } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0 } }
        .animate-confetti { animation: confetti 3s ease-out forwards; }
      `}</style>
    </div>
  );
}

/* Modal component */
function Modal({ title, setTitle, content, setContent, mood, setMood, saveEntry, deleteEntry, close, existing }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">✍️ Journal Entry</h3>
          <button onClick={close} className="text-gray-400">✕</button>
        </div>

        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full border rounded-xl px-4 py-2 mb-3" />
        <textarea rows={7} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write..." className="w-full border rounded-xl px-4 py-2 mb-3"></textarea>

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">How are you feeling?</div>
          <div className="flex gap-2">
            {Moods.map((m) => (
              <button key={m} onClick={() => setMood(m)} className={`px-3 py-2 rounded-lg ${mood === m ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" : "bg-white border"}`}>{m}</button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={saveEntry} className="flex-1 bg-green-500 text-white px-4 py-2 rounded-xl">{existing ? "Update Entry" : "Save Entry"}</button>
          {existing && <button onClick={deleteEntry} className="bg-red-500 text-white px-4 py-2 rounded-xl">Delete</button>}
        </div>
      </div>
    </div>
  );
}

/* helpers */
const Moods = ["😄 Happy", "😢 Sad", "🙂 Neutral", "😡 Angry", "🤩 Excited"];
function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function isoDate(d) { if (!d) return ""; const dt = new Date(d); if (isNaN(dt)) return ""; return dt.toISOString().split("T")[0]; }
function buildCalendarGrid(offset = 0) {
  const base = startOfDay(new Date());
  const firstOfMonth = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const monthLabel = firstOfMonth.toLocaleString("default", { month: "long", year: "numeric" });
  const start = new Date(firstOfMonth); start.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());
  const grid = [];
  for (let i = 0; i < 42; i++) { const d = new Date(start); d.setDate(start.getDate() + i); grid.push({ date: d }); }
  return { monthLabel, grid };
}
function formatHumanDate(d) { return new Date(d).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }); }
