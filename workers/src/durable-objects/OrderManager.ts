import { DurableObject } from "cloudflare:workers";

interface OrderState {
  id: string;
  status: string;
  restaurantId: string;
  platform: string;
  lastUpdated: string;
  subscribers: string[]; // WebSocket connection IDs
}

interface OrderUpdate {
  orderId: string;
  status: string;
  timestamp: string;
  platform: string;
  metadata?: Record<string, any>;
}

export class OrderManager extends DurableObject {
  private orders: Map<string, OrderState> = new Map();
  private websockets: Map<string, WebSocket> = new Map();

  constructor(state: DurableObjectState, env: any) {
    super(state, env);
    
    // Load persistent state
    this.state.blockConcurrencyWhile(async () => {
      const stored = await this.state.storage.get("orders");
      if (stored) {
        this.orders = new Map(stored as [string, OrderState][]);
      }
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    switch (url.pathname) {
      case '/websocket':
        return this.handleWebSocket(request);
      case '/orders':
        return this.handleOrderRequest(request);
      case '/update':
        return this.handleOrderUpdate(request);
      default:
        return new Response('Not found', { status: 404 });
    }
  }

  private async handleWebSocket(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected websocket', { status: 426 });
    }

    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    server.accept();
    
    const connectionId = this.generateConnectionId();
    this.websockets.set(connectionId, server);

    server.addEventListener('message', async (event) => {
      try {
        const data = JSON.parse(event.data as string);
        await this.handleWebSocketMessage(connectionId, data);
      } catch (error) {
        console.error('WebSocket message error:', error);
        server.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });

    server.addEventListener('close', () => {
      this.websockets.delete(connectionId);
      // Remove from order subscribers
      for (const [orderId, order] of this.orders.entries()) {
        order.subscribers = order.subscribers.filter(id => id !== connectionId);
        if (order.subscribers.length === 0) {
          // Optionally clean up orders with no subscribers
        }
      }
    });

    // Send initial connection confirmation
    server.send(JSON.stringify({
      type: 'connected',
      connectionId,
      timestamp: new Date().toISOString()
    }));

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  private async handleOrderRequest(request: Request): Promise<Response> {
    if (request.method === 'GET') {
      const url = new URL(request.url);
      const restaurantId = url.searchParams.get('restaurantId');
      
      if (!restaurantId) {
        return new Response('Restaurant ID required', { status: 400 });
      }

      const restaurantOrders = Array.from(this.orders.values())
        .filter(order => order.restaurantId === restaurantId);

      return new Response(JSON.stringify(restaurantOrders), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Method not allowed', { status: 405 });
  }

  private async handleOrderUpdate(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const update: OrderUpdate = await request.json();
      await this.updateOrder(update);
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Order update error:', error);
      return new Response('Invalid request', { status: 400 });
    }
  }

  private async handleWebSocketMessage(connectionId: string, data: any): Promise<void> {
    switch (data.type) {
      case 'subscribe_orders':
        await this.subscribeToOrders(connectionId, data.restaurantId);
        break;
      case 'unsubscribe_orders':
        await this.unsubscribeFromOrders(connectionId, data.restaurantId);
        break;
      case 'update_order':
        await this.updateOrder(data.update);
        break;
      default:
        console.warn('Unknown WebSocket message type:', data.type);
    }
  }

  async updateOrder(update: OrderUpdate): Promise<void> {
    const existingOrder = this.orders.get(update.orderId);
    
    const orderState: OrderState = {
      id: update.orderId,
      status: update.status,
      restaurantId: existingOrder?.restaurantId || '',
      platform: update.platform,
      lastUpdated: update.timestamp,
      subscribers: existingOrder?.subscribers || []
    };

    this.orders.set(update.orderId, orderState);
    
    // Persist to storage
    await this.state.storage.put("orders", Array.from(this.orders.entries()));

    // Notify subscribers
    await this.notifySubscribers(update.orderId, {
      type: 'order_updated',
      order: orderState,
      update,
      timestamp: new Date().toISOString()
    });

    // Trigger analytics processing
    await this.env.ANALYTICS_QUEUE.send({
      type: 'order_status_change',
      orderId: update.orderId,
      previousStatus: existingOrder?.status,
      newStatus: update.status,
      platform: update.platform,
      timestamp: update.timestamp
    });
  }

  private async subscribeToOrders(connectionId: string, restaurantId: string): Promise<void> {
    // Add connection to all orders for this restaurant
    for (const [orderId, order] of this.orders.entries()) {
      if (order.restaurantId === restaurantId) {
        if (!order.subscribers.includes(connectionId)) {
          order.subscribers.push(connectionId);
        }
      }
    }

    // Acknowledge subscription
    const websocket = this.websockets.get(connectionId);
    if (websocket) {
      websocket.send(JSON.stringify({
        type: 'subscribed',
        restaurantId,
        timestamp: new Date().toISOString()
      }));
    }
  }

  private async unsubscribeFromOrders(connectionId: string, restaurantId: string): Promise<void> {
    // Remove connection from all orders for this restaurant
    for (const [orderId, order] of this.orders.entries()) {
      if (order.restaurantId === restaurantId) {
        order.subscribers = order.subscribers.filter(id => id !== connectionId);
      }
    }

    const websocket = this.websockets.get(connectionId);
    if (websocket) {
      websocket.send(JSON.stringify({
        type: 'unsubscribed',
        restaurantId,
        timestamp: new Date().toISOString()
      }));
    }
  }

  private async notifySubscribers(orderId: string, message: any): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) return;

    const promises = order.subscribers.map(async (connectionId) => {
      const websocket = this.websockets.get(connectionId);
      if (websocket && websocket.readyState === WebSocket.READY_STATE_OPEN) {
        try {
          websocket.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Failed to send message to ${connectionId}:`, error);
          // Remove dead connection
          this.websockets.delete(connectionId);
          order.subscribers = order.subscribers.filter(id => id !== connectionId);
        }
      }
    });

    await Promise.allSettled(promises);
  }

  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup method for old orders
  async cleanupOldOrders(maxAge: number = 24 * 60 * 60 * 1000): Promise<void> {
    const now = Date.now();
    const toDelete: string[] = [];

    for (const [orderId, order] of this.orders.entries()) {
      const orderAge = now - new Date(order.lastUpdated).getTime();
      if (orderAge > maxAge && order.subscribers.length === 0) {
        toDelete.push(orderId);
      }
    }

    for (const orderId of toDelete) {
      this.orders.delete(orderId);
    }

    if (toDelete.length > 0) {
      await this.state.storage.put("orders", Array.from(this.orders.entries()));
    }
  }

  // Get statistics
  async getStatistics(): Promise<any> {
    const stats = {
      totalOrders: this.orders.size,
      activeConnections: this.websockets.size,
      ordersByStatus: {} as Record<string, number>,
      ordersByPlatform: {} as Record<string, number>
    };

    for (const order of this.orders.values()) {
      // Count by status
      stats.ordersByStatus[order.status] = (stats.ordersByStatus[order.status] || 0) + 1;
      
      // Count by platform
      stats.ordersByPlatform[order.platform] = (stats.ordersByPlatform[order.platform] || 0) + 1;
    }

    return stats;
  }
}