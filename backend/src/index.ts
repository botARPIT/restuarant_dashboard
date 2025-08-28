import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
// import compression from 'compression';
// import rateLimit from 'express-rate-limit';
// import slowDown from 'express-slow-down';
// import hpp from 'hpp';
import dotenv from 'dotenv';

// Import database and platform integration
import { 
  testDatabaseConnection, 
  initializeDatabase, 
  getDatabaseHealth,
  closeDatabasePool 
} from './config/database';
import PlatformIntegrationManager from './services/platformIntegration';

// Import routes
import dashboardRoutes from './routes/dashboard';
import ordersRoutes from './routes/orders';
import analyticsRoutes from './routes/analytics';
import menuRoutes from './routes/menu';
import customersRoutes from './routes/customers';
import notificationsRoutes from './routes/notifications';
import platformRoutes from './routes/platforms';
import healthRoutes from './routes/health';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize platform integration manager
const platformManager = new PlatformIntegrationManager();

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN?.split(',') || ['https://your-frontend-domain.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting - simplified for now
// const limiter = rateLimit({
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
//   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
//   message: {
//     error: 'Too many requests from this IP, please try again later.',
//     retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000)
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // Slow down requests after hitting rate limit
// const speedLimiter = slowDown({
//   windowMs: parseInt(process.env.SLOW_DOWN_WINDOW_MS || '900000'), // 15 minutes
//   delayAfter: parseInt(process.env.SLOW_DOWN_DELAY_AFTER || '50'), // allow 50 requests per 15 minutes, then...
//   delayMs: (hits: number) => Math.min(hits * 100, parseInt(process.env.SLOW_DOWN_MAX_DELAY_MS || '2000')) // begin adding 100ms of delay per request above 50
// });

// // Apply rate limiting and slow down
// app.use('/api/', limiter);
// app.use('/api/', speedLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware - simplified for now
// app.use(hpp()); // Protect against HTTP Parameter Pollution attacks
// app.use(compression()); // Enable gzip compression

// Logging middleware
if (NODE_ENV === 'production') {
  // Production logging
  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 400,
    stream: {
      write: (message: string) => {
        console.log(message.trim());
      }
    }
  }));
} else {
  // Development logging
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    let dbHealth;
    let platformHealth;
    
    try {
      dbHealth = await getDatabaseHealth();
    } catch (error) {
      dbHealth = {
        status: 'unhealthy',
        message: 'Database connection failed',
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      platformHealth = await platformManager.getHealthStatus();
    } catch (error) {
      platformHealth = {
        error: 'Platform integration failed to initialize'
      };
    }
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: NODE_ENV,
      database: dbHealth,
      platforms: platformHealth,
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/health', healthRoutes);

// Platform webhook endpoints
app.post('/webhooks/zomato', async (req, res) => {
  try {
    const signature = req.headers['x-zomato-signature'] as string;
    if (!signature) {
      return res.status(401).json({ error: 'Missing signature' });
    }

    const result = await platformManager.handleZomatoWebhook(req.body, signature);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Zomato webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/webhooks/swiggy', async (req, res) => {
  try {
    const signature = req.headers['x-swiggy-signature'] as string;
    if (!signature) {
      return res.status(401).json({ error: 'Missing signature' });
    }

    const result = await platformManager.handleSwiggyWebhook(req.body, signature);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Swiggy webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);
  
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  // Don't leak error details in production
  const errorResponse = NODE_ENV === 'production' 
    ? { error: 'Internal Server Error' }
    : { error: message, stack: error.stack };
  
  res.status(statusCode).json(errorResponse);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await closeDatabasePool();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await closeDatabasePool();
  process.exit(0);
});

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    let dbConnected = false;
    try {
      dbConnected = await testDatabaseConnection();
    } catch (error) {
      console.log('⚠️ Database connection failed, starting with mock data mode');
      dbConnected = false;
    }

    if (dbConnected) {
      // Initialize database tables
      try {
        await initializeDatabase();
        console.log('✅ Database initialized successfully');
      } catch (error) {
        console.log('⚠️ Database initialization failed, continuing with existing tables');
      }
    } else {
      console.log('⚠️ Running in mock data mode (no database connection)');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Restaurant Dashboard API server running on http://0.0.0.0:${PORT}`);
      console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
      console.log(`🌐 Environment: ${NODE_ENV}`);
      console.log(`🔌 Database: ${dbConnected ? 'Connected' : 'Mock Mode'}`);
      
      // Get platform health status
      platformManager.getHealthStatus().then(platformHealth => {
        console.log(`📱 Platform Integrations: ${Object.keys(platformHealth).length} active`);
      }).catch(() => {
        console.log(`📱 Platform Integrations: Initializing...`);
      });
      
      if (NODE_ENV === 'production') {
        console.log(`🌍 Access from host: https://your-production-domain.com`);
      } else {
        console.log(`🌍 Access from host: http://localhost:${PORT}`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();