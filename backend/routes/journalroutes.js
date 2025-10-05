import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Save,
  X,
  Sparkles,
  NotebookPen,
} from "lucide-react";

export default function JournalPage({ userId, apiBaseUrl = "http://localhost:5000" }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [entries, setEntries] = useState({});
  const [allEntries, setAllEntries] = useState([]); // ✅ All journals of user
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("🙂 Neutral");
  const today = startOfDay(new Date());

  // Build calendar grid
  const { monthLabel, grid } = useMemo(
    () => buildCalendarGrid(monthOffset),
    [monthOffset]
  );

  // ✅ Fetch all entries of user (for list view)
  useEffect(() => {
    if (!userId) return;
    fetch(`${apiBaseUrl}/api/journals/user/${userId}`)
      .then((r) => r.json())
      .then((data) => {
        setAllEntries(data);
        const map = {};
        data.forEach((entry) => {
          const d = isoDate(entry.date);
          if (d) map[d] = entry; // only map valid dates
        });
        setEntries(map);
      })
      .catch(() => {});
  }, [userId, apiBaseUrl]);

  // ✅ Open modal for add/edit
  const openModal = () => {
    const entry = entries[isoDate(selectedDate)];
    setTitle(entry?.title || "");
    setContent(entry?.content || "");
    setMood(entry?.mood || "🙂 Neutral");
    setModalOpen(true);
  };

  // ✅ Save entry
  const saveEntry = async () => {
    const body = {
      userId,
      date: isoDate(selectedDate),
      title: title.trim(),
      content: content.trim(),
      mood,
    };
    if (!body.title || !body.content) return alert("Title & content required");

    const existing = entries[isoDate(selectedDate)];
    let res;
    if (existing?._id) {
      res = await fetch(`${apiBaseUrl}/api/journals/${existing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      res = await fetch(`${apiBaseUrl}/api/journals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    const saved = await res.json();

    // update both state stores
    const d = isoDate(saved.date);
    if (!d) return;

    setEntries((prev) => ({ ...prev, [d]: saved }));
    setAllEntries((prev) => {
      const filtered = prev.filter((e) => e._id !== saved._id);
      return [saved, ...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* -------- Calendar + Selected Entry -------- */}
        <div className="md:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <NotebookPen className="w-6 h-6 text-pink-500" /> Journal
            </h1>
            <button
              onClick={() => {
                setMonthOffset(0);
                setSelectedDate(today);
              }}
              className="bg-pink-500 text-white px-4 py-2 rounded-xl hover:bg-pink-600 transition"
            >
              Today
            </button>
          </div>

          {/* Calendar */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setMonthOffset((m) => m - 1)}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <ChevronLeft />
              </button>
              <h2 className="font-semibold text-lg">{monthLabel}</h2>
              <button
                onClick={() => setMonthOffset((m) => m + 1)}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <ChevronRight />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                <div key={d} className="text-gray-500 font-medium">{d}</div>
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
                      "h-12 flex items-center justify-center rounded-xl relative transition",
                      isSelected ? "bg-pink-500 text-white shadow-lg" : "hover:bg-gray-100"
                    ].join(" ")}
                  >
                    {day.date.getDate()}
                    {isToday && (
                      <Sparkles className="w-3 h-3 absolute top-1 right-1 text-yellow-400" />
                    )}
                    {entry && (
                      <span className="absolute bottom-1 w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Entry */}
          <div className="bg-white/70 rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">
                {formatHumanDate(selectedDate)}
              </h2>
              <button
                onClick={openModal}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                {entries[isoDate(selectedDate)] ? "Edit Entry" : "Add Entry"}
              </button>
            </div>

            {entries[isoDate(selectedDate)] ? (
              <div>
                <h3 className="text-gray-800 font-medium">
                  {entries[isoDate(selectedDate)].title}
                </h3>
                <p className="text-gray-600 mt-1 whitespace-pre-wrap">
                  {entries[isoDate(selectedDate)].content}
                </p>
                <span className="inline-block mt-3 px-3 py-1 text-sm rounded-xl bg-gray-200">
                  {entries[isoDate(selectedDate)].mood}
                </span>
              </div>
            ) : (
              <p className="text-gray-400 italic">No entry yet.</p>
            )}
          </div>
        </div>

        {/* -------- Side Panel: All Entries -------- */}
        <div className="bg-white/70 rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">My Entries</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {allEntries.length === 0 && (
              <p className="text-gray-400 italic">No entries yet.</p>
            )}
            {allEntries.map((entry) => (
              <button
                key={entry._id}
                onClick={() => {
                  if (entry.date) setSelectedDate(new Date(entry.date));
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{entry.title}</span>
                  <span className="text-sm text-gray-500">
                    {entry.date
                      ? new Date(entry.date).toLocaleDateString()
                      : "No date"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{entry.content}</p>
                <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-lg bg-gray-200">
                  {entry.mood}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* -------- Modal -------- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Journal Entry</h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title..."
              className="w-full border rounded-xl px-3 py-2 mb-3"
            />
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts..."
              className="w-full border rounded-xl px-3 py-2 mb-3"
            />
            {/* Mood Picker */}
            <div className="flex gap-2 mb-4">
              {Moods.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`px-3 py-1 rounded-xl border ${
                    mood === m ? "bg-blue-600 text-white" : "bg-gray-100"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <button
              onClick={saveEntry}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
            >
              <Save className="w-4 h-4" /> Save Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------- Helpers -----------------
const Moods = ["😄 Happy", "😢 Sad", "🙂 Neutral", "😡 Angry", "🤩 Excited"];

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

// ✅ Safe isoDate
function isoDate(d) {
  if (!d) return "";
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return "";
  return dateObj.toISOString().split("T")[0];
}

function formatHumanDate(d) {
  if (!d || isNaN(new Date(d).getTime())) return "Invalid date";
  return new Date(d).toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function addMonths(date, count) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + count);
  return d;
}

function buildCalendarGrid(offset = 0) {
  const base = startOfDay(new Date());
  const firstOfMonth = new Date(
    addMonths(base, offset).getFullYear(),
    addMonths(base, offset).getMonth(),
    1
  );
  const monthName = firstOfMonth.toLocaleString(undefined, { month: "long" });
  const year = firstOfMonth.getFullYear();
  const monthLabel = `${monthName} ${year}`;

  const startWeekday = firstOfMonth.getDay();
  const grid = [];
  const start = new Date(firstOfMonth);
  start.setDate(firstOfMonth.getDate() - startWeekday);

  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    grid.push({ date: d });
  }
  return { monthLabel, grid };
}
4