import { PaymentMethod, PaymentInfo, Order, OrderStatus } from '../seagull-watch-types';
import { db } from '../database/database-manager';

// 支付配置信息
const PAYMENT_CONFIG = {
  alipay: {
    // 支付宝个人收款账号信息
    account: 'seagullwatch@example.com',
    name: '海鸥表专卖店',
    qrCodeUrl: 'images/payment/alipay-qr.jpg' // 支付宝收款码
  },
  wechat: {
    // 微信个人收款账号信息
    account: 'SeagullWatch2024',
    name: '海鸥表专卖店',
    qrCodeUrl: 'images/payment/wechat-qr.jpg' // 微信收款码
  },
  bank: {
    // 银行账户信息
    bankName: '中国工商银行',
    accountNumber: '6222 **** **** 1234',
    accountName: '海鸥表（天津）有限公司',
    branch: '天津分行营业部'
  }
};

// 支付服务类
export class PaymentService {
  
  /**
   * 创建支付订单
   */
  static async createPayment(order: Order, userId?: string): Promise<PaymentInfo> {
    try {
      // 转换为数据库订单格式
      const dbOrder = await db.createOrder({
        user_id: userId || undefined,
        order_number: order.id,
        payment_method: this.convertPaymentMethod(order.paymentMethod),
        subtotal: order.subtotal,
        shipping_fee: order.shipping,
        tax_fee: order.tax,
        discount_amount: 0,
        total_amount: order.total,
        shipping_address: {
          name: order.shippingAddress.name,
          phone: order.shippingAddress.phone,
          province: order.shippingAddress.province,
          city: order.shippingAddress.city,
          district: order.shippingAddress.district,
          street: order.shippingAddress.address,
          postal_code: order.shippingAddress.postalCode || '',
          is_default: false
        },
        notes: order.notes || '',
        ordered_at: new Date().toISOString()
      });

      // 保存订单项目  
      for (const item of order.items) {
        const orderItemData = {
          order_id: dbOrder.id,
          product_id: item.productId,
          product_name: item.name,
          product_image: item.imageUrl,
          sku: item.sku,
          price: item.price,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
          product_snapshot: {
            ...item,
            timestamp: new Date().toISOString()
          }
        };
        
        await db.getEngine().insert('order_items', orderItemData);
      }

      const paymentInfo: PaymentInfo = {
        orderId: dbOrder.id,
        amount: order.total,
        method: order.paymentMethod
      };

      switch (order.paymentMethod) {
        case PaymentMethod.ALIPAY:
          paymentInfo.qrCode = PAYMENT_CONFIG.alipay.qrCodeUrl;
          paymentInfo.accountInfo = `支付宝账号：${PAYMENT_CONFIG.alipay.account}`;
          break;
          
        case PaymentMethod.WECHAT:
          paymentInfo.qrCode = PAYMENT_CONFIG.wechat.qrCodeUrl;
          paymentInfo.accountInfo = `微信号：${PAYMENT_CONFIG.wechat.account}`;
          break;
          
        case PaymentMethod.BANK_TRANSFER:
          paymentInfo.accountInfo = `
            银行：${PAYMENT_CONFIG.bank.bankName}
            账号：${PAYMENT_CONFIG.bank.accountNumber}
            户名：${PAYMENT_CONFIG.bank.accountName}
            开户行：${PAYMENT_CONFIG.bank.branch}
          `;
          break;
      }

      return paymentInfo;
    } catch (error) {
      console.error('创建支付订单失败:', error);
      throw new Error('创建支付订单失败');
    }
  }

  /**
   * 确认支付（用户手动确认已完成转账）
   */
  static async confirmPayment(orderId: string): Promise<boolean> {
    try {
      const dbOrder = await db.getEngine().findById('orders', orderId);
      if (!dbOrder) {
        throw new Error('订单不存在');
      }

      // 更新订单状态为已支付
      await db.updateOrderStatus(orderId, 'paid');
      
      // 创建支付记录
      await db.getEngine().insert('payments', {
        order_id: orderId,
        payment_method: dbOrder.payment_method,
        amount: dbOrder.total_amount,
        status: 'success',
        paid_at: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error('确认支付失败:', error);
      return false;
    }
  }

  /**
   * 查询订单状态
   */
  static async getOrderStatus(orderId: string): Promise<OrderStatus | null> {
    try {
      const dbOrder = await db.getEngine().findById('orders', orderId);
      if (!dbOrder) {
        return null;
      }
      
      return this.convertDbOrderStatus(dbOrder.status);
    } catch (error) {
      console.error('查询订单状态失败:', error);
      return null;
    }
  }

  /**
   * 获取订单详情
   */
  static async getOrder(orderId: string): Promise<Order | null> {
    try {
      const dbOrder = await db.getEngine().findById('orders', orderId);
      if (!dbOrder) {
        return null;
      }

      // 获取订单项目
      const orderItems = await db.getEngine().find('order_items', {
        where: [{ field: 'order_id', operator: '=', value: orderId }]
      });

      // 转换为前端订单格式
      const order: Order = {
        id: dbOrder.id,
        orderNumber: dbOrder.order_number,
        items: orderItems.map(item => ({
          id: item.product_id,
          name: item.product_name,
          image: item.product_image,
          price: item.price,
          quantity: item.quantity,
          model: item.sku,
          total: item.total_price
        })),
        subtotal: dbOrder.subtotal,
        shipping: dbOrder.shipping_fee,
        tax: dbOrder.tax_fee,
        discount: dbOrder.discount_amount,
        total: dbOrder.total_amount,
        customerInfo: {
          name: dbOrder.shipping_address.name,
          email: '', // 需要从用户表获取
          phone: dbOrder.shipping_address.phone,
          address: {
            province: dbOrder.shipping_address.province,
            city: dbOrder.shipping_address.city,
            district: dbOrder.shipping_address.district,
            street: dbOrder.shipping_address.street,
            postalCode: dbOrder.shipping_address.postal_code
          }
        },
        paymentMethod: this.convertDbPaymentMethod(dbOrder.payment_method),
        status: this.convertDbOrderStatus(dbOrder.status),
        createdAt: dbOrder.created_at,
        paidAt: dbOrder.paid_at,
        notes: dbOrder.notes,
        userId: dbOrder.user_id
      };

      return order;
    } catch (error) {
      console.error('获取订单详情失败:', error);
      return null;
    }
  }

  /**
   * 获取用户所有订单
   */
  static async getUserOrders(userId?: string): Promise<Order[]> {
    try {
      let dbOrders;
      
      if (userId) {
        dbOrders = await db.findOrdersByUser(userId);
      } else {
        dbOrders = await db.getEngine().find('orders', {
          orderBy: [{ field: 'ordered_at', direction: 'desc' }]
        });
      }

      const orders: Order[] = [];
      
      for (const dbOrder of dbOrders) {
        // 获取订单项目
        const orderItems = await db.getEngine().find('order_items', {
          where: [{ field: 'order_id', operator: '=', value: dbOrder.id }]
        });

        const order: Order = {
          id: dbOrder.id,
          orderNumber: dbOrder.order_number,
          items: orderItems.map(item => ({
            id: item.product_id,
            name: item.product_name,
            image: item.product_image,
            price: item.price,
            quantity: item.quantity,
            model: item.sku,
            total: item.total_price
          })),
          subtotal: dbOrder.subtotal,
          shipping: dbOrder.shipping_fee,
          tax: dbOrder.tax_fee,
          discount: dbOrder.discount_amount,
          total: dbOrder.total_amount,
          customerInfo: {
            name: dbOrder.shipping_address.name,
            email: '',
            phone: dbOrder.shipping_address.phone,
            address: {
              province: dbOrder.shipping_address.province,
              city: dbOrder.shipping_address.city,
              district: dbOrder.shipping_address.district,
              street: dbOrder.shipping_address.street,
              postalCode: dbOrder.shipping_address.postal_code
            }
          },
          paymentMethod: this.convertDbPaymentMethod(dbOrder.payment_method),
          status: this.convertDbOrderStatus(dbOrder.status),
          createdAt: dbOrder.created_at,
          paidAt: dbOrder.paid_at,
          notes: dbOrder.notes,
          userId: dbOrder.user_id
        };

        orders.push(order);
      }

      return orders;
    } catch (error) {
      console.error('获取用户订单失败:', error);
      return [];
    }
  }

  /**
   * 取消订单
   */
  static async cancelOrder(orderId: string): Promise<boolean> {
    try {
      const dbOrder = await db.getEngine().findById('orders', orderId);
      if (!dbOrder) {
        return false;
      }

      if (dbOrder.status === 'paid' || dbOrder.status === 'shipped') {
        throw new Error('已支付或已发货的订单无法取消');
      }

      await db.updateOrderStatus(orderId, 'cancelled');
      return true;
    } catch (error) {
      console.error('取消订单失败:', error);
      return false;
    }
  }

  /**
   * 生成订单号
   */
  static generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SG${timestamp}${random}`;
  }

  /**
   * 计算运费
   */
  static calculateShipping(subtotal: number, province: string): number {
    // 免运费门槛
    if (subtotal >= 5000) {
      return 0;
    }
    
    // 根据地区计算运费
    const remoteProvinces = ['新疆', '西藏', '青海', '内蒙古'];
    if (remoteProvinces.includes(province)) {
      return 25; // 偏远地区运费
    }
    
    return 15; // 普通地区运费
  }

  /**
   * 计算税费（奢侈品税）
   */
  static calculateTax(subtotal: number): number {
    // 超过一定金额征收奢侈品税
    if (subtotal >= 50000) {
      return subtotal * 0.1; // 10%奢侈品税
    }
    return 0;
  }

  // 转换支付方式
  private static convertPaymentMethod(method: PaymentMethod): 'alipay' | 'wechat' | 'bank_transfer' | 'credit_card' | 'cash' {
    switch (method) {
      case PaymentMethod.ALIPAY:
        return 'alipay';
      case PaymentMethod.WECHAT:
        return 'wechat';
      case PaymentMethod.BANK_TRANSFER:
        return 'bank_transfer';
      default:
        return 'alipay';
    }
  }

  // 转换数据库支付方式
  private static convertDbPaymentMethod(method: string): PaymentMethod {
    switch (method) {
      case 'alipay':
        return PaymentMethod.ALIPAY;
      case 'wechat':
        return PaymentMethod.WECHAT;
      case 'bank_transfer':
        return PaymentMethod.BANK_TRANSFER;
      default:
        return PaymentMethod.ALIPAY;
    }
  }

  // 转换数据库订单状态
  private static convertDbOrderStatus(status: string): OrderStatus {
    switch (status) {
      case 'pending':
        return OrderStatus.PENDING;
      case 'paid':
        return OrderStatus.PAID;
      case 'processing':
        return OrderStatus.PROCESSING;
      case 'shipped':
        return OrderStatus.SHIPPED;
      case 'delivered':
        return OrderStatus.DELIVERED;
      case 'cancelled':
        return OrderStatus.CANCELLED;
      case 'refunded':
        return OrderStatus.REFUNDED;
      default:
        return OrderStatus.PENDING;
    }
  }
}

export default PaymentService; 