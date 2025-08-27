import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { KPI } from '../types';

interface KPICardProps {
  kpi: KPI;
}

const KPICard: React.FC<KPICardProps> = ({ kpi }) => {
  const Icon = kpi.icon;
  
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
        </div>
        <div className={`p-3 rounded-lg ${
          kpi.changeType === 'positive' ? 'bg-green-100' : 
          kpi.changeType === 'negative' ? 'bg-red-100' : 'bg-gray-100'
        }`}>
          <Icon className={`w-6 h-6 ${
            kpi.changeType === 'positive' ? 'text-green-600' : 
            kpi.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
          }`} />
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-1">
        {kpi.changeType === 'positive' ? (
          <TrendingUp className="w-4 h-4 text-green-500" />
        ) : kpi.changeType === 'negative' ? (
          <TrendingDown className="w-4 h-4 text-red-500" />
        ) : null}
        <span className={`text-sm ${
          kpi.changeType === 'positive' ? 'text-green-600' : 
          kpi.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {kpi.change}
        </span>
      </div>
    </div>
  );
};

export default KPICard;