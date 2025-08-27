import React from 'react';
import { navigationItems } from '../utils/data';
import { HelpCircle, LogOut } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-50 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900">RestaurantHub</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                item.current
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${item.current ? 'text-white' : 'text-gray-500'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.current 
                    ? 'bg-white text-primary-600' 
                    : 'bg-primary-100 text-primary-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Help Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Need Help?</span>
          </div>
          <p className="text-xs text-blue-700 mb-3">Check our documentation</p>
          <button className="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors duration-200">
            Support
          </button>
        </div>
        
        <button className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;