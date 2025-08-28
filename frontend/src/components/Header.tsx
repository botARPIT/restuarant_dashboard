import React, { useState } from 'react';
import { Search, Filter, Bell, User, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Section */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, customers, menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          {/* Filter Button */}
          <button className="btn-outline flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <Settings className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;