import React from 'react';
import { Platform } from '../types';
import { getPlatformColor } from '../utils/data';
import { TrendingUp, Users, ShoppingCart, Activity } from 'lucide-react';

interface PlatformPerformanceProps {
  platforms: Platform[];
}

const PlatformPerformance: React.FC<PlatformPerformanceProps> = ({ platforms }) => {
  // Platform logo mapping
  const getPlatformLogo = (platformName: string) => {
    const logos: Record<string, string> = {
      'Zomato': '🍽️',
      'Swiggy': '🛵',
      'UberEats': '🚗',
      'Dunzo': '📦',
      'Zepto': '⚡',
      'Blinkit': '⚡'
    };
    return logos[platformName] || platformName.charAt(0);
  };

  return (
    <div className="card-minimal card-hover">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Platform Performance</h2>
          <p className="text-slate-600">Track performance across all delivery platforms</p>
        </div>
        <button className="btn-primary text-sm px-4 py-2">
          View Details
        </button>
      </div>
      
      <div className="space-y-4">
        {platforms.map((platform) => (
          <div key={platform.name} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`platform-logo ${getPlatformColor(platform.name)}`}>
                  <span className="text-lg">
                    {getPlatformLogo(platform.name)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{platform.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${platform.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                    <span className={`text-sm ${platform.status === 'active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {platform.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm text-slate-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">Orders</span>
                  </div>
                  <div className="text-lg font-semibold text-slate-900">{platform.orders}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm text-slate-600 mb-1">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="font-medium">Revenue</span>
                  </div>
                  <div className="text-lg font-semibold text-slate-900">₹{platform.revenue.toLocaleString()}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm text-slate-600 mb-1">
                    <Activity className="w-4 h-4" />
                    <span className="font-medium">Growth</span>
                  </div>
                  <div className={`text-lg font-semibold flex items-center gap-1 ${
                    platform.change >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${platform.change < 0 ? 'rotate-180' : ''}`} />
                    {platform.change >= 0 ? '+' : ''}{platform.change}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformPerformance;