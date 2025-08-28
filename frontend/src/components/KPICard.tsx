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
    <div className="kpi-card">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-100 rounded-lg">
          <kpi.icon className="w-6 h-6 text-slate-700" />
        </div>
        <div className="text-right">
          <span className={`kpi-change ${changeColor} flex items-center gap-1`}>
            <ChangeIcon className="w-4 h-4" />
            <span className="text-xs">{kpi.change}</span>
          </span>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="kpi-value">{kpi.value}</div>
        <div className="kpi-label">{kpi.title}</div>
      </div>
    </div>
  );
};

export default KPICard;