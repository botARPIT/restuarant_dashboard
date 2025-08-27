import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { jwt } from 'hono/jwt';

import { authRoutes } from './routes/auth';
import { orderRoutes } from './routes/orders';
import { menuRoutes } from './routes/menu';
import { analyticsRoutes } from './routes/analytics';
import { platformRoutes } from './routes/platforms';
import { webhookRoutes } from './routes/webhooks';
import { healthRoutes } from './routes/health';

import { OrderManager } from './durable-objects/OrderManager';
import { RealTimeSync } from './durable-objects/RealTimeSync';

import { handleOrderProcessing } from './queues/orderProcessor';
import { handleAnalyticsProcessing } from './queues/analyticsProcessor';
import { handleNotificationProcessing } from './queues/notificationProcessor';

export { OrderManager, RealTimeSync };

export interface Env {
  // Durable Objects
  ORDER_MANAGER: DurableObjectNamespace;
  REAL_TIME_SYNC: DurableObjectNamespace;
  
  // Storage
  DB: D1Database;
  CACHE: KVNamespace;
  SESSIONS: KVNamespace;
  
  // Queues
  ORDER_QUEUE: Queue;
  ANALYTICS_QUEUE: Queue;
  NOTIFICATION_QUEUE: Queue;
  
  // AI
  AI: Ai;
  
  // Environment variables
  ENVIRONMENT: string;
  JWT_SECRET: string;
  SWIGGY_API_URL: string;
  ZOMATO_API_URL: string;
  UBEREATS_API_URL: string;
  DOORDASH_API_URL: string;
}

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', prettyJSON());
app.use('*', cors({
  origin: (origin) => {
    // Allow localhost for development and your domains for production
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://dashboard.unifiedrestaurant.com',
      'https://app.unifiedrestaurant.com'
    ];
    return allowedOrigins.includes(origin) || origin.endsWith('.pages.dev');
  },
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

// Public routes (no authentication required)
app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/webhooks', webhookRoutes);
app.route('/api/v1/health', healthRoutes);

// Protected routes (authentication required)
app.use('/api/v1/*', async (c, next) => {
  const publicPaths = ['/api/v1/auth', '/api/v1/webhooks', '/api/v1/health'];
  const isPublicPath = publicPaths.some(path => c.req.path.startsWith(path));
  
  if (isPublicPath) {
    return next();
  }
  
  // JWT middleware for protected routes
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
    cookie: 'auth-token'
  });
  
  return jwtMiddleware(c, next);
});

app.route('/api/v1/orders', orderRoutes);
app.route('/api/v1/menu', menuRoutes);
app.route('/api/v1/analytics', analyticsRoutes);
app.route('/api/v1/platforms', platformRoutes);

// Error handling
app.onError((err, c) => {
  console.error('Application error:', err);
  
  const isDev = c.env.ENVIRONMENT === 'development';
  
  return c.json({
    error: 'Internal Server Error',
    message: isDev ? err.message : 'Something went wrong',
    ...(isDev && { stack: err.stack })
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  }, 404);
});

// Queue handlers
export default {
  fetch: app.fetch,
  
  // Queue consumers
  async queue(batch: MessageBatch<any>, env: Env, ctx: ExecutionContext): Promise<void> {
    switch (batch.queue) {
      case 'order-processing':
        await handleOrderProcessing(batch, env, ctx);
        break;
      case 'analytics-processing':
        await handleAnalyticsProcessing(batch, env, ctx);
        break;
      case 'notification-processing':
        await handleNotificationProcessing(batch, env, ctx);
        break;
      default:
        console.warn(`Unknown queue: ${batch.queue}`);
    }
  },
  
  // Scheduled tasks
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    switch (event.cron) {
      case '*/5 * * * *': // Every 5 minutes
        // Sync orders from platforms
        await syncOrdersFromPlatforms(env, ctx);
        break;
      case '0 */1 * * *': // Every hour
        // Process analytics
        await processHourlyAnalytics(env, ctx);
        break;
      case '0 0 * * *': // Daily at midnight
        // Cleanup old data
        await cleanupOldData(env, ctx);
        break;
    }
  }
};

async function syncOrdersFromPlatforms(env: Env, ctx: ExecutionContext): Promise<void> {
  // Implementation for periodic order sync
  console.log('Syncing orders from platforms...');
}

async function processHourlyAnalytics(env: Env, ctx: ExecutionContext): Promise<void> {
  // Implementation for hourly analytics processing
  console.log('Processing hourly analytics...');
}

async function cleanupOldData(env: Env, ctx: ExecutionContext): Promise<void> {
  // Implementation for data cleanup
  console.log('Cleaning up old data...');
}