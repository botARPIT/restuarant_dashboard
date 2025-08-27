import { 
  DeliveryPlatformAdapter, 
  AuthResult, 
  UnifiedOrder, 
  OrderFilters, 
  OrderStatus, 
  Menu, 
  AnalyticsData, 
  TimeRange, 
  HealthStatus,
  CustomerInfo,
  OrderItem,
  PricingBreakdown,
  DeliveryInfo,
  OrderEvent
} from '../base/DeliveryPlatformAdapter';

interface SwiggyConfig {
  baseUrl: string;
  partnerId: string;
  apiKey: string;
  apiSecret: string;
  environment: 'sandbox' | 'production';
  timeout: number;
  retryAttempts: number;
  rateLimitBuffer: number;
}

interface SwiggyAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface SwiggyOrder {
  id: string;
  order_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  customer_details: {
    name: string;
    phone: string;
    email?: string;
  };
  delivery_address: {
    complete_address: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
    city: string;
    area: string;
    pincode: string;
  };
  order_items: SwiggyOrderItem[];
  order_total: {
    item_total: number;
    delivery_charge: number;
    packing_charge: number;
    tax_amount: number;
    total_amount: number;
    currency: string;
  };
  delivery_details?: {
    delivery_boy_name?: string;
    delivery_boy_phone?: string;
    estimated_delivery_time?: string;
  };
  restaurant_details: {
    id: string;
    name: string;
    address: string;
  };
}

interface SwiggyOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total_price: number;
  item_description?: string;
  customization?: SwiggyCustomization[];
  special_instructions?: string;
}

interface SwiggyCustomization {
  name: string;
  value: string;
  price: number;
}

interface SwiggyMenu {
  restaurant_id: string;
  menu_categories: SwiggyMenuCategory[];
  last_updated: string;
}

interface SwiggyMenuCategory {
  category_id: string;
  category_name: string;
  items: SwiggyMenuItem[];
  display_order: number;
}

interface SwiggyMenuItem {
  item_id: string;
  item_name: string;
  item_description: string;
  price: number;
  currency: string;
  is_available: boolean;
  preparation_time?: number;
  item_image_url?: string;
  customizations?: SwiggyMenuCustomization[];
  item_tags?: string[];
}

interface SwiggyMenuCustomization {
  customization_id: string;
  customization_name: string;
  customization_type: 'SINGLE' | 'MULTIPLE';
  is_mandatory: boolean;
  options: SwiggyCustomizationOption[];
}

interface SwiggyCustomizationOption {
  option_id: string;
  option_name: string;
  price: number;
  is_available: boolean;
}

export class SwiggyAdapter extends DeliveryPlatformAdapter {
  private refreshToken?: string;

  constructor(config: SwiggyConfig) {
    super(config);
  }

  protected getPlatformName(): string {
    return 'swiggy';
  }

  async authenticate(): Promise<AuthResult> {
    try {
      const response = await fetch(`${this.config.baseUrl}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          partner_id: this.config.partnerId,
          api_key: this.config.apiKey,
          api_secret: this.config.apiSecret,
          grant_type: 'client_credentials'
        })
      });

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          error: `Swiggy authentication failed: ${response.status} ${error}`
        };
      }

      const data: SwiggyAuthResponse = await response.json();
      this.refreshToken = data.refresh_token;

      return {
        success: true,
        token: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in
      };
    } catch (error) {
      return {
        success: false,
        error: `Swiggy authentication error: ${error.message}`
      };
    }
  }

  async fetchOrders(filters?: OrderFilters): Promise<UnifiedOrder[]> {
    const params = new URLSearchParams();
    
    if (filters?.status?.length) {
      params.append('status', filters.status.join(','));
    }
    if (filters?.startDate) {
      params.append('start_date', filters.startDate.toISOString());
    }
    if (filters?.endDate) {
      params.append('end_date', filters.endDate.toISOString());
    }
    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }
    if (filters?.offset) {
      params.append('offset', filters.offset.toString());
    }

    const url = `${this.config.baseUrl}/orders?${params.toString()}`;
    const response = await this.makeAuthenticatedRequest(url);
    const data = await response.json();

    return data.orders.map((order: SwiggyOrder) => this.normalizeOrder(order));
  }

  async getOrderDetails(orderId: string): Promise<UnifiedOrder> {
    const url = `${this.config.baseUrl}/orders/${orderId}`;
    const response = await this.makeAuthenticatedRequest(url);
    const data = await response.json();

    return this.normalizeOrder(data.order);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const swiggyStatus = this.mapToSwiggyStatus(status);
    
    const url = `${this.config.baseUrl}/orders/${orderId}/status`;
    const response = await this.makeAuthenticatedRequest(url, {
      method: 'PUT',
      body: JSON.stringify({
        status: swiggyStatus,
        updated_at: new Date().toISOString()
      })
    });

    return response.ok;
  }

  async cancelOrder(orderId: string, reason: string): Promise<boolean> {
    const url = `${this.config.baseUrl}/orders/${orderId}/cancel`;
    const response = await this.makeAuthenticatedRequest(url, {
      method: 'POST',
      body: JSON.stringify({
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString()
      })
    });

    return response.ok;
  }

  async getMenu(): Promise<Menu> {
    const url = `${this.config.baseUrl}/menu`;
    const response = await this.makeAuthenticatedRequest(url);
    const data = await response.json();

    return this.normalizeMenu(data.menu);
  }

  async updateMenu(menu: Menu): Promise<boolean> {
    const swiggyMenu = this.mapToSwiggyMenu(menu);
    
    const url = `${this.config.baseUrl}/menu`;
    const response = await this.makeAuthenticatedRequest(url, {
      method: 'PUT',
      body: JSON.stringify(swiggyMenu)
    });

    return response.ok;
  }

  async updateItemAvailability(itemId: string, available: boolean): Promise<boolean> {
    const url = `${this.config.baseUrl}/menu/items/${itemId}/availability`;
    const response = await this.makeAuthenticatedRequest(url, {
      method: 'PUT',
      body: JSON.stringify({
        is_available: available,
        updated_at: new Date().toISOString()
      })
    });

    return response.ok;
  }

  async updateItemPrice(itemId: string, price: number): Promise<boolean> {
    const url = `${this.config.baseUrl}/menu/items/${itemId}/price`;
    const response = await this.makeAuthenticatedRequest(url, {
      method: 'PUT',
      body: JSON.stringify({
        price: this.validatePrice(price),
        updated_at: new Date().toISOString()
      })
    });

    return response.ok;
  }

  async getOrderAnalytics(timeRange: TimeRange): Promise<AnalyticsData> {
    const params = new URLSearchParams({
      start_date: timeRange.start.toISOString(),
      end_date: timeRange.end.toISOString()
    });

    const url = `${this.config.baseUrl}/analytics/orders?${params.toString()}`;
    const response = await this.makeAuthenticatedRequest(url);
    const data = await response.json();

    return {
      timeRange,
      metrics: {
        totalOrders: data.total_orders,
        totalRevenue: data.total_revenue,
        averageOrderValue: data.average_order_value,
        cancelledOrders: data.cancelled_orders,
        avgPreparationTime: data.avg_preparation_time,
        customerRating: data.average_rating,
        topItems: data.top_items?.map((item: any) => ({
          itemId: item.item_id,
          itemName: item.item_name,
          orderCount: item.order_count,
          revenue: item.revenue
        })) || []
      }
    };
  }

  async healthCheck(): Promise<HealthStatus> {
    const startTime = Date.now();
    
    try {
      const url = `${this.config.baseUrl}/health`;
      const response = await this.makeAuthenticatedRequest(url);
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        return {
          status: responseTime < 1000 ? 'healthy' : 'degraded',
          responseTime,
          lastChecked: new Date()
        };
      } else {
        return {
          status: 'unhealthy',
          responseTime,
          lastChecked: new Date(),
          errors: [`HTTP ${response.status}: ${response.statusText}`]
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastChecked: new Date(),
        errors: [error.message]
      };
    }
  }

  protected normalizeOrder(swiggyOrder: SwiggyOrder): UnifiedOrder {
    const customer: CustomerInfo = {
      name: swiggyOrder.customer_details.name,
      phone: this.validatePhoneNumber(swiggyOrder.customer_details.phone),
      email: swiggyOrder.customer_details.email,
      address: {
        street: swiggyOrder.delivery_address.complete_address,
        city: swiggyOrder.delivery_address.city,
        state: swiggyOrder.delivery_address.area,
        country: 'India', // Swiggy is India-specific
        zipCode: swiggyOrder.delivery_address.pincode,
        coordinates: swiggyOrder.delivery_address.latitude && swiggyOrder.delivery_address.longitude ? {
          latitude: swiggyOrder.delivery_address.latitude,
          longitude: swiggyOrder.delivery_address.longitude
        } : undefined
      }
    };

    const items: OrderItem[] = swiggyOrder.order_items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unitPrice: this.validatePrice(item.price),
      totalPrice: this.validatePrice(item.total_price),
      customizations: item.customization?.map(custom => ({
        name: custom.name,
        value: custom.value,
        price: this.validatePrice(custom.price)
      })),
      instructions: item.special_instructions
    }));

    const pricing: PricingBreakdown = {
      subtotal: this.validatePrice(swiggyOrder.order_total.item_total),
      tax: this.validatePrice(swiggyOrder.order_total.tax_amount),
      deliveryFee: this.validatePrice(swiggyOrder.order_total.delivery_charge),
      serviceFee: this.validatePrice(swiggyOrder.order_total.packing_charge),
      discount: 0, // Not provided in this format
      total: this.validatePrice(swiggyOrder.order_total.total_amount),
      currency: swiggyOrder.order_total.currency
    };

    const delivery: DeliveryInfo = {
      type: 'delivery',
      driverInfo: swiggyOrder.delivery_details ? {
        name: swiggyOrder.delivery_details.delivery_boy_name || '',
        phone: swiggyOrder.delivery_details.delivery_boy_phone || ''
      } : undefined,
      estimatedTime: swiggyOrder.delivery_details?.estimated_delivery_time ? 
        new Date(swiggyOrder.delivery_details.estimated_delivery_time).getTime() : undefined
    };

    const timeline: OrderEvent[] = [
      {
        type: 'order_placed',
        timestamp: new Date(swiggyOrder.created_at),
        description: 'Order placed by customer'
      }
    ];

    if (swiggyOrder.updated_at !== swiggyOrder.created_at) {
      timeline.push({
        type: 'status_updated',
        timestamp: new Date(swiggyOrder.updated_at),
        description: `Order status updated to ${swiggyOrder.status}`
      });
    }

    return {
      id: `swiggy_${swiggyOrder.id}`,
      platform: 'swiggy',
      platformOrderId: swiggyOrder.order_id,
      restaurantId: swiggyOrder.restaurant_details.id,
      customer,
      items,
      status: this.validateOrderStatus(swiggyOrder.status),
      timeline,
      pricing,
      delivery,
      metadata: {
        originalOrder: swiggyOrder,
        restaurantName: swiggyOrder.restaurant_details.name,
        restaurantAddress: swiggyOrder.restaurant_details.address
      },
      createdAt: new Date(swiggyOrder.created_at),
      updatedAt: new Date(swiggyOrder.updated_at)
    };
  }

  protected normalizeMenu(swiggyMenu: SwiggyMenu): Menu {
    return {
      id: `swiggy_menu_${swiggyMenu.restaurant_id}`,
      restaurantId: swiggyMenu.restaurant_id,
      categories: swiggyMenu.menu_categories.map(category => ({
        id: category.category_id,
        name: category.category_name,
        items: category.items.map(item => ({
          id: item.item_id,
          name: item.item_name,
          description: item.item_description,
          price: this.validatePrice(item.price),
          currency: item.currency,
          available: item.is_available,
          preparationTime: item.preparation_time,
          images: item.item_image_url ? [item.item_image_url] : [],
          customizations: item.customizations?.map(custom => ({
            id: custom.customization_id,
            name: custom.customization_name,
            type: custom.customization_type.toLowerCase() as 'single' | 'multiple',
            required: custom.is_mandatory,
            options: custom.options.map(option => ({
              id: option.option_id,
              name: option.option_name,
              price: this.validatePrice(option.price),
              available: option.is_available
            }))
          })),
          tags: item.item_tags
        })),
        displayOrder: category.display_order
      })),
      lastUpdated: new Date(swiggyMenu.last_updated)
    };
  }

  private mapToSwiggyStatus(status: OrderStatus): string {
    const statusMap: Record<OrderStatus, string> = {
      [OrderStatus.RECEIVED]: 'PLACED',
      [OrderStatus.CONFIRMED]: 'ACCEPTED',
      [OrderStatus.PREPARING]: 'FOOD_PREPARATION',
      [OrderStatus.READY]: 'FOOD_READY',
      [OrderStatus.PICKED_UP]: 'DISPATCHED',
      [OrderStatus.OUT_FOR_DELIVERY]: 'DISPATCHED',
      [OrderStatus.DELIVERED]: 'DELIVERED',
      [OrderStatus.CANCELLED]: 'CANCELLED',
      [OrderStatus.REFUNDED]: 'REFUNDED'
    };

    return statusMap[status] || 'PLACED';
  }

  private mapToSwiggyMenu(menu: Menu): SwiggyMenu {
    return {
      restaurant_id: menu.restaurantId,
      menu_categories: menu.categories.map(category => ({
        category_id: category.id,
        category_name: category.name,
        display_order: category.displayOrder,
        items: category.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          item_description: item.description,
          price: item.price,
          currency: item.currency,
          is_available: item.available,
          preparation_time: item.preparationTime,
          item_image_url: item.images?.[0],
          customizations: item.customizations?.map(custom => ({
            customization_id: custom.id,
            customization_name: custom.name,
            customization_type: custom.type.toUpperCase() as 'SINGLE' | 'MULTIPLE',
            is_mandatory: custom.required,
            options: custom.options.map(option => ({
              option_id: option.id,
              option_name: option.name,
              price: option.price,
              is_available: option.available
            }))
          })),
          item_tags: item.tags
        }))
      })),
      last_updated: menu.lastUpdated.toISOString()
    };
  }
}