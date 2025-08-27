import { Order, OrderStatus, Analytics, MenuItem, PlatformConnection } from '@/types';

// Mock Orders Data
export const mockOrders: Order[] = [
  {
    id: '1',
    platform: 'swiggy',
    platformOrderId: 'SW789012',
    status: OrderStatus.PREPARING,
    customer: {
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      address: 'A-123, Connaught Place, New Delhi 110001'
    },
    items: [
      {
        id: '1',
        name: 'Chicken Biryani (Large)',
        quantity: 2,
        price: 199,
        customizations: ['Extra raita', 'Medium spice']
      },
      {
        id: '2',
        name: 'Raita',
        quantity: 1,
        price: 50
      }
    ],
    pricing: {
      subtotal: 448,
      tax: 45,
      deliveryFee: 40,
      total: 533,
      currency: 'INR'
    },
    estimatedTime: 25,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString()
  },
  {
    id: '2',
    platform: 'zomato',
    platformOrderId: 'ZM445667',
    status: OrderStatus.READY,
    customer: {
      name: 'Priya Patel',
      phone: '+91 98765 54321',
      address: 'B-456, Dwarka Sector 10, New Delhi 110075'
    },
    items: [
      {
        id: '3',
        name: 'Dal Makhani',
        quantity: 1,
        price: 180
      },
      {
        id: '4',
        name: 'Butter Naan',
        quantity: 2,
        price: 45
      }
    ],
    pricing: {
      subtotal: 270,
      tax: 27,
      deliveryFee: 30,
      total: 327,
      currency: 'INR'
    },
    estimatedTime: 30,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: '3',
    platform: 'ubereats',
    platformOrderId: 'UE223344',
    status: OrderStatus.OUT_FOR_DELIVERY,
    customer: {
      name: 'Amit Kumar',
      phone: '+91 98765 98765',
      address: 'C-789, Lajpat Nagar, New Delhi 110024'
    },
    items: [
      {
        id: '5',
        name: 'Paneer Butter Masala',
        quantity: 1,
        price: 220
      },
      {
        id: '6',
        name: 'Jeera Rice',
        quantity: 1,
        price: 120
      }
    ],
    pricing: {
      subtotal: 340,
      tax: 34,
      deliveryFee: 35,
      total: 409,
      currency: 'INR'
    },
    estimatedTime: 20,
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60000).toISOString()
  },
  {
    id: '4',
    platform: 'doordash',
    platformOrderId: 'DD112233',
    status: OrderStatus.DELIVERED,
    customer: {
      name: 'Sarah Johnson',
      phone: '+1 555 123 4567',
      address: '123 Main St, San Francisco, CA 94102'
    },
    items: [
      {
        id: '7',
        name: 'Chicken Tikka Masala',
        quantity: 1,
        price: 16.99
      },
      {
        id: '8',
        name: 'Garlic Naan',
        quantity: 2,
        price: 3.99
      }
    ],
    pricing: {
      subtotal: 24.97,
      tax: 2.25,
      deliveryFee: 2.99,
      total: 30.21,
      currency: 'USD'
    },
    estimatedTime: 0,
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 60000).toISOString()
  },
  {
    id: '5',
    platform: 'swiggy',
    platformOrderId: 'SW789013',
    status: OrderStatus.CONFIRMED,
    customer: {
      name: 'Anita Singh',
      phone: '+91 98765 11111',
      address: 'D-321, Saket, New Delhi 110017'
    },
    items: [
      {
        id: '9',
        name: 'Mutton Biryani',
        quantity: 1,
        price: 299
      }
    ],
    pricing: {
      subtotal: 299,
      tax: 30,
      deliveryFee: 40,
      total: 369,
      currency: 'INR'
    },
    estimatedTime: 35,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60000).toISOString()
  }
];

// Mock Analytics Data
export const mockAnalytics: Analytics = {
  totalOrders: 47,
  completedOrders: 42,
  activeOrders: 5,
  totalRevenue: 18450,
  averageOrderValue: 392,
  platformBreakdown: [
    { platform: 'Swiggy', orders: 28, revenue: 10980, percentage: 59.5 },
    { platform: 'Zomato', orders: 12, revenue: 4680, percentage: 25.4 },
    { platform: 'UberEats', orders: 5, revenue: 1950, percentage: 10.6 },
    { platform: 'DoorDash', orders: 2, revenue: 840, percentage: 4.5 }
  ],
  hourlyData: [
    { hour: '12:00', orders: 3, revenue: 1170 },
    { hour: '13:00', orders: 5, revenue: 1950 },
    { hour: '14:00', orders: 2, revenue: 780 },
    { hour: '15:00', orders: 1, revenue: 390 },
    { hour: '16:00', orders: 0, revenue: 0 },
    { hour: '17:00', orders: 2, revenue: 780 },
    { hour: '18:00', orders: 8, revenue: 3120 },
    { hour: '19:00', orders: 12, revenue: 4680 },
    { hour: '20:00', orders: 10, revenue: 3900 },
    { hour: '21:00', orders: 4, revenue: 1560 }
  ],
  topItems: [
    { name: 'Chicken Biryani', orders: 15, revenue: 2985 },
    { name: 'Paneer Butter Masala', orders: 12, revenue: 2640 },
    { name: 'Dal Makhani', orders: 8, revenue: 1440 },
    { name: 'Butter Chicken', orders: 6, revenue: 1380 },
    { name: 'Mutton Biryani', orders: 4, revenue: 1196 }
  ]
};

// Mock Menu Items
export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice with tender chicken pieces and exotic spices',
    price: 199,
    category: 'Main Course',
    isAvailable: true,
    preparationTime: 25,
    platforms: {
      swiggy: true,
      zomato: true,
      ubereats: true,
      doordash: false
    }
  },
  {
    id: '2',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese cubes in rich tomato and butter gravy',
    price: 220,
    category: 'Main Course',
    isAvailable: true,
    preparationTime: 20,
    platforms: {
      swiggy: true,
      zomato: true,
      ubereats: true,
      doordash: true
    }
  },
  {
    id: '3',
    name: 'Dal Makhani',
    description: 'Creamy black lentils slow-cooked with butter and cream',
    price: 180,
    category: 'Main Course',
    isAvailable: false,
    preparationTime: 30,
    platforms: {
      swiggy: true,
      zomato: true,
      ubereats: false,
      doordash: false
    }
  },
  {
    id: '4',
    name: 'Butter Naan',
    description: 'Soft Indian bread brushed with butter',
    price: 45,
    category: 'Bread',
    isAvailable: true,
    preparationTime: 10,
    platforms: {
      swiggy: true,
      zomato: true,
      ubereats: true,
      doordash: true
    }
  },
  {
    id: '5',
    name: 'Gulab Jamun',
    description: 'Traditional Indian sweet dumplings in sugar syrup',
    price: 80,
    category: 'Dessert',
    isAvailable: true,
    preparationTime: 5,
    platforms: {
      swiggy: true,
      zomato: false,
      ubereats: true,
      doordash: true
    }
  }
];

// Mock Platform Connections
export const mockPlatformConnections: PlatformConnection[] = [
  {
    platform: 'Swiggy',
    connected: true,
    lastSync: new Date(Date.now() - 2 * 60000).toISOString(),
    status: 'active',
    ordersToday: 28,
    revenueToday: 10980
  },
  {
    platform: 'Zomato',
    connected: true,
    lastSync: new Date(Date.now() - 5 * 60000).toISOString(),
    status: 'active',
    ordersToday: 12,
    revenueToday: 4680
  },
  {
    platform: 'UberEats',
    connected: true,
    lastSync: new Date(Date.now() - 3 * 60000).toISOString(),
    status: 'active',
    ordersToday: 5,
    revenueToday: 1950
  },
  {
    platform: 'DoorDash',
    connected: false,
    lastSync: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    status: 'disconnected',
    ordersToday: 0,
    revenueToday: 0
  }
];

// Generate more realistic time-based data
export const generateRealtimeOrder = (): Order => {
  const platforms: Array<'swiggy' | 'zomato' | 'ubereats' | 'doordash'> = ['swiggy', 'zomato', 'ubereats', 'doordash'];
  const customers = [
    { name: 'Rajesh Kumar', phone: '+91 98765 00001', address: 'Sector 1, Noida' },
    { name: 'Sneha Patel', phone: '+91 98765 00002', address: 'Cyber City, Gurgaon' },
    { name: 'Arjun Singh', phone: '+91 98765 00003', address: 'CP Block, Delhi' },
    { name: 'Kavya Sharma', phone: '+91 98765 00004', address: 'Dwarka, Delhi' }
  ];
  
  const items = [
    { name: 'Chicken Biryani', price: 199 },
    { name: 'Paneer Tikka', price: 220 },
    { name: 'Dal Tadka', price: 160 },
    { name: 'Butter Chicken', price: 240 }
  ];

  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  const customer = customers[Math.floor(Math.random() * customers.length)];
  const item = items[Math.floor(Math.random() * items.length)];
  const quantity = Math.floor(Math.random() * 3) + 1;
  
  const subtotal = item.price * quantity;
  const tax = Math.round(subtotal * 0.1);
  const deliveryFee = Math.floor(Math.random() * 30) + 20;
  const total = subtotal + tax + deliveryFee;

  return {
    id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    platform,
    platformOrderId: `${platform.toUpperCase().slice(0, 2)}${Math.floor(Math.random() * 900000) + 100000}`,
    status: OrderStatus.RECEIVED,
    customer,
    items: [{
      id: '1',
      name: item.name,
      quantity,
      price: item.price
    }],
    pricing: {
      subtotal,
      tax,
      deliveryFee,
      total,
      currency: 'INR'
    },
    estimatedTime: Math.floor(Math.random() * 20) + 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};