import React from 'react';
import { KPI } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  kpi: KPI;
}

const KPICard: React.FC<KPICardProps> = ({ kpi }) => {
  const isPositive = kpi.changeType === 'positive';
  const changeColor = isPositive ? 'positive' : 'negative';
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="kpi-card-modern">
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50">
          <kpi.icon className="w-7 h-7 text-blue-600" />
        </div>
        <div className="text-right">
          <span className={`kpi-change-modern ${changeColor} flex items-center gap-2`}>
            <ChangeIcon className="w-5 h-5" />
            <span className="text-xs font-bold">{kpi.change}</span>
          </span>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="kpi-value-modern">{kpi.value}</div>
        <div className="kpi-label-modern">{kpi.title}</div>
      </div>
    </div>
  );
};

export default KPICard;