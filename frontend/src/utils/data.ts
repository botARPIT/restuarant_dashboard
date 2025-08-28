import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Clock,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export interface KPI {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative';
  icon: any;
}

export interface Order {
  id: string;
  customer: string;
  items: string[];
  totalPrice: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  platform: string;
  time: string;
  price?: number;
}

export interface Platform {
  name: string;
  status: 'active' | 'inactive';
  orders: number;
  revenue: number;
  change: number;
  icon?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: 'active' | 'inactive';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

// KPI Data
export const kpis: KPI[] = [
  {
    title: 'Total Orders',
    value: '1,234',
    change: '+12%',
    changeType: 'positive',
    icon: ShoppingCart
  },
  {
    title: 'Total Revenue',
    value: '₹45,678',
    change: '+8%',
    changeType: 'positive',
    icon: DollarSign
  },
  {
    title: 'Avg Order Value',
    value: '₹37',
    change: '+5%',
    changeType: 'positive',
    icon: TrendingUp
  },
  {
    title: 'Completion Rate',
    value: '94%',
    change: '+2%',
    changeType: 'positive',
    icon: Users
  }
];

// Recent Orders Data
export const recentOrders: Order[] = [
  {
    id: 'ORD001',
    customer: 'John Doe',
    items: ['Butter Chicken', 'Naan'],
    totalPrice: 450,
    status: 'delivered',
    platform: 'Zomato',
    time: '2 hours ago'
  },
  {
    id: 'ORD002',
    customer: 'Jane Smith',
    items: ['Biryani', 'Raita'],
    totalPrice: 380,
    status: 'preparing',
    platform: 'Swiggy',
    time: '1 hour ago'
  },
  {
    id: 'ORD003',
    customer: 'Mike Johnson',
    items: ['Tandoori Chicken', 'Dal'],
    totalPrice: 520,
    status: 'ready',
    platform: 'UberEats',
    time: '30 mins ago'
  },
  {
    id: 'ORD004',
    customer: 'Sarah Wilson',
    items: ['Paneer Tikka', 'Rice'],
    totalPrice: 320,
    status: 'pending',
    platform: 'Zomato',
    time: '15 mins ago'
  },
  {
    id: 'ORD005',
    customer: 'David Brown',
    items: ['Chicken Curry', 'Roti'],
    totalPrice: 410,
    status: 'cancelled',
    platform: 'Swiggy',
    time: '45 mins ago'
  }
];

// Platform Data
export const platforms: Platform[] = [
  {
    name: 'Zomato',
    status: 'active',
    orders: 456,
    revenue: 18500,
    change: 12
  },
  {
    name: 'Swiggy',
    status: 'active',
    orders: 389,
    revenue: 15200,
    change: 8
  },
  {
    name: 'UberEats',
    status: 'active',
    orders: 234,
    revenue: 9800,
    change: -3
  },
  {
    name: 'Dunzo',
    status: 'inactive',
    orders: 89,
    revenue: 3200,
    change: -15
  }
];

// Menu Items Data
export const menuItems: MenuItem[] = [
  {
    id: 'MENU001',
    name: 'Butter Chicken',
    description: 'Creamy tomato-based curry with tender chicken',
    price: 280,
    category: 'Main Course',
    available: true
  },
  {
    id: 'MENU002',
    name: 'Biryani',
    description: 'Aromatic rice dish with spices and meat',
    price: 320,
    category: 'Main Course',
    available: true
  },
  {
    id: 'MENU003',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese with Indian spices',
    price: 180,
    category: 'Appetizer',
    available: true
  },
  {
    id: 'MENU004',
    name: 'Dal Makhani',
    description: 'Creamy black lentils slow-cooked overnight',
    price: 120,
    category: 'Main Course',
    available: false
  }
];

// Customers Data
export const customers: Customer[] = [
  {
    id: 'CUST001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    totalOrders: 15,
    totalSpent: 4500,
    lastOrder: '2 days ago',
    status: 'active'
  },
  {
    id: 'CUST002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91 98765 43211',
    totalOrders: 8,
    totalSpent: 2800,
    lastOrder: '1 week ago',
    status: 'active'
  },
  {
    id: 'CUST003',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+91 98765 43212',
    totalOrders: 22,
    totalSpent: 7800,
    lastOrder: '3 days ago',
    status: 'active'
  }
];

// Notifications Data
export const notifications: NotificationItem[] = [
  {
    id: 'NOTIF001',
    title: 'New Order Received',
    message: 'Order #ORD006 has been placed via Zomato',
    type: 'info',
    read: false,
    timestamp: '5 minutes ago'
  },
  {
    id: 'NOTIF002',
    title: 'Order Delivered',
    message: 'Order #ORD001 has been successfully delivered',
    type: 'success',
    read: false,
    timestamp: '2 hours ago'
  },
  {
    id: 'NOTIF003',
    title: 'Low Stock Alert',
    message: 'Paneer stock is running low. Please reorder soon.',
    type: 'warning',
    read: true,
    timestamp: '1 day ago'
  },
  {
    id: 'NOTIF004',
    title: 'Payment Failed',
    message: 'Payment for order #ORD005 has failed',
    type: 'error',
    read: false,
    timestamp: '2 days ago'
  }
];

// Utility functions
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'pending': 'badge-warning',
    'preparing': 'badge-info',
    'ready': 'badge-info',
    'delivered': 'badge-success',
    'cancelled': 'badge-error'
  };
  return statusColors[status] || 'badge-info';
};

export const getPlatformColor = (platform: string): string => {
  const platformColors: Record<string, string> = {
    'Zomato': 'bg-orange-100 text-orange-700 border-orange-200',
    'Swiggy': 'bg-orange-100 text-orange-700 border-orange-200',
    'UberEats': 'bg-black text-white border-black',
    'Dunzo': 'bg-purple-100 text-purple-700 border-purple-200',
    'Zepto': 'bg-blue-100 text-blue-700 border-blue-200',
    'Blinkit': 'bg-green-100 text-green-700 border-green-200'
  };
  return platformColors[platform] || 'bg-slate-100 text-slate-700 border-slate-200';
};

export const getStatusIcon = (status: string) => {
  const statusIcons: Record<string, any> = {
    'pending': Clock,
    'preparing': Package,
    'ready': CheckCircle,
    'delivered': CheckCircle,
    'cancelled': XCircle
  };
  return statusIcons[status] || AlertCircle;
};