import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { getStatusColor, getPlatformColor, getStatusIcon } from '../utils/data';
import { Clock, Eye, ExternalLink } from 'lucide-react';

interface RecentOrdersProps {
  orders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  const navigate = useNavigate();
  
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

  const handleViewAll = () => {
    navigate('/orders');
  };

  return (
    <div className="card-minimal card-hover">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Recent Orders</h2>
          <p className="text-slate-600">Latest customer orders and their status</p>
        </div>
        <button 
          onClick={handleViewAll}
          className="btn-primary text-sm px-4 py-2 flex items-center gap-2 hover:bg-slate-700 transition-colors duration-200"
        >
          <span>View All</span>
          <ExternalLink className="w-4 h-4" />
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
            {orders.map((order) => {
              const companyLogo = getCompanyLogo(order.platform);
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
                      <span className="text-sm font-medium text-slate-700">{order.platform}</span>
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
                      <span className={`badge-minimal ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
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
                    <button 
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;