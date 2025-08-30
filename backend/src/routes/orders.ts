import express from 'express';
import { getDatabasePool } from '../config/database';

const router = express.Router();
const db = getDatabasePool();

// Mock orders data for fallback
const mockOrders = [
  {
    id: 'ORD001',
    customer: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+91-9876543210',
    items: [
      { name: 'Butter Chicken', quantity: 1, price: 280, category: 'Main Course' },
      { name: 'Naan', quantity: 2, price: 85, category: 'Bread' }
    ],
    totalPrice: 450,
    price: 450,
    status: 'delivered',
    platform: 'Zomato',
    platformOrderId: 'ZOM123456',
    time: '2 hours ago',
    eta: '1:15 PM',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ORD002',
    customer: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '+91-9876543211',
    items: [
      { name: 'Biryani', quantity: 1, price: 320, category: 'Main Course' },
      { name: 'Raita', quantity: 1, price: 60, category: 'Side Dish' }
    ],
    totalPrice: 380,
    price: 380,
    status: 'preparing',
    platform: 'Swiggy',
    platformOrderId: 'SWG789012',
    time: '1 hour ago',
    eta: '1:20 PM',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ORD003',
    customer: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    customerPhone: '+91-9876543212',
    items: [
      { name: 'Tandoori Chicken', quantity: 1, price: 420, category: 'Main Course' },
      { name: 'Dal', quantity: 1, price: 100, category: 'Side Dish' }
    ],
    totalPrice: 520,
    price: 520,
    status: 'ready',
    platform: 'UberEats',
    platformOrderId: 'UBER345678',
    time: '30 mins ago',
    eta: '1:25 PM',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ORD004',
    customer: 'Sarah Wilson',
    customerEmail: 'sarah@example.com',
    customerPhone: '+91-9876543213',
    items: [
      { name: 'Paneer Tikka', quantity: 1, price: 280, category: 'Main Course' },
      { name: 'Rice', quantity: 1, price: 40, category: 'Rice' }
    ],
    totalPrice: 320,
    price: 320,
    status: 'pending',
    platform: 'Zomato',
    platformOrderId: 'ZOM901234',
    time: '15 mins ago',
    eta: '1:30 PM',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ORD005',
    customer: 'David Brown',
    customerEmail: 'david@example.com',
    customerPhone: '+91-9876543214',
    items: [
      { name: 'Chicken Curry', quantity: 1, price: 320, category: 'Main Course' },
      { name: 'Roti', quantity: 2, price: 45, category: 'Bread' }
    ],
    totalPrice: 410,
    price: 410,
    status: 'cancelled',
    platform: 'Swiggy',
    platformOrderId: 'SWG567890',
    time: '45 mins ago',
    eta: '1:35 PM',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Get all orders with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, platform, search } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Try to get data from database first
    try {
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

      // Transform database rows to match frontend expected format
      const transformedOrders = ordersResult.rows.map(row => ({
        id: row.order_id,
        customer: row.customer_name,
        customerEmail: row.customer_email,
        customerPhone: row.customer_phone,
        items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
        totalPrice: row.total_price,
        price: row.total_price, // For backward compatibility
        status: row.status,
        platform: row.platform,
        platformOrderId: row.platform_order_id,
        time: row.created_at ? new Date(row.created_at).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }) : 'Unknown',
        eta: row.eta,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      res.json({
        success: true,
        data: transformedOrders,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit as string))
        }
      });
    } catch (dbError) {
      console.log('⚠️ Database query failed, using mock data:', dbError.message);
      
      // Use mock data as fallback
      let filteredOrders = [...mockOrders];
      
      // Apply filters to mock data
      if (status) {
        filteredOrders = filteredOrders.filter(order => order.status === status);
      }
      
      if (platform) {
        filteredOrders = filteredOrders.filter(order => order.platform.toLowerCase() === platform.toString().toLowerCase());
      }
      
      if (search) {
        const searchLower = search.toString().toLowerCase();
        filteredOrders = filteredOrders.filter(order => 
          order.id.toLowerCase().includes(searchLower) ||
          order.customer.toLowerCase().includes(searchLower) ||
          order.platform.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply pagination
      const totalCount = filteredOrders.length;
      const paginatedOrders = filteredOrders.slice(offset, offset + parseInt(limit as string));
      
      res.json({
        success: true,
        data: paginatedOrders,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit as string))
        }
      });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch orders',
      data: []
    });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to get data from database first
    try {
      const result = await db.query('SELECT * FROM orders WHERE order_id = $1', [id]);
      
      if (result.rows.length > 0) {
        const row = result.rows[0];
        const transformedOrder = {
          id: row.order_id,
          customer: row.customer_name,
          customerEmail: row.customer_email,
          customerPhone: row.customer_phone,
          items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
          totalPrice: row.total_price,
          price: row.total_price,
          status: row.status,
          platform: row.platform,
          platformOrderId: row.platform_order_id,
          time: row.created_at ? new Date(row.created_at).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }) : 'Unknown',
          eta: row.eta,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        };
        
        res.json({
          success: true,
          data: transformedOrder
        });
        return;
      }
    } catch (dbError) {
      console.log('⚠️ Database query failed, using mock data:', dbError.message);
    }
    
    // Fallback to mock data
    const mockOrder = mockOrders.find(order => order.id === id);
    
    if (!mockOrder) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }
    
    res.json({
      success: true,
      data: mockOrder
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch order' 
    });
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