# 🗄️ 数据库使用指南

## 📋 概述

浏览器端JSON数据库系统，基于localStorage的轻量级数据管理解决方案。

## 🏗️ 系统架构

```
数据库管理器 (DatabaseManager)
├── 浏览器数据库引擎 (BrowserDatabaseEngine)
├── 数据库模式 (Schema)
└── 本地存储 (localStorage)
```

### 核心组件

- **DatabaseManager** - 单例数据库管理器
- **BrowserDatabaseEngine** - 底层数据库引擎
- **Schema** - 数据表结构定义
- **localStorage** - 数据持久化存储

## 📊 数据表结构

### 用户表 (users)
```typescript
interface UserRecord {
  id: string;                    // 用户ID
  email: string;                 // 邮箱
  username: string;              // 用户名
  full_name: string;             // 全名
  password_hash: string;         // 密码哈希
  phone?: string;                // 电话
  avatar_url?: string;           // 头像
  email_verified: boolean;       // 邮箱验证状态
  status: 'active' | 'inactive'; // 用户状态
  created_at: string;            // 创建时间
  updated_at: string;            // 更新时间
}
```

### 产品表 (products)
```typescript
interface ProductRecord {
  id: string;                    // 产品ID
  name: string;                  // 产品名称
  description: string;           // 产品描述
  price: number;                 // 价格
  sku: string;                   // SKU编码
  category_id: string;           // 分类ID
  images: string[];              // 图片数组
  stock_quantity: number;        // 库存数量
  status: 'active' | 'inactive'; // 产品状态
  is_featured: boolean;          // 是否精选
  tags: string[];                // 标签
  created_at: string;            // 创建时间
  updated_at: string;            // 更新时间
}
```

### 订单表 (orders)
```typescript
interface OrderRecord {
  id: string;                    // 订单ID
  order_number: string;          // 订单号
  user_id?: string;              // 用户ID（可空，支持游客）
  status: OrderStatus;           // 订单状态
  payment_status: PaymentStatus; // 支付状态
  payment_method: string;        // 支付方式
  subtotal: number;              // 小计
  shipping_cost: number;         // 运费
  tax_amount: number;            // 税费
  total_amount: number;          // 总金额
  shipping_address: Address;     // 收货地址
  created_at: string;            // 创建时间
  updated_at: string;            // 更新时间
}
```

### 订单项表 (order_items)
```typescript
interface OrderItemRecord {
  id: string;           // 项目ID
  order_id: string;     // 订单ID
  product_id: string;   // 产品ID
  quantity: number;     // 数量
  unit_price: number;   // 单价
  total_price: number;  // 总价
}
```

### 购物车表 (cart_items)
```typescript
interface CartItemRecord {
  id: string;           // 项目ID
  user_id?: string;     // 用户ID
  session_id?: string;  // 会话ID
  product_id: string;   // 产品ID
  quantity: number;     // 数量
  created_at: string;   // 创建时间
}
```

### 分类表 (categories)
```typescript
interface CategoryRecord {
  id: string;           // 分类ID
  name: string;         // 分类名称
  slug: string;         // URL友好名称
  description?: string; // 描述
  parent_id?: string;   // 父分类ID
  sort_order: number;   // 排序
  is_active: boolean;   // 是否活跃
  created_at: string;   // 创建时间
  updated_at: string;   // 更新时间
}
```

## 🚀 快速开始

### 初始化数据库
```typescript
import { DatabaseManager } from './database/database-manager';

// 获取单例实例
const db = DatabaseManager.getInstance();

// 初始化数据库
await db.initialize();
```

### 基本CRUD操作

#### 创建记录
```typescript
// 创建用户
const user = await db.createUser({
  email: 'user@example.com',
  username: 'testuser',
  full_name: '测试用户',
  password_hash: 'hashedpassword'
});

// 创建产品
const product = await db.createProduct({
  name: '海鸥表',
  description: '精美腕表',
  price: 2999,
  sku: 'SG-001',
  category_id: 'luxury',
  images: ['product1.jpg'],
  stock_quantity: 10,
  tags: ['奢侈品', '腕表']
});
```

#### 查询记录
```typescript
// 根据ID查找
const user = await db.findUserById('user123');
const product = await db.findProductById('product456');

// 条件查询
const activeProducts = await db.findProducts({
  where: [{ field: 'status', operator: '=', value: 'active' }],
  limit: 10,
  offset: 0
});

// 搜索功能
const searchResults = await db.searchProducts('海鸥');
```

#### 更新记录
```typescript
// 更新用户信息
await db.updateUser('user123', {
  full_name: '新的用户名',
  phone: '13800138000'
});

// 更新产品库存
await db.updateProductStock('product456', 5);
```

#### 删除记录
```typescript
// 删除用户
await db.deleteUser('user123');
```

## 🛒 购物车操作

```typescript
// 添加商品到购物车
await db.addToCart('user123', null, 'product456', 2);

// 游客购物车（使用会话ID）
await db.addToCart(null, 'session789', 'product456', 1);

// 获取购物车商品
const cartItems = await db.getCartItems('user123', null);

// 清空购物车
await db.clearCart('user123', null);
```

## 📋 订单管理

```typescript
// 创建订单
const order = await db.createOrder({
  order_number: 'SG1703123456789',
  user_id: 'user123',
  status: 'pending',
  payment_status: 'pending',
  payment_method: 'alipay',
  subtotal: 2999,
  shipping_cost: 15,
  tax_amount: 0,
  total_amount: 3014,
  shipping_address: {
    name: '张三',
    phone: '13800138000',
    province: '上海市',
    city: '上海市',
    district: '黄浦区',
    street: '南京路100号'
  }
});

// 查询用户订单
const userOrders = await db.findOrdersByUser('user123');

// 更新订单状态
await db.updateOrderStatus('order789', 'paid');
```

## 🔍 高级查询

### 查询选项
```typescript
interface QueryOptions {
  where?: QueryCondition[];     // 查询条件
  orderBy?: string;            // 排序字段
  orderDirection?: 'asc' | 'desc'; // 排序方向
  limit?: number;              // 限制数量
  offset?: number;             // 偏移量
}

interface QueryCondition {
  field: string;               // 字段名
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'like';
  value: any;                  // 值
}
```

### 查询示例
```typescript
// 分页查询
const products = await db.findProducts({
  where: [{ field: 'status', operator: '=', value: 'active' }],
  orderBy: 'created_at',
  orderDirection: 'desc',
  limit: 20,
  offset: 0
});

// 价格范围查询
const expensiveProducts = await db.findProducts({
  where: [
    { field: 'price', operator: '>=', value: 5000 },
    { field: 'price', operator: '<=', value: 10000 }
  ]
});

// 模糊搜索
const searchResults = await db.findProducts({
  where: [{ field: 'name', operator: 'like', value: '%海鸥%' }]
});
```

## 🔧 数据库配置

### 存储配置
```typescript
const config = {
  storageKey: 'seagull-watch-db',  // localStorage键名
  options: {
    autoBackup: true,              // 自动备份
    maxBackups: 24,                // 最大备份数
    enableLogging: true            // 启用日志
  }
};
```

### 数据初始化
系统首次运行时会自动加载初始数据：
- 产品分类
- 示例产品
- 测试用户

## 🔄 数据备份与恢复

```typescript
// 创建备份
const backupData = await db.backup();

// 恢复数据
await db.restore(backupData);
```

## 🛠️ 开发工具

### 调试页面
访问 `/debug-storage.html` 查看数据库内容

### 清理工具
访问 `/clear-storage.html` 清除所有数据

### 控制台操作
```javascript
// 浏览器控制台
const db = window.DatabaseManager?.getInstance();
console.log(await db.findProducts());
```

## ⚠️ 注意事项

1. **数据持久化** - 数据存储在localStorage中，清除浏览器数据会丢失
2. **存储限制** - localStorage通常有5-10MB大小限制
3. **并发控制** - 单线程操作，无需考虑并发问题
4. **数据验证** - 客户端验证，生产环境需要服务器端验证
5. **安全性** - 敏感数据需要加密处理

## 🚀 最佳实践

1. **错误处理** - 使用try-catch处理异步操作
2. **数据验证** - 创建前验证数据格式
3. **性能优化** - 合理使用分页和索引
4. **备份策略** - 定期备份重要数据
5. **测试数据** - 开发时使用独立的存储键名

---

**注意**: 此数据库系统适用于演示和小型应用，生产环境建议使用专业数据库。 