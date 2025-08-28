import express from 'express';
import { getDatabasePool } from '../config/database';

const router = express.Router();
const db = getDatabasePool();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
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
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get dashboard trends
router.get('/trends', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
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
    res.status(500).json({ error: 'Failed to fetch dashboard trends' });
  }
});

export default router;