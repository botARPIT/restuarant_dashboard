import React from 'react';
import { Platform } from '../types';
import { getPlatformColor } from '../utils/data';
import { TrendingUp, Users, ShoppingCart } from 'lucide-react';

interface PlatformPerformanceProps {
  platforms: Platform[];
}

const PlatformPerformance: React.FC<PlatformPerformanceProps> = ({ platforms }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Platform Performance</h2>
        <button className="btn-outline text-sm">View Details</button>
      </div>
      
      <div className="space-y-4">
        {platforms.map((platform) => (
          <div key={platform.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPlatformColor(platform.name)}`}>
                <span className="text-white font-semibold text-sm">
                  {platform.icon}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{platform.name}</h3>
                <p className="text-sm text-gray-500">{platform.status === 'active' ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Orders</span>
                </div>
                <div className="font-semibold text-gray-900">{platform.orders}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Revenue</span>
                </div>
                <div className="font-semibold text-gray-900">₹{platform.revenue}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>Growth</span>
                </div>
                <div className={`font-semibold ${platform.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {platform.change >= 0 ? '+' : ''}{platform.change}%
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