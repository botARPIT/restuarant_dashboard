import { Pool, PoolConfig, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration interface
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean | { rejectUnauthorized: boolean };
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

// Get database configuration from environment variables
const getDatabaseConfig = (): DatabaseConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'restaurant_dashboard',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'mysecretpassword',
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000')
  };
};

// Create database pool
let pool: Pool | null = null;

export const getDatabasePool = (): Pool => {
  if (!pool) {
    const config = getDatabaseConfig();
    
    const poolConfig: PoolConfig = {
      ...config,
      // Additional pool configuration
      min: parseInt(process.env.DB_MIN_CONNECTIONS || '2'),
      // Only use valid PoolConfig properties
    };

    pool = new Pool(poolConfig);

    // Pool event handlers
    pool.on('connect', (client: PoolClient) => {
      console.log('🔌 New client connected to database');
    });

    pool.on('error', (err: Error, client: PoolClient) => {
      console.error('❌ Unexpected error on idle client', err);
    });

    pool.on('remove', (client: PoolClient) => {
      console.log('🔌 Client removed from pool');
    });
  }

  return pool;
};

// Test database connection
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const pool = getDatabasePool();
    const client = await pool.connect();
    
    // Test query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database connection successful:', result.rows[0].current_time);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Close database pool
export const closeDatabasePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('🔌 Database pool closed');
  }
};

// Health check for database
export const getDatabaseHealth = async (): Promise<{
  status: 'healthy' | 'unhealthy';
  message: string;
  timestamp: string;
}> => {
  try {
    const pool = getDatabasePool();
    const client = await pool.connect();
    
    // Check if we can execute a simple query
    await client.query('SELECT 1');
    
    // Get pool statistics
    const poolStats = {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    };
    
    client.release();
    
    return {
      status: 'healthy',
      message: `Database is healthy. Pool stats: ${JSON.stringify(poolStats)}`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Database connection failed: ${error}`,
      timestamp: new Date().toISOString()
    };
  }
};

// Database migration helper
export const runMigration = async (sql: string): Promise<void> => {
  try {
    const pool = getDatabasePool();
    const client = await pool.connect();
    
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    
    client.release();
    console.log('✅ Migration executed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Initialize database tables
export const initializeDatabase = async (): Promise<void> => {
  const createTablesSQL = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'staff',
      avatar VARCHAR(10),
      phone VARCHAR(20),
      bio TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Orders table
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_id VARCHAR(50) UNIQUE NOT NULL,
      customer_name VARCHAR(100) NOT NULL,
      customer_email VARCHAR(255),
      customer_phone VARCHAR(20),
      items JSONB NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      platform VARCHAR(50) NOT NULL,
      platform_order_id VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Menu items table
    CREATE TABLE IF NOT EXISTS menu_items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      category VARCHAR(50) NOT NULL,
      available BOOLEAN DEFAULT true,
      image_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Customers table
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20),
      total_orders INTEGER DEFAULT 0,
      total_spent DECIMAL(10,2) DEFAULT 0,
      last_order_at TIMESTAMP,
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Notifications table
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(20) NOT NULL DEFAULT 'info',
      read BOOLEAN DEFAULT false,
      user_id INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Platform integrations table
    CREATE TABLE IF NOT EXISTS platform_integrations (
      id SERIAL PRIMARY KEY,
      platform VARCHAR(50) NOT NULL UNIQUE,
      api_key VARCHAR(500),
      api_secret VARCHAR(500),
      webhook_url VARCHAR(500),
      is_active BOOLEAN DEFAULT true,
      settings JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_platform ON orders(platform);
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
    CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
    CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
    CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
  `;

  try {
    await runMigration(createTablesSQL);
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database tables:', error);
    throw error;
  }
};

export default {
  getDatabasePool,
  testDatabaseConnection,
  closeDatabasePool,
  getDatabaseHealth,
  runMigration,
  initializeDatabase
};