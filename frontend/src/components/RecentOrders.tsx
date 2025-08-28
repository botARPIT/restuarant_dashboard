import React from 'react';
import { Order } from '../types';
import { getStatusColor, getPlatformColor } from '../utils/data';
import { Clock, MapPin } from 'lucide-react';

interface RecentOrdersProps {
  orders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
        <button className="btn-outline text-sm">View All</button>
      </div>
      
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
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td>
                  <div className="font-medium text-gray-900">#{order.id}</div>
                </td>
                <td>
                  <div className="font-medium text-gray-900">{order.customer}</div>
                </td>
                <td>
                  <span className={`badge ${getPlatformColor(order.platform)}`}>
                    {order.platform}
                  </span>
                </td>
                <td>
                  <div className="flex items-center">
                    <span className={`status-dot ${getStatusColor(order.status)}`}></span>
                    <span className="text-sm font-medium text-gray-700">{order.status}</span>
                  </div>
                </td>
                <td>
                  <div className="font-semibold text-gray-900">₹{order.totalPrice || order.price || 0}</div>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {order.time}
                  </div>
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