// 产品信息接口定义
export interface Product {
  id: string;           // 产品唯一标识
  name: string;         // 产品名称
  brand: string;        // 品牌名称
  price: number;        // 价格（人民币）
  imageUrl: string;     // 主图片URL
  galleryImages?: string[];  // 产品图片集
  description: string;  // 详细描述
  shortDescription: string;  // 简短描述
  features: string[];   // 产品特色功能
  category: ProductCategory; // 产品分类
  stock: number;        // 库存数量
  sku: string;          // 产品编码
}

// 海鸥表产品分类枚举
export enum ProductCategory {
  LUXURY = "大师海鸥",      // 顶级复杂功能系列
  SPORTS = "飞行系列",      // 飞行员腕表系列
  CLASSIC = "海洋系列",     // 潜水运动腕表系列
  MINIMALIST = "潮酷品线"   // 现代创意设计系列
}

// 购物车商品项接口（扩展Product，添加数量字段）
export interface CartItem extends Product {
  quantity: number;         // 购买数量
}

// 用户评价接口
export interface Review {
  id: string;              // 评价ID
  author: string;          // 评价作者
  rating: number;          // 评分 (1-5星)
  comment: string;         // 评价内容
  date: string;            // 评价日期
}

// 品牌信息接口
export interface BrandInfo {
  name: string;            // 英文品牌名
  chineseName: string;     // 中文品牌名
  tagline: string;         // 品牌标语
  logoSvg: React.ReactNode; // 品牌Logo SVG图标
}

// 支付方式枚举
export enum PaymentMethod {
  ALIPAY = "alipay",       // 支付宝
  WECHAT = "wechat",       // 微信支付
  BANK_TRANSFER = "bank"   // 银行转账
}

// 订单状态枚举
export enum OrderStatus {
  PENDING = "pending",           // 待支付
  PAID = "paid",                // 已支付
  PROCESSING = "processing",     // 处理中
  SHIPPED = "shipped",          // 已发货
  DELIVERED = "delivered",      // 已送达
  CANCELLED = "cancelled"       // 已取消
}

// 收货地址接口
export interface ShippingAddress {
  name: string;           // 收件人姓名
  phone: string;          // 联系电话
  province: string;       // 省份
  city: string;           // 城市
  district: string;       // 区县
  address: string;        // 详细地址
  postalCode?: string;    // 邮政编码
}

// 订单商品项接口
export interface OrderItem {
  productId: string;      // 产品ID
  name: string;           // 产品名称
  price: number;          // 单价
  quantity: number;       // 数量
  imageUrl: string;       // 产品图片
  sku: string;           // 产品编码
}

// 订单接口
export interface Order {
  id: string;             // 订单号
  userId?: string;        // 用户ID（可选，支持游客下单）
  items: OrderItem[];     // 订单商品
  subtotal: number;       // 商品小计
  shipping: number;       // 运费
  tax: number;           // 税费
  total: number;         // 订单总金额
  paymentMethod: PaymentMethod; // 支付方式
  status: OrderStatus;    // 订单状态
  shippingAddress: ShippingAddress; // 收货地址
  createdAt: string;      // 创建时间
  paidAt?: string;        // 支付时间
  notes?: string;         // 订单备注
}

// 支付信息接口
export interface PaymentInfo {
  orderId: string;        // 订单号
  amount: number;         // 支付金额
  method: PaymentMethod;  // 支付方式
  qrCode?: string;        // 支付二维码
  accountInfo?: string;   // 收款账号信息
  paymentUrl?: string;    // 支付链接
}

// 用户接口
export interface User {
  id: string;             // 用户ID
  email: string;          // 邮箱
  phone?: string;         // 手机号
  name: string;           // 姓名
  avatar?: string;        // 头像
  createdAt: string;      // 注册时间
  lastLoginAt?: string;   // 最后登录时间
  isActive: boolean;      // 账户状态
  defaultAddress?: ShippingAddress; // 默认收货地址
}

// 用户注册数据
export interface UserRegistration {
  email: string;          // 邮箱
  password: string;       // 密码
  confirmPassword: string; // 确认密码
  name: string;           // 姓名
  phone?: string;         // 手机号
  acceptTerms: boolean;   // 同意条款
}

// 用户登录数据
export interface UserLogin {
  email: string;          // 邮箱
  password: string;       // 密码
  rememberMe?: boolean;   // 记住我
}

// 认证状态
export interface AuthState {
  isAuthenticated: boolean; // 是否已登录
  user: User | null;        // 当前用户
  loading: boolean;         // 加载状态
  error: string | null;     // 错误信息
}
