import React from 'react';
import { TrendingUp, TrendingDown, CheckCircle, AlertCircle } from 'lucide-react';
import { Platform } from '../types';

interface PlatformPerformanceProps {
  platforms: Platform[];
}

const PlatformPerformance: React.FC<PlatformPerformanceProps> = ({ platforms }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Performance</h3>
      
      <div className="space-y-4">
        {platforms.map((platform) => (
          <div key={platform.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold ${platform.color}`}>
                {platform.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{platform.name}</h4>
                <div className="flex items-center space-x-2">
                  {platform.status === 'active' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs ${
                    platform.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {platform.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-600">
                <p>{platform.orders} orders today</p>
                <p className="font-medium text-gray-900">₹{platform.revenue.toLocaleString()}</p>
              </div>
              
              {platform.status === 'active' && (
                <div className="flex items-center space-x-1 mt-2">
                  {platform.change > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : platform.change < 0 ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : null}
                  <span className={`text-xs ${
                    platform.change > 0 ? 'text-green-600' : 
                    platform.change < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {platform.change > 0 ? '+' : ''}{platform.change}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformPerformance;