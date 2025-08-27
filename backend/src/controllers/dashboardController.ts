import { Request, Response } from 'express';
import { DashboardStats, ApiResponse } from '../types';

// Mock data - in production this would come from database
const mockDashboardStats: DashboardStats = {
  totalOrders: 47,
  totalRevenue: 18450,
  activeOrders: 12,
  completionRate: 94,
  platformStats: [
    {
      platformId: '1',
      platformName: 'Zomato',
      orders: 18,
      revenue: 7200,
      change: 15,
      status: 'active'
    },
    {
      platformId: '2',
      platformName: 'Swiggy',
      orders: 23,
      revenue: 8900,
      change: 8,
      status: 'active'
    },
    {
      platformId: '3',
      platformName: 'UberEats',
      orders: 0,
      revenue: 0,
      change: 0,
      status: 'inactive'
    },
    {
      platformId: '4',
      platformName: 'Dunzo',
      orders: 6,
      revenue: 2350,
      change: -5,
      status: 'active'
    }
  ],
  recentOrders: [
    {
      id: 'ZOM-001',
      status: 'preparing',
      customer: 'John Doe',
      time: '12:45 PM',
      items: [
        { name: 'Butter Chicken', quantity: 1, price: 450 },
        { name: 'Naan Bread', quantity: 2, price: 120 },
        { name: 'Rice', quantity: 1, price: 80 }
      ],
      totalPrice: 850,
      eta: '1:15 PM',
      platform: 'zomato',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'SWG-002',
      status: 'ready',
      customer: 'Sarah Wilson',
      time: '12:50 PM',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 550 },
        { name: 'Garlic Bread', quantity: 1, price: 100 }
      ],
      totalPrice: 650,
      eta: '1:20 PM',
      platform: 'swiggy',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  dailyTrends: [
    { date: '2024-01-01', orders: 45, revenue: 17500 },
    { date: '2024-01-02', orders: 52, revenue: 19800 },
    { date: '2024-01-03', orders: 47, revenue: 18450 }
  ]
};

export const getDashboardStats = async (req: Request, res: Response<ApiResponse<DashboardStats>>) => {
  try {
    // In production, fetch from database
    // const stats = await dashboardService.getStats();
    
    res.json({
      success: true,
      data: mockDashboardStats,
      message: 'Dashboard statistics retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve dashboard statistics'
    });
  }
};

export const getDailyTrends = async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const { days = 7 } = req.query;
    
    // In production, fetch from database based on days parameter
    const trends = mockDashboardStats.dailyTrends.slice(-Number(days));
    
    res.json({
      success: true,
      data: trends,
      message: 'Daily trends retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve daily trends'
    });
  }
};