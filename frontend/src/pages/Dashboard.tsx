import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Receipt as OrdersIcon,
  TrendingUp as RevenueIcon,
  Restaurant as RestaurantIcon,
  Star as RatingIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import StatsCard from '@/components/Dashboard/StatsCard';
import OrderCard from '@/components/Orders/OrderCard';
import { mockOrders, mockAnalytics, generateRealtimeOrder } from '@/utils/mockData';
import { Order, OrderStatus } from '@/types';
import toast from 'react-hot-toast';

const COLORS = ['#ff6600', '#e23744', '#000000', '#ff3008'];

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [analytics] = useState(mockAnalytics);

  // Simulate real-time orders
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 15 seconds
        const newOrder = generateRealtimeOrder();
        setOrders(prev => [newOrder, ...prev]);
        toast.success(`New order from ${newOrder.platform}! #${newOrder.platformOrderId}`);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );
    toast.success(`Order status updated to ${newStatus}`);
  };

  const activeOrders = orders.filter(order => 
    ![OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)
  );

  const todayRevenue = orders
    .filter(order => {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    })
    .reduce((sum, order) => sum + order.pricing.total, 0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Good morning, Priya! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your restaurant today
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Today's Orders"
            value={analytics.totalOrders}
            change={15}
            icon={<OrdersIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Orders"
            value={activeOrders.length}
            icon={<RestaurantIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Today's Revenue"
            value={`₹${todayRevenue.toLocaleString()}`}
            change={8}
            icon={<RevenueIcon />}
            color="#2e7d2e"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Average Rating"
            value="4.7"
            change={2}
            icon={<RatingIcon />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Live Orders */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  🔴 Live Order Stream
                </Typography>
                <Chip 
                  label={`${activeOrders.length} Active`} 
                  size="small" 
                  color="primary"
                />
              </Box>
              
              {activeOrders.length > 0 ? (
                <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                  {activeOrders.slice(0, 5).map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                  {activeOrders.length > 5 && (
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 2 }}
                    >
                      View All {activeOrders.length} Orders
                    </Button>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No active orders at the moment
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    New orders will appear here automatically
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Analytics Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Platform Breakdown */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Platform Performance
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={analytics.platformBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="percentage"
                    nameKey="platform"
                  >
                    {analytics.platformBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                {analytics.platformBreakdown.map((platform, index) => (
                  <Box key={platform.platform} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: COLORS[index],
                        borderRadius: 1,
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {platform.platform}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {platform.percentage}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Top Items */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                🏆 Top Items Today
              </Typography>
              {analytics.topItems.slice(0, 5).map((item, index) => (
                <Box key={item.name} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {index + 1}. {item.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.orders}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(item.orders / analytics.topItems[0].orders) * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Hourly Trends */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                📊 Today's Order Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'orders' ? `${value} orders` : `₹${value}`,
                      name === 'orders' ? 'Orders' : 'Revenue'
                    ]}
                  />
                  <Bar dataKey="orders" fill="#1976d2" name="orders" />
                  <Bar dataKey="revenue" fill="#2e7d2e" name="revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;