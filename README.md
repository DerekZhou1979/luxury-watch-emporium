# 🕰️ 海鸥表电商平台

现代化高端腕表电商平台，React + TypeScript + 浏览器端数据库系统。

## ✨ 核心功能

- **产品展示** - 分类浏览、搜索、详情展示
- **购物车** - 添加/删除/修改商品，实时计算
- **订单管理** - 完整购买流程，支付状态跟踪
- **用户认证** - 注册/登录/个人中心
- **支付集成** - 支付宝/微信/银行转账

## 🏗️ 技术栈

- **React 18** + TypeScript + Vite
- **Tailwind CSS** 响应式样式
- **React Router** 路由管理
- **localStorage** 数据持久化
- **GitHub Pages** 自动部署

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发环境
npm run dev

# 构建部署
npm run build
```

**访问地址:** http://localhost:5173

## 📁 项目结构

```
luxury-watch-emporium/
├── components/          # React组件
│   ├── navigation-header.tsx
│   ├── brand-footer.tsx
│   └── [feature]-components/
├── database/           # 数据库系统
│   ├── database-manager.ts      # 单例数据库管理
│   ├── browser-database-engine.ts
│   ├── schema.ts
│   └── seagull-watch-db.json
├── pages/             # 页面组件
│   ├── home-showcase.tsx
│   ├── watch-catalog.tsx
│   ├── watch-detail-view.tsx
│   ├── shopping-cart.tsx
│   ├── checkout.tsx
│   └── payment.tsx
├── services/          # 业务服务
│   ├── payment-service-simple.ts
│   └── database-product-service.ts
├── hooks/            # 自定义Hooks
│   ├── use-auth.tsx
│   ├── use-shopping-cart.tsx
│   └── use-products.ts
├── public/images/    # 产品图片
└── seagull-watch-types.ts  # 类型定义
```

## 🗄️ 数据库设计

**浏览器端JSON数据库**
- 零配置部署
- localStorage持久化
- TypeScript类型安全
- 支持CRUD操作

**数据表**
- `users` - 用户信息
- `products` - 产品数据
- `orders` - 订单记录
- `categories` - 分类管理
- `cart_items` - 购物车

## 💳 支付系统

**支持方式**
- 支付宝扫码
- 微信支付
- 银行转账

**费用计算**
- 满5000免运费
- 偏远地区运费25元
- 订单≥50000收取10%奢侈品税

## 👤 测试账户

```
邮箱: herozdy@hotmail.com
用户名: test
密码: Zdy@12345
```

## 🎨 产品分类

- **大师海鸥** - 顶级复杂功能
- **飞行系列** - 飞行员腕表
- **海洋系列** - 潜水运动
- **潮酷品线** - 现代创意设计

## 🌐 部署信息

**生产地址:** https://derekzhou1979.github.io/luxury-watch-emporium/

**自动部署:** GitHub Actions + GitHub Pages

**配置要求**
- Node.js ≥ 16
- 支持ES6+现代浏览器

## 🛠️ 开发工具

**调试页面**
- `/clear-storage.html` - 清除本地数据
- `/debug-storage.html` - 查看数据结构

**构建优化**
- Vite快速构建
- 代码分割
- 图片优化
- 缓存策略

## 📱 响应式设计

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🧪 性能特点

- 首屏加载 < 2秒
- 图片懒加载
- 35个优化图片文件
- 100%图片利用率

## 📄 项目文档

- `API_DOCUMENTATION.md` - API接口文档
- `DATABASE_GUIDE.md` - 数据库使用指南
- `PAYMENT_SETUP.md` - 支付配置说明
- `DEPLOYMENT_GUIDE.md` - 部署指南
- `DEVELOPER_GUIDE.md` - 开发者指南

---

**🏆 项目亮点:** 现代化架构、零服务器成本、完整电商功能、生产就绪
