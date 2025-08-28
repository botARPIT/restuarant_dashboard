import React, { useState } from 'react';
import { Search, Filter, Bell, User, Settings, Sparkles, TrendingUp, Menu } from 'lucide-react';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-slate-200/30 px-8 py-6">
      <div className="flex items-center justify-between">
        {/* Left Section - Search and Stats */}
        <div className="flex items-center gap-8">
          {/* Search Bar */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, customers, menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-modern pl-12 w-80 bg-white/60 backdrop-blur-sm"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs font-semibold text-slate-400 bg-slate-100/60 border border-slate-200/60 rounded-lg">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-slate-600 font-medium">Live Orders:</span>
              <span className="text-slate-900 font-bold">12</span>
            </div>
            <div className="w-px h-6 bg-slate-200/60"></div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-slate-600 font-medium">Today:</span>
              <span className="text-slate-900 font-bold">₹24.5K</span>
            </div>
          </div>
        </div>

        {/* Right Section - Actions and User */}
        <div className="flex items-center gap-4">
          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="btn-secondary-modern flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <button className="btn-accent flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Quick Actions</span>
            </button>
          </div>

          {/* Notifications */}
          <button className="relative p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 rounded-xl transition-all duration-300 group">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <span className="text-xs font-bold text-white">5</span>
            </span>
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              New notifications
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
            </div>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <button className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 rounded-xl transition-all duration-300">
              <Settings className="w-5 h-5" />
            </button>
            
            <button className="flex items-center gap-3 p-3 hover:bg-slate-100/60 rounded-xl transition-all duration-300 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">Restaurant Manager</p>
              </div>
              <div className="hidden lg:block w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors duration-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 rounded-xl transition-all duration-300">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <span className="hover:text-slate-700 cursor-pointer transition-colors duration-200">Dashboard</span>
        <span>/</span>
        <span className="text-slate-700 font-medium">Overview</span>
      </div>
    </header>
  );
};

export default Header;