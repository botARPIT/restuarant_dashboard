import { Hono } from 'hono';
import { cors } from '@hono/cors';
import { prettyJSON } from 'hono/pretty-json';

// Mock data
const mockOrders = [
  {
    id: '1',
    platform: 'swiggy',
    platformOrderId: 'SW789012',
    status: 'preparing',
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
        price: 199
      }
    ],
    pricing: {
      subtotal: 398,
      tax: 40,
      deliveryFee: 40,
      total: 478,
      currency: 'INR'
    },
    estimatedTime: 25,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString()
  },
  {
    id: '2',
    platform: 'zomato',
    platformOrderId: 'ZM445667',
    status: 'ready',
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
      }
    ],
    pricing: {
      subtotal: 180,
      tax: 18,
      deliveryFee: 30,
      total: 228,
      currency: 'INR'
    },
    estimatedTime: 30,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString()
  }
];

const mockAnalytics = {
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
  ]
};

const mockMenuItems = [
  {
    id: '1',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice with tender chicken pieces',
    price: 199,
    category: 'Main Course',
    isAvailable: true,
    preparationTime: 25
  },
  {
    id: '2',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese in rich tomato gravy',
    price: 220,
    category: 'Main Course',
    isAvailable: true,
    preparationTime: 20
  }
];

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use('*', prettyJSON());

// Health check
app.get('/api/v1/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Orders API
app.get('/api/v1/orders', (c) => {
  const status = c.req.query('status');
  const platform = c.req.query('platform');
  
  let filteredOrders = [...mockOrders];
  
  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }
  
  if (platform) {
    filteredOrders = filteredOrders.filter(order => order.platform === platform);
  }
  
  return c.json({
    orders: filteredOrders,
    total: filteredOrders.length,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/orders/:id', (c) => {
  const id = c.req.param('id');
  const order = mockOrders.find(o => o.id === id);
  
  if (!order) {
    return c.json({ error: 'Order not found' }, 404);
  }
  
  return c.json({ order });
});

app.put('/api/v1/orders/:id/status', async (c) => {
  const id = c.req.param('id');
  const { status } = await c.req.json();
  
  const orderIndex = mockOrders.findIndex(o => o.id === id);
  
  if (orderIndex === -1) {
    return c.json({ error: 'Order not found' }, 404);
  }
  
  // Update the order status
  mockOrders[orderIndex].status = status;
  mockOrders[orderIndex].updatedAt = new Date().toISOString();
  
  return c.json({
    success: true,
    order: mockOrders[orderIndex],
    message: `Order status updated to ${status}`
  });
});

// Analytics API
app.get('/api/v1/analytics/dashboard', (c) => {
  return c.json(mockAnalytics);
});

app.get('/api/v1/analytics/orders', (c) => {
  const period = c.req.query('period') || 'today';
  
  // Mock analytics based on period
  const periodData = {
    today: {
      totalOrders: 23,
      totalRevenue: 8950,
      averageOrderValue: 389,
      completionRate: 94.2
    },
    week: {
      totalOrders: 156,
      totalRevenue: 62400,
      averageOrderValue: 400,
      completionRate: 96.1
    },
    month: {
      totalOrders: 672,
      totalRevenue: 268800,
      averageOrderValue: 400,
      completionRate: 95.8
    }
  };
  
  return c.json({
    period,
    data: periodData[period as keyof typeof periodData] || periodData.today,
    timestamp: new Date().toISOString()
  });
});

// Menu API
app.get('/api/v1/menu', (c) => {
  return c.json({
    items: mockMenuItems,
    total: mockMenuItems.length,
    timestamp: new Date().toISOString()
  });
});

app.put('/api/v1/menu/:id', async (c) => {
  const id = c.req.param('id');
  const updates = await c.req.json();
  
  const itemIndex = mockMenuItems.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return c.json({ error: 'Menu item not found' }, 404);
  }
  
  // Update the menu item
  mockMenuItems[itemIndex] = { ...mockMenuItems[itemIndex], ...updates };
  
  return c.json({
    success: true,
    item: mockMenuItems[itemIndex],
    message: 'Menu item updated successfully'
  });
});

// Platforms API
app.get('/api/v1/platforms', (c) => {
  const platforms = [
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
  
  return c.json({ platforms });
});

// Demo endpoint to generate new orders
app.post('/api/v1/demo/generate-order', (c) => {
  const platforms = ['swiggy', 'zomato', 'ubereats', 'doordash'];
  const customers = [
    { name: 'Rajesh Kumar', phone: '+91 98765 00001', address: 'Sector 1, Noida' },
    { name: 'Sneha Patel', phone: '+91 98765 00002', address: 'Cyber City, Gurgaon' }
  ];
  
  const items = [
    { name: 'Chicken Biryani', price: 199 },
    { name: 'Paneer Tikka', price: 220 }
  ];

  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  const customer = customers[Math.floor(Math.random() * customers.length)];
  const item = items[Math.floor(Math.random() * items.length)];
  const quantity = Math.floor(Math.random() * 3) + 1;
  
  const subtotal = item.price * quantity;
  const tax = Math.round(subtotal * 0.1);
  const deliveryFee = Math.floor(Math.random() * 30) + 20;
  const total = subtotal + tax + deliveryFee;

  const newOrder = {
    id: `demo_${Date.now()}`,
    platform,
    platformOrderId: `${platform.toUpperCase().slice(0, 2)}${Math.floor(Math.random() * 900000) + 100000}`,
    status: 'received',
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

  mockOrders.unshift(newOrder);
  
  return c.json({
    success: true,
    order: newOrder,
    message: 'Demo order generated successfully'
  });
});

// Error handling
app.onError((err, c) => {
  console.error('Application error:', err);
  
  return c.json({
    error: 'Internal Server Error',
    message: 'Something went wrong',
    timestamp: new Date().toISOString()
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    timestamp: new Date().toISOString()
  }, 404);
});

export default app;