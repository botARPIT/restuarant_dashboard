export interface Order {
  id: string;
  status: 'preparing' | 'ready' | 'delivered' | 'cancelled';
  customer: string;
  time: string;
  items: string[];
  price: number;
  eta: string;
  platform: 'zomato' | 'swiggy' | 'uber' | 'dunzo';
}

export interface Platform {
  name: string;
  status: 'active' | 'inactive';
  orders: number;
  revenue: number;
  change: number;
  icon: string;
  color: string;
}

export interface KPI {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

export interface NavigationItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
  current?: boolean;
}