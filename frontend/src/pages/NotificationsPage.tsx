import React, { useState, useEffect } from 'react';
import { Search, Filter, Bell, CheckCircle, AlertTriangle, Info, XCircle, Trash2, Clock, Eye, EyeOff } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

// Mock notifications data
const mockNotifications: NotificationItem[] = [
  {
    id: 'NOTIF001',
    title: 'New Order Received',
    message: 'Order #ORD006 has been placed via Zomato',
    type: 'info',
    read: false,
    timestamp: '2024-01-15T10:30:00Z'
  },
  {
    id: 'NOTIF002',
    title: 'Order Delivered',
    message: 'Order #ORD001 has been successfully delivered',
    type: 'success',
    read: false,
    timestamp: '2024-01-15T09:15:00Z'
  },
  {
    id: 'NOTIF003',
    title: 'Low Stock Alert',
    message: 'Paneer stock is running low. Please reorder soon.',
    type: 'warning',
    read: true,
    timestamp: '2024-01-14T16:45:00Z'
  },
  {
    id: 'NOTIF004',
    title: 'Payment Failed',
    message: 'Payment for order #ORD005 has failed',
    type: 'error',
    read: false,
    timestamp: '2024-01-14T14:20:00Z'
  },
  {
    id: 'NOTIF005',
    title: 'New Customer Registration',
    message: 'A new customer has registered on your platform',
    type: 'info',
    read: false,
    timestamp: '2024-01-15T08:45:00Z'
  },
  {
    id: 'NOTIF006',
    title: 'Revenue Milestone',
    message: 'Congratulations! You\'ve reached ₹50,000 in monthly revenue',
    type: 'success',
    read: true,
    timestamp: '2024-01-13T20:30:00Z'
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');

  useEffect(() => {
    // Simulate API call with mock data
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const deleteNotification = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        setNotifications(prev => prev.filter(n => n.id !== id));
      } catch (e: any) {
        setError(e.message);
      }
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      info: <Info className="w-5 h-5 text-blue-500" />,
      success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      error: <XCircle className="w-5 h-5 text-rose-500" />
    };
    return icons[type as keyof typeof icons] || icons.info;
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      info: 'border-blue-200 bg-blue-50',
      success: 'border-emerald-200 bg-emerald-50',
      warning: 'border-amber-200 bg-amber-50',
      error: 'border-rose-200 bg-rose-50'
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesRead = readFilter === 'all' || 
                       (readFilter === 'read' && notification.read) ||
                       (readFilter === 'unread' && !notification.read);
    return matchesSearch && matchesType && matchesRead;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const totalCount = notifications.length;

  return (
    <div className="content-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">Stay updated with important restaurant alerts and updates</p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="btn-secondary flex items-center gap-2 hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                Mark All Read
              </button>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Bell className="w-4 h-4" />
              <span>{unreadCount} unread of {totalCount} total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-bar">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-clean pl-10 w-full cursor-text"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-clean w-32 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          
          <select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            className="input-clean w-32 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          
          <button className="btn-secondary flex items-center gap-2 hover:bg-slate-100 transition-colors duration-200 cursor-pointer">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`card-minimal card-hover border-l-4 ${getNotificationColor(notification.type)} ${
              !notification.read ? 'ring-2 ring-slate-200' : ''
            } transition-all duration-200 hover:shadow-md cursor-pointer`}
          >
            <div className="flex items-start gap-4">
              {/* Notification Icon */}
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              
              {/* Notification Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-semibold text-lg ${
                    notification.read ? 'text-slate-700' : 'text-slate-900'
                  }`}>
                    {notification.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors duration-200 cursor-pointer"
                        title="Mark as read"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors duration-200 cursor-pointer"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className={`text-slate-600 mb-3 ${
                  notification.read ? 'text-slate-500' : 'text-slate-600'
                }`}>
                  {notification.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{formatTimeAgo(notification.timestamp)}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400">
                      {new Date(notification.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`badge-minimal ${
                      notification.type === 'info' ? 'badge-info' :
                      notification.type === 'success' ? 'badge-success' :
                      notification.type === 'warning' ? 'badge-warning' :
                      'badge-error'
                    }`}>
                      {notification.type}
                    </span>
                    
                    {!notification.read && (
                      <span className="badge-minimal badge-info">
                        Unread
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && filteredNotifications.length === 0 && (
        <div className="empty-state">
          <Bell className="empty-state-icon" />
          <p className="empty-state-text">
            {searchQuery || typeFilter !== 'all' || readFilter !== 'all' 
              ? 'No notifications match your filters' 
              : 'No notifications yet'
            }
          </p>
          {(searchQuery || typeFilter !== 'all' || readFilter !== 'all') && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setReadFilter('all');
              }}
              className="btn-secondary mt-4 hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="text-slate-600 mt-2">Loading notifications...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="empty-state">
          <XCircle className="empty-state-icon text-rose-500" />
          <p className="text-rose-600 mb-2">{error}</p>
          <button className="btn-primary hover:bg-slate-700 transition-colors duration-200 cursor-pointer" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
