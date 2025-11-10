import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';

export default function DashboardWithSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home, link: '/overview' },
    { id: 'aibot', label: 'AI Bot', icon: Brain, link: '/aibot' },
    { id: 'journal', label: 'Journal', icon: BookOpen, link: '/journal' },
    { id: 'mood', label: 'Mood Analyzer', icon: Heart, link: '/mood' },
    { id: 'analytics', label: 'Analytics', icon: Activity, link: '/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, link: '/settings' },
    { id: 'profile', label: 'Profile', icon: User, link: '/profile' },
  ];

  const stats = [
    { label: 'Journal Entries', value: '24', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Mood Score', value: '7.2', icon: Smile, color: 'bg-green-500' },
    { label: 'AI Sessions', value: '12', icon: Brain, color: 'bg-purple-500' },
    { label: 'Streak Days', value: '15', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const recentEntries = [
    { date: '2025-11-09', mood: 'Happy', excerpt: 'Had a great day at work...' },
    { date: '2025-11-08', mood: 'Calm', excerpt: 'Spent time reading and...' },
    { date: '2025-11-07', mood: 'Anxious', excerpt: 'Feeling a bit overwhelmed...' },
  ];

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
          <span className="text-slate-300 text-sm">Welcome back, John Doe 👋</span>
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-slate-800/95 backdrop-blur-lg border-r border-slate-700/50 p-6 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 mt-12">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold">Mind Mirror</h2>
        </div>

        {/* Navigation */}
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
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Profile section */}
        
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 pt-24 p-8">
        {activeTab === 'overview' && (
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
              <p className="text-slate-400">Here's your current mental wellness summary</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 hover:scale-105 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Entries */}
              <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Recent Journal Entries</h3>
                  <button className="text-blue-400 hover:text-blue-300 text-sm">View All</button>
                </div>
                <div className="space-y-4">
                  {recentEntries.map((entry, index) => (
                    <div
                      key={index}
                      className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">{entry.date}</span>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                          {entry.mood}
                        </span>
                      </div>
                      <p className="text-slate-300">{entry.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                    <BookOpen className="w-5 h-5" /> New Journal Entry
                  </button>
                  <button className="w-full bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-600 transition-all flex items-center justify-center gap-2">
                    <Brain className="w-5 h-5" /> Chat with AI
                  </button>
                  <button className="w-full bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-600 transition-all flex items-center justify-center gap-2">
                    <Activity className="w-5 h-5" /> Log Mood
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold">Today's Insight</span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    You've been maintaining a consistent journaling habit. Keep it up!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Tab Pages */}
        {activeTab !== 'overview' && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-4">
                {menuItems.find((item) => item.id === activeTab)?.label}
              </h2>
              <p className="text-slate-400 mb-6">
                This is the content for {menuItems.find((item) => item.id === activeTab)?.label}.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-slate-700/30 rounded-lg p-6 hover:bg-slate-700/50 transition-all">
                    <h3 className="font-semibold mb-2">Card {item}</h3>
                    <p className="text-slate-400 text-sm">Sample content for this section</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
