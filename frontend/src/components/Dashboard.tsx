import React from 'react';
import { kpis, recentOrders, platforms } from '../utils/data';
import KPICard from './KPICard';
import RecentOrders from './RecentOrders';
import PlatformPerformance from './PlatformPerformance';

const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {kpis.map((kpi) => (
          <KPICard key={kpi.title} kpi={kpi} />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <RecentOrders orders={recentOrders} />
        <PlatformPerformance platforms={platforms} />
      </div>
    </div>
  );
};

export default Dashboard;