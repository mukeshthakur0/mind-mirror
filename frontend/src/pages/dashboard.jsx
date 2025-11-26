import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  Brain,
  BookOpen,
  Activity,
  Heart,
  Menu,
  X,
  Home,
  Settings,
  User,
  Calendar,
  Smile,
  TrendingUp,
} from "lucide-react";

const USER_ID = "demoUser123";
const API_BASE = "http://localhost:5000/api";

export default function DashboardWithSidebar() {
  const [stats, setStats] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const toggleSidebar = () => setIsOpen(!isOpen);
const [userName, setUserName] = useState("Guest");

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home, link: "/overview" },
    { id: "aibot", label: "AI Bot", icon: Brain, link: "/Chatbot" },
    { id: "journal", label: "Journal", icon: BookOpen, link: "/journal" },
    { id: "mood", label: "Mood Analyzer", icon: Heart, link: "/mood" },
    { id: "analytics", label: "Analytics", icon: Activity, link: "/analytics" },
    { id: "settings", label: "Settings", icon: Settings, link: "/settings" },
    { id: "profile", label: "Profile", icon: User, link: "/profile" },
  ];

  // 🔹 Fetch stats and recent entries dynamically
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch stats
        const statsRes = await fetch(`${API_BASE}/journals/user/${USER_ID}/stats`);
        const statsData = await statsRes.json();

        // Fetch recent journal entries
        const entriesRes = await fetch(`${API_BASE}/journals/user/${USER_ID}`);
        const allEntries = await entriesRes.json();

        const sortedEntries = allEntries
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3); // show 3 latest

        setStats(statsData);
        setRecentEntries(sortedEntries);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // Prefer displayName, fallback to email prefix
      const name = user.displayName || user.email?.split("@")[0] || "User";
      setUserName(name);
    } else {
      setUserName("Guest");
    }
  });
  return () => unsubscribe();
  },
   []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* ✅ Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-slate-800/80 backdrop-blur-lg border-b border-slate-700/50 z-50 flex items-center justify-between px-6 py-3 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden bg-slate-700 text-white p-2 rounded-lg hover:bg-slate-600 transition-all"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-2xl font-bold">Mind Mirror</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-300 text-sm">Welcome back, {userName} 👋</span>
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div onClick={toggleSidebar} className="fixed inset-0 bg-black/50 z-30 lg:hidden" />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-slate-800/95 backdrop-blur-lg border-r border-slate-700/50 p-6 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 mb-8 mt-12">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold">Mind Mirror</h2>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-700/50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 pt-24 p-8">
        {loading && (
          <div className="text-center py-10 text-slate-400">⏳ Loading dashboard...</div>
        )}
        {error && (
          <div className="text-center py-10 text-red-400">⚠️ {error}</div>
        )}

        {!loading && !error && activeTab === "overview" && (
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
              <p className="text-slate-400">
                Here's your current mental wellness summary
              </p>
            </div>

            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  label="Journal Entries"
                  value={stats.totalEntries}
                  icon={<BookOpen className="w-6 h-6" />}
                  color="bg-blue-500"
                />
                <StatCard
                  label="Top Mood"
                  value={stats.mostFrequentMood?.split(" ")[0] || "🙂"}
                  icon={<Smile className="w-6 h-6" />}
                  color="bg-green-500"
                />
                <StatCard
                  label="Day Streak"
                  value={stats.streak}
                  icon={<TrendingUp className="w-6 h-6" />}
                  color="bg-orange-500"
                />
                <StatCard
                  label="Mood Types"
                  value={Object.keys(stats.moodCounts).length}
                  icon={<Heart className="w-6 h-6" />}
                  color="bg-purple-500"
                />
              </div>
            )}

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Entries */}
              <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Recent Journal Entries</h3>
                  <Link to="/journal" className="text-blue-400 hover:text-blue-300 text-sm">
                    View All
                  </Link>
                </div>
                {recentEntries.length === 0 ? (
                  <p className="text-slate-400 italic">
                    No journal entries yet. Start writing!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentEntries.map((entry) => (
                      <div
                        key={entry._id}
                        className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400 text-sm">
                            {new Date(entry.date).toLocaleDateString("en", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                            {entry.mood}
                          </span>
                        </div>
                        <p className="text-slate-300 line-clamp-2">{entry.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/journal"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" /> New Journal Entry
                  </Link>
                  <Link
                    to="/Chatbot"
                    className="w-full bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Brain className="w-5 h-5" /> Chat with AI
                  </Link>
                  <Link
                    to="/mood"
                    className="w-full bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Activity className="w-5 h-5" /> Log Mood
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold">Today's Insight</span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    You’ve been maintaining a consistent journaling habit. Keep it up!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ✅ Reusable StatCard Component */
function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 hover:scale-105 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{value ?? "-"}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  );
}
