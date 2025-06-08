// 数据库架构定义
export interface DatabaseSchema {
  users: UserRecord[];
  products: ProductRecord[];
  categories: CategoryRecord[];
  orders: OrderRecord[];
  order_items: OrderItemRecord[];
  cart_items: CartItemRecord[];
  addresses: AddressRecord[];
  payments: PaymentRecord[];
  reviews: ReviewRecord[];
  coupons: CouponRecord[];
  settings: SettingRecord[];
  logs: LogRecord[];
}

// 用户表
export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'banned';
  email_verified: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

// 商品表
export interface ProductRecord {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  original_price?: number;
  cost_price?: number;
  sku: string;
  barcode?: string;
  category_id: string;
  brand: string;
  model: string;
  images: string[];
  specifications: Record<string, any>;
  stock_quantity: number;
  min_stock_level: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  status: 'active' | 'inactive' | 'draft' | 'out_of_stock';
  is_featured: boolean;
  seo_title?: string;
  seo_description?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

// 分类表
export interface CategoryRecord {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  slug: string;
  image?: string;
  sort_order: number;
  status: 'active' | 'inactive';
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

// 订单表
export interface OrderRecord {
  id: string;
  user_id?: string; // 可为空支持游客订单
  order_number: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund';
  payment_method: 'alipay' | 'wechat' | 'bank_transfer' | 'credit_card' | 'cash';
  
  // 价格信息
  subtotal: number;
  shipping_fee: number;
  tax_fee: number;
  discount_amount: number;
  total_amount: number;
  
  // 收货地址
  shipping_address: {
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    street: string;
    postal_code?: string;
    is_default: boolean;
  };
  
  // 时间记录
  ordered_at: string;
  paid_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  
  // 其他信息
  notes?: string;
  internal_notes?: string;
  tracking_number?: string;
  courier_company?: string;
  estimated_delivery?: string;
  
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

// 订单项目表
export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  sku: string;
  price: number;
  quantity: number;
  total_price: number;
  product_snapshot: Record<string, any>; // 保存下单时的商品信息快照
  created_at: string;
  updated_at: string;
}

// 购物车项目表
export interface CartItemRecord {
  id: string;
  user_id?: string; // 可为空支持游客购物车
  session_id?: string; // 游客会话ID
  product_id: string;
  quantity: number;
  added_at: string;
  updated_at: string;
}

// 收货地址表
export interface AddressRecord {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  street: string;
  postal_code?: string;
  is_default: boolean;
  label?: string; // 如：家、公司
  created_at: string;
  updated_at: string;
}

// 支付记录表
export interface PaymentRecord {
  id: string;
  order_id: string;
  payment_method: 'alipay' | 'wechat' | 'bank_transfer' | 'credit_card';
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  transaction_id?: string; // 第三方支付流水号
  gateway_response?: Record<string, any>; // 支付网关返回数据
  paid_at?: string;
  failed_reason?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

// 商品评论表
export interface ReviewRecord {
  id: string;
  product_id: string;
  user_id?: string;
  order_id?: string;
  rating: number; // 1-5星
  title?: string;
  content: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

// 优惠券表
export interface CouponRecord {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'fixed' | 'percentage' | 'free_shipping';
  value: number; // 折扣金额或百分比
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  status: 'active' | 'inactive' | 'expired';
  valid_from: string;
  valid_to: string;
  applicable_categories?: string[];
  applicable_products?: string[];
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

// 系统设置表
export interface SettingRecord {
  id: string;
  key: string;
  value: any;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'text';
  category: string;
  is_public: boolean; // 是否可以在前端访问
  created_at: string;
  updated_at: string;
}

// 操作日志表
export interface LogRecord {
  id: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  action: string;
  entity_type?: string;
  entity_id?: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  message: string;
  data?: Record<string, any>;
  created_at: string;
}

// 数据库版本信息
export interface DatabaseVersion {
  version: string;
  migrations_applied: string[];
  last_migration_at: string;
  created_at: string;
}

// 索引定义（用于查询优化）
export interface DatabaseIndex {
  table: keyof DatabaseSchema;
  fields: string[];
  unique?: boolean;
  name: string;
}

// 预定义索引
export const DATABASE_INDEXES: DatabaseIndex[] = [
  // 用户索引
  { table: 'users', fields: ['email'], unique: true, name: 'idx_users_email' },
  { table: 'users', fields: ['status'], name: 'idx_users_status' },
  
  // 商品索引
  { table: 'products', fields: ['category_id'], name: 'idx_products_category' },
  { table: 'products', fields: ['status'], name: 'idx_products_status' },
  { table: 'products', fields: ['sku'], unique: true, name: 'idx_products_sku' },
  { table: 'products', fields: ['is_featured'], name: 'idx_products_featured' },
  
  // 订单索引
  { table: 'orders', fields: ['user_id'], name: 'idx_orders_user' },
  { table: 'orders', fields: ['status'], name: 'idx_orders_status' },
  { table: 'orders', fields: ['order_number'], unique: true, name: 'idx_orders_number' },
  { table: 'orders', fields: ['ordered_at'], name: 'idx_orders_date' },
  
  // 订单项目索引
  { table: 'order_items', fields: ['order_id'], name: 'idx_order_items_order' },
  { table: 'order_items', fields: ['product_id'], name: 'idx_order_items_product' },
  
  // 购物车索引
  { table: 'cart_items', fields: ['user_id'], name: 'idx_cart_user' },
  { table: 'cart_items', fields: ['session_id'], name: 'idx_cart_session' },
  
  // 支付记录索引
  { table: 'payments', fields: ['order_id'], name: 'idx_payments_order' },
  { table: 'payments', fields: ['status'], name: 'idx_payments_status' },
  
  // 评论索引
  { table: 'reviews', fields: ['product_id'], name: 'idx_reviews_product' },
  { table: 'reviews', fields: ['user_id'], name: 'idx_reviews_user' },
  
  // 优惠券索引
  { table: 'coupons', fields: ['code'], unique: true, name: 'idx_coupons_code' },
  { table: 'coupons', fields: ['status'], name: 'idx_coupons_status' },
];

export default DatabaseSchema; 