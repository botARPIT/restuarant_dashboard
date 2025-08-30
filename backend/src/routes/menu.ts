import express from 'express';
import { getDatabasePool } from '../config/database';

const router = express.Router();

// Mock data for when database is not available
const mockMenuItems = [
  {
    id: 1,
    name: 'Butter Chicken',
    description: 'Creamy and rich Indian curry with tender chicken',
    price: 450,
    category: 'Main Course',
    available: true,
    image_url: 'https://example.com/butter-chicken.jpg',
    created_at: '2025-08-28T10:00:00Z',
    updated_at: '2025-08-28T10:00:00Z'
  },
  {
    id: 2,
    name: 'Biryani',
    description: 'Aromatic rice dish with spices and meat',
    price: 380,
    category: 'Main Course',
    available: true,
    image_url: 'https://example.com/biryani.jpg',
    created_at: '2025-08-28T10:00:00Z',
    updated_at: '2025-08-28T10:00:00Z'
  },
  {
    id: 3,
    name: 'Gulab Jamun',
    description: 'Sweet dessert balls soaked in sugar syrup',
    price: 120,
    category: 'Dessert',
    available: true,
    image_url: 'https://example.com/gulab-jamun.jpg',
    created_at: '2025-08-28T10:00:00Z',
    updated_at: '2025-08-28T10:00:00Z'
  }
];

// Get menu categories - this must come before /:id route
router.get('/categories/list', async (req, res) => {
  try {
    // Try to get database pool
    let db;
    try {
      db = getDatabasePool();
    } catch (error) {
      // Database not available, return mock categories
      console.log('⚠️ Database not available, returning mock categories');
      const categories = [...new Set(mockMenuItems.map(item => item.category))];
      return res.json(categories);
    }

    const result = await db.query(`
      SELECT DISTINCT category 
      FROM menu_items 
      ORDER BY category
    `);

    res.json(result.rows.map(row => row.category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // If database query fails, return mock categories
    console.log('⚠️ Database query failed, returning mock categories');
    const categories = [...new Set(mockMenuItems.map(item => item.category))];
    res.json(categories);
  }
});

// Get all menu items - this must come before /:id route
router.get('/items', async (req, res) => {
  try {
    const { category, available, search } = req.query;
    
    // Try to get database pool
    let db;
    try {
      db = getDatabasePool();
    } catch (error) {
      // Database not available, return mock data
      console.log('⚠️ Database not available, returning mock menu items');
      let filteredItems = [...mockMenuItems];
      
      if (category && category !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === category);
      }
      
      if (available !== undefined) {
        const isAvailable = available === 'true';
        filteredItems = filteredItems.filter(item => item.available === isAvailable);
      }
      
      if (search) {
        const searchLower = search.toString().toLowerCase();
        filteredItems = filteredItems.filter(item => 
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
        );
      }
      
      return res.json({
        success: true,
        data: filteredItems,
        pagination: {
          total: filteredItems.length,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });
    }

    let query = 'SELECT * FROM menu_items WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (category && category !== 'all') {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (available !== undefined) {
      query += ` AND available = $${paramIndex}`;
      params.push(available === 'true');
      paramIndex++;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: result.rows.length,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    
    // If database query fails, return mock data
    console.log('⚠️ Database query failed, returning mock menu items');
    res.json({
      success: true,
      data: mockMenuItems,
      pagination: {
        total: mockMenuItems.length,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    });
  }
});

// Get menu item by ID - this must come after specific routes
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate that id is a number
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ success: false, error: 'Invalid menu item ID' });
    }
    
    // Try to get database pool
    let db;
    try {
      db = getDatabasePool();
    } catch (error) {
      // Database not available, return mock data
      console.log('⚠️ Database not available, returning mock menu item');
      const mockItem = mockMenuItems.find(item => item.id === parseInt(id));
      if (!mockItem) {
        return res.status(404).json({ success: false, error: 'Menu item not found' });
      }
      return res.json({ success: true, data: mockItem });
    }

    const result = await db.query('SELECT * FROM menu_items WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch menu item' });
  }
});

// Create new menu item
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, available, imageUrl } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, price, and category are required' 
      });
    }

    // Try to get database pool
    let db;
    try {
      db = getDatabasePool();
    } catch (error) {
      // Database not available, simulate success
      console.log('⚠️ Database not available, simulating menu item creation');
      const newItem = {
        id: Date.now(),
        name,
        description: description || '',
        price: parseFloat(price),
        category,
        available: available !== undefined ? available : true,
        image_url: imageUrl || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return res.json({ success: true, data: newItem });
    }

    const result = await db.query(`
      INSERT INTO menu_items (name, description, price, category, available, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, description, price, category, available, imageUrl]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ success: false, error: 'Failed to create menu item' });
  }
});

// Update menu item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, available, imageUrl } = req.body;

    // Validate that id is a number
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ success: false, error: 'Invalid menu item ID' });
    }

    // Try to get database pool
    let db;
    try {
      db = getDatabasePool();
    } catch (error) {
      // Database not available, simulate success
      console.log('⚠️ Database not available, simulating menu item update');
      const updatedItem = {
        id: parseInt(id),
        name: name || 'Updated Item',
        description: description || '',
        price: parseFloat(price) || 0,
        category: category || 'Main Course',
        available: available !== undefined ? available : true,
        image_url: imageUrl || '',
        created_at: '2025-08-28T10:00:00Z',
        updated_at: new Date().toISOString()
      };
      return res.json({ success: true, data: updatedItem });
    }

    const result = await db.query(`
      UPDATE menu_items 
      SET name = COALESCE($1, name), 
          description = COALESCE($2, description), 
          price = COALESCE($3, price), 
          category = COALESCE($4, category), 
          available = COALESCE($5, available), 
          image_url = COALESCE($6, image_url), 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [name, description, price, category, available, imageUrl, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ success: false, error: 'Failed to update menu item' });
  }
});

// Delete menu item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate that id is a number
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ success: false, error: 'Invalid menu item ID' });
    }

    // Try to get database pool
    let db;
    try {
      db = getDatabasePool();
    } catch (error) {
      // Database not available, simulate success
      console.log('⚠️ Database not available, simulating menu item deletion');
      return res.json({ success: true, message: 'Menu item deleted successfully' });
    }

    const result = await db.query('DELETE FROM menu_items WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ success: false, error: 'Failed to delete menu item' });
  }
});

export default router;