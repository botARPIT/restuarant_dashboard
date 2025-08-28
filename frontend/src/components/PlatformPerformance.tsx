import React from 'react';
import { Platform } from '../types';
import { getPlatformColor } from '../utils/data';
import { TrendingUp, Users, ShoppingCart, Activity } from 'lucide-react';

interface PlatformPerformanceProps {
  platforms: Platform[];
}

const PlatformPerformance: React.FC<PlatformPerformanceProps> = ({ platforms }) => {
  return (
    <div className="glass-card glass-card-hover">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Platform Performance
          </h2>
          <p className="text-slate-600">Track performance across all delivery platforms</p>
        </div>
        <button className="btn-modern text-sm px-4 py-2.5">
          View Details
        </button>
      </div>
      
      <div className="space-y-4">
        {platforms.map((platform) => (
          <div key={platform.name} className="group p-6 bg-gradient-to-r from-slate-50/50 to-slate-100/30 rounded-2xl border border-slate-200/30 hover:from-slate-100/60 hover:to-slate-200/40 hover:border-slate-300/50 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${getPlatformColor(platform.name)}`}>
                  <span className="text-white font-bold text-lg">
                    {platform.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{platform.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${platform.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                    <span className={`text-sm font-medium ${platform.status === 'active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {platform.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">Orders</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900">{platform.orders}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="font-medium">Revenue</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900">₹{platform.revenue.toLocaleString()}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                    <Activity className="w-4 h-4" />
                    <span className="font-medium">Growth</span>
                  </div>
                  <div className={`text-xl font-bold flex items-center gap-1 ${
                    platform.change >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    <TrendingUp className={`w-5 h-5 ${platform.change < 0 ? 'rotate-180' : ''}`} />
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