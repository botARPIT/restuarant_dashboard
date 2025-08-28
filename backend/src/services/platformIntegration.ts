import { getDatabasePool } from '../config/database';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import crypto from 'crypto';

// Platform integration interfaces
interface PlatformConfig {
  apiKey: string;
  apiSecret: string;
  webhookUrl?: string;
  isActive: boolean;
  settings: Record<string, any>;
}

interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  status: string;
  platformOrderId: string;
}

interface PlatformResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

// Base platform integration class
abstract class BasePlatformIntegration {
  protected config: PlatformConfig;
  protected apiClient: AxiosInstance;
  protected platformName: string;

  constructor(platformName: string, config: PlatformConfig) {
    this.platformName = platformName;
    this.config = config;
    
    this.apiClient = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'RestaurantDashboard/1.0'
      }
    });

    // Add request interceptor for authentication
    this.apiClient.interceptors.request.use(
      (config) => this.authenticateRequest(config),
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => this.handleApiError(error)
    );
  }

  protected abstract authenticateRequest(config: any): any;
  protected abstract handleApiError(error: any): any;
  
  abstract fetchOrders(): Promise<OrderData[]>;
  abstract updateOrderStatus(orderId: string, status: string): Promise<boolean>;
  abstract getOrderDetails(orderId: string): Promise<OrderData | null>;
}

// Zomato integration
export class ZomatoIntegration extends BasePlatformIntegration {
  private baseUrl = 'https://developers.zomato.com/api/v2.1';

  constructor(config: PlatformConfig) {
    super('Zomato', config);
  }

  protected authenticateRequest(config: any): any {
    config.headers['user-key'] = this.config.apiKey;
    return config;
  }

  protected handleApiError(error: any): any {
    if (error.response) {
      console.error(`Zomato API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    }
    return Promise.reject(error);
  }

  async fetchOrders(): Promise<OrderData[]> {
    try {
      // Note: Zomato's public API has limited access to order data
      // In production, you'd need to use their Partner API or webhook system
      const response = await this.apiClient.get(`${this.baseUrl}/orders`);
      
      // Transform Zomato order format to our format
      return this.transformOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch Zomato orders:', error);
      return [];
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      // Update order status in Zomato (if using Partner API)
      const response = await this.apiClient.put(`${this.baseUrl}/orders/${orderId}/status`, {
        status
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('Failed to update Zomato order status:', error);
      return false;
    }
  }

  async getOrderDetails(orderId: string): Promise<OrderData | null> {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/orders/${orderId}`);
      return this.transformOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch Zomato order details:', error);
      return null;
    }
  }

  private transformOrders(orders: any[]): OrderData[] {
    return orders.map(order => this.transformOrder(order));
  }

  private transformOrder(order: any): OrderData {
    return {
      orderId: order.order_id || order.id,
      customerName: order.customer?.name || 'Unknown Customer',
      customerEmail: order.customer?.email,
      customerPhone: order.customer?.phone,
      items: order.items?.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })) || [],
      totalPrice: order.total_price || 0,
      status: order.status || 'pending',
      platformOrderId: order.platform_order_id || order.order_id
    };
  }

  // Webhook verification for Zomato
  verifyWebhook(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.config.apiSecret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }
}

// Swiggy integration
export class SwiggyIntegration extends BasePlatformIntegration {
  private baseUrl = 'https://api.swiggy.com/v1'; // Example URL

  constructor(config: PlatformConfig) {
    super('Swiggy', config);
  }

  protected authenticateRequest(config: any): any {
    config.headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    return config;
  }

  protected handleApiError(error: any): any {
    if (error.response) {
      console.error(`Swiggy API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    }
    return Promise.reject(error);
  }

  async fetchOrders(): Promise<OrderData[]> {
    try {
      // Fetch orders from Swiggy API
      const response = await this.apiClient.get(`${this.baseUrl}/orders`);
      
      // Transform Swiggy order format to our format
      return this.transformOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch Swiggy orders:', error);
      return [];
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      // Update order status in Swiggy
      const response = await this.apiClient.put(`${this.baseUrl}/orders/${orderId}/status`, {
        status
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('Failed to update Swiggy order status:', error);
      return false;
    }
  }

  async getOrderDetails(orderId: string): Promise<OrderData | null> {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/orders/${orderId}`);
      return this.transformOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch Swiggy order details:', error);
      return null;
    }
  }

  private transformOrders(orders: any[]): OrderData[] {
    return orders.map(order => this.transformOrder(order));
  }

  private transformOrder(order: any): OrderData {
    return {
      orderId: order.order_id || order.id,
      customerName: order.customer?.name || 'Unknown Customer',
      customerEmail: order.customer?.email,
      customerPhone: order.customer?.phone,
      items: order.items?.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })) || [],
      totalPrice: order.total_price || 0,
      status: order.status || 'pending',
      platformOrderId: order.platform_order_id || order.order_id
    };
  }

  // Webhook verification for Swiggy
  verifyWebhook(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.config.apiSecret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }
}

// Platform integration manager
export class PlatformIntegrationManager {
  private integrations: Map<string, BasePlatformIntegration> = new Map();
  private db = getDatabasePool();

  constructor() {
    this.initializeIntegrations();
  }

  private async initializeIntegrations(): Promise<void> {
    try {
      const result = await this.db.query(
        'SELECT platform, api_key, api_secret, webhook_url, is_active, settings FROM platform_integrations WHERE is_active = true'
      );

      for (const row of result.rows) {
        const config: PlatformConfig = {
          apiKey: row.api_key,
          apiSecret: row.api_secret,
          webhookUrl: row.webhook_url,
          isActive: row.is_active,
          settings: row.settings || {}
        };

        let integration: BasePlatformIntegration;

        switch (row.platform.toLowerCase()) {
          case 'zomato':
            integration = new ZomatoIntegration(config);
            break;
          case 'swiggy':
            integration = new SwiggyIntegration(config);
            break;
          default:
            console.warn(`Unknown platform: ${row.platform}`);
            continue;
        }

        this.integrations.set(row.platform.toLowerCase(), integration);
        console.log(`✅ ${row.platform} integration initialized`);
      }
    } catch (error) {
      console.error('Failed to initialize platform integrations:', error);
    }
  }

  async getIntegration(platform: string): Promise<BasePlatformIntegration | null> {
    return this.integrations.get(platform.toLowerCase()) || null;
  }

  async fetchAllOrders(): Promise<OrderData[]> {
    const allOrders: OrderData[] = [];

    for (const [platform, integration] of this.integrations.entries()) {
      try {
        const orders = await integration.fetchOrders();
        // Add platform information to orders
        orders.forEach(order => {
          (order as any).platform = platform;
        });
        allOrders.push(...orders);
      } catch (error) {
        console.error(`Failed to fetch orders from ${platform}:`, error);
      }
    }

    return allOrders;
  }

  async updateOrderStatus(platform: string, orderId: string, status: string): Promise<boolean> {
    const integration = await this.getIntegration(platform);
    if (!integration) {
      throw new Error(`Platform ${platform} not found`);
    }

    return await integration.updateOrderStatus(orderId, status);
  }

  async getOrderDetails(platform: string, orderId: string): Promise<OrderData | null> {
    const integration = await this.getIntegration(platform);
    if (!integration) {
      throw new Error(`Platform ${platform} not found`);
    }

    return await integration.getOrderDetails(orderId);
  }

  // Webhook handlers
  async handleZomatoWebhook(payload: any, signature: string): Promise<PlatformResponse> {
    const integration = await this.getIntegration('zomato') as ZomatoIntegration;
    if (!integration) {
      return { success: false, error: 'Zomato integration not found' };
    }

    if (!integration.verifyWebhook(JSON.stringify(payload), signature)) {
      return { success: false, error: 'Invalid webhook signature' };
    }

    try {
      // Process webhook payload
      await this.processWebhookPayload('zomato', payload);
      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      return { success: false, error: `Failed to process webhook: ${error}` };
    }
  }

  async handleSwiggyWebhook(payload: any, signature: string): Promise<PlatformResponse> {
    const integration = await this.getIntegration('swiggy') as SwiggyIntegration;
    if (!integration) {
      return { success: false, error: 'Swiggy integration not found' };
    }

    if (!integration.verifyWebhook(JSON.stringify(payload), signature)) {
      return { success: false, error: 'Invalid webhook signature' };
    }

    try {
      // Process webhook payload
      await this.processWebhookPayload('swiggy', payload);
      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      return { success: false, error: `Failed to process webhook: ${error}` };
    }
  }

  private async processWebhookPayload(platform: string, payload: any): Promise<void> {
    // Process different types of webhooks
    switch (payload.type) {
      case 'order.created':
        await this.handleOrderCreated(platform, payload.data);
        break;
      case 'order.updated':
        await this.handleOrderUpdated(platform, payload.data);
        break;
      case 'order.cancelled':
        await this.handleOrderCancelled(platform, payload.data);
        break;
      default:
        console.log(`Unknown webhook type: ${payload.type}`);
    }
  }

  private async handleOrderCreated(platform: string, orderData: any): Promise<void> {
    // Save new order to database
    await this.db.query(
      `INSERT INTO orders (order_id, customer_name, customer_email, customer_phone, items, total_price, status, platform, platform_order_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (order_id) DO UPDATE SET
       customer_name = EXCLUDED.customer_name,
       customer_email = EXCLUDED.customer_email,
       customer_phone = EXCLUDED.customer_phone,
       items = EXCLUDED.items,
       total_price = EXCLUDED.total_price,
       status = EXCLUDED.status,
       updated_at = CURRENT_TIMESTAMP`,
      [
        orderData.orderId,
        orderData.customerName,
        orderData.customerEmail,
        orderData.customerPhone,
        JSON.stringify(orderData.items),
        orderData.totalPrice,
        orderData.status,
        platform,
        orderData.platformOrderId
      ]
    );

    console.log(`✅ Order created: ${orderData.orderId} from ${platform}`);
  }

  private async handleOrderUpdated(platform: string, orderData: any): Promise<void> {
    // Update existing order in database
    await this.db.query(
      `UPDATE orders SET
       customer_name = $2,
       customer_email = $3,
       customer_phone = $4,
       items = $5,
       total_price = $6,
       status = $7,
       updated_at = CURRENT_TIMESTAMP
       WHERE platform_order_id = $1`,
      [
        orderData.platformOrderId,
        orderData.customerName,
        orderData.customerEmail,
        orderData.customerPhone,
        JSON.stringify(orderData.items),
        orderData.totalPrice,
        orderData.status
      ]
    );

    console.log(`✅ Order updated: ${orderData.orderId} from ${platform}`);
  }

  private async handleOrderCancelled(platform: string, orderData: any): Promise<void> {
    // Update order status to cancelled
    await this.db.query(
      `UPDATE orders SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE platform_order_id = $1`,
      [orderData.platformOrderId]
    );

    console.log(`✅ Order cancelled: ${orderData.orderId} from ${platform}`);
  }

  // Health check for all integrations
  async getHealthStatus(): Promise<Record<string, any>> {
    const health: Record<string, any> = {};

    for (const [platform, integration] of this.integrations.entries()) {
      try {
        // Test API connection
        const orders = await integration.fetchOrders();
        health[platform] = {
          status: 'healthy',
          message: `Connected successfully. Found ${orders.length} orders.`,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        health[platform] = {
          status: 'unhealthy',
          message: `Connection failed: ${error}`,
          timestamp: new Date().toISOString()
        };
      }
    }

    return health;
  }
}

export default PlatformIntegrationManager;