import { PaymentMethod, PaymentInfo, Order, OrderStatus } from '../seagull-watch-types';

// 支付配置信息
const PAYMENT_CONFIG = {
  alipay: {
    // 支付宝个人收款账号信息
    account: 'seagullwatch@example.com',
    name: '海鸥表专卖店',
    qrCodeUrl: 'images/payment/alipay-qr.png' // 支付宝收款码
  },
  wechat: {
    // 微信个人收款账号信息
    account: 'SeagullWatch2024',
    name: '海鸥表专卖店',
    qrCodeUrl: 'images/payment/wechat-qr.png' // 微信收款码
  },
  bank: {
    // 银行账户信息
    bankName: '中国工商银行',
    accountNumber: '6222 **** **** 1234',
    accountName: '海鸥表（天津）有限公司',
    branch: '天津分行营业部'
  }
};

// 订单存储（实际应用中应使用数据库）
let orders: Order[] = [];

// 支付服务类
export class PaymentService {
  
  /**
   * 创建支付订单
   */
  static async createPayment(order: Order, userId?: string): Promise<PaymentInfo> {
    // 如果有用户ID，添加到订单中
    if (userId) {
      order.userId = userId;
    }
    
    // 保存订单到本地存储
    orders.push(order);
    this.saveOrdersToStorage();
    
    const paymentInfo: PaymentInfo = {
      orderId: order.id,
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
  }

  /**
   * 确认支付（用户手动确认已完成转账）
   */
  static async confirmPayment(orderId: string): Promise<boolean> {
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('订单不存在');
    }

    // 更新订单状态为已支付
    orders[orderIndex].status = OrderStatus.PAID;
    orders[orderIndex].paidAt = new Date().toISOString();
    
    this.saveOrdersToStorage();
    
    // 模拟支付成功，实际应用中这里会调用支付API验证
    return true;
  }

  /**
   * 查询订单状态
   */
  static async getOrderStatus(orderId: string): Promise<OrderStatus | null> {
    const order = orders.find(order => order.id === orderId);
    return order ? order.status : null;
  }

  /**
   * 获取订单详情
   */
  static async getOrder(orderId: string): Promise<Order | null> {
    const order = orders.find(order => order.id === orderId);
    return order || null;
  }

  /**
   * 获取用户所有订单
   */
  static async getUserOrders(userId?: string): Promise<Order[]> {
    let filteredOrders = [...orders];
    
    // 如果指定用户ID，只返回该用户的订单
    if (userId) {
      filteredOrders = orders.filter(order => order.userId === userId);
    }
    
    return filteredOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * 取消订单
   */
  static async cancelOrder(orderId: string): Promise<boolean> {
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      return false;
    }

    const order = orders[orderIndex];
    if (order.status === OrderStatus.PAID || order.status === OrderStatus.SHIPPED) {
      throw new Error('已支付或已发货的订单无法取消');
    }

    orders[orderIndex].status = OrderStatus.CANCELLED;
    this.saveOrdersToStorage();
    return true;
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

  /**
   * 保存订单到本地存储
   */
  private static saveOrdersToStorage(): void {
    localStorage.setItem('seagullOrders', JSON.stringify(orders));
  }

  /**
   * 从本地存储加载订单
   */
  static loadOrdersFromStorage(): void {
    const storedOrders = localStorage.getItem('seagullOrders');
    if (storedOrders) {
      orders = JSON.parse(storedOrders);
    }
  }
}

// 初始化时加载订单
PaymentService.loadOrdersFromStorage(); 