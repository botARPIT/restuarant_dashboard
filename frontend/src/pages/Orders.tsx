import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import OrderCard from '@/components/Orders/OrderCard';
import { mockOrders } from '@/utils/mockData';
import { Order, OrderStatus } from '@/types';
import toast from 'react-hot-toast';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`orders-tabpanel-${index}`}
      aria-labelledby={`orders-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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

  const filterOrders = (orders: Order[], status?: OrderStatus[]) => {
    let filtered = orders;

    // Filter by status
    if (status) {
      filtered = filtered.filter(order => status.includes(order.status));
    }

    // Filter by platform
    if (platformFilter !== 'all') {
      filtered = filtered.filter(order => order.platform === platformFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.platformOrderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.phone.includes(searchQuery)
      );
    }

    return filtered;
  };

  const activeOrders = filterOrders(orders, [
    OrderStatus.RECEIVED,
    OrderStatus.CONFIRMED,
    OrderStatus.PREPARING,
    OrderStatus.READY,
    OrderStatus.PICKED_UP,
    OrderStatus.OUT_FOR_DELIVERY,
  ]);

  const completedOrders = filterOrders(orders, [OrderStatus.DELIVERED]);
  const cancelledOrders = filterOrders(orders, [OrderStatus.CANCELLED]);
  const allOrders = filterOrders(orders);

  const getOrderCount = (status: string) => {
    switch (status) {
      case 'active': return activeOrders.length;
      case 'completed': return completedOrders.length;
      case 'cancelled': return cancelledOrders.length;
      default: return allOrders.length;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Order Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage all your orders from one place
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search orders, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Platform</InputLabel>
                <Select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  label="Platform"
                >
                  <MenuItem value="all">All Platforms</MenuItem>
                  <MenuItem value="swiggy">Swiggy</MenuItem>
                  <MenuItem value="zomato">Zomato</MenuItem>
                  <MenuItem value="ubereats">Uber Eats</MenuItem>
                  <MenuItem value="doordash">DoorDash</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  More Filters
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Export
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="order status tabs">
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  All Orders
                  <Chip label={getOrderCount('all')} size="small" />
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Active
                  <Chip label={getOrderCount('active')} size="small" color="warning" />
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Completed
                  <Chip label={getOrderCount('completed')} size="small" color="success" />
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Cancelled
                  <Chip label={getOrderCount('cancelled')} size="small" color="error" />
                </Box>
              } 
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ px: 3 }}>
            {allOrders.length > 0 ? (
              allOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No orders found matching your criteria
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: 3 }}>
            {activeOrders.length > 0 ? (
              activeOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))
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
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ px: 3 }}>
            {completedOrders.length > 0 ? (
              completedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No completed orders found
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box sx={{ px: 3 }}>
            {cancelledOrders.length > 0 ? (
              cancelledOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No cancelled orders found
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default Orders;