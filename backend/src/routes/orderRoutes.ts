import express from 'express';
import { 
  getAllOrders, 
  getOrderById, 
  createOrder, 
  updateOrderStatus,
  getOrdersByPlatform,
  getOrdersByStatus
} from '../controllers/orderController';

const router = express.Router();

// Get all orders with pagination
router.get('/', getAllOrders);

// Get order by ID
router.get('/:id', getOrderById);

// Create new order
router.post('/', createOrder);

// Update order status
router.patch('/:id/status', updateOrderStatus);

// Get orders by platform
router.get('/platform/:platform', getOrdersByPlatform);

// Get orders by status
router.get('/status/:status', getOrdersByStatus);

export default router;