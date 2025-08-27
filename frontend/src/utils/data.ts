import { 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Grid3X3,
  BarChart3,
  List,
  Users,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Filter
} from 'lucide-react';
import { KPI, Order, Platform, NavigationItem } from '../types';

export const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', icon: Grid3X3, href: '#', current: true },
  { name: 'Orders', icon: ShoppingBag, href: '#', badge: 12 },
  { name: 'Analytics', icon: BarChart3, href: '#' },
  { name: 'Menu Management', icon: List, href: '#' },
  { name: 'Customers', icon: Users, href: '#' },
  { name: 'Notifications', icon: Bell, href: '#', badge: 3 },
  { name: 'Settings', icon: Settings, href: '#' },
];

export const kpis: KPI[] = [
  {
    title: 'Total Orders Today',
    value: 47,
    change: '+12% from yesterday',
    changeType: 'positive',
    icon: ShoppingBag,
  },
  {
    title: 'Revenue Today',
    value: '₹18,450',
    change: '+8% from yesterday',
    changeType: 'positive',
    icon: DollarSign,
  },
  {
    title: 'Active Orders',
    value: 12,
    change: '-2 from yesterday',
    changeType: 'negative',
    icon: Clock,
  },
  {
    title: 'Completion Rate',
    value: '94%',
    change: '+3% from yesterday',
    changeType: 'positive',
    icon: CheckCircle,
  },
];

export const recentOrders: Order[] = [
  {
    id: 'ZOM-001',
    status: 'preparing',
    customer: 'John Doe',
    time: '12:45 PM',
    items: ['Butter Chicken', 'Naan Bread', 'Rice'],
    price: 850,
    eta: '1:15 PM',
    platform: 'zomato',
  },
  {
    id: 'SWG-002',
    status: 'ready',
    customer: 'Sarah Wilson',
    time: '12:50 PM',
    items: ['Margherita Pizza', 'Garlic Bread'],
    price: 650,
    eta: '1:20 PM',
    platform: 'swiggy',
  },
  {
    id: 'UBE-003',
    status: 'delivered',
    customer: 'Mike Johnson',
    time: '12:30 PM',
    items: ['Chicken Biryani', 'Raita'],
    price: 450,
    eta: '1:00 PM',
    platform: 'uber',
  },
];

export const platforms: Platform[] = [
  {
    name: 'Zomato',
    status: 'active',
    orders: 18,
    revenue: 7200,
    change: 15,
    icon: 'Z',
    color: 'bg-red-500',
  },
  {
    name: 'Swiggy',
    status: 'active',
    orders: 23,
    revenue: 8900,
    change: 8,
    icon: 'S',
    color: 'bg-orange-500',
  },
  {
    name: 'UberEats',
    status: 'inactive',
    orders: 0,
    revenue: 0,
    change: 0,
    icon: 'U',
    color: 'bg-black',
  },
  {
    name: 'Dunzo',
    status: 'active',
    orders: 6,
    revenue: 2350,
    change: -5,
    icon: 'D',
    color: 'bg-blue-500',
  },
];

export const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'preparing':
      return 'bg-warning-500 text-white';
    case 'ready':
      return 'bg-success-500 text-white';
    case 'delivered':
      return 'bg-success-600 text-white';
    case 'cancelled':
      return 'bg-danger-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const getStatusText = (status: Order['status']) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const getPlatformIcon = (platform: Order['platform']) => {
  const platformData = platforms.find(p => p.name.toLowerCase().includes(platform));
  return platformData?.icon || '?';
};

export const getPlatformColor = (platform: Order['platform']) => {
  const platformData = platforms.find(p => p.name.toLowerCase().includes(platform));
  return platformData?.color || 'bg-gray-500';
};