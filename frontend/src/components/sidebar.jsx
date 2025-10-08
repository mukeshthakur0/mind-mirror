import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Bot, BookOpen, Activity } from "lucide-react";

function Sidebar() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow-lg p-4 flex flex-col">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2 mb-8">
          <LayoutDashboard className="w-6 h-6" /> Mind Mirror
        </h2>

        <nav className="flex flex-col gap-4">
          {/* AI Bot Section */}
          <Link
            to="/ai"   // <-- make sure this matches your Route path
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-100 transition"
          >
            <Bot className="w-5 h-5 text-blue-500" /> AI Bot
          </Link>

          {/* Journal Section */}
          <Link
            to="/journal"   // <-- make sure this matches your Route path
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-100 transition"
          >
            <BookOpen className="w-5 h-5 text-green-500" /> Journal
          </Link>

          {/* Mood Analyzer Section */}
          <Link
            to="/mood"   // <-- make sure this matches your Route path
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-100 transition"
          >
            <Activity className="w-5 h-5 text-purple-500" /> Mood Analyzer
          </Link>
        </nav>
      </aside>
    </div>
  );
}

export default Sidebar;
