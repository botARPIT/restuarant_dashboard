import express from 'express';
import { getDatabasePool } from '../config/database';

const router = express.Router();
const db = getDatabasePool();

// Get all orders with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, platform, search } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      whereClause += ` AND status = $${paramIndex++}`;
      params.push(status);
    }

    if (platform) {
      whereClause += ` AND platform = $${paramIndex++}`;
      params.push(platform);
    }

    if (search) {
      whereClause += ` AND (customer_name ILIKE $${paramIndex++} OR order_id ILIKE $${paramIndex++})`;
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM orders ${whereClause}`;
    const countResult = await db.query(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].count);

    // Get orders with pagination
    const ordersQuery = `
      SELECT * FROM orders 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    params.push(parseInt(limit as string), offset);

    const ordersResult = await db.query(ordersQuery, params);

    res.json({
      orders: ordersResult.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, items, totalPrice, platform, platformOrderId } = req.body;

    const result = await db.query(`
      INSERT INTO orders (order_id, customer_name, customer_email, customer_phone, items, total_price, platform, platform_order_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      `ORD${Date.now()}`,
      customerName,
      customerEmail,
      customerPhone,
      JSON.stringify(items),
      totalPrice,
      platform,
      platformOrderId
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, customerEmail, customerPhone, items, totalPrice, status, platform, platformOrderId } = req.body;

    const result = await db.query(`
      UPDATE orders 
      SET customer_name = $2, customer_email = $3, customer_phone = $4, 
          items = $5, total_price = $6, status = $7, platform = $8, 
          platform_order_id = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id, customerName, customerEmail, customerPhone, JSON.stringify(items), totalPrice, status, platform, platformOrderId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await db.query(`
      UPDATE orders 
      SET status = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id, status]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get orders by platform
router.get('/platform/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const result = await db.query(`
      SELECT * FROM orders 
      WHERE platform = $1
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `, [platform, parseInt(limit as string), offset]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching platform orders:', error);
    res.status(500).json({ error: 'Failed to fetch platform orders' });
  }
});

// Get orders by status
router.get('/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const result = await db.query(`
      SELECT * FROM orders 
      WHERE status = $1
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `, [status, parseInt(limit as string), offset]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching status orders:', error);
    res.status(500).json({ error: 'Failed to fetch status orders' });
  }
});

export default router;