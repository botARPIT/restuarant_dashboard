# 🔧 Troubleshooting Guide - Restaurant Dashboard Access

## 🚨 **IMMEDIATE SOLUTION**

If you can't see the preview, try these URLs:

### **Frontend Dashboard**
- **Primary URL**: http://localhost:3000
- **Alternative URLs**:
  - http://127.0.0.1:3000
  - http://0.0.0.0:3000
  - http://172.30.0.2:3000 (container IP)

### **Backend API**
- **Primary URL**: http://localhost:5000
- **Alternative URLs**:
  - http://127.0.0.1:5000
  - http://0.0.0.0:5000
  - http://172.30.0.2:5000 (container IP)

## 🔍 **Diagnostic Steps**

### 1. Check Service Status
```bash
# Check if services are running
ps aux | grep -E "(ts-node|vite)" | grep -v grep

# Check ports
curl -s http://localhost:3000 | head -5
curl -s http://localhost:5000/health
```

### 2. Network Configuration
```bash
# Get container IP
hostname -I

# Test from container IP
curl -s http://172.30.0.2:3000 | head -5
curl -s http://172.30.0.2:5000/health
```

### 3. Restart Services
```bash
# Stop all services
pkill -f "ts-node\|vite"

# Start backend
cd backend && npx ts-node src/index.ts &

# Start frontend
cd frontend && npm run dev &
```

## 🌐 **Access Methods**

### **Method 1: Localhost (Recommended)**
- Open browser and go to: **http://localhost:3000**
- This should work if you're accessing from the host machine

### **Method 2: Container IP**
- Use the container IP: **http://172.30.0.2:3000**
- This works from within the container environment

### **Method 3: Port Forwarding**
If you're using VS Code or similar:
- Forward port 3000 to your local machine
- Access via **http://localhost:3000**

## 🐛 **Common Issues & Solutions**

### **Issue 1: "Connection Refused"**
**Solution**: Services aren't running
```bash
# Start services
npm run dev
```

### **Issue 2: "Page Not Found"**
**Solution**: Wrong URL or service not ready
```bash
# Wait for services to start (10-15 seconds)
# Use correct URLs above
```

### **Issue 3: "Cannot Access from Browser"**
**Solution**: Network binding issue
```bash
# Check if services bind to 0.0.0.0
# Restart services with updated config
```

## 🚀 **Quick Start Commands**

### **Start Both Services**
```bash
npm run dev
```

### **Start Frontend Only**
```bash
npm run frontend:dev
```

### **Start Backend Only**
```bash
npm run backend:dev
```

## 📱 **Browser Access**

1. **Open your web browser**
2. **Navigate to**: `http://localhost:3000`
3. **If that doesn't work, try**: `http://172.30.0.2:3000`
4. **You should see**: The RestaurantHub dashboard with sidebar, KPI cards, and order management

## 🔧 **Manual Service Start**

If automatic startup fails:

```bash
# Terminal 1 - Backend
cd backend
npx ts-node src/index.ts

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## 📊 **Expected Dashboard Features**

Once accessible, you should see:

- **Left Sidebar**: Dashboard, Orders (12), Analytics, Menu Management, Customers, Notifications (3), Settings
- **Header**: RestaurantHub branding, search, filter, notifications
- **KPI Cards**: Total Orders (47), Revenue (₹18,450), Active Orders (12), Completion Rate (94%)
- **Recent Orders**: Live order tracking
- **Platform Performance**: Zomato, Swiggy, UberEats, Dunzo metrics

## 🆘 **Still Can't Access?**

1. **Check service logs** for errors
2. **Verify ports** aren't blocked by firewall
3. **Try different browsers** (Chrome, Firefox, Safari)
4. **Clear browser cache** and cookies
5. **Check if you're in a containerized environment**

---

**Need Help?** Check the logs or restart the services using the commands above.