import React from 'react';
import { Platform } from '../types';
import { getPlatformColor } from '../utils/data';
import { TrendingUp, Users, ShoppingCart, Activity, ExternalLink } from 'lucide-react';

interface PlatformPerformanceProps {
  platforms: Platform[];
}

const PlatformPerformance: React.FC<PlatformPerformanceProps> = ({ platforms }) => {
  // Company logo mapping with proper colors
  const getCompanyLogo = (platformName: string) => {
    const logos: Record<string, { logo: string; bgColor: string; textColor: string }> = {
      'Zomato': { logo: 'Z', bgColor: 'bg-red-500', textColor: 'text-white' },
      'Swiggy': { logo: 'S', bgColor: 'bg-orange-500', textColor: 'text-white' },
      'UberEats': { logo: 'U', bgColor: 'bg-black', textColor: 'text-white' },
      'Dunzo': { logo: 'D', bgColor: 'bg-purple-500', textColor: 'text-white' },
      'Zepto': { logo: 'Z', bgColor: 'bg-blue-500', textColor: 'text-white' },
      'Blinkit': { logo: 'B', bgColor: 'bg-green-500', textColor: 'text-white' }
    };
    return logos[platformName] || { logo: platformName.charAt(0), bgColor: 'bg-slate-500', textColor: 'text-white' };
  };

  const handleViewAll = () => {
    // Navigate to a platforms overview page or create a modal
    window.location.href = '/analytics?tab=platforms';
  };

  const handleViewDetails = (platformName: string) => {
    // Navigate to platform-specific analytics or create a modal
    window.location.href = `/analytics?platform=${platformName.toLowerCase()}`;
  };

  return (
    <div className="card-minimal card-hover">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Platform Performance</h2>
          <p className="text-slate-600">Track performance across all delivery platforms</p>
        </div>
        <button 
          onClick={handleViewAll}
          className="btn-primary text-sm px-4 py-2 flex items-center gap-2 hover:bg-slate-700 transition-colors duration-200"
        >
          <span>View All</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        {platforms.map((platform) => {
          const companyLogo = getCompanyLogo(platform.name);
          
          return (
            <div key={platform.name} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${companyLogo.bgColor} rounded-lg flex items-center justify-center shadow-sm`}>
                    <span className={`text-lg font-bold ${companyLogo.textColor}`}>
                      {companyLogo.logo}
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
                  
                  <button 
                    onClick={() => handleViewDetails(platform.name)}
                    className="btn-secondary text-xs px-3 py-1.5 hover:bg-slate-100 transition-colors duration-200"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformPerformance;