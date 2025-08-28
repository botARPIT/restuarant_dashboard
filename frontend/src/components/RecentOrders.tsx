import React from 'react';
import { Order, getStatusColor, getStatusText, getPlatformIcon, getPlatformColor } from '../utils/data';

interface RecentOrdersProps {
  orders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          Live
        </span>
      </div>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getPlatformColor(order.platform)}`}>
                  {getPlatformIcon(order.platform)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{order.id}</h4>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Time</p>
                <p className="font-medium text-gray-900">{order.time}</p>
              </div>
              <div>
                <p className="text-gray-600">ETA</p>
                <p className="font-medium text-gray-900">{order.eta}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Items</p>
                <p className="font-medium text-gray-900">{order.items.join(', ')}</p>
              </div>
              <div>
                <p className="text-gray-600">Price</p>
                <p className="font-medium text-gray-900">₹{order.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;