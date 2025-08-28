import express from 'express';
import { getDatabasePool } from '../config/database';

const router = express.Router();
const db = getDatabasePool();

// Get all platforms
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM platform_integrations 
      ORDER BY platform
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    res.status(500).json({ error: 'Failed to fetch platforms' });
  }
});

// Get platform by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM platform_integrations WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Platform not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching platform:', error);
    res.status(500).json({ error: 'Failed to fetch platform' });
  }
});

// Get platform statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get platform info
    const platformResult = await db.query('SELECT platform FROM platform_integrations WHERE id = $1', [id]);
    
    if (platformResult.rows.length === 0) {
      return res.status(404).json({ error: 'Platform not found' });
    }

    const platformName = platformResult.rows[0].platform;

    // Get platform statistics
    const statsResult = await db.query(`
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_price), 0) as total_revenue,
        COUNT(DISTINCT customer_email) as unique_customers,
        AVG(total_price) as avg_order_value,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
      FROM orders 
      WHERE platform = $1
    `, [platformName]);

    // Get recent orders
    const recentOrdersResult = await db.query(`
      SELECT * FROM orders 
      WHERE platform = $1
      ORDER BY created_at DESC 
      LIMIT 5
    `, [platformName]);

    // Get daily trends for last 7 days
    const trendsResult = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        COALESCE(SUM(total_price), 0) as revenue
      FROM orders 
      WHERE platform = $1 
        AND created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [platformName]);

    const stats = statsResult.rows[0];
    const completionRate = stats.total_orders > 0 
      ? Math.round((stats.completed_orders / stats.total_orders) * 100) 
      : 0;

    res.json({
      platform: platformName,
      stats: {
        ...stats,
        completion_rate: completionRate
      },
      recentOrders: recentOrdersResult.rows,
      trends: trendsResult.rows
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({ error: 'Failed to fetch platform statistics' });
  }
});

// Create new platform
router.post('/', async (req, res) => {
  try {
    const { platform, apiKey, apiSecret, webhookUrl, isActive, settings } = req.body;

    const result = await db.query(`
      INSERT INTO platform_integrations (platform, api_key, api_secret, webhook_url, is_active, settings)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [platform, apiKey, apiSecret, webhookUrl, isActive, JSON.stringify(settings)]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating platform:', error);
    res.status(500).json({ error: 'Failed to create platform' });
  }
});

// Update platform
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, apiKey, apiSecret, webhookUrl, isActive, settings } = req.body;

    const result = await db.query(`
      UPDATE platform_integrations 
      SET platform = $2, api_key = $3, api_secret = $4, webhook_url = $5, 
          is_active = $6, settings = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id, platform, apiKey, apiSecret, webhookUrl, isActive, JSON.stringify(settings)]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Platform not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating platform:', error);
    res.status(500).json({ error: 'Failed to update platform' });
  }
});

// Delete platform
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM platform_integrations WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Platform not found' });
    }

    res.json({ message: 'Platform deleted successfully' });
  } catch (error) {
    console.error('Error deleting platform:', error);
    res.status(500).json({ error: 'Failed to delete platform' });
  }
});

// Toggle platform status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(`
      UPDATE platform_integrations 
      SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Platform not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error toggling platform status:', error);
    res.status(500).json({ error: 'Failed to toggle platform status' });
  }
});

export default router;