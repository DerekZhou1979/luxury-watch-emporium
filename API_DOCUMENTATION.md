# 🔌 海鸥表电商平台 API 文档

## 📋 概述

本文档描述海鸥表电商平台的API接口，包括数据库服务和支付服务的所有方法。

## 🗄️ 数据库管理器 (DatabaseManager)

### 基础操作

#### `getInstance(): DatabaseManager`
获取数据库管理器单例实例
- **返回**: DatabaseManager 实例

#### `initialize(): Promise<void>`
初始化数据库连接和基础数据
- **功能**: 连接数据库引擎，加载初始数据
- **异常**: 初始化失败时抛出错误

#### `close(): Promise<void>`
关闭数据库连接
- **功能**: 清理资源，确保数据持久化

### 👤 用户管理

#### `createUser(userData: Omit<UserRecord, 'id' | 'created_at' | 'updated_at'>): Promise<UserRecord>`
创建新用户
- **参数**: 用户数据（不包含ID和时间戳）
- **返回**: 创建的用户记录
- **默认值**: email_verified: false, status: 'active'

#### `findUserByEmail(email: string): Promise<UserRecord | null>`
根据邮箱查找用户
- **参数**: 用户邮箱
- **返回**: 用户记录或null
- **用途**: 登录验证，重复邮箱检查

#### `findUserById(id: string): Promise<UserRecord | null>`
根据ID查找用户
- **参数**: 用户ID
- **返回**: 用户记录或null

#### `updateUser(id: string, updates: Partial<UserRecord>): Promise<number>`
更新用户信息
- **参数**: 用户ID，更新字段
- **返回**: 受影响的记录数

#### `deleteUser(id: string): Promise<number>`
删除用户
- **参数**: 用户ID
- **返回**: 受影响的记录数
- **注意**: 会删除用户的所有关联数据

### 📦 商品管理

#### `createProduct(productData: Omit<ProductRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ProductRecord>`
创建新商品
- **参数**: 商品数据（不包含ID和时间戳）
- **返回**: 创建的商品记录
- **默认值**: status: 'active', is_featured: false

#### `findProducts(options?: QueryOptions): Promise<ProductRecord[]>`
查找商品列表
- **参数**: 查询选项（分页、排序、筛选）
- **返回**: 商品记录数组

#### `findProductById(id: string): Promise<ProductRecord | null>`
根据ID查找商品
- **参数**: 商品ID
- **返回**: 商品记录或null

#### `findProductsBySku(sku: string): Promise<ProductRecord | null>`
根据SKU查找商品
- **参数**: 商品SKU（应唯一）
- **返回**: 商品记录或null

#### `findProductsByCategory(categoryId: string, options?: QueryOptions): Promise<ProductRecord[]>`
根据分类查找商品
- **参数**: 分类ID，附加查询选项
- **返回**: 商品记录数组

#### `updateProduct(id: string, updates: Partial<ProductRecord>): Promise<number>`
更新商品信息
- **参数**: 商品ID，更新字段
- **返回**: 受影响的记录数

#### `updateProductStock(productId: string, newQuantity: number): Promise<number>`
更新商品库存
- **参数**: 商品ID，新库存数量
- **返回**: 受影响的记录数
- **逻辑**: 库存为0时自动设为缺货状态

### 📋 订单管理

#### `createOrder(orderData: Omit<OrderRecord, 'id' | 'created_at' | 'updated_at'>): Promise<OrderRecord>`
创建新订单
- **参数**: 订单数据（不包含ID和时间戳）
- **返回**: 创建的订单记录
- **默认值**: status: 'pending', payment_status: 'pending'

#### `findOrders(options?: QueryOptions): Promise<OrderRecord[]>`
查找订单列表
- **参数**: 查询选项
- **返回**: 订单记录数组（按下单时间倒序）

#### `findOrdersByUser(userId: string, options?: QueryOptions): Promise<OrderRecord[]>`
查找用户的订单
- **参数**: 用户ID，附加查询选项
- **返回**: 订单记录数组

#### `findOrderByNumber(orderNumber: string): Promise<OrderRecord | null>`
根据订单号查找订单
- **参数**: 订单号
- **返回**: 订单记录或null

#### `getOrderById(orderId: string): Promise<OrderRecord | null>`
根据ID获取订单
- **参数**: 订单ID
- **返回**: 订单记录或null

#### `getUserOrders(userId?: string): Promise<OrderRecord[]>`
获取用户订单
- **参数**: 用户ID（可选）
- **返回**: 订单记录数组
- **游客模式**: userId为空时返回空数组

#### `updateOrderStatus(id: string, status: OrderRecord['status'], statusTime?: string): Promise<number>`
更新订单状态
- **参数**: 订单ID，新状态，状态时间（可选）
- **返回**: 受影响的记录数
- **自动更新**: 根据状态自动更新相应时间字段

### 🛒 购物车管理

#### `addToCart(userId: string | null, sessionId: string | null, productId: string, quantity: number)`
添加商品到购物车
- **参数**: 用户ID，会话ID，商品ID，数量
- **支持**: 登录用户和游客模式

#### `getCartItems(userId: string | null, sessionId: string | null)`
获取购物车商品
- **参数**: 用户ID，会话ID
- **返回**: 购物车商品列表

#### `clearCart(userId: string | null, sessionId: string | null): Promise<number>`
清空购物车
- **参数**: 用户ID，会话ID
- **返回**: 清除的记录数

### 🔍 搜索功能

#### `searchProducts(query: string, options?: QueryOptions): Promise<ProductRecord[]>`
搜索商品
- **参数**: 搜索关键词，查询选项
- **返回**: 匹配的商品记录数组

## 💳 支付服务 (PaymentServiceSimple)

### 支付订单

#### `createPayment(order: Order, userId?: string): Promise<PaymentInfo>`
创建支付订单
- **参数**: 前端订单对象，用户ID（可选）
- **返回**: 支付信息对象
- **功能**: 
  - 创建数据库订单记录
  - 保存订单项目详情
  - 生成支付信息（二维码、账户信息）
- **支持**: 支付宝、微信、银行转账

### 工具方法

#### `generateOrderId(): string`
生成唯一订单号
- **格式**: SG + 13位时间戳 + 3位随机数
- **示例**: SG1703123456789123
- **返回**: 唯一订单号字符串

#### `calculateShipping(subtotal: number, province: string): number`
计算运费
- **参数**: 商品小计，收货省份
- **返回**: 运费金额
- **规则**:
  - 订单金额 ≥ 5000元：免运费
  - 偏远地区（新疆、西藏等）：25元
  - 其他地区：15元

#### `calculateTax(subtotal: number): number`
计算税费
- **参数**: 商品小计
- **返回**: 税费金额
- **规则**:
  - 订单金额 ≥ 50000元：收取10%奢侈品税
  - 其他情况：免税

### 订单查询

#### `getUserOrders(userId?: string): Promise<Order[]>`
获取用户订单列表
- **参数**: 用户ID（可选）
- **返回**: 前端格式订单数组
- **游客模式**: 返回空数组

#### `getOrderById(orderId: string): Promise<Order | null>`
根据ID获取订单详情
- **参数**: 订单ID
- **返回**: 前端格式订单对象或null

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
- **组合逻辑**: 根据订单状态和支付状态确定最终显示状态

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

所有异步方法都会在失败时抛出详细的错误信息：
- 数据库连接失败
- 数据验证失败
- 订单创建失败
- 支付信息生成失败

建议在调用API时使用 try-catch 块进行错误处理。

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

**注意**: 本文档描述的是浏览器端JSON数据库系统，所有数据存储在localStorage中，适用于演示和开发环境。 