import React, { useState } from 'react';
import { getJSON } from '../utils/api';
import { TrendingUp, TrendingDown, BarChart3, Calendar, DollarSign, Users, ShoppingCart } from 'lucide-react';

export default function AnalyticsPage(){
  const [summary, setSummary] = useState<any>();
  const [trends, setTrends] = useState<any[]>([]);
  const [error, setError] = useState<string|undefined>();
  const [timeRange, setTimeRange] = useState('7');

  React.useEffect(() => {
    Promise.all([
      getJSON(`/analytics/summary`),
      getJSON(`/analytics/trends?days=${timeRange}`)
    ]).then(([s, t]) => { 
      setSummary(s.data ?? s); 
      setTrends((t.data ?? t) as any[]); 
    }).catch(e => setError(e.message));
  }, [timeRange]);

  return (
    <div className="content-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Analytics</h1>
            <p className="page-subtitle">Track your restaurant's performance and growth</p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="timeRange" className="text-sm font-medium text-slate-700">Time Range:</label>
            <select 
              id="timeRange"
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-clean w-40 text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid-responsive mb-8">
          <div className="kpi-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-700" />
              </div>
              <span className="kpi-change positive flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12%
              </span>
            </div>
            <div className="kpi-value">{summary.totalOrders || 0}</div>
            <div className="kpi-label">Total Orders</div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-700" />
              </div>
              <span className="kpi-change positive flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +8%
              </span>
            </div>
            <div className="kpi-value">₹{summary.totalRevenue || 0}</div>
            <div className="kpi-label">Total Revenue</div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-700" />
              </div>
              <span className="kpi-change positive flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +5%
              </span>
            </div>
            <div className="kpi-value">₹{summary.avgOrderValue || 0}</div>
            <div className="kpi-label">Avg Order Value</div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Users className="w-6 h-6 text-amber-700" />
              </div>
              <span className="kpi-change positive flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +15%
              </span>
            </div>
            <div className="kpi-value">{summary.completionRate || 0}%</div>
            <div className="kpi-label">Completion Rate</div>
          </div>
        </div>
      )}

      {/* Trends Chart */}
      <div className="card-minimal card-hover">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Revenue Trends</h2>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>Last {timeRange} days</span>
          </div>
        </div>
        
        {error && (
          <div className="empty-state">
            <p className="text-rose-600 mb-2">{error}</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}
        
        {trends.length > 0 && (
          <div className="space-y-3">
            {trends.map((day: any, index: number) => (
              <div key={day.date || index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-blue-700 truncate">
                      {day.date ? new Date(day.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      }) : `Day ${index + 1}`}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-900 truncate">{day.orders || 0} orders</div>
                    <div className="text-sm text-slate-500 truncate">₹{day.revenue || 0} revenue</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className={`text-sm font-medium ${
                    (day.revenue || 0) > (trends[index - 1]?.revenue || 0) ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {trends[index - 1] ? 
                      ((day.revenue || 0) > (trends[index - 1]?.revenue || 0) ? '↗' : '↘') : 
                      '—'
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {trends.length === 0 && !error && (
          <div className="empty-state">
            <BarChart3 className="empty-state-icon" />
            <p className="empty-state-text">No trend data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
