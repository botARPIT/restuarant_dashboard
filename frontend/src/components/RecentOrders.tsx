import React from 'react';
import { Order } from '../types';
import { getStatusColor, getPlatformColor } from '../utils/data';
import { Clock, Eye } from 'lucide-react';

interface RecentOrdersProps {
  orders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  return (
    <div className="card-minimal card-hover">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Recent Orders</h2>
          <p className="text-slate-600">Latest customer orders and their status</p>
        </div>
        <button className="btn-primary text-sm px-4 py-2">
          View All
        </button>
      </div>
      
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
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors duration-150">
                <td>
                  <div className="font-medium text-slate-900">#{order.id}</div>
                </td>
                <td>
                  <div className="font-medium text-slate-900">{order.customer}</div>
                </td>
                <td>
                  <span className={`badge-minimal ${getPlatformColor(order.platform)}`}>
                    {order.platform}
                  </span>
                </td>
                <td>
                  <div className="flex items-center">
                    <span className={`status-dot ${getStatusColor(order.status)}`}></span>
                    <span className="text-sm font-medium text-slate-700 capitalize">{order.status}</span>
                  </div>
                </td>
                <td>
                  <div className="font-semibold text-slate-900">₹{order.totalPrice || order.price || 0}</div>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    {order.time}
                  </div>
                </td>
                <td>
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;