# Platform Adapters

This directory contains platform-specific adapters for integrating with various food delivery services. Each adapter implements the `DeliveryPlatformAdapter` interface to provide standardized access to platform APIs.

## Supported Platforms

### Tier 1 Platforms (Primary Focus)
- **Swiggy** (India) - Market leader in India
- **Zomato** (India/Global) - Major presence in India and international markets
- **UberEats** (Global) - International platform with strong presence
- **DoorDash** (US/International) - Leading US platform expanding globally

### Tier 2 Platforms (Secondary)
- **Grubhub** (US) - Established US market player
- **Deliveroo** (EU/UK) - Strong European presence
- **Foodpanda** (Asia) - Regional Asian platform
- **Dunzo** (India) - Quick commerce and food delivery

### Tier 3 Platforms (Regional/Future)
- **Just Eat** (EU)
- **Postmates** (Acquired by Uber)
- **Seamless** (US)
- Regional platforms based on market demand

## Adapter Architecture

### Interface Definition
```typescript
interface DeliveryPlatformAdapter {
  // Authentication
  authenticate(): Promise<AuthResult>;
  refreshToken(): Promise<AuthResult>;
  
  // Order Management
  fetchOrders(filters?: OrderFilters): Promise<Order[]>;
  getOrderDetails(orderId: string): Promise<OrderDetails>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  cancelOrder(orderId: string, reason: string): Promise<boolean>;
  
  // Menu Management
  getMenu(): Promise<Menu>;
  updateMenu(menu: Menu): Promise<UpdateResult>;
  updateItemAvailability(itemId: string, available: boolean): Promise<boolean>;
  updateItemPrice(itemId: string, price: number): Promise<boolean>;
  
  // Analytics
  getOrderAnalytics(timeRange: TimeRange): Promise<AnalyticsData>;
  getPerformanceMetrics(): Promise<PerformanceMetrics>;
  
  // Webhooks
  registerWebhook(endpoint: string, events: string[]): Promise<WebhookResult>;
  unregisterWebhook(webhookId: string): Promise<boolean>;
  
  // Utility
  getApiLimits(): ApiLimits;
  healthCheck(): Promise<HealthStatus>;
}
```

## Implementation Guidelines

### Error Handling
All adapters must implement comprehensive error handling:
- **Rate Limiting**: Implement exponential backoff for 429 responses
- **Authentication Errors**: Auto-refresh tokens when possible
- **Network Errors**: Retry with circuit breaker pattern
- **API Errors**: Map platform-specific errors to standard error codes

### Data Normalization
Each adapter normalizes platform-specific data to our unified format:
- **Orders**: Convert to `UnifiedOrder` format
- **Menu Items**: Convert to `UnifiedMenuItem` format
- **Customer Data**: Standardize customer information
- **Analytics**: Normalize metrics and KPIs

### Configuration
Each adapter supports environment-specific configuration:
```typescript
interface AdapterConfig {
  baseUrl: string;
  apiKey: string;
  apiSecret?: string;
  partnerId?: string;
  environment: 'sandbox' | 'production';
  timeout: number;
  retryAttempts: number;
  rateLimitBuffer: number;
}
```

## Testing Strategy

### Mock Adapters
For development and testing, each adapter has a corresponding mock implementation:
- **MockSwiggyAdapter**: Simulates Swiggy API responses
- **MockZomatoAdapter**: Simulates Zomato API responses
- etc.

### Integration Tests
Comprehensive integration tests verify:
- Authentication flows
- Order lifecycle management
- Menu synchronization
- Error handling scenarios
- Rate limiting behavior

## Monitoring & Observability

### Metrics
Each adapter exposes metrics for monitoring:
- **Request Latency**: API response times
- **Error Rates**: Success/failure ratios
- **Rate Limit Usage**: Current API usage vs limits
- **Data Quality**: Validation error rates

### Logging
Structured logging includes:
- **API Requests/Responses**: For debugging
- **Authentication Events**: Token refresh, failures
- **Error Events**: Detailed error context
- **Performance Events**: Slow queries, timeouts

## Security Considerations

### API Key Management
- Store credentials securely using environment variables
- Implement key rotation mechanisms
- Monitor for compromised credentials

### Data Privacy
- Encrypt sensitive data in transit and at rest
- Implement data retention policies
- Ensure GDPR/CCPA compliance

### Rate Limiting
- Respect platform rate limits
- Implement intelligent request scheduling
- Use caching to reduce API calls