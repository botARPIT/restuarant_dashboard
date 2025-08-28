import React, { useState } from 'react';
import { getJSON } from '../utils/api';
import { Search, Filter, Plus, MoreHorizontal } from 'lucide-react';

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

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track all your restaurant orders</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Order
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by ID, customer, or platform..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <button className="btn-outline flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-2">{error}</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <div className="overflow-hidden">
            <table className="table">
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
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td>
                      <div className="font-medium text-gray-900">#{order.id}</div>
                    </td>
                    <td>
                      <div className="font-medium text-gray-900">{order.customer}</div>
                    </td>
                    <td>
                      <span className="badge badge-info">
                        {order.platform || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        order.status === 'completed' ? 'badge-success' :
                        order.status === 'pending' ? 'badge-warning' :
                        order.status === 'cancelled' ? 'badge-error' :
                        'badge-info'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div className="font-semibold text-gray-900">₹{order.totalPrice ?? order.price ?? 0}</div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-500">{order.time}</div>
                    </td>
                    <td>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
