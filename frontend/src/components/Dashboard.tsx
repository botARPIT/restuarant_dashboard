import React from 'react';
import KPICard from './KPICard';
import RecentOrders from './RecentOrders';
import PlatformPerformance from './PlatformPerformance';
import { kpis, recentOrders, platforms } from '../utils/data';
import { Plus, UtensilsCrossed, BarChart3, Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="content-container scrollbar-clean">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's what's happening with your restaurant today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid-responsive mb-8">
        {kpis.map((kpi) => (
          <KPICard key={kpi.title} kpi={kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid-2-col mb-8">
        {/* Recent Orders */}
        <div className="lg:col-span-1">
          <RecentOrders orders={recentOrders.slice(0, 5)} />
        </div>

        {/* Platform Performance */}
        <div className="lg:col-span-1">
          <PlatformPerformance platforms={platforms} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-minimal card-hover">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Quick Actions</h2>
          <p className="text-slate-600">Common tasks to help you manage your restaurant efficiently</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors duration-200 border border-blue-200 hover:border-blue-300">
            <div className="w-8 h-8 bg-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-blue-900">New Order</span>
          </button>
          
          <button className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-center transition-colors duration-200 border border-emerald-200 hover:border-emerald-300">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-emerald-900">Add Menu Item</span>
          </button>
          
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors duration-200 border border-purple-200 hover:border-purple-300">
            <div className="w-8 h-8 bg-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-purple-900">View Reports</span>
          </button>
          
          <button className="p-4 bg-amber-50 hover:bg-amber-100 rounded-lg text-center transition-colors duration-200 border border-amber-200 hover:border-amber-300">
            <div className="w-8 h-8 bg-amber-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-amber-900">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;