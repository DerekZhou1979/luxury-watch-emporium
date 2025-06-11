# 🛠️ 开发者指南

## 📋 项目概述

海鸥表电商平台 - React + TypeScript + 浏览器端数据库的现代化电商解决方案。

## 🏗️ 技术架构

```
├── React 18 + TypeScript     # 前端框架
├── Vite                      # 构建工具
├── Tailwind CSS             # 样式框架
├── React Router             # 路由管理
├── localStorage             # 数据持久化
└── GitHub Pages            # 自动部署
```

## 🚀 开发环境

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
# 访问 http://localhost:5173
```

### 构建生产版本
```bash
npm run build
```

## 📁 项目结构

```
luxury-watch-emporium/
├── components/                    # React组件
│   ├── navigation-header.tsx      # 导航栏
│   ├── brand-footer.tsx          # 页脚
│   └── [feature]-components/     # 功能组件
├── database/                     # 数据库系统
│   ├── database-manager.ts       # 数据库管理器
│   ├── browser-database-engine.ts # 数据库引擎
│   ├── schema.ts                 # 数据结构
│   └── seagull-watch-db.json     # 初始数据
├── pages/                        # 页面组件
│   ├── home-showcase.tsx         # 首页
│   ├── watch-catalog.tsx         # 产品目录
│   ├── shopping-cart.tsx         # 购物车
│   └── checkout.tsx              # 结账页面
├── services/                     # 业务服务
│   ├── payment-service-simple.ts # 支付服务
│   └── database-product-service.ts # 产品服务
├── hooks/                        # 自定义Hooks
│   ├── use-auth.tsx              # 认证Hook
│   └── use-shopping-cart.tsx     # 购物车Hook
├── public/images/                # 静态图片
└── seagull-watch-types.ts        # 类型定义
```

## 🗄️ 数据库系统

### 核心组件
- **DatabaseManager** - 单例数据库管理器
- **BrowserDatabaseEngine** - 底层数据库引擎  
- **localStorage** - 数据持久化存储

### 基本使用
```typescript
// 初始化数据库
const db = DatabaseManager.getInstance();
await db.initialize();

// 创建用户
const user = await db.createUser({
  email: 'user@example.com',
  username: 'testuser',
  full_name: '测试用户',
  password_hash: 'hashedpassword'
});

// 查询产品
const products = await db.findProducts({
  where: [{ field: 'status', operator: '=', value: 'active' }],
  limit: 10
});
```

## 🔄 状态管理

### 认证状态
```typescript
// use-auth.tsx
const { user, login, logout, isAuthenticated } = useAuth();
```

### 购物车状态
```typescript
// use-shopping-cart.tsx
const { items, addItem, removeItem, clearCart, totalAmount } = useShoppingCart();
```

## 🎨 样式系统

### Tailwind CSS配置
```typescript
// tailwind.config.js
module.exports = {
  content: ["./**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-gold': '#D4AF37',
        'brand-navy': '#1a202c'
      }
    }
  }
}
```

### 组件样式示例
```tsx
<div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
  <h2 className="text-2xl font-bold mb-4">产品标题</h2>
  <p className="text-gray-300">产品描述</p>
</div>
```

## 🛣️ 路由配置

```tsx
// SeagullWatchApp.tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/products" element={<ProductsPage />} />
  <Route path="/products/:productId" element={<ProductDetailPage />} />
  <Route path="/cart" element={<CartPage />} />
  <Route path="/checkout" element={<CheckoutPage />} />
  <Route path="/orders" element={<OrdersPage />} />
</Routes>
```

## 💳 支付系统

### 支付配置
```typescript
const PAYMENT_CONFIG = {
  alipay: {
    account: 'seagull_watch@alipay.com',
    qrCodeUrl: 'images/payment/alipay-qr.png'
  },
  wechat: {
    account: 'SeagullWatch2024', 
    qrCodeUrl: 'images/payment/wechat-qr.png'
  }
};
```

### 创建订单
```typescript
const paymentInfo = await PaymentServiceSimple.createPayment(order, userId);
```

## 🧪 开发工具

### 调试页面
- `/debug-storage.html` - 查看数据库内容
- `/clear-storage.html` - 清除本地数据

### 浏览器控制台
```javascript
// 查看数据库内容
const db = window.DatabaseManager?.getInstance();
console.log(await db.findProducts());
```

## 📦 构建与部署

### Vite配置
```typescript
// vite.config.ts
export default defineConfig({
  base: mode === 'production' ? '/luxury-watch-emporium/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
```

### GitHub Actions部署
```yaml
# .github/workflows/deploy.yml
- name: 🔨 构建项目
  run: npm run build

- name: 🚫 添加 .nojekyll 文件
  run: touch ./dist/.nojekyll

- name: 📤 上传构建产物
  uses: actions/upload-pages-artifact@v3
  with:
    path: './dist'
```

## 🎯 核心功能实现

### 产品展示
```tsx
const ProductCard: React.FC<{ product: ProductRecord }> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img src={product.images[0]} alt={product.name} />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-brand-gold">¥{product.price}</p>
    </div>
  );
};
```

### 购物车操作
```tsx
const addToCart = async (productId: string, quantity: number) => {
  await db.addToCart(userId, sessionId, productId, quantity);
  // 更新购物车状态
};
```

### 订单处理
```tsx
const createOrder = async (orderData: OrderData) => {
  const order = await db.createOrder(orderData);
  const paymentInfo = await PaymentServiceSimple.createPayment(order);
  return { order, paymentInfo };
};
```

## ⚡ 性能优化

### 图片优化
- 使用WebP格式
- 实现懒加载
- 压缩图片大小

### 代码分割
```tsx
// 懒加载页面组件
const ProductDetailPage = lazy(() => import('./pages/watch-detail-view'));
```

### 缓存策略
- localStorage数据缓存
- 图片浏览器缓存
- API响应缓存

## 🔒 类型安全

### 核心类型定义
```typescript
// seagull-watch-types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: ProductCategory;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
}
```

## 🧪 测试策略

### 数据测试
```typescript
// 测试数据库操作
const testUser = await db.createUser(mockUserData);
expect(testUser.email).toBe(mockUserData.email);
```

### 组件测试
```tsx
// 测试React组件
render(<ProductCard product={mockProduct} />);
expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
```

## 🐛 调试技巧

### 数据库调试
```typescript
// 查看数据库状态
console.log('数据库统计:', await db.getDashboardStats());

// 导出数据检查
const backup = await db.backup();
console.log('数据备份:', backup);
```

### 网络调试
```typescript
// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
await delay(1000); // 延迟1秒
```

## 📝 代码规范

### 命名约定
- 组件：PascalCase (`ProductCard`)
- 函数：camelCase (`addToCart`)
- 常量：UPPER_SNAKE_CASE (`PAYMENT_CONFIG`)
- 文件：kebab-case (`product-card.tsx`)

### 注释风格
```typescript
// 单行注释 - 简洁说明功能
/**
 * 多行注释 - 核心功能说明
 * 参数和返回值描述
 */
```

## 🚀 最佳实践

1. **组件设计** - 保持组件单一职责
2. **状态管理** - 合理使用Context和Hooks
3. **错误处理** - 使用try-catch处理异步操作
4. **性能优化** - 避免不必要的重渲染
5. **类型安全** - 充分利用TypeScript类型系统

## 📄 相关文档

- `README.md` - 项目介绍
- `API_DOCUMENTATION.md` - API接口文档
- `DATABASE_GUIDE.md` - 数据库使用指南
- `PAYMENT_SETUP.md` - 支付配置说明
- `DEPLOYMENT_GUIDE.md` - 部署指南

---

**技术栈优势**: 零服务器成本、快速开发、现代化架构、生产就绪 