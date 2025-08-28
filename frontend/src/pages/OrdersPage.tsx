import React, { useState } from 'react';
import { getJSON } from '../utils/api';
import { Search, Filter, Plus, Eye, MoreHorizontal, Clock, Package, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getStatusIcon } from '../utils/data';

type Order = { id: string; customer: string; status: string; totalPrice?: number; price?: number; platform?: string; time?: string; };

export default function OrdersPage(){
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    getJSON<{success:boolean; data: Order[]; pagination?: any}>(`/orders`)
      .then(r => setData(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = data.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.platform?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="content-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Orders</h1>
            <p className="page-subtitle">Manage and track all your restaurant orders</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Order
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-bar">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search orders by ID, customer, or platform..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-clean pl-10 w-full"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card-minimal card-hover">
        {loading && (
          <div className="loading-container">
            <div className="text-center">
              <div className="loading-spinner mb-2"></div>
              <p className="text-slate-600">Loading orders...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="empty-state">
            <p className="text-rose-600 mb-2">{error}</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <div className="overflow-hidden">
            <table className="table-clean">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Platform</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const companyLogo = getCompanyLogo(order.platform || 'Unknown');
                  const StatusIcon = getStatusIcon(order.status);
                  
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors duration-150">
                      <td>
                        <div className="font-medium text-slate-900">#{order.id}</div>
                      </td>
                      <td>
                        <div className="font-medium text-slate-900">{order.customer}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 ${companyLogo.bgColor} rounded-lg flex items-center justify-center shadow-sm`}>
                            <span className={`text-sm font-bold ${companyLogo.textColor}`}>
                              {companyLogo.logo}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-slate-700">{order.platform || 'Unknown'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${
                            order.status === 'delivered' ? 'text-emerald-500' :
                            order.status === 'cancelled' ? 'text-rose-500' :
                            order.status === 'ready' ? 'text-blue-500' :
                            order.status === 'preparing' ? 'text-amber-500' :
                            'text-slate-500'
                          }`} />
                          <span className={`badge-minimal ${
                            order.status === 'completed' || order.status === 'delivered' ? 'badge-success' :
                            order.status === 'pending' ? 'badge-warning' :
                            order.status === 'cancelled' ? 'badge-error' :
                            'badge-info'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold text-slate-900">₹{order.totalPrice ?? order.price ?? 0}</div>
                      </td>
                      <td>
                        <div className="text-sm text-slate-500">{order.time}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <p className="empty-state-text">No orders found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
