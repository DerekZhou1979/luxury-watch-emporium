import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/use-shopping-cart';
import { useAuth } from '../hooks/use-auth';
import { PaymentServiceSimple as PaymentService } from '../services/payment-service-simple';
import { 
  PaymentMethod, 
  ShippingAddress, 
  Order, 
  OrderStatus, 
  OrderItem 
} from '../seagull-watch-types';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  // 表单状态
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
    postalCode: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.ALIPAY);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 中国省份列表
  const provinces = [
    '北京', '天津', '上海', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江',
    '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南',
    '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾',
    '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门'
  ];

  // 计算费用
  const subtotal = totalPrice;
  const shipping = PaymentService.calculateShipping(subtotal, shippingAddress.province);
  const tax = PaymentService.calculateTax(subtotal);
  const total = subtotal + shipping + tax;

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!shippingAddress.name.trim()) newErrors.name = '请输入收件人姓名';
    if (!shippingAddress.phone.trim()) newErrors.phone = '请输入联系电话';
    else if (!/^1[3-9]\d{9}$/.test(shippingAddress.phone)) newErrors.phone = '请输入有效的手机号码';
    if (!shippingAddress.province) newErrors.province = '请选择省份';
    if (!shippingAddress.city.trim()) newErrors.city = '请输入城市';
    if (!shippingAddress.district.trim()) newErrors.district = '请输入区县';
    if (!shippingAddress.address.trim()) newErrors.address = '请输入详细地址';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交订单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (cart.length === 0) {
      alert('购物车为空，无法结算');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 创建订单
      const orderId = PaymentService.generateOrderId();
      const orderItems: OrderItem[] = cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        sku: item.sku
      }));

      const order: Order = {
        id: orderId,
        items: orderItems,
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod,
        status: OrderStatus.PENDING,
        shippingAddress,
        createdAt: new Date().toISOString(),
        notes
      };

      // 创建支付
      const paymentInfo = await PaymentService.createPayment(order, user?.id);
      
      // 清空购物车
      clearCart();
      
      // 跳转到支付页面
      navigate(`/payment/${orderId}`, { 
        state: { paymentInfo, order } 
      });
      
    } catch (error) {
      console.error('订单创建失败:', error);
      alert('订单创建失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-serif font-bold text-brand-text mb-4">购物车为空</h1>
        <p className="text-brand-text-secondary mb-8">请先添加商品到购物车</p>
        <button 
          onClick={() => navigate('/products')}
          className="bg-brand-primary text-brand-bg font-semibold py-3 px-6 rounded-md hover:bg-brand-primary-dark transition-colors"
        >
          去购物
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-serif font-bold text-brand-text text-center">结算</h1>
      
      {/* 登录提示 */}
      {!isAuthenticated && (
        <div className="bg-brand-primary/10 border border-brand-primary/30 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-brand-primary font-medium">建议登录后结算</h3>
              <p className="text-brand-text-secondary text-sm">登录后可享受更便捷的购物体验和订单管理</p>
            </div>
            <div className="space-x-3">
              <button 
                onClick={() => navigate('/login', { state: { from: { pathname: '/checkout' } } })}
                className="bg-brand-primary text-brand-bg px-4 py-2 rounded-md text-sm hover:bg-brand-primary-dark transition-colors"
              >
                登录
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="border border-brand-primary text-brand-primary px-4 py-2 rounded-md text-sm hover:bg-brand-primary hover:text-brand-bg transition-colors"
              >
                注册
              </button>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
        {/* 左侧：收货信息 */}
        <div className="space-y-6">
          <div className="bg-brand-surface p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-brand-text mb-4">收货信息</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-brand-text-secondary mb-1">收件人姓名 *</label>
                <input
                  type="text"
                  value={shippingAddress.name}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-brand-bg border border-gray-600 rounded-md text-brand-text focus:border-brand-primary focus:outline-none"
                  placeholder="请输入收件人姓名"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-brand-text-secondary mb-1">联系电话 *</label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 bg-brand-bg border border-gray-600 rounded-md text-brand-text focus:border-brand-primary focus:outline-none"
                  placeholder="请输入手机号码"
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-brand-text-secondary mb-1">省份 *</label>
                  <select
                    value={shippingAddress.province}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, province: e.target.value }))}
                    className="w-full p-3 bg-brand-bg border border-gray-600 rounded-md text-brand-text focus:border-brand-primary focus:outline-none"
                  >
                    <option value="">选择省份</option>
                    {provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                  {errors.province && <p className="text-red-400 text-sm mt-1">{errors.province}</p>}
                </div>

                <div>
                  <label className="block text-brand-text-secondary mb-1">城市 *</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full p-3 bg-brand-bg border border-gray-600 rounded-md text-brand-text focus:border-brand-primary focus:outline-none"
                    placeholder="城市"
                  />
                  {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-brand-text-secondary mb-1">区县 *</label>
                  <input
                    type="text"
                    value={shippingAddress.district}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full p-3 bg-brand-bg border border-gray-600 rounded-md text-brand-text focus:border-brand-primary focus:outline-none"
                    placeholder="区县"
                  />
                  {errors.district && <p className="text-red-400 text-sm mt-1">{errors.district}</p>}
                </div>
              </div>

              <div>
                <label className="block text-brand-text-secondary mb-1">详细地址 *</label>
                <textarea
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-3 bg-brand-bg border border-gray-600 rounded-md text-brand-text focus:border-brand-primary focus:outline-none"
                  placeholder="请输入详细地址（街道、门牌号等）"
                  rows={3}
                />
                {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-brand-text-secondary mb-1">邮政编码</label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                  className="w-full p-3 bg-brand-bg border border-gray-600 rounded-md text-brand-text focus:border-brand-primary focus:outline-none"
                  placeholder="可选"
                />
              </div>
            </div>
          </div>

          {/* 支付方式 */}
          <div className="bg-brand-surface p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-brand-text mb-4">支付方式</h2>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value={PaymentMethod.ALIPAY}
                  checked={paymentMethod === PaymentMethod.ALIPAY}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="text-brand-primary"
                />
                <span className="text-brand-text">支付宝转账</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value={PaymentMethod.WECHAT}
                  checked={paymentMethod === PaymentMethod.WECHAT}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="text-brand-primary"
                />
                <span className="text-brand-text">微信转账</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value={PaymentMethod.BANK_TRANSFER}
                  checked={paymentMethod === PaymentMethod.BANK_TRANSFER}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="text-brand-primary"
                />
                <span className="text-brand-text">银行转账</span>
              </label>
            </div>
          </div>

          {/* 订单备注 */}
          <div className="bg-brand-surface p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-brand-text mb-4">订单备注</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-brand-bg border border-gray-600 rounded-md text-brand-text focus:border-brand-primary focus:outline-none"
              placeholder="如有特殊要求请在此说明（可选）"
              rows={3}
            />
          </div>
        </div>

        {/* 右侧：订单摘要 */}
        <div className="space-y-6">
          <div className="bg-brand-surface p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-brand-text mb-4">订单摘要</h2>
            
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-grow">
                    <p className="text-brand-text font-medium text-sm">{item.name}</p>
                    <p className="text-brand-text-secondary text-sm">数量: {item.quantity}</p>
                  </div>
                  <p className="text-brand-primary font-semibold">¥{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-600 mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-brand-text-secondary">
                <span>商品小计</span>
                <span>¥{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-brand-text-secondary">
                <span>运费</span>
                <span>{shipping === 0 ? '免运费' : `¥${shipping}`}</span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-brand-text-secondary">
                  <span>税费</span>
                  <span>¥{tax.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-brand-primary border-t border-gray-600 pt-2">
                <span>总计</span>
                <span>¥{total.toLocaleString()}</span>
              </div>
            </div>

            {/* 优惠提示 */}
            {subtotal < 5000 && (
              <div className="mt-4 p-3 bg-brand-primary/10 border border-brand-primary/30 rounded-md">
                <p className="text-brand-primary text-sm">
                  购满¥5,000即可享受免运费！还差¥{(5000 - subtotal).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary text-brand-bg font-bold py-4 px-6 rounded-md text-lg hover:bg-brand-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '创建订单中...' : `提交订单 - ¥${total.toLocaleString()}`}
          </button>

          <p className="text-brand-text-secondary text-sm text-center">
            点击"提交订单"即表示您同意我们的服务条款和隐私政策
          </p>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage; 