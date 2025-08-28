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
  Menu,
  X
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
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-900">Restaurant</h1>
              <p className="text-sm text-slate-500">Dashboard</p>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
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
              className={`nav-link-clean group ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className={`p-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <>
                  <span className="flex-1 font-medium">{item.name}</span>
                  {item.badge && (
                    <span className="badge-minimal badge-info">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </a>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-200">
        <div className={`${isCollapsed ? 'justify-center' : ''} flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200`}>
          <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-medium text-sm">A</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@restaurant.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;