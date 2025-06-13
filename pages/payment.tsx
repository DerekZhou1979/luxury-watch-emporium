import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { PaymentService } from '../services/payment-service';
import { PaymentMethod, PaymentInfo, Order, OrderStatus } from '../seagull-watch-types';

const PaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(
    location.state?.paymentInfo || null
  );
  const [order, setOrder] = useState<Order | null>(
    location.state?.order || null
  );
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // 如果没有传递state，尝试从存储中获取订单信息
  useEffect(() => {
    if (!paymentInfo && orderId) {
      const loadOrderInfo = async () => {
        try {
          const orderData = await PaymentService.getOrder(orderId);
          if (orderData) {
            setOrder(orderData);
            const payment = await PaymentService.createPayment(orderData);
            setPaymentInfo(payment);
          } else {
            navigate('/orders');
          }
        } catch (error) {
          console.error('加载订单信息失败:', error);
          navigate('/orders');
        }
      };
      loadOrderInfo();
    }
  }, [orderId, paymentInfo, navigate]);

  // 确认支付
  const handleConfirmPayment = async () => {
    if (!orderId) return;
    
    setIsConfirming(true);
    try {
      const success = await PaymentService.confirmPayment(orderId);
      if (success) {
        setPaymentConfirmed(true);
        // 3秒后跳转到订单页面
        setTimeout(() => {
          navigate(`/orders/${orderId}`);
        }, 3000);
      }
    } catch (error) {
      console.error('确认支付失败:', error);
      alert('确认支付失败，请重试');
    } finally {
      setIsConfirming(false);
    }
  };

  // 取消订单
  const handleCancelOrder = async () => {
    if (!orderId) return;
    
    if (window.confirm('确定要取消这个订单吗？')) {
      try {
        await PaymentService.cancelOrder(orderId);
        navigate('/orders');
      } catch (error) {
        console.error('取消订单失败:', error);
        alert('取消订单失败，请重试');
      }
    }
  };

  if (!paymentInfo || !order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary mx-auto"></div>
          <p className="text-brand-text mt-4">加载支付信息中...</p>
        </div>
      </div>
    );
  }

  if (paymentConfirmed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-brand-surface p-8 rounded-lg">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif font-bold text-brand-text mb-4">支付确认成功！</h1>
          <p className="text-brand-text-secondary mb-6">
            您的订单 {orderId} 已确认支付。我们将尽快为您安排发货。
          </p>
          <p className="text-brand-text-secondary text-sm">
            即将跳转到订单详情页面...
          </p>
        </div>
      </div>
    );
  }

  const getPaymentMethodName = (method: PaymentMethod): string => {
    switch (method) {
      case PaymentMethod.ALIPAY:
        return '支付宝转账';
      case PaymentMethod.WECHAT:
        return '微信转账';
      case PaymentMethod.BANK_TRANSFER:
        return '银行转账';
      default:
        return '未知支付方式';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-serif font-bold text-brand-text text-center">支付订单</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* 左侧：支付信息 */}
        <div className="space-y-6">
          <div className="bg-brand-surface p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-brand-text mb-4">支付信息</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-brand-text-secondary">订单号:</span>
                <span className="text-brand-text font-mono">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text-secondary">支付方式:</span>
                <span className="text-brand-text">{getPaymentMethodName(paymentInfo.method)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text-secondary">支付金额:</span>
                <span className="text-brand-primary font-bold text-xl">¥{paymentInfo.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 支付二维码或账户信息 */}
          {paymentInfo.method !== PaymentMethod.BANK_TRANSFER && paymentInfo.qrCode && (
            <div className="bg-brand-surface p-6 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-brand-text mb-4">
                {paymentInfo.method === PaymentMethod.ALIPAY ? '支付宝收款码' : '微信收款码'}
              </h3>
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <img 
                  src={paymentInfo.qrCode} 
                  alt="支付二维码" 
                  className="w-48 h-48 mx-auto"
                  onError={(e) => {
                    // 如果二维码图片加载失败，显示默认占位符
                    e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="100" y="100" text-anchor="middle" fill="%236b7280" font-size="14">二维码占位符</text></svg>';
                  }}
                />
              </div>
              <p className="text-brand-text-secondary text-sm">
                请使用{paymentInfo.method === PaymentMethod.ALIPAY ? '支付宝' : '微信'}扫描二维码完成支付
              </p>
              {paymentInfo.accountInfo && (
                <p className="text-brand-text-secondary text-xs mt-2">
                  {paymentInfo.accountInfo}
                </p>
              )}
            </div>
          )}

          {/* 银行转账信息 */}
          {paymentInfo.method === PaymentMethod.BANK_TRANSFER && (
            <div className="bg-brand-surface p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-brand-text mb-4">银行转账信息</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-brand-bg p-4 rounded-md">
                  <pre className="text-brand-text whitespace-pre-wrap">{paymentInfo.accountInfo}</pre>
                </div>
                <p className="text-brand-text-secondary text-xs">
                  请将上述信息截图保存，前往银行或使用网银完成转账
                </p>
              </div>
            </div>
          )}

          {/* 支付说明 */}
          <div className="bg-brand-surface p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-brand-text mb-4">支付说明</h3>
            <div className="space-y-2 text-sm text-brand-text-secondary">
              <p>• 请在24小时内完成支付，超时订单将自动取消</p>
              <p>• 完成支付后，请点击下方"我已完成支付"按钮</p>
              <p>• 我们将在确认收款后1-2个工作日内安排发货</p>
              <p>• 如有问题，请联系客服：400-123-4567</p>
            </div>
          </div>
        </div>

        {/* 右侧：订单详情 */}
        <div className="space-y-6">
          <div className="bg-brand-surface p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-brand-text mb-4">订单详情</h2>
            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center space-x-3">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-grow">
                    <p className="text-brand-text font-medium text-sm">{item.name}</p>
                    <p className="text-brand-text-secondary text-sm">
                      ¥{item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-brand-primary font-semibold">
                    ¥{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-600 mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-brand-text-secondary">
                <span>商品小计</span>
                <span>¥{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-brand-text-secondary">
                <span>运费</span>
                <span>{order.shipping === 0 ? '免运费' : `¥${order.shipping}`}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-brand-text-secondary">
                  <span>税费</span>
                  <span>¥{order.tax.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-brand-primary border-t border-gray-600 pt-2">
                <span>总计</span>
                <span>¥{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 收货信息 */}
          <div className="bg-brand-surface p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-brand-text mb-4">收货信息</h3>
            <div className="text-brand-text-secondary text-sm space-y-1">
              <p><strong className="text-brand-text">收件人:</strong> {order.shippingAddress.name}</p>
              <p><strong className="text-brand-text">电话:</strong> {order.shippingAddress.phone}</p>
              <p><strong className="text-brand-text">地址:</strong> {order.shippingAddress.province} {order.shippingAddress.city} {order.shippingAddress.district}</p>
              <p className="pl-12">{order.shippingAddress.address}</p>
              {order.shippingAddress.postalCode && (
                <p><strong className="text-brand-text">邮编:</strong> {order.shippingAddress.postalCode}</p>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <button
              onClick={handleConfirmPayment}
              disabled={isConfirming}
              className="w-full bg-brand-primary text-brand-bg font-bold py-3 px-6 rounded-md text-lg hover:bg-brand-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConfirming ? '确认中...' : '我已完成支付'}
            </button>
            
            <button
              onClick={handleCancelOrder}
              className="w-full border border-gray-600 text-brand-text-secondary font-medium py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
            >
              取消订单
            </button>
            
            <button
              onClick={() => navigate('/user-center#orders')}
              className="w-full text-center text-brand-primary hover:underline"
            >
              查看我的订单
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 