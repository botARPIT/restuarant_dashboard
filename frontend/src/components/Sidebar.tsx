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
  Sparkles,
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
    <div className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl shadow-slate-200/30 flex flex-col transition-all duration-500 ease-in-out`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Restaurant
              </h1>
              <p className="text-sm text-slate-500 font-medium">Dashboard Pro</p>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/60 rounded-xl transition-all duration-300"
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
              className={`nav-link-modern ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100/60'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <>
                  <span className="flex-1 font-semibold">{item.name}</span>
                  {item.badge && (
                    <span className="badge-modern badge-info-modern">
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
      <div className="p-4 border-t border-slate-200/30">
        <div className={`${isCollapsed ? 'justify-center' : ''} flex items-center gap-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl border border-slate-200/30`}>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@restaurant.com</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="lg:hidden p-4">
        <button className="w-full btn-modern">
          <span className="flex items-center gap-2 justify-center">
            <Sparkles className="w-4 h-4" />
            {!isCollapsed && <span>Quick Actions</span>}
          </button>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;