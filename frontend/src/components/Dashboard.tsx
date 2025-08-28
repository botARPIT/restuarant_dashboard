import React from 'react';
import KPICard from './KPICard';
import RecentOrders from './RecentOrders';
import PlatformPerformance from './PlatformPerformance';
import { kpis, recentOrders, platforms } from '../utils/data';
import { Plus, UtensilsCrossed, BarChart3, Settings, Sparkles } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8 scrollbar-modern">
      {/* Page Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/30">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
              Welcome back!
            </h1>
            <p className="text-xl text-slate-600 mt-2">Here's what's happening with your restaurant today</p>
          </div>
        </div>
        
        {/* Quick Stats Bar */}
        <div className="flex items-center gap-6 p-4 bg-gradient-to-r from-slate-50/50 to-blue-50/30 rounded-2xl border border-slate-200/30">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-slate-600 font-medium">Live Orders:</span>
            <span className="text-slate-900 font-bold text-lg">12</span>
          </div>
          <div className="w-px h-6 bg-slate-200/60"></div>
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Today's Revenue:</span>
            <span className="text-slate-900 font-bold text-lg">₹24,500</span>
          </div>
          <div className="w-px h-6 bg-slate-200/60"></div>
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Completion Rate:</span>
            <span className="text-emerald-600 font-bold text-lg">94%</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {kpis.map((kpi) => (
          <KPICard key={kpi.title} kpi={kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
      <div className="glass-card glass-card-hover">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Quick Actions
            </h2>
            <p className="text-slate-600">Common tasks to help you manage your restaurant efficiently</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <button className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl border border-blue-200/30 hover:border-blue-300/50 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:shadow-xl group-hover:shadow-blue-600/40 transition-all duration-300">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-blue-900">New Order</span>
          </button>
          
          <button className="group p-6 bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 rounded-2xl border border-emerald-200/30 hover:border-emerald-300/50 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:shadow-xl group-hover:shadow-emerald-600/40 transition-all duration-300">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-emerald-900">Add Menu Item</span>
          </button>
          
          <button className="group p-6 bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 rounded-2xl border border-purple-200/30 hover:border-purple-300/50 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:shadow-xl group-hover:shadow-purple-600/40 transition-all duration-300">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-purple-900">View Reports</span>
          </button>
          
          <button className="group p-6 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-2xl border border-amber-200/30 hover:border-amber-300/50 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-amber-600/30 group-hover:shadow-xl group-hover:shadow-amber-600/40 transition-all duration-300">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-amber-900">Settings</span>
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fab">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Dashboard;