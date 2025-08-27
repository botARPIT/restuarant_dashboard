# Restaurant Dashboard Demo - Quick Deploy Guide

A fully functional restaurant dashboard demo built with React.js frontend and Cloudflare Workers backend, ready to deploy in under 10 minutes.

## 🚀 Quick Deploy (7 Days Ready!)

### Prerequisites
- Node.js 18+ installed
- Cloudflare account (free tier works)
- Git installed

### 1. Clone & Setup
```bash
git clone <your-repo>
cd unified-restaurant-dashboard

# Install global dependencies
npm install -g wrangler
```

### 2. Authenticate with Cloudflare
```bash
wrangler auth login
```
This opens your browser to authenticate with Cloudflare.

### 3. Deploy Everything
```bash
# One command deployment
./deploy.sh
```

That's it! Your demo will be live in ~5 minutes.

## 🎯 What You Get

### Live Demo Features
- **Real-time Order Dashboard** with simulated orders
- **Multi-platform Integration** (Swiggy, Zomato, UberEats, DoorDash)
- **Interactive Order Management** - click to update statuses
- **Live Analytics** with charts and metrics
- **Responsive Design** - works on mobile and desktop
- **Auto-generating Orders** - new orders appear every 15-30 seconds

### Backend API (Cloudflare Workers)
- **Mock APIs** for orders, analytics, menu management
- **CORS enabled** for frontend integration
- **Global edge deployment** with <50ms response times
- **Infinite scaling** - handles any traffic automatically

### Frontend (React.js + Material-UI)
- **Modern React** with TypeScript
- **Material-UI** components for professional look
- **Real-time updates** with live order notifications
- **Interactive charts** using Recharts
- **Mobile-responsive** design

## 📱 Demo Features

### Dashboard
- Live order stream with real-time updates
- Platform performance breakdown (pie charts)
- Today's statistics cards
- Hourly trends graph
- Top selling items list

### Order Management
- Filter orders by status (Active, Completed, Cancelled)
- Search orders by customer name or order ID
- Update order status with one click
- Platform-specific order views
- Order details with customer information

### Live Demo Data
- **Auto-generating orders** every 15-30 seconds
- **Realistic restaurant data** with Indian and international orders
- **Interactive status updates** - see changes in real-time
- **Toast notifications** for all actions

## 🛠️ Development

### Local Development
```bash
# Terminal 1: Start backend
cd workers
npm install
npm run dev

# Terminal 2: Start frontend
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:3000
Backend API: http://localhost:8787

### Project Structure
```
unified-restaurant-dashboard/
├── frontend/           # React.js dashboard
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/      # Dashboard pages
│   │   ├── types/      # TypeScript definitions
│   │   └── utils/      # Mock data & utilities
│   └── package.json
├── workers/            # Cloudflare Workers backend
│   ├── src/
│   │   └── index.ts    # Main API with mock data
│   └── wrangler.toml   # Cloudflare configuration
└── deploy.sh          # One-click deployment
```

## 🎨 Customization

### Update Restaurant Info
Edit `/frontend/src/components/Layout/Sidebar.tsx`:
```typescript
// Change restaurant name and details
<Typography variant="subtitle2">
  Your Restaurant Name
</Typography>
```

### Modify Mock Data
Edit `/frontend/src/utils/mockData.ts` to customize:
- Restaurant orders
- Menu items
- Analytics data
- Platform connections

### Change Colors & Branding
Edit `/frontend/src/main.tsx` theme configuration:
```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#your-brand-color' },
    // ... customize colors
  }
});
```

## 🌐 Demo URLs

After deployment, you'll get:

- **Frontend**: `https://restaurant-dashboard.pages.dev`
- **Backend API**: `https://restaurant-dashboard-api.your-subdomain.workers.dev`

### API Endpoints
- `GET /api/v1/health` - Health check
- `GET /api/v1/orders` - Get all orders
- `PUT /api/v1/orders/:id/status` - Update order status
- `GET /api/v1/analytics/dashboard` - Dashboard analytics
- `GET /api/v1/menu` - Menu items
- `GET /api/v1/platforms` - Platform connections
- `POST /api/v1/demo/generate-order` - Generate demo order

## 📊 Demo Features in Action

### Real-time Order Generation
- New orders automatically appear every 15-30 seconds
- Orders come from different platforms (Swiggy, Zomato, etc.)
- Realistic customer data and order items
- Toast notifications for new orders

### Interactive Order Management
- Click "Mark Ready" to move orders through the workflow
- See status changes reflected immediately
- Filter and search through orders
- Platform-specific styling and icons

### Live Analytics
- Charts update with new order data
- Platform breakdown shows percentage distribution
- Hourly trends show order patterns
- Top items list shows most popular dishes

## 🚀 Next Steps for Production

### Add Real Integrations
1. Replace mock APIs with real platform APIs
2. Add authentication and user management
3. Implement database storage (D1, PlanetScale)
4. Add real-time WebSocket connections
5. Implement proper error handling

### Scale the Infrastructure
1. Add Durable Objects for real-time features
2. Implement Cloudflare Queues for order processing
3. Add KV storage for caching
4. Setup monitoring and alerts

### Business Features
1. Multi-restaurant support
2. User roles and permissions
3. Payment processing integration
4. Advanced analytics and reporting
5. Mobile app for managers

## 💡 Pro Tips

### For Investors/Demos
- Open multiple browser tabs to see real-time sync
- Use mobile and desktop to show responsiveness
- Click through the order workflow to show interactivity
- Explain the global edge deployment advantage

### For Development
- Use the mock data generators to test edge cases
- Customize the order generation frequency for demos
- Add new order statuses by updating the enum
- Extend the mock APIs to test new features

## 🆘 Troubleshooting

### Common Issues
1. **CORS errors**: Check Cloudflare Workers CORS configuration
2. **API not found**: Verify the API URL in frontend `.env`
3. **Build errors**: Ensure Node.js 18+ and latest npm
4. **Auth issues**: Run `wrangler auth login` again

### Getting Help
- Check Cloudflare Workers documentation
- Verify all environment variables are set
- Test API endpoints directly in browser
- Check browser console for errors

---

**Ready to impress?** This demo showcases a production-ready architecture that can scale from 0 to millions of orders with Cloudflare's global edge network. Perfect for investor demos, customer presentations, or as a foundation for your actual restaurant platform! 🍽️✨