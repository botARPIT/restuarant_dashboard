-- Unified Restaurant Dashboard - Database Schema
-- Using D1 (SQLite) for Cloudflare Workers

-- Users and Authentication
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'restaurant_owner' CHECK (role IN ('restaurant_owner', 'manager', 'staff', 'admin')),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME
);

-- Restaurants
CREATE TABLE IF NOT EXISTS restaurants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL REFERENCES users(id),
    cuisine_type TEXT,
    restaurant_type TEXT CHECK (restaurant_type IN ('dine_in', 'cloud_kitchen', 'food_truck', 'cafe', 'quick_service')),
    address_street TEXT,
    address_city TEXT,
    address_state TEXT,
    address_country TEXT,
    address_zipcode TEXT,
    phone TEXT,
    email TEXT,
    latitude REAL,
    longitude REAL,
    operating_hours JSON, -- Store opening/closing times
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    subscription_plan TEXT DEFAULT 'starter',
    subscription_status TEXT DEFAULT 'active',
    timezone TEXT DEFAULT 'UTC',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Platform Connections
CREATE TABLE IF NOT EXISTS platforms (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL, -- 'swiggy', 'zomato', 'ubereats', etc.
    display_name TEXT NOT NULL,
    api_base_url TEXT NOT NULL,
    supported_countries JSON, -- Array of country codes
    integration_type TEXT CHECK (integration_type IN ('api', 'webhook', 'scraping')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deprecated')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Restaurant Platform Connections
CREATE TABLE IF NOT EXISTS restaurant_platforms (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
    platform_id TEXT NOT NULL REFERENCES platforms(id),
    platform_restaurant_id TEXT, -- Restaurant ID on the platform
    partner_id TEXT,
    api_key TEXT, -- Encrypted
    api_secret TEXT, -- Encrypted
    access_token TEXT, -- Encrypted
    refresh_token TEXT, -- Encrypted
    token_expires_at DATETIME,
    webhook_url TEXT,
    webhook_secret TEXT, -- Encrypted
    connection_status TEXT DEFAULT 'active' CHECK (connection_status IN ('active', 'inactive', 'error', 'expired')),
    last_sync_at DATETIME,
    sync_enabled BOOLEAN DEFAULT TRUE,
    rate_limit_requests_per_minute INTEGER DEFAULT 60,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(restaurant_id, platform_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
    platform_id TEXT NOT NULL REFERENCES platforms(id),
    platform_order_id TEXT NOT NULL, -- Order ID from the platform
    unified_order_id TEXT UNIQUE, -- Our internal unified ID
    status TEXT NOT NULL CHECK (status IN ('received', 'confirmed', 'preparing', 'ready', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled', 'refunded')),
    order_type TEXT CHECK (order_type IN ('delivery', 'pickup', 'dine_in')),
    customer_data JSON NOT NULL, -- Encrypted customer information
    items_data JSON NOT NULL, -- Order items with details
    pricing_data JSON NOT NULL, -- Pricing breakdown
    delivery_data JSON, -- Delivery information
    timeline_data JSON, -- Order status timeline
    metadata JSON, -- Platform-specific additional data
    estimated_prep_time INTEGER, -- Minutes
    actual_prep_time INTEGER, -- Minutes
    estimated_delivery_time DATETIME,
    actual_delivery_time DATETIME,
    customer_rating INTEGER CHECK (customer_rating BETWEEN 1 AND 5),
    customer_feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(platform_id, platform_order_id)
);

-- Menu Management
CREATE TABLE IF NOT EXISTS menu_categories (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
    name TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
    category_id TEXT REFERENCES menu_categories(id),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    is_available BOOLEAN DEFAULT TRUE,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    spice_level TEXT CHECK (spice_level IN ('mild', 'medium', 'hot', 'very_hot')),
    preparation_time INTEGER, -- Minutes
    calories INTEGER,
    images JSON, -- Array of image URLs
    ingredients JSON, -- Array of ingredients
    allergens JSON, -- Array of allergens
    customizations JSON, -- Available customizations
    platform_specific_data JSON, -- Platform-specific item data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Menu Item Platform Mapping
CREATE TABLE IF NOT EXISTS menu_item_platforms (
    id TEXT PRIMARY KEY,
    menu_item_id TEXT NOT NULL REFERENCES menu_items(id),
    platform_id TEXT NOT NULL REFERENCES platforms(id),
    platform_item_id TEXT, -- Item ID on the platform
    platform_category_id TEXT,
    platform_price DECIMAL(10,2),
    is_available BOOLEAN DEFAULT TRUE,
    last_synced_at DATETIME,
    sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'error')),
    sync_error TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(menu_item_id, platform_id)
);

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
    event_type TEXT NOT NULL, -- 'order_placed', 'order_completed', 'menu_viewed', etc.
    event_category TEXT, -- 'order', 'menu', 'customer', 'platform'
    platform_id TEXT REFERENCES platforms(id),
    order_id TEXT REFERENCES orders(id),
    customer_id TEXT, -- Anonymized customer identifier
    event_data JSON, -- Event-specific data
    session_id TEXT,
    user_agent TEXT,
    ip_address TEXT, -- Hashed for privacy
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE
);

-- Customer Analytics (Aggregated and Anonymized)
CREATE TABLE IF NOT EXISTS customer_analytics (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
    customer_hash TEXT NOT NULL, -- Hashed customer identifier
    first_order_date DATE,
    last_order_date DATE,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    average_order_value DECIMAL(10,2) DEFAULT 0,
    favorite_items JSON, -- Array of frequently ordered items
    preferred_platforms JSON, -- Platform preference data
    customer_lifetime_value DECIMAL(10,2) DEFAULT 0,
    churn_risk_score DECIMAL(3,2), -- 0.00 to 1.00
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(restaurant_id, customer_hash)
);

-- Daily Analytics Aggregations
CREATE TABLE IF NOT EXISTS daily_analytics (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
    platform_id TEXT REFERENCES platforms(id),
    date DATE NOT NULL,
    total_orders INTEGER DEFAULT 0,
    completed_orders INTEGER DEFAULT 0,
    cancelled_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    average_order_value DECIMAL(10,2) DEFAULT 0,
    average_prep_time INTEGER, -- Minutes
    customer_rating_avg DECIMAL(3,2), -- Average rating
    peak_hour INTEGER, -- Hour of day with most orders (0-23)
    top_items JSON, -- Most ordered items
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(restaurant_id, platform_id, date)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
    user_id TEXT REFERENCES users(id),
    type TEXT NOT NULL, -- 'order', 'system', 'marketing', 'alert'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSON, -- Additional notification data
    channel TEXT CHECK (channel IN ('in_app', 'email', 'sms', 'push')),
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    scheduled_at DATETIME,
    sent_at DATETIME,
    read_at DATETIME,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- System Logs
CREATE TABLE IF NOT EXISTS system_logs (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT REFERENCES restaurants(id),
    user_id TEXT REFERENCES users(id),
    action TEXT NOT NULL, -- 'login', 'order_update', 'menu_sync', etc.
    entity_type TEXT, -- 'order', 'menu', 'user', 'platform'
    entity_id TEXT, -- ID of the affected entity
    old_data JSON, -- Previous state (for updates)
    new_data JSON, -- New state (for updates)
    ip_address TEXT,
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    execution_time_ms INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Data Deletion Requests (GDPR Compliance)
CREATE TABLE IF NOT EXISTS data_deletions (
    id TEXT PRIMARY KEY,
    customer_id TEXT,
    restaurant_id TEXT REFERENCES restaurants(id),
    request_type TEXT CHECK (request_type IN ('customer_request', 'automatic_cleanup', 'gdpr_request')),
    deletion_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    deleted_records_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_platform_id ON orders(platform_id);
CREATE INDEX IF NOT EXISTS idx_orders_unified_id ON orders(unified_order_id);

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);

CREATE INDEX IF NOT EXISTS idx_analytics_events_restaurant_id ON analytics_events(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);

CREATE INDEX IF NOT EXISTS idx_daily_analytics_restaurant_date ON daily_analytics(restaurant_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_analytics_platform_date ON daily_analytics(platform_id, date);

CREATE INDEX IF NOT EXISTS idx_notifications_restaurant_id ON notifications(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);

-- Triggers for automatic timestamp updates
CREATE TRIGGER IF NOT EXISTS trigger_users_updated_at 
    AFTER UPDATE ON users
    BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS trigger_restaurants_updated_at 
    AFTER UPDATE ON restaurants
    BEGIN
        UPDATE restaurants SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS trigger_orders_updated_at 
    AFTER UPDATE ON orders
    BEGIN
        UPDATE orders SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS trigger_menu_items_updated_at 
    AFTER UPDATE ON menu_items
    BEGIN
        UPDATE menu_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Insert default platforms
INSERT OR IGNORE INTO platforms (id, name, display_name, api_base_url, supported_countries, integration_type) VALUES
    ('swiggy', 'swiggy', 'Swiggy', 'https://api.swiggy.com', '["IN"]', 'api'),
    ('zomato', 'zomato', 'Zomato', 'https://api.zomato.com', '["IN", "AE", "AU"]', 'api'),
    ('ubereats', 'ubereats', 'Uber Eats', 'https://api.ubereats.com', '["US", "CA", "GB", "AU", "IN"]', 'api'),
    ('doordash', 'doordash', 'DoorDash', 'https://api.doordash.com', '["US", "CA", "AU"]', 'api'),
    ('grubhub', 'grubhub', 'Grubhub', 'https://api.grubhub.com', '["US"]', 'api'),
    ('deliveroo', 'deliveroo', 'Deliveroo', 'https://api.deliveroo.com', '["GB", "FR", "DE", "NL", "BE"]', 'api'),
    ('foodpanda', 'foodpanda', 'Foodpanda', 'https://api.foodpanda.com', '["SG", "MY", "TH", "PH"]', 'api'),
    ('dunzo', 'dunzo', 'Dunzo', 'https://api.dunzo.com', '["IN"]', 'api');

-- Create views for common queries
CREATE VIEW IF NOT EXISTS order_summary AS
SELECT 
    o.id,
    o.restaurant_id,
    r.name as restaurant_name,
    p.display_name as platform_name,
    o.status,
    o.order_type,
    json_extract(o.pricing_data, '$.total') as order_total,
    json_extract(o.customer_data, '$.name') as customer_name,
    o.created_at,
    o.updated_at
FROM orders o
JOIN restaurants r ON o.restaurant_id = r.id
JOIN platforms p ON o.platform_id = p.id;

CREATE VIEW IF NOT EXISTS restaurant_performance AS
SELECT 
    r.id as restaurant_id,
    r.name as restaurant_name,
    COUNT(o.id) as total_orders,
    COUNT(CASE WHEN o.status = 'delivered' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) as cancelled_orders,
    AVG(CASE WHEN o.status = 'delivered' THEN CAST(json_extract(o.pricing_data, '$.total') AS REAL) END) as avg_order_value,
    SUM(CASE WHEN o.status = 'delivered' THEN CAST(json_extract(o.pricing_data, '$.total') AS REAL) ELSE 0 END) as total_revenue,
    AVG(o.customer_rating) as avg_rating
FROM restaurants r
LEFT JOIN orders o ON r.id = o.restaurant_id
GROUP BY r.id, r.name;