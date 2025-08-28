import React from 'react';
import KPICard from './KPICard';
import RecentOrders from './RecentOrders';
import PlatformPerformance from './PlatformPerformance';
import { kpis, orders, platforms } from '../utils/data';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your restaurant today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-1">
          <RecentOrders orders={orders.slice(0, 5)} />
        </div>

        {/* Platform Performance */}
        <div className="lg:col-span-1">
          <PlatformPerformance platforms={platforms} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors duration-200">
            <div className="w-8 h-8 bg-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">+</span>
            </div>
            <span className="text-sm font-medium text-blue-900">New Order</span>
          </button>
          
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors duration-200">
            <div className="w-8 h-8 bg-green-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">🍽️</span>
            </div>
            <span className="text-sm font-medium text-green-900">Add Menu Item</span>
          </button>
          
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors duration-200">
            <div className="w-8 h-8 bg-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">📊</span>
            </div>
            <span className="text-sm font-medium text-purple-900">View Reports</span>
          </button>
          
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors duration-200">
            <div className="w-8 h-8 bg-orange-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">⚙️</span>
            </div>
            <span className="text-sm font-medium text-orange-900">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;