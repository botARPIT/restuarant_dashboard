export enum OrderStatus {
  RECEIVED = 'received',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  PICKED_UP = 'picked_up',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface Order {
  id: string;
  platform: 'swiggy' | 'zomato' | 'ubereats' | 'doordash';
  platformOrderId: string;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    tax: number;
    deliveryFee: number;
    total: number;
    currency: string;
  };
  estimatedTime: number; // minutes
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  customizations?: string[];
}

export interface Analytics {
  totalOrders: number;
  completedOrders: number;
  activeOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  platformBreakdown: {
    platform: string;
    orders: number;
    revenue: number;
    percentage: number;
  }[];
  hourlyData: {
    hour: string;
    orders: number;
    revenue: number;
  }[];
  topItems: {
    name: string;
    orders: number;
    revenue: number;
  }[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  preparationTime: number;
  platforms: {
    swiggy: boolean;
    zomato: boolean;
    ubereats: boolean;
    doordash: boolean;
  };
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  cuisineType: string;
  status: 'active' | 'inactive';
}

export interface PlatformConnection {
  platform: string;
  connected: boolean;
  lastSync: string;
  status: 'active' | 'error' | 'disconnected';
  ordersToday: number;
  revenueToday: number;
}