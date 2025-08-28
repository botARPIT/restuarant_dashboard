import express from 'express';
import { getDatabasePool } from '../config/database';

const router = express.Router();
const db = getDatabasePool();

// Get analytics summary
router.get('/summary', async (req, res) => {
  try {
    // Get total orders and revenue
    const summaryResult = await db.query(`
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_price), 0) as total_revenue,
        COUNT(DISTINCT customer_email) as unique_customers
      FROM orders
    `);

    // Get orders by status
    const statusResult = await db.query(`
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
    `);

    // Get orders by platform
    const platformResult = await db.query(`
      SELECT platform, COUNT(*) as count, COALESCE(SUM(total_price), 0) as revenue
      FROM orders
      GROUP BY platform
    `);

    // Get recent trends (last 7 days)
    const trendsResult = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        COALESCE(SUM(total_price), 0) as revenue
      FROM orders 
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    res.json({
      summary: summaryResult.rows[0],
      statusBreakdown: statusResult.rows,
      platformBreakdown: platformResult.rows,
      trends: trendsResult.rows
    });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({ error: 'Failed to fetch analytics summary' });
  }
});

// Get analytics trends
router.get('/trends', async (req, res) => {
  try {
    const { days = 30, groupBy = 'day' } = req.query;
    
    let timeGroup = 'DATE(created_at)';
    if (groupBy === 'hour') {
      timeGroup = 'DATE_TRUNC(\'hour\', created_at)';
    } else if (groupBy === 'week') {
      timeGroup = 'DATE_TRUNC(\'week\', created_at)';
    } else if (groupBy === 'month') {
      timeGroup = 'DATE_TRUNC(\'month\', created_at)';
    }

    const trendsResult = await db.query(`
      SELECT 
        ${timeGroup} as time_period,
        COUNT(*) as orders,
        COALESCE(SUM(total_price), 0) as revenue,
        COUNT(DISTINCT customer_email) as unique_customers
      FROM orders 
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY ${timeGroup}
      ORDER BY time_period DESC
    `);

    res.json(trendsResult.rows);
  } catch (error) {
    console.error('Error fetching analytics trends:', error);
    res.status(500).json({ error: 'Failed to fetch analytics trends' });
  }
});

// Get platform performance
router.get('/platforms', async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const platformResult = await db.query(`
      SELECT 
        platform,
        COUNT(*) as total_orders,
        COALESCE(SUM(total_price), 0) as total_revenue,
        COUNT(DISTINCT customer_email) as unique_customers,
        AVG(total_price) as avg_order_value,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
      FROM orders 
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY platform
      ORDER BY total_revenue DESC
    `);

    // Calculate completion rates
    const platformsWithRates = platformResult.rows.map(platform => ({
      ...platform,
      completion_rate: platform.total_orders > 0 
        ? Math.round((platform.completed_orders / platform.total_orders) * 100) 
        : 0,
      cancellation_rate: platform.total_orders > 0 
        ? Math.round((platform.cancelled_orders / platform.total_orders) * 100) 
        : 0
    }));

    res.json(platformsWithRates);
  } catch (error) {
    console.error('Error fetching platform performance:', error);
    res.status(500).json({ error: 'Failed to fetch platform performance' });
  }
});

// Get customer analytics
router.get('/customers', async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const customerResult = await db.query(`
      SELECT 
        customer_email,
        customer_name,
        COUNT(*) as total_orders,
        COALESCE(SUM(total_price), 0) as total_spent,
        AVG(total_price) as avg_order_value,
        MIN(created_at) as first_order,
        MAX(created_at) as last_order
      FROM orders 
      WHERE created_at >= NOW() - INTERVAL '${days} days'
        AND customer_email IS NOT NULL
      GROUP BY customer_email, customer_name
      ORDER BY total_spent DESC
      LIMIT 100
    `);

    res.json(customerResult.rows);
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    res.status(500).json({ error: 'Failed to fetch customer analytics' });
  }
});

// Get revenue analytics
router.get('/revenue', async (req, res) => {
  try {
    const { days = 30, groupBy = 'day' } = req.query;
    
    let timeGroup = 'DATE(created_at)';
    if (groupBy === 'hour') {
      timeGroup = 'DATE_TRUNC(\'hour\', created_at)';
    } else if (groupBy === 'week') {
      timeGroup = 'DATE_TRUNC(\'week\', created_at)';
    } else if (groupBy === 'month') {
      timeGroup = 'DATE_TRUNC(\'month\', created_at)';
    }

    const revenueResult = await db.query(`
      SELECT 
        ${timeGroup} as time_period,
        COALESCE(SUM(total_price), 0) as revenue,
        COUNT(*) as orders,
        AVG(total_price) as avg_order_value
      FROM orders 
      WHERE created_at >= NOW() - INTERVAL '${days} days'
        AND status != 'cancelled'
      GROUP BY ${timeGroup}
      ORDER BY time_period DESC
    `);

    res.json(revenueResult.rows);
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({ error: 'Failed to fetch revenue analytics' });
  }
});

export default router;