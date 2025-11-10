import React, { useState } from 'react';
import { Brain, BookOpen, Activity, Heart, Menu, X, Home, Settings, User } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'aibot', label: 'AI Bot', icon: Brain },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'mood', label: 'Mood Analyzer', icon: Heart },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-slate-800 text-white p-3 rounded-lg shadow-lg hover:bg-slate-700 transition-all"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

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
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Mind Mirror</h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false); // Close sidebar on mobile after selection
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">JD</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">John Doe</p>
                <p className="text-slate-400 text-xs">Premium Member</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Demo */}
      <div className="lg:ml-64 p-8 pt-20 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h2>
            <p className="text-slate-400">
              This is the content area for {menuItems.find(item => item.id === activeTab)?.label}.
              The sidebar is fully responsive and can be toggled on mobile devices.
            </p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-slate-700/30 rounded-lg p-6 hover:bg-slate-700/50 transition-all">
                  <h3 className="text-white font-semibold mb-2">Card {item}</h3>
                  <p className="text-slate-400 text-sm">Sample content card</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}