import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env } from '../index';

const orderRoutes = new Hono<{ Bindings: Env }>();

// Validation schemas
const orderFiltersSchema = z.object({
  status: z.array(z.string()).optional(),
  platform: z.array(z.string()).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().min(1).max(100).optional().default(20),
  offset: z.number().min(0).optional().default(0)
});

const orderStatusUpdateSchema = z.object({
  status: z.enum([
    'received', 'confirmed', 'preparing', 'ready', 
    'picked_up', 'out_for_delivery', 'delivered', 'cancelled'
  ]),
  notes: z.string().optional(),
  estimatedTime: z.number().optional()
});

const orderCancelSchema = z.object({
  reason: z.string().min(1).max(500),
  refundAmount: z.number().optional()
});

// GET /api/v1/orders - Get orders with filters
orderRoutes.get('/', zValidator('query', orderFiltersSchema), async (c) => {
  try {
    const filters = c.req.valid('query');
    const user = c.get('jwtPayload');
    
    if (!user?.restaurantId) {
      return c.json({ error: 'Restaurant ID not found' }, 400);
    }

    // Build SQL query based on filters
    let sql = `
      SELECT 
        o.*,
        p.name as platform_name,
        r.name as restaurant_name
      FROM orders o
      LEFT JOIN platforms p ON o.platform_id = p.id
      LEFT JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.restaurant_id = ?
    `;
    
    const params: any[] = [user.restaurantId];

    // Add filters
    if (filters.status?.length) {
      sql += ` AND o.status IN (${filters.status.map(() => '?').join(',')})`;
      params.push(...filters.status);
    }

    if (filters.platform?.length) {
      sql += ` AND p.name IN (${filters.platform.map(() => '?').join(',')})`;
      params.push(...filters.platform);
    }

    if (filters.startDate) {
      sql += ` AND o.created_at >= ?`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      sql += ` AND o.created_at <= ?`;
      params.push(filters.endDate);
    }

    sql += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
    params.push(filters.limit, filters.offset);

    const { results } = await c.env.DB.prepare(sql).bind(...params).all();

    // Get total count for pagination
    let countSql = `
      SELECT COUNT(*) as total
      FROM orders o
      LEFT JOIN platforms p ON o.platform_id = p.id
      WHERE o.restaurant_id = ?
    `;
    const countParams = [user.restaurantId];

    if (filters.status?.length) {
      countSql += ` AND o.status IN (${filters.status.map(() => '?').join(',')})`;
      countParams.push(...filters.status);
    }

    if (filters.platform?.length) {
      countSql += ` AND p.name IN (${filters.platform.map(() => '?').join(',')})`;
      countParams.push(...filters.platform);
    }

    if (filters.startDate) {
      countSql += ` AND o.created_at >= ?`;
      countParams.push(filters.startDate);
    }

    if (filters.endDate) {
      countSql += ` AND o.created_at <= ?`;
      countParams.push(filters.endDate);
    }

    const { results: countResults } = await c.env.DB.prepare(countSql).bind(...countParams).all();
    const total = (countResults[0] as any)?.total || 0;

    // Transform results to include parsed JSON fields
    const orders = results.map((order: any) => ({
      ...order,
      customer: JSON.parse(order.customer_data),
      items: JSON.parse(order.items_data),
      pricing: JSON.parse(order.pricing_data),
      delivery: JSON.parse(order.delivery_data),
      timeline: JSON.parse(order.timeline_data || '[]'),
      metadata: JSON.parse(order.metadata || '{}')
    }));

    return c.json({
      orders,
      pagination: {
        total,
        limit: filters.limit,
        offset: filters.offset,
        hasMore: filters.offset + filters.limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// GET /api/v1/orders/:id - Get order details
orderRoutes.get('/:id', async (c) => {
  try {
    const orderId = c.req.param('id');
    const user = c.get('jwtPayload');

    const { results } = await c.env.DB.prepare(`
      SELECT 
        o.*,
        p.name as platform_name,
        r.name as restaurant_name
      FROM orders o
      LEFT JOIN platforms p ON o.platform_id = p.id
      LEFT JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.id = ? AND o.restaurant_id = ?
    `).bind(orderId, user.restaurantId).all();

    if (results.length === 0) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const order = results[0] as any;
    
    // Parse JSON fields
    const orderDetails = {
      ...order,
      customer: JSON.parse(order.customer_data),
      items: JSON.parse(order.items_data),
      pricing: JSON.parse(order.pricing_data),
      delivery: JSON.parse(order.delivery_data),
      timeline: JSON.parse(order.timeline_data || '[]'),
      metadata: JSON.parse(order.metadata || '{}')
    };

    return c.json({ order: orderDetails });

  } catch (error) {
    console.error('Error fetching order details:', error);
    return c.json({ error: 'Failed to fetch order details' }, 500);
  }
});

// PUT /api/v1/orders/:id/status - Update order status
orderRoutes.put('/:id/status', zValidator('json', orderStatusUpdateSchema), async (c) => {
  try {
    const orderId = c.req.param('id');
    const updateData = c.req.valid('json');
    const user = c.get('jwtPayload');

    // First, get the current order
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM orders WHERE id = ? AND restaurant_id = ?
    `).bind(orderId, user.restaurantId).all();

    if (results.length === 0) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const currentOrder = results[0] as any;
    const currentTimeline = JSON.parse(currentOrder.timeline_data || '[]');

    // Add new event to timeline
    const newEvent = {
      type: 'status_updated',
      timestamp: new Date().toISOString(),
      description: `Order status updated to ${updateData.status}`,
      metadata: {
        previousStatus: currentOrder.status,
        newStatus: updateData.status,
        notes: updateData.notes,
        updatedBy: user.userId
      }
    };

    const updatedTimeline = [...currentTimeline, newEvent];

    // Update order in database
    await c.env.DB.prepare(`
      UPDATE orders 
      SET 
        status = ?,
        timeline_data = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND restaurant_id = ?
    `).bind(
      updateData.status,
      JSON.stringify(updatedTimeline),
      orderId,
      user.restaurantId
    ).run();

    // Get Durable Object for real-time updates
    const orderManagerId = c.env.ORDER_MANAGER.idFromName(user.restaurantId);
    const orderManager = c.env.ORDER_MANAGER.get(orderManagerId);

    // Send update to Durable Object for real-time sync
    await orderManager.fetch(`https://dummy/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        status: updateData.status,
        timestamp: new Date().toISOString(),
        platform: currentOrder.platform_order_id.split('_')[0] // Extract platform from ID
      })
    });

    // Queue order for platform sync
    await c.env.ORDER_QUEUE.send({
      type: 'sync_order_status',
      orderId,
      status: updateData.status,
      platformOrderId: currentOrder.platform_order_id,
      platform: currentOrder.platform_id,
      estimatedTime: updateData.estimatedTime
    });

    return c.json({ 
      success: true, 
      message: 'Order status updated successfully',
      orderId,
      newStatus: updateData.status
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    return c.json({ error: 'Failed to update order status' }, 500);
  }
});

// POST /api/v1/orders/:id/cancel - Cancel order
orderRoutes.post('/:id/cancel', zValidator('json', orderCancelSchema), async (c) => {
  try {
    const orderId = c.req.param('id');
    const cancelData = c.req.valid('json');
    const user = c.get('jwtPayload');

    // Get the current order
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM orders WHERE id = ? AND restaurant_id = ?
    `).bind(orderId, user.restaurantId).all();

    if (results.length === 0) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const currentOrder = results[0] as any;

    // Check if order can be cancelled
    const cancellableStatuses = ['received', 'confirmed', 'preparing'];
    if (!cancellableStatuses.includes(currentOrder.status)) {
      return c.json({ 
        error: 'Order cannot be cancelled in current status',
        currentStatus: currentOrder.status 
      }, 400);
    }

    const currentTimeline = JSON.parse(currentOrder.timeline_data || '[]');

    // Add cancellation event to timeline
    const cancellationEvent = {
      type: 'order_cancelled',
      timestamp: new Date().toISOString(),
      description: `Order cancelled: ${cancelData.reason}`,
      metadata: {
        reason: cancelData.reason,
        refundAmount: cancelData.refundAmount,
        cancelledBy: user.userId
      }
    };

    const updatedTimeline = [...currentTimeline, cancellationEvent];

    // Update order status to cancelled
    await c.env.DB.prepare(`
      UPDATE orders 
      SET 
        status = 'cancelled',
        timeline_data = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND restaurant_id = ?
    `).bind(
      JSON.stringify(updatedTimeline),
      orderId,
      user.restaurantId
    ).run();

    // Send real-time update
    const orderManagerId = c.env.ORDER_MANAGER.idFromName(user.restaurantId);
    const orderManager = c.env.ORDER_MANAGER.get(orderManagerId);

    await orderManager.fetch(`https://dummy/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        status: 'cancelled',
        timestamp: new Date().toISOString(),
        platform: currentOrder.platform_order_id.split('_')[0]
      })
    });

    // Queue for platform cancellation
    await c.env.ORDER_QUEUE.send({
      type: 'cancel_order',
      orderId,
      platformOrderId: currentOrder.platform_order_id,
      platform: currentOrder.platform_id,
      reason: cancelData.reason,
      refundAmount: cancelData.refundAmount
    });

    // Queue notification
    await c.env.NOTIFICATION_QUEUE.send({
      type: 'order_cancelled',
      orderId,
      customerPhone: JSON.parse(currentOrder.customer_data).phone,
      reason: cancelData.reason
    });

    return c.json({ 
      success: true, 
      message: 'Order cancelled successfully',
      orderId,
      cancellationReason: cancelData.reason
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    return c.json({ error: 'Failed to cancel order' }, 500);
  }
});

// GET /api/v1/orders/stats/summary - Get order statistics
orderRoutes.get('/stats/summary', async (c) => {
  try {
    const user = c.get('jwtPayload');
    const timeFilter = c.req.query('period') || 'today'; // today, week, month

    let dateCondition = '';
    switch (timeFilter) {
      case 'today':
        dateCondition = "AND DATE(created_at) = DATE('now')";
        break;
      case 'week':
        dateCondition = "AND created_at >= DATE('now', '-7 days')";
        break;
      case 'month':
        dateCondition = "AND created_at >= DATE('now', '-1 month')";
        break;
    }

    const { results } = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
        COUNT(CASE WHEN status IN ('received', 'confirmed', 'preparing', 'ready', 'picked_up', 'out_for_delivery') THEN 1 END) as active_orders,
        AVG(CASE WHEN status = 'delivered' THEN CAST(JSON_EXTRACT(pricing_data, '$.total') as REAL) END) as avg_order_value,
        SUM(CASE WHEN status = 'delivered' THEN CAST(JSON_EXTRACT(pricing_data, '$.total') as REAL) ELSE 0 END) as total_revenue
      FROM orders 
      WHERE restaurant_id = ? ${dateCondition}
    `).bind(user.restaurantId).all();

    const stats = results[0] as any;

    return c.json({
      summary: {
        totalOrders: stats.total_orders || 0,
        completedOrders: stats.completed_orders || 0,
        cancelledOrders: stats.cancelled_orders || 0,
        activeOrders: stats.active_orders || 0,
        averageOrderValue: Math.round((stats.avg_order_value || 0) * 100) / 100,
        totalRevenue: Math.round((stats.total_revenue || 0) * 100) / 100,
        completionRate: stats.total_orders > 0 ? 
          Math.round((stats.completed_orders / stats.total_orders) * 100 * 100) / 100 : 0
      },
      period: timeFilter
    });

  } catch (error) {
    console.error('Error fetching order statistics:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

// GET /api/v1/orders/realtime/connect - WebSocket connection for real-time updates
orderRoutes.get('/realtime/connect', async (c) => {
  try {
    const user = c.get('jwtPayload');
    
    if (!user?.restaurantId) {
      return c.json({ error: 'Restaurant ID required' }, 400);
    }

    // Get Durable Object for this restaurant
    const orderManagerId = c.env.ORDER_MANAGER.idFromName(user.restaurantId);
    const orderManager = c.env.ORDER_MANAGER.get(orderManagerId);

    // Forward WebSocket upgrade to Durable Object
    return orderManager.fetch(c.req);

  } catch (error) {
    console.error('Error establishing WebSocket connection:', error);
    return c.json({ error: 'Failed to establish real-time connection' }, 500);
  }
});

export { orderRoutes };