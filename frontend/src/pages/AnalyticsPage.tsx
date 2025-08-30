import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar, 
  DollarSign, 
  Users, 
  ShoppingCart,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  UtensilsCrossed
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AnalyticsData {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    completionRate: number;
    activeCustomers: number;
    avgPreparationTime: number;
  };
  trends: Array<{
    date: string;
    orders: number;
    revenue: number;
    customers: number;
  }>;
  platformData: Array<{
    name: string;
    orders: number;
    revenue: number;
    percentage: number;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  hourlyData: Array<{
    hour: string;
    orders: number;
    revenue: number;
  }>;
  categoryData: Array<{
    category: string;
    orders: number;
    revenue: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [timeRange, setTimeRange] = useState('7');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    setLoading(true);
    // Simulate API call with comprehensive mock data
    setTimeout(() => {
      const days = parseInt(timeRange);
      const today = new Date();
      
      // Generate comprehensive mock data
      const mockTrends = [];
      const mockHourlyData = [];
      const mockCategoryData = [
        { category: 'Main Course', orders: 45, revenue: 12500 },
        { category: 'Pizza', orders: 32, revenue: 9600 },
        { category: 'Bread', orders: 28, revenue: 2800 },
        { category: 'Rice', orders: 15, revenue: 1200 },
        { category: 'Side Dish', orders: 20, revenue: 2400 },
        { category: 'Dessert', orders: 12, revenue: 1800 }
      ];

      // Generate daily trends
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        mockTrends.push({
          date: date.toISOString().split('T')[0],
          orders: Math.floor(Math.random() * 50) + 20,
          revenue: Math.floor(Math.random() * 2000) + 800,
          customers: Math.floor(Math.random() * 30) + 15
        });
      }

      // Generate hourly data
      for (let hour = 10; hour <= 22; hour++) {
        mockHourlyData.push({
          hour: `${hour}:00`,
          orders: Math.floor(Math.random() * 15) + 5,
          revenue: Math.floor(Math.random() * 800) + 200
        });
      }

      const mockData: AnalyticsData = {
        summary: {
          totalOrders: 1234,
          totalRevenue: 45678,
          avgOrderValue: 37,
          completionRate: 94,
          activeCustomers: 156,
          avgPreparationTime: 18
        },
        trends: mockTrends,
        platformData: [
          { name: 'Zomato', orders: 456, revenue: 18500, percentage: 37 },
          { name: 'Swiggy', orders: 389, revenue: 15200, percentage: 32 },
          { name: 'UberEats', orders: 234, revenue: 9800, percentage: 19 },
          { name: 'Dunzo', orders: 89, revenue: 3200, percentage: 7 },
          { name: 'Zepto', orders: 66, revenue: 978, percentage: 5 }
        ],
        statusDistribution: [
          { status: 'Delivered', count: 580, percentage: 47 },
          { status: 'Preparing', count: 123, percentage: 10 },
          { status: 'Ready', count: 89, percentage: 7 },
          { status: 'Pending', count: 234, percentage: 19 },
          { status: 'Cancelled', count: 208, percentage: 17 }
        ],
        hourlyData: mockHourlyData,
        categoryData: mockCategoryData
      };
      
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="content-container">
        <div className="loading-container">
          <div className="text-center">
            <div className="loading-spinner mb-2"></div>
            <p className="text-slate-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-container">
        <div className="empty-state">
          <p className="text-rose-600 mb-2">{error}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="content-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Analytics</h1>
            <p className="page-subtitle">Track your restaurant's performance and growth</p>
          </div>
          <div className="flex items-center gap-4">
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
          <div className="kpi-value">{data.summary.totalOrders.toLocaleString()}</div>
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
          <div className="kpi-value">{formatCurrency(data.summary.totalRevenue)}</div>
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
          <div className="kpi-value">{formatCurrency(data.summary.avgOrderValue)}</div>
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
          <div className="kpi-value">{data.summary.completionRate}%</div>
          <div className="kpi-label">Completion Rate</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Users className="w-6 h-6 text-indigo-700" />
            </div>
            <span className="kpi-change positive flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +22%
            </span>
          </div>
          <div className="kpi-value">{data.summary.activeCustomers}</div>
          <div className="kpi-label">Active Customers</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-100 rounded-lg">
              <Clock className="w-6 h-6 text-rose-700" />
            </div>
            <span className="kpi-change negative flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              -8%
            </span>
          </div>
          <div className="kpi-value">{data.summary.avgPreparationTime} min</div>
          <div className="kpi-label">Avg Prep Time</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid-2-col mb-8">
        {/* Revenue Trends Chart */}
        <div className="card-minimal card-hover">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Revenue Trends</h2>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="w-4 h-4" />
              <span>Last {timeRange} days</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                tickFormatter={(value) => `₹${value}`}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip 
                formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                labelFormatter={formatDate}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Trends Chart */}
        <div className="card-minimal card-hover">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Orders Trends</h2>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <ShoppingCart className="w-4 h-4" />
              <span>Last {timeRange} days</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip 
                formatter={(value: any) => [value, 'Orders']}
                labelFormatter={formatDate}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform Performance & Status Distribution */}
      <div className="grid-2-col mb-8">
        {/* Platform Performance */}
        <div className="card-minimal card-hover">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Platform Performance</h2>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <BarChart3 className="w-4 h-4" />
              <span>Revenue Share</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.platformData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                type="number"
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                tick={{ fontSize: 12, fill: '#64748b' }}
                width={80}
              />
              <Tooltip 
                formatter={(value: any) => [formatCurrency(value), 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="card-minimal card-hover">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Order Status Distribution</h2>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Package className="w-4 h-4" />
              <span>Status Breakdown</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percentage }) => `${status} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: any) => [value, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Performance & Category Performance */}
      <div className="grid-2-col mb-8">
        {/* Hourly Performance */}
        <div className="card-minimal card-hover">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Hourly Performance</h2>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4" />
              <span>Peak Hours</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="hour" 
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip 
                formatter={(value: any) => [value, 'Orders']}
              />
              <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Performance */}
        <div className="card-minimal card-hover">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Category Performance</h2>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Menu Categories</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.categoryData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                type="number"
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                dataKey="category" 
                type="category"
                tick={{ fontSize: 12, fill: '#64748b' }}
                width={100}
              />
              <Tooltip 
                formatter={(value: any) => [formatCurrency(value), 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="card-minimal card-hover">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Detailed Metrics</h2>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Filter className="w-4 h-4" />
            <span>Performance Breakdown</span>
          </div>
        </div>
        
        <div className="overflow-hidden">
          <table className="table-clean">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Change</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-slate-900">Total Orders</td>
                <td className="font-semibold text-slate-900">{data.summary.totalOrders.toLocaleString()}</td>
                <td className="text-emerald-600">+12%</td>
                <td><TrendingUp className="w-4 h-4 text-emerald-600" /></td>
              </tr>
              <tr>
                <td className="font-medium text-slate-900">Total Revenue</td>
                <td className="font-semibold text-slate-900">{formatCurrency(data.summary.totalRevenue)}</td>
                <td className="text-emerald-600">+8%</td>
                <td><TrendingUp className="w-4 h-4 text-emerald-600" /></td>
              </tr>
              <tr>
                <td className="font-medium text-slate-900">Average Order Value</td>
                <td className="font-semibold text-slate-900">{formatCurrency(data.summary.avgOrderValue)}</td>
                <td className="text-emerald-600">+5%</td>
                <td><TrendingUp className="w-4 h-4 text-emerald-600" /></td>
              </tr>
              <tr>
                <td className="font-medium text-slate-900">Completion Rate</td>
                <td className="font-semibold text-slate-900">{data.summary.completionRate}%</td>
                <td className="text-emerald-600">+2%</td>
                <td><TrendingUp className="w-4 h-4 text-emerald-600" /></td>
              </tr>
              <tr>
                <td className="font-medium text-slate-900">Active Customers</td>
                <td className="font-semibold text-slate-900">{data.summary.activeCustomers}</td>
                <td className="text-emerald-600">+22%</td>
                <td><TrendingUp className="w-4 h-4 text-emerald-600" /></td>
              </tr>
              <tr>
                <td className="font-medium text-slate-900">Avg Preparation Time</td>
                <td className="font-semibold text-slate-900">{data.summary.avgPreparationTime} min</td>
                <td className="text-rose-600">-8%</td>
                <td><TrendingDown className="w-4 h-4 text-rose-600" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
