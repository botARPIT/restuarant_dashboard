export interface Order {
  id: string;
  status: 'preparing' | 'ready' | 'delivered' | 'cancelled';
  customer: string;
  customerEmail?: string;
  customerPhone?: string;
  time: string;
  items: OrderItem[];
  totalPrice: number;
  eta: string;
  platform: 'zomato' | 'swiggy' | 'uber' | 'dunzo';
  platformOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  category?: string;
  specialInstructions?: string;
}

export interface Platform {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  apiKey?: string;
  apiSecret?: string;
  webhookUrl?: string;
  orders: number;
  revenue: number;
  change: number;
  icon: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  completionRate: number;
  platformStats: PlatformStats[];
  recentOrders: Order[];
  dailyTrends: DailyTrend[];
}

export interface PlatformStats {
  platformId: string;
  platformName: string;
  orders: number;
  revenue: number;
  change: number;
  status: string;
}

export interface DailyTrend {
  date: string;
  orders: number;
  revenue: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}