# Unified Restaurant Dashboard - Product Specification

## Executive Summary

The Unified Restaurant Dashboard is a comprehensive middleware aggregation platform designed to consolidate multiple food delivery services into a single management interface. This solution addresses the critical pain point of restaurant owners who struggle to manage orders across multiple delivery platforms efficiently.

## 1. Market Analysis & Problem Statement

### Current Market Challenges
- **Fragmented Management**: Restaurants manage 3-8 different delivery platforms simultaneously
- **Operational Inefficiency**: Switching between multiple apps/dashboards reduces productivity by 40%
- **Data Silos**: Lack of consolidated analytics across platforms
- **Human Error**: Manual synchronization leads to order fulfillment mistakes
- **Cost Overhead**: Multiple tablet rentals and platform fees

### Target Market Size
- **TAM**: $150B global food delivery market
- **SAM**: $15B restaurant management software market
- **SOM**: $500M unified platform segment (projected)

### Target Customers
1. **Independent Restaurants** (50-200 orders/day)
2. **Restaurant Chains** (200-1000 orders/day)
3. **Cloud Kitchens** (100-500 orders/day)
4. **Franchise Operations** (Multiple locations)

## 2. Detailed Feature Breakdown

### 2.1 Core Integration Features

#### Multi-Platform API Connectivity
**Feature**: Standardized connections to major delivery platforms
**Technical Implementation**:
```typescript
interface DeliveryPlatformAdapter {
  authenticate(): Promise<AuthToken>;
  fetchOrders(filters: OrderFilters): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  syncMenu(menuData: MenuData): Promise<SyncResult>;
  getAnalytics(timeRange: TimeRange): Promise<AnalyticsData>;
}

// Platform-specific implementations
class SwiggyAdapter implements DeliveryPlatformAdapter { }
class ZomatoAdapter implements DeliveryPlatformAdapter { }
class UberEatsAdapter implements DeliveryPlatformAdapter { }
```

**Supported Platforms**:
- **Tier 1**: Swiggy, Zomato, UberEats, DoorDash (India/US focus)
- **Tier 2**: Grubhub, Deliveroo, Foodpanda, Dunzo
- **Tier 3**: Regional platforms (expandable)

#### Real-Time Data Synchronization
**Feature**: Live order status updates across all platforms
**Technical Architecture**:
- WebSocket connections for real-time updates
- Redis pub/sub for message distribution
- Event-driven architecture for status propagation

```typescript
// Real-time event system
interface OrderEvent {
  type: 'order.created' | 'order.updated' | 'order.cancelled';
  orderId: string;
  platform: string;
  timestamp: Date;
  data: any;
}

class EventProcessor {
  async processOrderEvent(event: OrderEvent): Promise<void> {
    // Update local database
    await this.updateLocalOrder(event);
    
    // Broadcast to connected clients
    this.socketService.broadcast(event);
    
    // Trigger business logic
    await this.triggerWorkflows(event);
  }
}
```

### 2.2 Order Management System

#### Unified Order Processing
**Feature**: Standardized order format and processing pipeline

```typescript
interface UnifiedOrder {
  id: string;
  platform: DeliveryPlatform;
  platformOrderId: string;
  customer: CustomerInfo;
  items: OrderItem[];
  status: OrderStatus;
  timeline: OrderTimeline[];
  pricing: PricingBreakdown;
  delivery: DeliveryInfo;
  restaurant: RestaurantInfo;
  metadata: Record<string, any>;
}

enum OrderStatus {
  RECEIVED = 'received',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  PICKED_UP = 'picked_up',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}
```

#### Bulk Operations & Automation
**Features**:
- Batch order status updates
- Auto-confirmation rules
- Smart inventory management
- Automated menu synchronization

```typescript
class OrderAutomation {
  // Auto-confirm orders based on rules
  async autoConfirmOrders(rules: ConfirmationRules): Promise<void> {
    const pendingOrders = await this.getPendingOrders();
    
    for (const order of pendingOrders) {
      if (this.shouldAutoConfirm(order, rules)) {
        await this.confirmOrder(order.id);
      }
    }
  }
  
  // Smart inventory management
  async updateInventoryAcrossPlatforms(item: MenuItem): Promise<void> {
    const platforms = await this.getConnectedPlatforms();
    
    await Promise.all(
      platforms.map(platform => 
        platform.updateMenuItemAvailability(item.id, item.available)
      )
    );
  }
}
```

### 2.3 Analytics & Business Intelligence

#### Performance Metrics Dashboard
**Key Metrics**:
- **Revenue Analytics**: Platform-wise revenue, trends, forecasting
- **Operational Metrics**: Average preparation time, order accuracy
- **Customer Insights**: Repeat orders, satisfaction scores, preferences
- **Platform Performance**: Commission analysis, order volume comparison

```typescript
interface AnalyticsDashboard {
  // Revenue metrics
  getTotalRevenue(timeRange: TimeRange): Promise<RevenueData>;
  getPlatformBreakdown(timeRange: TimeRange): Promise<PlatformRevenue[]>;
  getRevenueForecasting(days: number): Promise<ForecastData>;
  
  // Operational metrics
  getAveragePreparationTime(): Promise<number>;
  getOrderAccuracyRate(): Promise<number>;
  getPeakHours(): Promise<PeakHourData[]>;
  
  // Customer insights
  getCustomerRetentionRate(): Promise<number>;
  getPopularItems(timeRange: TimeRange): Promise<PopularItem[]>;
  getCustomerSatisfactionScore(): Promise<number>;
}
```

#### Custom Reporting Engine
**Features**:
- Drag-and-drop report builder
- Scheduled report generation
- Export capabilities (PDF, Excel, CSV)
- Alert system for KPI thresholds

### 2.4 Menu Management System

#### Unified Menu Synchronization
**Feature**: Single interface to manage menus across all platforms

```typescript
interface MenuSyncSystem {
  // Sync menu across all platforms
  syncMenuAcrossPlatforms(menu: UnifiedMenu): Promise<SyncResult[]>;
  
  // Platform-specific menu formatting
  formatMenuForPlatform(menu: UnifiedMenu, platform: string): Promise<PlatformMenu>;
  
  // Conflict resolution
  resolveMenuConflicts(conflicts: MenuConflict[]): Promise<Resolution[]>;
  
  // Bulk operations
  bulkUpdatePrices(priceUpdates: PriceUpdate[]): Promise<UpdateResult[]>;
  updateItemAvailability(itemId: string, available: boolean): Promise<void>;
}
```

### 2.5 User Experience Features

#### Intuitive Dashboard Interface
**Design Principles**:
- **Mobile-First**: Responsive design for all devices
- **Progressive Disclosure**: Show relevant information based on context
- **Real-Time Updates**: Live data without page refreshes
- **Accessibility**: WCAG 2.1 AA compliance

**Key UI Components**:
1. **Order Stream**: Real-time order feed with filtering
2. **Quick Actions**: One-click order status updates
3. **Performance Cards**: Key metrics at a glance
4. **Alert Center**: Notifications and system alerts

#### Customization & Personalization
**Features**:
- Custom dashboard layouts
- Personalized notification preferences
- Role-based access control
- White-label branding options

## 3. Technical Architecture Deep Dive

### 3.1 Microservices Architecture

```typescript
// Core microservices
interface CoreServices {
  orderService: OrderManagementService;
  integrationService: PlatformIntegrationService;
  analyticsService: AnalyticsService;
  menuService: MenuManagementService;
  notificationService: NotificationService;
  userService: UserManagementService;
  authService: AuthenticationService;
}

// Service communication
class ServiceMesh {
  // API Gateway for external requests
  gateway: APIGateway;
  
  // Service discovery
  serviceRegistry: ServiceRegistry;
  
  // Load balancing
  loadBalancer: LoadBalancer;
  
  // Circuit breaker for fault tolerance
  circuitBreaker: CircuitBreaker;
}
```

### 3.2 Data Architecture

#### Database Strategy
**Primary Database**: MongoDB (Document store for orders, menus)
**Analytics Database**: ClickHouse (Time-series analytics)
**User Database**: PostgreSQL (Relational data)
**Cache Layer**: Redis (Session management, real-time data)

```typescript
// Data models
interface OrderDocument {
  _id: ObjectId;
  unifiedOrderId: string;
  platformData: {
    [platform: string]: PlatformSpecificData;
  };
  normalizedData: UnifiedOrder;
  timeline: OrderEvent[];
  analytics: OrderAnalytics;
  createdAt: Date;
  updatedAt: Date;
}

interface AnalyticsEvent {
  eventId: string;
  restaurantId: string;
  eventType: string;
  platform: string;
  timestamp: Date;
  data: Record<string, any>;
  processed: boolean;
}
```

### 3.3 API Design

#### RESTful API Structure
```typescript
// Core API endpoints
interface RestaurantDashboardAPI {
  // Order management
  'GET /api/v1/orders': GetOrdersEndpoint;
  'POST /api/v1/orders/:id/status': UpdateOrderStatusEndpoint;
  'GET /api/v1/orders/:id': GetOrderDetailsEndpoint;
  
  // Menu management
  'GET /api/v1/menu': GetMenuEndpoint;
  'PUT /api/v1/menu': UpdateMenuEndpoint;
  'POST /api/v1/menu/sync': SyncMenuEndpoint;
  
  // Analytics
  'GET /api/v1/analytics/dashboard': GetDashboardAnalyticsEndpoint;
  'GET /api/v1/analytics/reports': GetReportsEndpoint;
  'POST /api/v1/analytics/reports': CreateCustomReportEndpoint;
  
  // Platform integration
  'POST /api/v1/platforms/connect': ConnectPlatformEndpoint;
  'DELETE /api/v1/platforms/:platform': DisconnectPlatformEndpoint;
  'GET /api/v1/platforms/status': GetPlatformStatusEndpoint;
}
```

#### WebSocket Events
```typescript
// Real-time events
interface SocketEvents {
  // Order events
  'order:new': (order: UnifiedOrder) => void;
  'order:updated': (orderId: string, update: OrderUpdate) => void;
  'order:cancelled': (orderId: string, reason: string) => void;
  
  // System events
  'platform:connected': (platform: string) => void;
  'platform:disconnected': (platform: string) => void;
  'system:alert': (alert: SystemAlert) => void;
  
  // Analytics events
  'analytics:updated': (metrics: RealTimeMetrics) => void;
}
```

## 4. Platform Integration Strategy

### 4.1 API Integration Patterns

#### Adapter Pattern Implementation
```typescript
abstract class DeliveryPlatformAdapter {
  abstract authenticate(): Promise<AuthResult>;
  abstract fetchOrders(): Promise<Order[]>;
  abstract updateOrderStatus(orderId: string, status: string): Promise<boolean>;
  
  // Common functionality
  protected handleRateLimit(response: Response): Promise<void> {
    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      await this.delay(parseInt(retryAfter) * 1000);
    }
  }
  
  protected normalizeOrder(platformOrder: any): UnifiedOrder {
    // Platform-specific to unified format conversion
  }
}

// Specific platform implementations
class SwiggyAdapter extends DeliveryPlatformAdapter {
  async authenticate(): Promise<AuthResult> {
    // Swiggy-specific authentication
    const response = await fetch('https://api.swiggy.com/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        partnerId: this.partnerId,
        apiKey: this.apiKey 
      })
    });
    
    return response.json();
  }
  
  async fetchOrders(): Promise<Order[]> {
    // Swiggy-specific order fetching
    const response = await this.authenticatedRequest('/orders');
    return response.data.map(order => this.normalizeOrder(order));
  }
}
```

### 4.2 Rate Limiting & Error Handling

#### Intelligent Request Management
```typescript
class RateLimitManager {
  private limits: Map<string, RateLimit> = new Map();
  
  async makeRequest(platform: string, request: () => Promise<any>): Promise<any> {
    const limit = this.limits.get(platform);
    
    if (limit && limit.isExceeded()) {
      await this.waitForReset(limit);
    }
    
    try {
      const response = await request();
      this.updateLimits(platform, response);
      return response;
    } catch (error) {
      await this.handleError(platform, error);
      throw error;
    }
  }
  
  private async handleError(platform: string, error: any): Promise<void> {
    if (error.status === 429) {
      // Rate limit exceeded
      await this.backoff(platform);
    } else if (error.status >= 500) {
      // Server error - implement exponential backoff
      await this.exponentialBackoff(platform);
    }
  }
}
```

### 4.3 Data Synchronization Strategy

#### Event-Driven Synchronization
```typescript
class DataSynchronizer {
  private eventBus: EventBus;
  private conflictResolver: ConflictResolver;
  
  async syncOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void> {
    const order = await this.getOrder(orderId);
    const platforms = await this.getConnectedPlatforms(order.restaurantId);
    
    // Update all platforms in parallel
    const updates = await Promise.allSettled(
      platforms.map(platform => 
        platform.updateOrderStatus(order.platformOrderId, newStatus)
      )
    );
    
    // Handle conflicts and failures
    await this.handleSyncResults(orderId, updates);
    
    // Emit event for real-time updates
    this.eventBus.emit('order:status_updated', {
      orderId,
      newStatus,
      timestamp: new Date()
    });
  }
  
  private async handleSyncResults(orderId: string, results: PromiseSettledResult<boolean>[]): Promise<void> {
    const failures = results
      .map((result, index) => ({ result, index }))
      .filter(({ result }) => result.status === 'rejected')
      .map(({ index }) => index);
    
    if (failures.length > 0) {
      // Queue for retry
      await this.queueForRetry(orderId, failures);
      
      // Alert administrators
      await this.alertAdmins(`Sync failed for order ${orderId}`, failures);
    }
  }
}
```

## 5. Security & Compliance

### 5.1 Authentication & Authorization

#### Multi-Factor Authentication
```typescript
class AuthenticationService {
  async authenticateUser(credentials: LoginCredentials): Promise<AuthResult> {
    // Step 1: Validate credentials
    const user = await this.validateCredentials(credentials);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Step 2: Check if MFA is required
    if (user.mfaEnabled) {
      const mfaChallenge = await this.createMFAChallenge(user.id);
      return {
        requiresMFA: true,
        challengeId: mfaChallenge.id,
        methods: user.mfaMethods
      };
    }
    
    // Step 3: Generate tokens
    const tokens = await this.generateTokens(user);
    
    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }
  
  async verifyMFA(challengeId: string, code: string): Promise<AuthResult> {
    const challenge = await this.getMFAChallenge(challengeId);
    
    if (!challenge || challenge.isExpired()) {
      throw new Error('Invalid or expired challenge');
    }
    
    const isValid = await this.verifyMFACode(challenge, code);
    
    if (!isValid) {
      throw new Error('Invalid MFA code');
    }
    
    const user = await this.getUser(challenge.userId);
    const tokens = await this.generateTokens(user);
    
    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }
}
```

#### Role-Based Access Control (RBAC)
```typescript
interface Permission {
  resource: string;
  actions: string[];
  conditions?: Record<string, any>;
}

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  isSystemRole: boolean;
}

class AuthorizationService {
  async checkPermission(
    userId: string, 
    resource: string, 
    action: string, 
    context?: any
  ): Promise<boolean> {
    const userRoles = await this.getUserRoles(userId);
    
    for (const role of userRoles) {
      for (const permission of role.permissions) {
        if (this.matchesResource(permission.resource, resource) &&
            permission.actions.includes(action) &&
            this.matchesConditions(permission.conditions, context)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  private matchesResource(permissionResource: string, requestedResource: string): boolean {
    // Support wildcards and hierarchical resources
    return permissionResource === '*' || 
           permissionResource === requestedResource ||
           requestedResource.startsWith(permissionResource + '.');
  }
}
```

### 5.2 Data Protection & Privacy

#### GDPR Compliance
```typescript
class DataProtectionService {
  // Right to access
  async exportUserData(userId: string): Promise<UserDataExport> {
    const userData = await this.collectUserData(userId);
    
    return {
      personalData: userData.personal,
      orderHistory: userData.orders,
      analyticsData: userData.analytics,
      exportDate: new Date(),
      retentionPolicy: userData.retentionPolicy
    };
  }
  
  // Right to erasure
  async deleteUserData(userId: string, reason: string): Promise<DeletionResult> {
    // Identify data to be deleted vs anonymized
    const dataMap = await this.mapUserData(userId);
    
    // Delete personal data
    await this.deletePersonalData(dataMap.personal);
    
    // Anonymize business data
    await this.anonymizeBusinessData(dataMap.business);
    
    // Log deletion for compliance
    await this.logDataDeletion(userId, reason, dataMap);
    
    return {
      deletedRecords: dataMap.personal.length,
      anonymizedRecords: dataMap.business.length,
      completionDate: new Date()
    };
  }
  
  // Data portability
  async transferUserData(userId: string, targetSystem: string): Promise<TransferResult> {
    const userData = await this.exportUserData(userId);
    const transferFormat = this.getTransferFormat(targetSystem);
    
    const formattedData = await this.formatForTransfer(userData, transferFormat);
    
    return {
      transferId: generateId(),
      format: transferFormat,
      data: formattedData,
      checksum: this.calculateChecksum(formattedData)
    };
  }
}
```

### 5.3 Security Monitoring

#### Threat Detection
```typescript
class SecurityMonitor {
  async detectAnomalies(event: SecurityEvent): Promise<ThreatAssessment> {
    const riskScore = await this.calculateRiskScore(event);
    
    if (riskScore > this.highRiskThreshold) {
      await this.triggerHighRiskResponse(event);
    } else if (riskScore > this.mediumRiskThreshold) {
      await this.triggerMediumRiskResponse(event);
    }
    
    return {
      eventId: event.id,
      riskScore,
      threatLevel: this.getRiskLevel(riskScore),
      recommendations: await this.getRecommendations(event, riskScore)
    };
  }
  
  private async calculateRiskScore(event: SecurityEvent): Promise<number> {
    let score = 0;
    
    // Check for suspicious patterns
    score += await this.checkLoginPatterns(event);
    score += await this.checkGeolocation(event);
    score += await this.checkDeviceFingerprint(event);
    score += await this.checkRateLimit(event);
    
    return Math.min(score, 100);
  }
  
  private async triggerHighRiskResponse(event: SecurityEvent): Promise<void> {
    // Immediate actions
    await this.lockUserAccount(event.userId);
    await this.invalidateUserSessions(event.userId);
    await this.alertSecurityTeam(event);
    
    // Notifications
    await this.notifyUser(event.userId, 'security_alert');
    await this.logSecurityIncident(event);
  }
}
```

## 6. Performance & Scalability

### 6.1 Caching Strategy

#### Multi-Layer Caching
```typescript
class CacheManager {
  private l1Cache: InMemoryCache; // Application cache
  private l2Cache: RedisCache;    // Distributed cache
  private l3Cache: CDNCache;      // Edge cache
  
  async get<T>(key: string): Promise<T | null> {
    // L1: Check in-memory cache
    let value = await this.l1Cache.get<T>(key);
    if (value) return value;
    
    // L2: Check Redis
    value = await this.l2Cache.get<T>(key);
    if (value) {
      await this.l1Cache.set(key, value, 60); // 1 minute L1 TTL
      return value;
    }
    
    // L3: Check CDN (for static content)
    if (this.isStaticContent(key)) {
      value = await this.l3Cache.get<T>(key);
      if (value) {
        await this.l2Cache.set(key, value, 300); // 5 minute L2 TTL
        await this.l1Cache.set(key, value, 60);
        return value;
      }
    }
    
    return null;
  }
  
  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    // Write through all cache layers
    await Promise.all([
      this.l1Cache.set(key, value, Math.min(ttl, 60)),
      this.l2Cache.set(key, value, ttl),
      this.isStaticContent(key) ? this.l3Cache.set(key, value, ttl) : Promise.resolve()
    ]);
  }
  
  async invalidate(pattern: string): Promise<void> {
    await Promise.all([
      this.l1Cache.deletePattern(pattern),
      this.l2Cache.deletePattern(pattern),
      this.l3Cache.deletePattern(pattern)
    ]);
  }
}
```

### 6.2 Database Optimization

#### Query Optimization & Indexing
```typescript
// MongoDB indexes for optimal query performance
const orderIndexes = [
  // Compound index for restaurant orders by status and date
  { restaurantId: 1, status: 1, createdAt: -1 },
  
  // Index for platform-specific queries
  { 'platformData.platform': 1, createdAt: -1 },
  
  // Text search index for order search
  { 
    'customer.name': 'text', 
    'customer.phone': 'text',
    'items.name': 'text'
  },
  
  // TTL index for automatic cleanup of old orders
  { createdAt: 1, expireAfterSeconds: 31536000 } // 1 year
];

// Aggregation pipeline for analytics
class AnalyticsQueries {
  async getRevenueByPlatform(restaurantId: string, timeRange: TimeRange): Promise<PlatformRevenue[]> {
    return await OrderModel.aggregate([
      {
        $match: {
          restaurantId,
          createdAt: { $gte: timeRange.start, $lte: timeRange.end },
          status: { $in: ['delivered', 'completed'] }
        }
      },
      {
        $group: {
          _id: '$platformData.platform',
          totalRevenue: { $sum: '$pricing.total' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$pricing.total' }
        }
      },
      {
        $project: {
          platform: '$_id',
          totalRevenue: 1,
          orderCount: 1,
          avgOrderValue: { $round: ['$avgOrderValue', 2] }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);
  }
}
```

### 6.3 Auto-Scaling Configuration

#### Kubernetes Horizontal Pod Autoscaler
```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: restaurant-dashboard-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: restaurant-dashboard-api
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "1000"
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
```

## 7. Testing Strategy

### 7.1 Comprehensive Test Coverage

#### Unit Testing
```typescript
// Example unit test for order normalization
describe('OrderNormalizer', () => {
  let normalizer: OrderNormalizer;
  
  beforeEach(() => {
    normalizer = new OrderNormalizer();
  });
  
  describe('normalizeSwiggyOrder', () => {
    it('should correctly normalize a Swiggy order', () => {
      const swiggyOrder = {
        id: 'SW123456',
        customer_details: {
          name: 'John Doe',
          phone: '+91-9876543210'
        },
        items: [
          {
            name: 'Chicken Biryani',
            quantity: 2,
            price: 299.00
          }
        ],
        total_amount: 598.00,
        status: 'placed'
      };
      
      const normalized = normalizer.normalizeSwiggyOrder(swiggyOrder);
      
      expect(normalized.id).toBeDefined();
      expect(normalized.platform).toBe('swiggy');
      expect(normalized.platformOrderId).toBe('SW123456');
      expect(normalized.customer.name).toBe('John Doe');
      expect(normalized.items).toHaveLength(1);
      expect(normalized.pricing.total).toBe(598.00);
      expect(normalized.status).toBe(OrderStatus.RECEIVED);
    });
  });
});
```

#### Integration Testing
```typescript
// Integration test for platform adapter
describe('SwiggyAdapter Integration', () => {
  let adapter: SwiggyAdapter;
  let mockServer: MockServer;
  
  beforeAll(async () => {
    mockServer = new MockServer();
    await mockServer.start();
    
    adapter = new SwiggyAdapter({
      baseUrl: mockServer.url,
      partnerId: 'TEST_PARTNER',
      apiKey: 'TEST_API_KEY'
    });
  });
  
  afterAll(async () => {
    await mockServer.stop();
  });
  
  it('should authenticate successfully', async () => {
    mockServer.post('/auth')
      .reply(200, { 
        access_token: 'mock_token',
        expires_in: 3600 
      });
    
    const result = await adapter.authenticate();
    
    expect(result.success).toBe(true);
    expect(result.token).toBe('mock_token');
  });
  
  it('should handle rate limiting', async () => {
    mockServer.get('/orders')
      .reply(429, {}, { 'retry-after': '2' });
    
    const startTime = Date.now();
    
    try {
      await adapter.fetchOrders();
    } catch (error) {
      const duration = Date.now() - startTime;
      expect(duration).toBeGreaterThanOrEqual(2000);
    }
  });
});
```

### 7.2 End-to-End Testing
```typescript
// E2E test using Cypress
describe('Order Management Flow', () => {
  beforeEach(() => {
    cy.login('restaurant@example.com', 'password');
    cy.visit('/dashboard');
  });
  
  it('should display new order and allow status update', () => {
    // Mock incoming order from WebSocket
    cy.mockWebSocketMessage('order:new', {
      id: 'order-123',
      platform: 'swiggy',
      customer: { name: 'Test Customer' },
      items: [{ name: 'Test Item', quantity: 1 }],
      status: 'received'
    });
    
    // Verify order appears in dashboard
    cy.get('[data-testid="order-stream"]')
      .should('contain', 'Test Customer')
      .and('contain', 'Test Item');
    
    // Update order status
    cy.get('[data-testid="order-123"]')
      .find('[data-testid="confirm-button"]')
      .click();
    
    // Verify status update
    cy.get('[data-testid="order-123"]')
      .should('have.attr', 'data-status', 'confirmed');
    
    // Verify API call was made
    cy.wait('@updateOrderStatus')
      .its('request.body')
      .should('deep.include', {
        orderId: 'order-123',
        status: 'confirmed'
      });
  });
});
```

This comprehensive product specification provides the detailed framework for building the Unified Restaurant Dashboard. The next sections will cover user journey design, technical challenges, and business strategy components.