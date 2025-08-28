import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  BarChart3, 
  UtensilsCrossed, 
  Users, 
  Bell, 
  Settings,
  TrendingUp
} from 'lucide-react';
import { NavigationItem } from '../types';

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, badge: null },
  { name: 'Orders', href: '/orders', icon: ShoppingCart, badge: '12' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, badge: null },
  { name: 'Menu', href: '/menu', icon: UtensilsCrossed, badge: '3' },
  { name: 'Customers', href: '/customers', icon: Users, badge: null },
  { name: 'Notifications', href: '/notifications', icon: Bell, badge: '5' },
  { name: 'Settings', href: '/settings', icon: Settings, badge: null },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Restaurant</h1>
            <p className="text-sm text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <a
              key={item.name}
              href={item.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className="flex-1 font-medium">{item.name}</span>
              {item.badge && (
                <span className="badge badge-info">
                  {item.badge}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@restaurant.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;