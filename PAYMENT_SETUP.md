# 💳 支付系统设置指南

## 📋 概述

简化版支付系统，支持支付宝、微信、银行转账三种方式。

## 🚀 快速配置

### 支付方式配置
```typescript
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
}
```

### 修改收款信息

**1. 支付宝配置**
```typescript
alipay: {
  account: 'your-alipay-account',    // 改为您的支付宝账号
  qrCodeUrl: 'images/payment/alipay-qr.png'
}
```

**2. 微信配置**
```typescript
wechat: {
  account: 'Your-WeChat-ID',         // 改为您的微信号
  qrCodeUrl: 'images/payment/wechat-qr.png'
}
```

**3. 银行配置**
```typescript
bank: {
  bankName: '您的开户银行',
  accountNumber: '您的银行账号',
  accountName: '账户姓名',
  branch: '开户支行'
}
```

## 📱 二维码设置

### 生成收款码
1. 支付宝：打开支付宝 → 收钱 → 保存二维码
2. 微信：打开微信 → 收付款 → 二维码收款 → 保存图片

### 替换收款码
1. 将新的二维码保存为：
   - `public/images/payment/alipay-qr.png`
   - `public/images/payment/wechat-qr.png`
2. 重新构建项目：`npm run build`

## 💰 费用计算

### 运费规则
- 满5000元免运费
- 偏远地区（新疆、西藏等）：25元
- 其他地区：15元

### 税费规则
- 订单≥50000元：收取10%奢侈品税
- 其他订单：免税

## 📋 订单管理

### 订单状态
- `pending` - 待支付
- `paid` - 已支付
- `processing` - 处理中
- `shipped` - 已发货
- `delivered` - 已送达
- `cancelled` - 已取消

### 支付流程
1. 用户选择支付方式
2. 系统显示收款信息/二维码
3. 用户完成支付
4. 点击"我已完成支付"
5. 订单状态更新为"已支付"

## 🔧 订单号规则

**格式**: SG + 13位时间戳 + 3位随机数
**示例**: SG1703123456789123

```typescript
static generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SG${timestamp}${random}`;
}
```

## 🗄️ 数据存储

- 订单数据存储在 localStorage
- 支持浏览器离线访问
- 生产环境建议使用数据库

## 🔒 安全提醒

1. **收款码安全** - 定期更换，避免长期使用
2. **订单验证** - 大额订单建议电话确认
3. **数据备份** - 定期备份订单数据
4. **防范钓鱼** - 注意识别虚假付款截图

## ⚙️ 高级配置

### 自定义支付方式
```typescript
// 在 PAYMENT_CONFIG 中添加新的支付方式
paypal: {
  account: 'your-paypal-email',
  description: 'PayPal支付'
}
```

### 修改费用计算
```typescript
// 自定义运费计算
static calculateShipping(subtotal: number, province: string): number {
  if (subtotal >= 3000) return 0;  // 修改免运费门槛
  return province === '偏远地区' ? 30 : 20;  // 修改运费标准
}
```

## 🚀 部署更新

```bash
# 修改配置后重新构建
npm run build

# 提交更改
git add .
git commit -m "更新支付配置"
git push origin main
```

## ❓ 常见问题

**Q: 如何处理支付纠纷？**
A: 保留完整订单记录和支付凭证，联系客服处理。

**Q: 收款码被盗用怎么办？**
A: 立即更换收款码，联系支付平台客服。

**Q: 如何自动对账？**
A: 当前版本需手动处理，可考虑集成第三方支付API。

---

**注意**: 此支付系统适用于个人小型电商，大量订单建议升级企业级方案。 