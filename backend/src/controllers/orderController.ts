import { Request, Response } from 'express';
import { Order, ApiResponse, PaginatedResponse } from '../types';

// Mock orders data - in production this would come from database
let mockOrders: Order[] = [
  {
    id: 'ZOM-001',
    status: 'preparing',
    customer: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+91-9876543210',
    time: '12:45 PM',
    items: [
      { name: 'Butter Chicken', quantity: 1, price: 450, category: 'Main Course' },
      { name: 'Naan Bread', quantity: 2, price: 120, category: 'Bread' },
      { name: 'Rice', quantity: 1, price: 80, category: 'Rice' }
    ],
    totalPrice: 850,
    eta: '1:15 PM',
    platform: 'zomato',
    platformOrderId: 'ZOM123456',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'SWG-002',
    status: 'ready',
    customer: 'Sarah Wilson',
    customerEmail: 'sarah@example.com',
    customerPhone: '+91-9876543211',
    time: '12:50 PM',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 550, category: 'Pizza' },
      { name: 'Garlic Bread', quantity: 1, price: 100, category: 'Bread' }
    ],
    totalPrice: 650,
    eta: '1:20 PM',
    platform: 'swiggy',
    platformOrderId: 'SWG789012',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const getAllOrders = async (req: Request, res: Response<PaginatedResponse<Order>>) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const orders = mockOrders.slice(startIndex, endIndex);
    const total = mockOrders.length;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    });
  }
};

export const getOrderById = async (req: Request, res: Response<ApiResponse<Order>>) => {
  try {
    const { id } = req.params;
    const order = mockOrders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order,
      message: 'Order retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve order'
    });
  }
};

export const createOrder = async (req: Request, res: Response<ApiResponse<Order>>) => {
  try {
    const orderData = req.body;
    const newOrder: Order = {
      ...orderData,
      id: `${orderData.platform.toUpperCase()}-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockOrders.push(newOrder);

    res.status(201).json({
      success: true,
      data: newOrder,
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response<ApiResponse<Order>>) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const orderIndex = mockOrders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    mockOrders[orderIndex].status = status;
    mockOrders[orderIndex].updatedAt = new Date();

    res.json({
      success: true,
      data: mockOrders[orderIndex],
      message: 'Order status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update order status'
    });
  }
};

export const getOrdersByPlatform = async (req: Request, res: Response<ApiResponse<Order[]>>) => {
  try {
    const { platform } = req.params;
    const orders = mockOrders.filter(o => o.platform === platform);

    res.json({
      success: true,
      data: orders,
      message: `Orders for ${platform} retrieved successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve orders by platform'
    });
  }
};

export const getOrdersByStatus = async (req: Request, res: Response<ApiResponse<Order[]>>) => {
  try {
    const { status } = req.params;
    const orders = mockOrders.filter(o => o.status === status);

    res.json({
      success: true,
      data: orders,
      message: `Orders with status ${status} retrieved successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve orders by status'
    });
  }
};