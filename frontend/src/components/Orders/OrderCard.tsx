import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { Order, OrderStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
}

const platformColors = {
  swiggy: '#ff6600',
  zomato: '#e23744',
  ubereats: '#000000',
  doordash: '#ff3008',
};

const statusColors = {
  [OrderStatus.RECEIVED]: '#ed6c02',
  [OrderStatus.CONFIRMED]: '#1976d2',
  [OrderStatus.PREPARING]: '#9c27b0',
  [OrderStatus.READY]: '#2e7d2e',
  [OrderStatus.PICKED_UP]: '#0288d1',
  [OrderStatus.OUT_FOR_DELIVERY]: '#0277bd',
  [OrderStatus.DELIVERED]: '#388e3c',
  [OrderStatus.CANCELLED]: '#d32f2f',
};

const statusLabels = {
  [OrderStatus.RECEIVED]: 'Received',
  [OrderStatus.CONFIRMED]: 'Confirmed',
  [OrderStatus.PREPARING]: 'Preparing',
  [OrderStatus.READY]: 'Ready',
  [OrderStatus.PICKED_UP]: 'Picked Up',
  [OrderStatus.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.CANCELLED]: 'Cancelled',
};

const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
  const statusFlow = [
    OrderStatus.RECEIVED,
    OrderStatus.CONFIRMED,
    OrderStatus.PREPARING,
    OrderStatus.READY,
    OrderStatus.PICKED_UP,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED,
  ];
  
  const currentIndex = statusFlow.indexOf(currentStatus);
  if (currentIndex >= 0 && currentIndex < statusFlow.length - 1) {
    return statusFlow[currentIndex + 1];
  }
  return null;
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusUpdate }) => {
  const nextStatus = getNextStatus(order.status);
  const isCompleted = order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED;
  
  const handleStatusUpdate = () => {
    if (nextStatus) {
      onStatusUpdate(order.id, nextStatus);
    }
  };

  return (
    <Card sx={{ mb: 2, border: `2px solid ${platformColors[order.platform]}20` }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: platformColors[order.platform],
                width: 32,
                height: 32,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {order.platform.slice(0, 2).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {order.platformOrderId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={statusLabels[order.status]}
              size="small"
              sx={{
                backgroundColor: `${statusColors[order.status]}20`,
                color: statusColors[order.status],
                fontWeight: 600,
              }}
            />
            <IconButton size="small">
              <MoreIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Customer Info */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Customer Details
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {order.customer.name}
            </Typography>
            <IconButton size="small" color="primary">
              <PhoneIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
            <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', mt: 0.2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {order.customer.address}
            </Typography>
          </Box>
        </Box>

        {/* Items */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Order Items
          </Typography>
          {order.items.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">
                {item.name} x{item.quantity}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {order.pricing.currency} {item.price * item.quantity}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {order.estimatedTime > 0 ? `${order.estimatedTime} min` : 'Delivered'}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {order.pricing.currency} {order.pricing.total}
            </Typography>
          </Box>
          
          {!isCompleted && nextStatus && (
            <Button
              variant="contained"
              size="small"
              onClick={handleStatusUpdate}
              sx={{ borderRadius: 2 }}
            >
              Mark {statusLabels[nextStatus]}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCard;