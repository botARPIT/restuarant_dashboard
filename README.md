# Restaurant Dashboard

A comprehensive restaurant management system with real-time order tracking, analytics, and platform integrations for Swiggy and Zomato.

## Features

- 🍽️ **Real-time Dashboard** - Live order tracking and business metrics
- 📊 **Advanced Analytics** - Revenue trends, customer insights, and performance metrics
- 🛍️ **Order Management** - Complete order lifecycle management
- 👥 **Customer Management** - Customer database with order history
- 🍕 **Menu Management** - Dynamic menu with categories and pricing
- 🔔 **Smart Notifications** - Real-time alerts and updates
- 🔌 **Platform Integrations** - Swiggy and Zomato API integration
- 🔐 **Authentication & Security** - Role-based access control
- 📱 **Responsive Design** - Mobile-first, modern UI/UX
- 🚀 **Production Ready** - Docker, monitoring, and scaling support

## Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons
- Page caching system

### Backend
- Node.js + Express.js + TypeScript
- PostgreSQL database
- Redis caching
- JWT authentication
- Rate limiting and security
- Platform API integrations

### Infrastructure
- Docker & Docker Compose
- Nginx reverse proxy
- Prometheus + Grafana monitoring
- Health checks and auto-scaling

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL (for local development)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/restaurant-dashboard.git
cd restaurant-dashboard
```

### 2. Environment Setup

#### Frontend Environment
```bash
cd frontend
cp .env.example .env.local
```

Update `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### Backend Environment
```bash
cd backend
cp .env.example .env
```

Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurant_dashboard
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Platform API Keys
ZOMATO_API_KEY=your-zomato-api-key
ZOMATO_API_SECRET=your-zomato-api-secret
SWIGGY_API_KEY=your-swiggy-api-key
SWIGGY_API_SECRET=your-swiggy-api-secret
```

### 3. Install Dependencies
```bash
# Install workspace dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 4. Database Setup

#### Option A: Local PostgreSQL
```bash
# Create database
createdb restaurant_dashboard

# Run migrations
cd backend
npm run migrate
```

#### Option B: Docker PostgreSQL
```bash
docker run --name restaurant-postgres \
  -e POSTGRES_DB=restaurant_dashboard \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 5. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run frontend:dev
npm run backend:dev
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Production Deployment

### 1. Environment Configuration
```bash
cp backend/.env.production backend/.env
```

Update production environment variables:
```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PASSWORD=your-secure-production-password
JWT_SECRET=your-production-jwt-secret
ZOMATO_API_KEY=your-production-zomato-key
SWIGGY_API_KEY=your-production-swiggy-key
# ... other production settings
```

### 2. Docker Deployment
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### 3. Manual Deployment
```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build

# Start production server
npm start
```

## Platform API Integration

### Zomato Integration
1. Get API credentials from [Zomato Developers](https://developers.zomato.com/)
2. Add to environment variables:
   ```env
   ZOMATO_API_KEY=your-api-key
   ZOMATO_API_SECRET=your-api-secret
   ```
3. Configure webhook URL in Zomato dashboard
4. Update webhook secret in environment

### Swiggy Integration
1. Contact Swiggy for API access
2. Add to environment variables:
   ```env
   SWIGGY_API_KEY=your-api-key
   SWIGGY_API_SECRET=your-api-secret
   ```
3. Configure webhook endpoints
4. Test integration endpoints

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/trends` - Revenue trends

### Orders
- `GET /api/orders` - List all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Platform Integrations
- `GET /api/platforms` - List platforms
- `GET /api/platforms/:id/stats` - Platform statistics
- `POST /webhooks/zomato` - Zomato webhook
- `POST /webhooks/swiggy` - Swiggy webhook

## Monitoring & Health Checks

### Health Endpoints
- `/health` - Overall system health
- `/api/health` - API health status

### Metrics
- Prometheus metrics available at `/metrics`
- Grafana dashboards for visualization
- Custom business metrics tracking

### Logging
- Structured logging with Morgan
- Log rotation and archiving
- Error tracking and alerting

## Security Features

- JWT-based authentication
- Role-based access control
- Input sanitization and validation
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Request throttling
- Secure headers with Helmet

## Development

### Code Quality
```bash
# Lint code
npm run lint

# Run tests
npm test

# Type checking
npx tsc --noEmit
```

### Database Migrations
```bash
cd backend
npm run migrate
npm run seed
```

### API Documentation
- OpenAPI/Swagger documentation available at `/api-docs`
- Postman collection included
- Example requests in `/examples`

## Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check database status
docker ps | grep postgres

# Test connection
cd backend
npm run health
```

#### Frontend Build Issues
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npx tsc --noEmit
```

#### Platform Integration Issues
```bash
# Check API keys
echo $ZOMATO_API_KEY
echo $SWIGGY_API_KEY

# Test webhook endpoints
curl -X POST http://localhost:5000/webhooks/zomato \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Logs
```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# Database logs
docker-compose logs postgres
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- Documentation: [Wiki](https://github.com/your-org/restaurant-dashboard/wiki)
- Issues: [GitHub Issues](https://github.com/your-org/restaurant-dashboard/issues)
- Discussions: [GitHub Discussions](https://github.com/your-org/restaurant-dashboard/discussions)

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-location support
- [ ] Inventory management
- [ ] Staff scheduling
- [ ] Customer loyalty program
- [ ] Payment gateway integration
- [ ] SMS notifications
- [ ] AI-powered insights
- [ ] Multi-language support