// 简单的测试脚本，用于验证checkout功能
console.log('测试开始：验证checkout页面的订单创建功能');

// 模拟测试数据
const testOrder = {
  id: 'SG' + Date.now(),
  items: [
    {
      productId: 'test-product-1',
      name: '海鸥测试表',
      imageUrl: '/images/test.jpg',
      sku: 'TEST001',
      price: 2999,
      quantity: 1
    }
  ],
  subtotal: 2999,
  shipping: 15,
  tax: 0,
  total: 3014,
  paymentMethod: 'alipay',
  status: 'pending',
  shippingAddress: {
    name: '测试用户',
    phone: '13800138000',
    province: '上海',
    city: '上海市',
    district: '黄浦区',
    address: '测试街道123号',
    postalCode: '200001'
  },
  createdAt: new Date().toISOString(),
  notes: '测试订单'
};

console.log('测试订单数据:', testOrder);
console.log('测试结束'); 