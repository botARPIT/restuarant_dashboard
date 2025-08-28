import express from 'express';
import { getDatabasePool } from '../config/database';

const router = express.Router();

// Mock data for when database is not available
const mockDashboardStats = {
  totalOrders: 156,
  totalRevenue: 45230.50,
  pendingOrders: 12,
  completionRate: 87,
  activeOrders: 12
};

const mockDashboardTrends = [
  { date: '2025-08-28', orders: 24, revenue: 3450.00 },
  { date: '2025-08-27', orders: 31, revenue: 4120.50 },
  { date: '2025-08-26', orders: 28, revenue: 3890.25 },
  { date: '2025-08-25', orders: 35, revenue: 4780.75 },
  { date: '2025-08-24', orders: 22, revenue: 2980.00 },
  { date: '2025-08-23', orders: 29, revenue: 3650.50 },
  { date: '2025-08-22', orders: 26, revenue: 3340.25 }
];

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Try to get database pool
    let db;
    try {
      db = getDatabasePool();
    } catch (error) {
      // Database not available, return mock data
      console.log('⚠️ Database not available, returning mock dashboard stats');
      return res.json(mockDashboardStats);
    }

    // Get total orders
    const ordersResult = await db.query('SELECT COUNT(*) as total_orders FROM orders');
    const totalOrders = parseInt(ordersResult.rows[0].total_orders) || 0;

    // Get total revenue
    const revenueResult = await db.query('SELECT COALESCE(SUM(total_price), 0) as total_revenue FROM orders');
    const totalRevenue = parseFloat(revenueResult.rows[0].total_revenue) || 0;

    // Get pending orders
    const pendingResult = await db.query("SELECT COUNT(*) as pending_orders FROM orders WHERE status = 'pending'");
    const pendingOrders = parseInt(pendingResult.rows[0].pending_orders) || 0;

    // Get completed orders
    const completedResult = await db.query("SELECT COUNT(*) as completed_orders FROM orders WHERE status = 'completed'");
    const completedOrders = parseInt(completedResult.rows[0].completed_orders) || 0;

    // Calculate completion rate
    const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

    res.json({
      totalOrders,
      totalRevenue,
      pendingOrders,
      completionRate,
      activeOrders: pendingOrders
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
    // If database query fails, return mock data
    console.log('⚠️ Database query failed, returning mock dashboard stats');
    res.json(mockDashboardStats);
  }
});

// Get dashboard trends
router.get('/trends', async (req, res) => {
  try {
    const { days = 7 } = req.query;

    // Try to get database pool
    let db;
    try {
      db = getDatabasePool();
    } catch (error) {
      // Database not available, return mock data
      console.log('⚠️ Database not available, returning mock dashboard trends');
      return res.json(mockDashboardTrends);
    }

    // Get daily trends for the specified number of days
    const trendsResult = await db.query(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as orders,
        COALESCE(SUM(total_price), 0) as revenue
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    res.json(trendsResult.rows);
  } catch (error) {
    console.error('Error fetching dashboard trends:', error);
    
    // If database query fails, return mock data
    console.log('⚠️ Database query failed, returning mock dashboard trends');
    res.json(mockDashboardTrends);
  }
});

export default router;