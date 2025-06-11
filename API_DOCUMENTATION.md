# 🔌 海鸥表电商平台 API 文档

## 📋 概述

浏览器端JSON数据库API，支持用户、产品、订单、支付的完整业务逻辑。

## 🗄️ 数据库管理器 (DatabaseManager)

### 基础操作

#### `getInstance(): DatabaseManager`
获取数据库管理器单例实例

#### `initialize(): Promise<void>`
初始化数据库连接，加载基础数据

#### `close(): Promise<void>`
关闭数据库连接

### 👤 用户管理

#### `createUser(userData): Promise<UserRecord>`
创建新用户
- **参数**: 用户数据（不包含ID和时间戳）
- **默认值**: email_verified: false, status: 'active'

#### `findUserByEmail(email: string): Promise<UserRecord | null>`
根据邮箱查找用户，用于登录验证

#### `findUserById(id: string): Promise<UserRecord | null>`
根据ID查找用户

#### `updateUser(id: string, updates): Promise<number>`
更新用户信息

#### `deleteUser(id: string): Promise<number>`
删除用户及关联数据

### 📦 商品管理

#### `createProduct(productData): Promise<ProductRecord>`
创建新商品
- **默认值**: status: 'active', is_featured: false

#### `findProducts(options?): Promise<ProductRecord[]>`
查找商品列表，支持分页、排序、筛选

#### `findProductById(id: string): Promise<ProductRecord | null>`
根据ID查找商品

#### `findProductsBySku(sku: string): Promise<ProductRecord | null>`
根据SKU查找商品（应唯一）

#### `findProductsByCategory(categoryId: string, options?): Promise<ProductRecord[]>`
根据分类查找商品

#### `updateProduct(id: string, updates): Promise<number>`
更新商品信息

#### `updateProductStock(productId: string, newQuantity: number): Promise<number>`
更新商品库存，库存为0时自动设为缺货状态

### 📋 订单管理

#### `createOrder(orderData): Promise<OrderRecord>`
创建新订单
- **默认值**: status: 'pending', payment_status: 'pending'

#### `findOrders(options?): Promise<OrderRecord[]>`
查找订单列表（按下单时间倒序）

#### `findOrdersByUser(userId: string, options?): Promise<OrderRecord[]>`
查找用户的订单

#### `findOrderByNumber(orderNumber: string): Promise<OrderRecord | null>`
根据订单号查找订单

#### `getOrderById(orderId: string): Promise<OrderRecord | null>`
根据ID获取订单

#### `getUserOrders(userId?: string): Promise<OrderRecord[]>`
获取用户订单，游客模式返回空数组

#### `updateOrderStatus(id: string, status, statusTime?): Promise<number>`
更新订单状态，自动更新相应时间字段

### 🛒 购物车管理

#### `addToCart(userId, sessionId, productId, quantity)`
添加商品到购物车，支持登录用户和游客模式

#### `getCartItems(userId, sessionId)`
获取购物车商品

#### `clearCart(userId, sessionId): Promise<number>`
清空购物车

### 🔍 搜索功能

#### `searchProducts(query: string, options?): Promise<ProductRecord[]>`
搜索商品，支持关键词匹配

## 💳 支付服务 (PaymentServiceSimple)

### 支付订单

#### `createPayment(order: Order, userId?: string): Promise<PaymentInfo>`
创建支付订单
- 创建数据库订单记录
- 保存订单项目详情
- 生成支付信息（二维码、账户信息）
- 支持：支付宝、微信、银行转账

### 工具方法

#### `generateOrderId(): string`
生成唯一订单号
- **格式**: SG + 13位时间戳 + 3位随机数
- **示例**: SG1703123456789123

#### `calculateShipping(subtotal: number, province: string): number`
计算运费
- 订单金额 ≥ 5000元：免运费
- 偏远地区（新疆、西藏等）：25元
- 其他地区：15元

#### `calculateTax(subtotal: number): number`
计算税费
- 订单金额 ≥ 50000元：收取10%奢侈品税
- 其他情况：免税

### 订单查询

#### `getUserOrders(userId?: string): Promise<Order[]>`
获取用户订单列表，游客模式返回空数组

#### `getOrderById(orderId: string): Promise<Order | null>`
根据ID获取订单详情

## 📊 数据格式转换

### 支付方式转换

#### `convertPaymentMethod(method: PaymentMethod): string`
前端支付方式枚举 → 数据库格式
- **ALIPAY** → 'alipay'
- **WECHAT** → 'wechat'
- **BANK_TRANSFER** → 'bank_transfer'

#### `convertFromDBPaymentMethod(method: string): PaymentMethod`
数据库格式 → 前端支付方式枚举

### 订单状态转换

#### `convertFromDBStatus(status: string, paymentStatus: string): OrderStatus`
数据库状态 → 前端订单状态

## 🛠️ 数据库配置

### 存储配置
```typescript
{
  storageKey: 'seagull-watch-db',
  options: {
    autoBackup: true,     // 启用自动备份
    maxBackups: 24,       // 最多保留24个备份
    enableLogging: true   // 启用操作日志
  }
}
```

### 支付配置
```typescript
{
  alipay: {
    account: 'seagull_watch@alipay.com',
    qrCodeUrl: '/images/payment/alipay-qr.png'
  },
  wechat: {
    account: 'SeagullWatch2024',
    qrCodeUrl: '/images/payment/wechat-qr.png'
  },
  bank: {
    bankName: '中国工商银行',
    accountNumber: '6212 2611 0000 1234 567',
    accountName: '上海海鸟表业有限公司',
    branch: '上海黄浦支行'
  }
}
```

## 🚫 错误处理

所有异步方法在失败时抛出详细错误信息：
- 数据库连接失败
- 数据验证失败
- 订单创建失败
- 支付信息生成失败

建议使用 try-catch 块进行错误处理。

## 📝 使用示例

```typescript
// 初始化数据库
const db = DatabaseManager.getInstance();
await db.initialize();

// 创建用户
const user = await db.createUser({
  email: 'user@example.com',
  username: 'testuser',
  password_hash: 'hashedpassword',
  full_name: '测试用户'
});

// 创建支付订单
const paymentInfo = await PaymentServiceSimple.createPayment(order, user.id);

// 获取用户订单
const orders = await PaymentServiceSimple.getUserOrders(user.id);
```

---

**注意**: 浏览器端JSON数据库系统，数据存储在localStorage中，适用于演示和开发环境。 