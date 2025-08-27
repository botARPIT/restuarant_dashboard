import { EventEmitter } from 'events';

// Core interfaces
export interface AuthResult {
  success: boolean;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
  error?: string;
}

export interface OrderFilters {
  status?: OrderStatus[];
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export enum OrderStatus {
  RECEIVED = 'received',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  PICKED_UP = 'picked_up',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export interface UnifiedOrder {
  id: string;
  platform: string;
  platformOrderId: string;
  restaurantId: string;
  customer: CustomerInfo;
  items: OrderItem[];
  status: OrderStatus;
  timeline: OrderEvent[];
  pricing: PricingBreakdown;
  delivery: DeliveryInfo;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerInfo {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  address: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations?: ItemCustomization[];
  instructions?: string;
}

export interface ItemCustomization {
  name: string;
  value: string;
  price: number;
}

export interface OrderEvent {
  type: string;
  timestamp: Date;
  description: string;
  metadata?: Record<string, any>;
}

export interface PricingBreakdown {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  currency: string;
}

export interface DeliveryInfo {
  type: 'pickup' | 'delivery';
  estimatedTime?: number;
  actualTime?: number;
  driverInfo?: DriverInfo;
  trackingUrl?: string;
}

export interface DriverInfo {
  name: string;
  phone: string;
  vehicleInfo?: string;
}

export interface Menu {
  id: string;
  restaurantId: string;
  categories: MenuCategory[];
  lastUpdated: Date;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
  displayOrder: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  available: boolean;
  preparationTime?: number;
  images?: string[];
  nutritionalInfo?: NutritionalInfo;
  customizations?: MenuCustomization[];
  tags?: string[];
}

export interface MenuCustomization {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface AnalyticsData {
  timeRange: TimeRange;
  metrics: AnalyticsMetrics;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface AnalyticsMetrics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  cancelledOrders: number;
  avgPreparationTime: number;
  customerRating?: number;
  topItems: PopularItem[];
}

export interface PopularItem {
  itemId: string;
  itemName: string;
  orderCount: number;
  revenue: number;
}

export interface ApiLimits {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  currentUsage: {
    minute: number;
    hour: number;
    day: number;
  };
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastChecked: Date;
  errors?: string[];
}

export interface AdapterConfig {
  baseUrl: string;
  apiKey: string;
  apiSecret?: string;
  partnerId?: string;
  environment: 'sandbox' | 'production';
  timeout: number;
  retryAttempts: number;
  rateLimitBuffer: number;
}

export interface RateLimitState {
  requestsRemaining: number;
  resetTime: Date;
  windowStart: Date;
}

// Base adapter class
export abstract class DeliveryPlatformAdapter extends EventEmitter {
  protected config: AdapterConfig;
  protected authToken?: string;
  protected tokenExpiry?: Date;
  protected rateLimitState: RateLimitState;

  constructor(config: AdapterConfig) {
    super();
    this.config = config;
    this.rateLimitState = {
      requestsRemaining: 0,
      resetTime: new Date(),
      windowStart: new Date()
    };
  }

  // Abstract methods to be implemented by specific adapters
  abstract authenticate(): Promise<AuthResult>;
  abstract fetchOrders(filters?: OrderFilters): Promise<UnifiedOrder[]>;
  abstract getOrderDetails(orderId: string): Promise<UnifiedOrder>;
  abstract updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  abstract cancelOrder(orderId: string, reason: string): Promise<boolean>;
  abstract getMenu(): Promise<Menu>;
  abstract updateMenu(menu: Menu): Promise<boolean>;
  abstract updateItemAvailability(itemId: string, available: boolean): Promise<boolean>;
  abstract updateItemPrice(itemId: string, price: number): Promise<boolean>;
  abstract getOrderAnalytics(timeRange: TimeRange): Promise<AnalyticsData>;
  abstract healthCheck(): Promise<HealthStatus>;

  // Common utility methods
  protected async makeAuthenticatedRequest(
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> {
    await this.ensureAuthenticated();
    await this.enforceRateLimit();

    const headers = {
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers,
      timeout: this.config.timeout
    });

    this.updateRateLimitState(response);

    if (response.status === 401) {
      // Token expired, refresh and retry
      await this.refreshAuthToken();
      return this.makeAuthenticatedRequest(url, options);
    }

    if (response.status === 429) {
      // Rate limited
      await this.handleRateLimit(response);
      return this.makeAuthenticatedRequest(url, options);
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  protected async ensureAuthenticated(): Promise<void> {
    if (!this.authToken || this.isTokenExpired()) {
      const result = await this.authenticate();
      if (!result.success) {
        throw new Error(`Authentication failed: ${result.error}`);
      }
      this.authToken = result.token;
      this.tokenExpiry = new Date(Date.now() + (result.expiresIn || 3600) * 1000);
    }
  }

  protected isTokenExpired(): boolean {
    return this.tokenExpiry ? new Date() >= this.tokenExpiry : true;
  }

  protected async refreshAuthToken(): Promise<void> {
    this.authToken = undefined;
    this.tokenExpiry = undefined;
    await this.ensureAuthenticated();
  }

  protected async enforceRateLimit(): Promise<void> {
    const now = new Date();
    
    if (now < this.rateLimitState.resetTime && this.rateLimitState.requestsRemaining <= 0) {
      const waitTime = this.rateLimitState.resetTime.getTime() - now.getTime();
      await this.delay(waitTime);
    }
  }

  protected updateRateLimitState(response: Response): void {
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');
    
    if (remaining) {
      this.rateLimitState.requestsRemaining = parseInt(remaining, 10);
    }
    
    if (reset) {
      this.rateLimitState.resetTime = new Date(parseInt(reset, 10) * 1000);
    }
  }

  protected async handleRateLimit(response: Response): Promise<void> {
    const retryAfter = response.headers.get('retry-after');
    const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 60000; // Default 1 minute
    
    this.emit('rateLimitExceeded', { waitTime, platform: this.getPlatformName() });
    await this.delay(waitTime);
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxAttempts: number = this.config.retryAttempts
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts) {
          break;
        }
        
        // Exponential backoff: 2^attempt * 1000ms
        const backoffMs = Math.pow(2, attempt) * 1000;
        await this.delay(backoffMs);
      }
    }
    
    throw lastError!;
  }

  // Platform-specific normalization methods (to be overridden)
  protected abstract normalizeOrder(platformOrder: any): UnifiedOrder;
  protected abstract normalizeMenu(platformMenu: any): Menu;
  protected abstract getPlatformName(): string;
  
  // Validation helpers
  protected validateOrderStatus(status: string): OrderStatus {
    const validStatuses = Object.values(OrderStatus);
    const normalizedStatus = status.toLowerCase().replace(/[^a-z]/g, '_') as OrderStatus;
    
    if (validStatuses.includes(normalizedStatus)) {
      return normalizedStatus;
    }
    
    // Fallback mapping for common variations
    const statusMapping: Record<string, OrderStatus> = {
      'new': OrderStatus.RECEIVED,
      'accepted': OrderStatus.CONFIRMED,
      'cooking': OrderStatus.PREPARING,
      'cooked': OrderStatus.READY,
      'dispatched': OrderStatus.OUT_FOR_DELIVERY,
      'completed': OrderStatus.DELIVERED,
      'rejected': OrderStatus.CANCELLED
    };
    
    return statusMapping[status.toLowerCase()] || OrderStatus.RECEIVED;
  }

  protected validatePrice(price: any): number {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice) || numPrice < 0) {
      throw new Error(`Invalid price: ${price}`);
    }
    return Math.round(numPrice * 100) / 100; // Round to 2 decimal places
  }

  protected validatePhoneNumber(phone: string): string {
    // Basic phone number validation and normalization
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (cleaned.length < 10) {
      throw new Error(`Invalid phone number: ${phone}`);
    }
    return cleaned;
  }

  // Metrics and monitoring
  public getApiLimits(): ApiLimits {
    return {
      requestsPerMinute: 60,
      requestsPerHour: 1000,
      requestsPerDay: 10000,
      currentUsage: {
        minute: 60 - this.rateLimitState.requestsRemaining,
        hour: 0, // Would need to track this
        day: 0   // Would need to track this
      }
    };
  }

  public async testConnection(): Promise<boolean> {
    try {
      const health = await this.healthCheck();
      return health.status === 'healthy';
    } catch (error) {
      return false;
    }
  }
}