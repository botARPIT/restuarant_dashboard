# RestaurantHub - Unified Restaurant Dashboard

A comprehensive restaurant management dashboard that aggregates orders from multiple delivery platforms (Zomato, Swiggy, UberEats, Dunzo) into a single, unified interface.

## 🚀 Features

- **Multi-Platform Integration**: Manage orders from Zomato, Swiggy, UberEats, and Dunzo
- **Real-time Dashboard**: Live order tracking and status updates
- **Performance Analytics**: Platform-wise performance metrics and trends
- **Order Management**: Complete order lifecycle management
- **Responsive Design**: Modern, mobile-friendly interface
- **RESTful API**: Scalable backend architecture

## 🏗️ Project Structure

```
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions and data
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   ├── package.json        # Frontend dependencies
│   └── tailwind.config.js  # Tailwind CSS configuration
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript type definitions
│   │   └── index.ts        # Server entry point
│   ├── package.json        # Backend dependencies
│   └── tsconfig.json       # TypeScript configuration
├── shared/                  # Shared types and utilities
└── package.json            # Root package.json with workspaces
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Lucide React** for icons
- **React Router** for navigation

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **RESTful API** architecture
- **Rate limiting** and security middleware
- **Mock data** (ready for database integration)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm 9+

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restaurant-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

This will start both frontend (port 3000) and backend (port 5000) in development mode.

## 🚀 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend
- `npm run test` - Run tests for both frontend and backend

### Frontend
- `npm run frontend:dev` - Start frontend development server
- `npm run frontend:build` - Build frontend for production
- `npm run frontend:preview` - Preview production build

### Backend
- `npm run backend:dev` - Start backend development server
- `npm run backend:build` - Build backend for production
- `npm run backend:start` - Start production backend server

## 🌐 API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard overview statistics
- `GET /api/dashboard/trends` - Get daily trends data

### Orders
- `GET /api/orders` - Get all orders with pagination
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/orders/platform/:platform` - Get orders by platform
- `GET /api/orders/status/:status` - Get orders by status

### Platforms
- `GET /api/platforms` - Get all platforms
- `GET /api/platforms/:id` - Get platform by ID
- `PATCH /api/platforms/:id/status` - Update platform status
- `GET /api/platforms/:id/stats` - Get platform statistics

## 🎨 UI Components

The dashboard includes:

- **Sidebar Navigation**: Dashboard, Orders, Analytics, Menu Management, Customers, Notifications, Settings
- **Header**: Search, Filter, and Notification controls
- **KPI Cards**: Total Orders, Revenue, Active Orders, Completion Rate
- **Recent Orders**: Live order tracking with status indicators
- **Platform Performance**: Platform-wise metrics and status

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Development
```bash
cd backend
npm run dev
```

The backend API will be available at `http://localhost:5000`

### API Testing
Test the backend API using the health check endpoint:
```bash
curl http://localhost:5000/health
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

The backend can be deployed to any Node.js hosting platform.

## 🔮 Future Enhancements

- **Database Integration**: MongoDB/PostgreSQL integration
- **Real-time Updates**: WebSocket implementation for live order updates
- **Authentication**: JWT-based user authentication
- **Push Notifications**: Browser and mobile push notifications
- **Advanced Analytics**: Detailed reporting and insights
- **Mobile App**: React Native mobile application
- **Multi-tenant Support**: Support for multiple restaurants

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

**RestaurantHub** - Simplifying restaurant management across multiple delivery platforms 🍕🍔🍜