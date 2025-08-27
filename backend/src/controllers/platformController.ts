import { Request, Response } from 'express';
import { Platform, ApiResponse } from '../types';

// Mock platforms data - in production this would come from database
let mockPlatforms: Platform[] = [
  {
    id: '1',
    name: 'Zomato',
    status: 'active',
    apiKey: 'zomato_api_key_123',
    apiSecret: 'zomato_secret_456',
    webhookUrl: 'https://restaurant.com/webhooks/zomato',
    orders: 18,
    revenue: 7200,
    change: 15,
    icon: 'Z',
    color: 'bg-red-500',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Swiggy',
    status: 'active',
    apiKey: 'swiggy_api_key_789',
    apiSecret: 'swiggy_secret_012',
    webhookUrl: 'https://restaurant.com/webhooks/swiggy',
    orders: 23,
    revenue: 8900,
    change: 8,
    icon: 'S',
    color: 'bg-orange-500',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'UberEats',
    status: 'inactive',
    apiKey: 'uber_api_key_345',
    apiSecret: 'uber_secret_678',
    webhookUrl: 'https://restaurant.com/webhooks/uber',
    orders: 0,
    revenue: 0,
    change: 0,
    icon: 'U',
    color: 'bg-black',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Dunzo',
    status: 'active',
    apiKey: 'dunzo_api_key_901',
    apiSecret: 'dunzo_secret_234',
    webhookUrl: 'https://restaurant.com/webhooks/dunzo',
    orders: 6,
    revenue: 2350,
    change: -5,
    icon: 'D',
    color: 'bg-blue-500',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const getAllPlatforms = async (req: Request, res: Response<ApiResponse<Platform[]>>) => {
  try {
    res.json({
      success: true,
      data: mockPlatforms,
      message: 'Platforms retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve platforms'
    });
  }
};

export const getPlatformById = async (req: Request, res: Response<ApiResponse<Platform>>) => {
  try {
    const { id } = req.params;
    const platform = mockPlatforms.find(p => p.id === id);

    if (!platform) {
      return res.status(404).json({
        success: false,
        error: 'Platform not found'
      });
    }

    res.json({
      success: true,
      data: platform,
      message: 'Platform retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve platform'
    });
  }
};

export const updatePlatformStatus = async (req: Request, res: Response<ApiResponse<Platform>>) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const platformIndex = mockPlatforms.findIndex(p => p.id === id);
    if (platformIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Platform not found'
      });
    }

    mockPlatforms[platformIndex].status = status;
    mockPlatforms[platformIndex].updatedAt = new Date();

    res.json({
      success: true,
      data: mockPlatforms[platformIndex],
      message: 'Platform status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update platform status'
    });
  }
};

export const getPlatformStats = async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const { id } = req.params;
    const platform = mockPlatforms.find(p => p.id === id);

    if (!platform) {
      return res.status(404).json({
        success: false,
        error: 'Platform not found'
      });
    }

    // In production, calculate real-time stats from orders
    const stats = {
      platformId: platform.id,
      platformName: platform.name,
      orders: platform.orders,
      revenue: platform.revenue,
      change: platform.change,
      status: platform.status,
      averageOrderValue: platform.orders > 0 ? platform.revenue / platform.orders : 0,
      lastUpdated: platform.updatedAt
    };

    res.json({
      success: true,
      data: stats,
      message: 'Platform statistics retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve platform statistics'
    });
  }
};