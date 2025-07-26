/**
 * 简化版支付服务
 * 支付宝、微信、银行转账，订单管理，运费税费计算
 */

import { DatabaseManager } from '../database/database-manager';
import { 
  PaymentMethod, 
  Order, 
  OrderStatus, 
  PaymentInfo,
  OrderItem
} from '../seagull-watch-types';

// 获取数据库管理器实例
const db = DatabaseManager.getInstance();

// 支付配置
const PAYMENT_CONFIG = {
  alipay: {
    account: 'seagull_watch@alipay.com',
    qrCodeUrl: 'images/payment/alipay-qr.png'
  },
  wechat: {
    account: 'SeagullWatch2024',
    qrCodeUrl: 'images/payment/wechat-qr.png'
  },
  bank: {
    bankName: '中国工商银行',
    accountNumber: '6212 2611 0000 1234 567',
    accountName: '上海海鸟表业有限公司',
    branch: '上海黄浦支行'
  }
};

/**
 * 简化版支付服务类
 * 
 * 提供完整的支付流程管理，包括订单创建、支付信息生成、
 * 费用计算等功能。采用静态方法设计，便于调用。
 */
export class PaymentServiceSimple {
  /**
   * 创建支付订单（简化版）
   * 
   * 执行以下操作：
   * 1. 创建数据库订单记录
   * 2. 保存订单项目详情
   * 3. 生成支付信息（二维码、账户信息等）
   * 4. 返回完整的支付配置
   * 
   * @param order 前端订单对象
   * @param userId 用户ID（可选，支持游客下单）
   * @returns {Promise<PaymentInfo>} 支付信息对象
   * @throws {Error} 当订单创建失败时抛出错误
   */
  static async createPayment(order: Order, userId?: string): Promise<PaymentInfo> {
    try {
      console.log('🔄 开始创建订单:', { orderId: order.id, userId, itemCount: order.items.length });

      // 构建数据库订单记录
      const dbOrderData = {
        user_id: userId,
        order_number: order.id,
        status: 'pending' as const,
        payment_status: 'pending' as const,
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
      };

      // 创建订单记录
      const dbOrder = await db.createOrder(dbOrderData);
      console.log('✅ 订单创建成功:', dbOrder.id);

      // 保存订单项目详情
      for (const item of order.items) {
        // 构建完整的商品快照，包含定制信息
        const productSnapshot = {
          ...item,
          // 如果是定制商品，确保保存完整的定制配置
          isCustomized: item.isCustomized || false,
          customization: item.customization || null
        };

        const orderItemData = {
          order_id: dbOrder.id,
          product_id: item.productId,
          product_name: item.name,
          product_image: item.imageUrl,
          sku: item.sku,
          price: item.price,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
          product_snapshot: productSnapshot  // 保存完整商品快照，包含定制信息
        } as any;
        
        await db.getEngine().insert('order_items', orderItemData);
        
        // 如果是定制商品，记录定制信息
        if (item.isCustomized && item.customization) {
          console.log('📝 保存定制商品信息:', {
            productId: item.productId,
            customizationId: item.customization.id,
            finalPrice: item.customization.finalPrice
          });
        }
      }

      console.log('📦 订单项目保存成功');

      // 构建支付信息对象
      const paymentInfo: PaymentInfo = {
        orderId: dbOrder.id,
        amount: order.total,
        method: order.paymentMethod
      };

      // 根据支付方式设置相应的支付信息
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

      console.log('💳 支付信息构建成功');
      return paymentInfo;
    } catch (error) {
      console.error('❌ 创建支付订单失败:', error);
      throw new Error(`创建支付订单失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  // 生成唯一订单号：SG + 时间戳 + 随机数
  static generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SG${timestamp}${random}`;
  }

  // 计算运费：>=5000免费，偏远25元，普通15元
  static calculateShipping(subtotal: number, province: string): number {
    // 满额免运费
    if (subtotal >= 5000) {
      return 0;
    }
    
    // 偏远地区运费
    const remoteProvinces = ['新疆', '西藏', '青海', '内蒙古'];
    if (remoteProvinces.includes(province)) {
      return 25;
    }
    
    // 普通地区运费
    return 15;
  }

  // 计算税费：>=50000收取10%奢侈品税
  static calculateTax(subtotal: number): number {
    if (subtotal >= 50000) {
      return subtotal * 0.1;
    }
    return 0;
  }

  /**
   * 获取用户订单列表
   * 
   * @param userId 用户ID（可选，游客返回空数组）
   * @returns {Promise<Order[]>} 订单列表
   */
  static async getUserOrders(userId?: string): Promise<Order[]> {
    try {
      const orders = await db.getUserOrders(userId);
      const result: Order[] = [];
      
      // 转换数据库订单格式为前端格式
      for (const order of orders) {
        const convertedOrder = await this.convertToOrder(order);
        result.push(convertedOrder);
      }
      
      return result;
    } catch (error) {
      console.error('❌ 获取用户订单失败:', error);
      return [];
    }
  }

  /**
   * 根据ID获取订单详情
   * 
   * @param orderId 订单ID
   * @returns {Promise<Order | null>} 订单详情或null
   */
  static async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const order = await db.getOrderById(orderId);
      if (!order) return null;
      return this.convertToOrder(order);
    } catch (error) {
      console.error('❌ 获取订单详情失败:', error);
      return null;
    }
  }

  /**
   * 转换数据库订单格式为前端Order类型
   * 
   * 这个方法负责：
   * 1. 查询订单的所有商品项目
   * 2. 转换数据格式以适配前端组件
   * 3. 处理支付方式和状态的转换
   * 
   * @param dbOrder 数据库订单记录
   * @returns {Promise<Order>} 前端订单对象
   */
  private static async convertToOrder(dbOrder: any): Promise<Order> {
    // 查询订单商品项目
    const orderItems = await db.getEngine().find('order_items', {
      where: [{ field: 'order_id', operator: '=', value: dbOrder.id }]
    });

    // 转换订单项目格式，正确解析定制信息
    const items: OrderItem[] = orderItems.map(item => {
      // 从product_snapshot中提取完整信息，包括定制数据
      const snapshot = item.product_snapshot || {};
      
      return {
        productId: item.product_id,
        name: item.product_name,
        imageUrl: item.product_image,
        sku: item.sku,
        price: item.price,
        quantity: item.quantity,
        isCustomized: snapshot.isCustomized || false,
        customization: snapshot.customization || undefined
      };
    });

    console.log('📦 订单项目解析结果:', {
      orderId: dbOrder.order_number,
      items: items.map(item => ({
        name: item.name,
        isCustomized: item.isCustomized,
        hasCustomization: !!item.customization
      }))
    });

    // 构建完整的订单对象
    return {
      id: dbOrder.order_number,
      items: items,
      subtotal: dbOrder.subtotal || 0,
      shipping: dbOrder.shipping_fee || 0,
      tax: dbOrder.tax_fee || 0,
      total: dbOrder.total_amount || 0,
      paymentMethod: this.convertFromDBPaymentMethod(dbOrder.payment_method),
      status: this.convertFromDBStatus(dbOrder.status, dbOrder.payment_status),
      shippingAddress: {
        name: dbOrder.shipping_address?.name || '',
        phone: dbOrder.shipping_address?.phone || '',
        province: dbOrder.shipping_address?.province || '',
        city: dbOrder.shipping_address?.city || '',
        district: dbOrder.shipping_address?.district || '',
        address: dbOrder.shipping_address?.street || '',
        postalCode: dbOrder.shipping_address?.postal_code || ''
      },
      notes: dbOrder.notes || '',
      createdAt: dbOrder.ordered_at || new Date().toISOString()
    };
  }

  /**
   * 转换前端支付方式枚举为数据库格式
   * 
   * @param method 前端支付方式枚举
   * @returns {string} 数据库支付方式字符串
   */
  private static convertPaymentMethod(method: PaymentMethod): 'alipay' | 'wechat' | 'bank_transfer' {
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

  /**
   * 转换数据库支付方式为前端枚举
   * 
   * @param method 数据库支付方式字符串
   * @returns {PaymentMethod} 前端支付方式枚举
   */
  private static convertFromDBPaymentMethod(method: string): PaymentMethod {
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

  /**
   * 转换数据库状态为前端订单状态
   * 
   * 根据订单状态和支付状态组合确定最终的前端显示状态
   * 
   * @param status 订单状态
   * @param paymentStatus 支付状态
   * @returns {OrderStatus} 前端订单状态枚举
   */
  private static convertFromDBStatus(status: string, paymentStatus: string): OrderStatus {
    if (status === 'pending' && paymentStatus === 'pending') {
      return OrderStatus.PENDING;
    } else if (status === 'paid' || paymentStatus === 'paid') {
      return OrderStatus.PAID;
    } else if (status === 'shipped') {
      return OrderStatus.SHIPPED;
    } else if (status === 'delivered') {
      return OrderStatus.DELIVERED;
    } else if (status === 'cancelled') {
      return OrderStatus.CANCELLED;
    }
    return OrderStatus.PENDING;
  }
}

export default PaymentServiceSimple; 