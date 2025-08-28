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
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your restaurant's performance and growth</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="input w-32"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="kpi-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
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
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
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
              <div className="p-2 bg-purple-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
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
              <div className="p-2 bg-orange-50 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
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
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Revenue Trends</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Last {timeRange} days</span>
          </div>
        </div>
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">{error}</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}
        
        {trends.length > 0 && (
          <div className="space-y-4">
            {trends.map((day: any, index: number) => (
              <div key={day.date || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{day.date || `Day ${index + 1}`}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{day.orders || 0} orders</div>
                    <div className="text-sm text-gray-500">₹{day.revenue || 0} revenue</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    (day.revenue || 0) > (trends[index - 1]?.revenue || 0) ? 'text-green-600' : 'text-red-600'
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
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No trend data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
