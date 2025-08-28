import { Request, Response } from 'express';
import { ApiResponse } from '../types';

export const getAnalyticsSummary = (req: Request, res: Response<ApiResponse<any>>) => {
  res.json({
    success: true,
    data: {
      totalOrders: 342,
      totalRevenue: 132450,
      avgOrderValue: 387.5,
      completionRate: 94,
      platforms: [
        { name: 'Zomato', orders: 140, revenue: 54000 },
        { name: 'Swiggy', orders: 160, revenue: 65000 },
        { name: 'UberEats', orders: 12, revenue: 3000 },
        { name: 'Dunzo', orders: 30, revenue: 10450 },
      ],
    },
  });
};

export const getAnalyticsTrends = (req: Request, res: Response<ApiResponse<any>>) => {
  const days = Number(req.query.days || 7);
  const now = new Date();
  const data = Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (days - 1 - i));
    return { date: d.toISOString().slice(0, 10), orders: 30 + Math.floor(Math.random() * 20), revenue: 5000 + Math.floor(Math.random() * 4000) };
  });
  res.json({ success: true, data });
};