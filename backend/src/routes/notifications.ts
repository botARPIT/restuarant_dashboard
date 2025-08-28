import express from 'express';
import { getDatabasePool } from '../config/database';

const router = express.Router();
const db = getDatabasePool();

// Get all notifications
router.get('/', async (req, res) => {
  try {
    const { type, read, search, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (type) {
      whereClause += ` AND type = $${paramIndex++}`;
      params.push(type);
    }

    if (read !== undefined) {
      whereClause += ` AND read = $${paramIndex++}`;
      params.push(read === 'true');
    }

    if (search) {
      whereClause += ` AND (title ILIKE $${paramIndex++} OR message ILIKE $${paramIndex++})`;
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM notifications ${whereClause}`;
    const countResult = await db.query(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].count);

    // Get notifications with pagination
    const notificationsQuery = `
      SELECT * FROM notifications 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    params.push(parseInt(limit as string), offset);

    const notificationsResult = await db.query(notificationsQuery, params);

    res.json({
      notifications: notificationsResult.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get notification by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM notifications WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ error: 'Failed to fetch notification' });
  }
});

// Create new notification
router.post('/', async (req, res) => {
  try {
    const { title, message, type, userId } = req.body;

    const result = await db.query(`
      INSERT INTO notifications (title, message, type, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [title, message, type, userId]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Update notification
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, type, read, userId } = req.body;

    const result = await db.query(`
      UPDATE notifications 
      SET title = $2, message = $3, type = $4, read = $5, 
          user_id = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id, title, message, type, read, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM notifications WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { read = true } = req.body;

    const result = await db.query(`
      UPDATE notifications 
      SET read = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id, read]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating notification read status:', error);
    res.status(500).json({ error: 'Failed to update notification read status' });
  }
});

// Mark all notifications as read
router.patch('/read-all', async (req, res) => {
  try {
    const result = await db.query(`
      UPDATE notifications 
      SET read = true, updated_at = CURRENT_TIMESTAMP
      WHERE read = false
      RETURNING COUNT(*) as updated_count
    `);

    const updatedCount = parseInt(result.rows[0].updated_count);
    res.json({ 
      message: `Marked ${updatedCount} notifications as read`,
      updatedCount 
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

export default router;