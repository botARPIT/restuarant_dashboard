import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  BarChart3, 
  UtensilsCrossed, 
  Users, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Menu
} from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Menu', href: '/menu', icon: UtensilsCrossed },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname === href;
  };

  return (
    <div className={`bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex-shrink-0 relative z-30`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-slate-900">Restaurant</span>
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Today's Orders</span>
              <span className="font-semibold text-slate-900">24</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Revenue</span>
              <span className="font-semibold text-emerald-600">₹8,450</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Growth</span>
              <span className="flex items-center gap-1 text-emerald-600">
                <TrendingUp className="w-3 h-3" />
                +12%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      <div className="lg:hidden">
        {/* Mobile menu button */}
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}