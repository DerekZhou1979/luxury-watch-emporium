import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { useLanguage } from '../hooks/use-language';
import { PaymentServiceSimple } from '../services/payment-service-simple';
import { Order, OrderStatus } from '../seagull-watch-types';

const OrdersPage: React.FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (orderId && orders.length > 0) {
      const order = orders.find(o => o.id === orderId);
      setSelectedOrder(order || null);
    }
  }, [orderId, orders]);

  const loadOrders = async () => {
    try {
      // 如果用户已登录，只加载该用户的订单；否则加载所有订单（游客模式）
      const userOrders = await PaymentServiceSimple.getUserOrders(user?.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('加载订单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'text-yellow-400 bg-yellow-400/10';
      case OrderStatus.PAID:
        return 'text-green-400 bg-green-400/10';
      case OrderStatus.PROCESSING:
        return 'text-blue-400 bg-blue-400/10';
      case OrderStatus.SHIPPED:
        return 'text-purple-400 bg-purple-400/10';
      case OrderStatus.DELIVERED:
        return 'text-green-500 bg-green-500/10';
      case OrderStatus.CANCELLED:
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusText = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.PENDING:
        return t.orders.pending;
      case OrderStatus.PAID:
        return t.orders.paid;
      case OrderStatus.PROCESSING:
        return t.orders.processing;
      case OrderStatus.SHIPPED:
        return t.orders.shipped;
      case OrderStatus.DELIVERED:
        return t.orders.delivered;
      case OrderStatus.CANCELLED:
        return t.orders.cancelled;
      default:
        return 'Unknown Status';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary mx-auto"></div>
          <p className="text-brand-text mt-4">{t.orders.loadingOrders}</p>
        </div>
      </div>
    );
  }

  // 如果指定了orderId，显示单个订单详情
  if (orderId && selectedOrder) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold text-brand-text">{t.orders.orderDetails}</h1>
          <Link 
            to="/orders" 
            className="text-brand-primary hover:underline"
          >
            {t.orders.backToOrderList}
          </Link>
        </div>

        <div className="bg-brand-surface p-6 rounded-lg">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-brand-text mb-3">{t.orders.orderInfo}</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-brand-text-secondary">{t.orders.orderNumber}:</span> <span className="text-brand-text font-mono">{selectedOrder.id}</span></p>
                <p><span className="text-brand-text-secondary">{t.orders.createdAt}:</span> <span className="text-brand-text">{formatDate(selectedOrder.createdAt)}</span></p>
                {selectedOrder.paidAt && (
                  <p><span className="text-brand-text-secondary">{t.orders.paidAt}:</span> <span className="text-brand-text">{formatDate(selectedOrder.paidAt)}</span></p>
                )}
                <p><span className="text-brand-text-secondary">{t.orders.orderStatus}:</span> 
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ml-2 ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-brand-text mb-3">{t.orders.shippingInfo}</h3>
              <div className="text-brand-text-secondary text-sm space-y-1">
                <p><span className="text-brand-text">{t.orders.recipient}:</span> {selectedOrder.shippingAddress.name}</p>
                <p><span className="text-brand-text">{t.orders.phone}:</span> {selectedOrder.shippingAddress.phone}</p>
                <p><span className="text-brand-text">{t.orders.address}:</span> {selectedOrder.shippingAddress.province} {selectedOrder.shippingAddress.city} {selectedOrder.shippingAddress.district}</p>
                <p className="pl-12">{selectedOrder.shippingAddress.address}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-brand-text mb-4">{t.orders.productList}</h3>
            <div className="space-y-4">
              {selectedOrder.items.map((item) => (
                <div key={item.productId} className="flex items-center space-x-4">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-grow">
                    <p className="text-brand-text font-medium">{item.name}</p>
                    <p className="text-brand-text-secondary text-sm">SKU: {item.sku}</p>
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

            <div className="border-t border-gray-600 mt-6 pt-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-brand-text-secondary">
                    <span>{t.orders.subtotalLabel}</span>
                    <span>¥{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-brand-text-secondary">
                    <span>{t.orders.shippingLabel}</span>
                    <span>{selectedOrder.shipping === 0 ? t.orders.freeShipping : `¥${selectedOrder.shipping}`}</span>
                  </div>
                  {selectedOrder.tax > 0 && (
                    <div className="flex justify-between text-brand-text-secondary">
                      <span>{t.orders.taxLabel}</span>
                      <span>¥{selectedOrder.tax.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-brand-primary border-t border-gray-600 pt-2">
                    <span>{t.orders.totalLabel}</span>
                    <span>¥{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectedOrder.notes && (
            <div className="border-t border-gray-600 pt-6">
              <h3 className="text-lg font-semibold text-brand-text mb-2">{t.orders.orderNotes}</h3>
              <p className="text-brand-text-secondary">{selectedOrder.notes}</p>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="border-t border-gray-600 pt-6">
            <div className="flex space-x-4">
              {selectedOrder.status === OrderStatus.PENDING && (
                <Link
                  to={`/payment/${selectedOrder.id}`}
                  className="bg-brand-primary text-brand-bg font-semibold py-2 px-4 rounded-md hover:bg-brand-primary-dark transition-colors"
                >
                  去支付
                </Link>
              )}
              <Link
                to="/products"
                className="border border-brand-primary text-brand-primary font-semibold py-2 px-4 rounded-md hover:bg-brand-primary hover:text-brand-bg transition-colors"
              >
                继续购物
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 显示订单列表
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-4xl font-serif font-bold text-brand-text text-center">
        {isAuthenticated ? '我的订单' : '所有订单'}
      </h1>
      
      {/* 未登录提示 */}
      {!isAuthenticated && (
        <div className="bg-brand-primary/10 border border-brand-primary/30 p-4 rounded-lg text-center">
          <h3 className="text-brand-primary font-medium mb-2">提示</h3>
          <p className="text-brand-text-secondary text-sm mb-4">
            您当前以游客模式浏览。登录后可以查看和管理您的个人订单。
          </p>
          <div className="space-x-3">
            <Link 
              to="/login"
              className="bg-brand-primary text-brand-bg px-4 py-2 rounded-md text-sm hover:bg-brand-primary-dark transition-colors"
            >
              登录
            </Link>
            <Link 
              to="/register"
              className="border border-brand-primary text-brand-primary px-4 py-2 rounded-md text-sm hover:bg-brand-primary hover:text-brand-bg transition-colors"
            >
              注册
            </Link>
          </div>
        </div>
      )}
      
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-serif font-bold text-brand-text mb-4">暂无订单</h2>
          <p className="text-brand-text-secondary text-lg mb-8">您还没有任何订单记录</p>
          <Link 
            to="/products" 
            className="bg-brand-primary text-brand-bg font-semibold py-3 px-6 rounded-md hover:bg-brand-primary-dark transition-colors"
          >
            开始购物
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-brand-surface p-6 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-brand-text">订单号: {order.id}</h3>
                  <p className="text-brand-text-secondary text-sm">创建时间: {formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center space-x-4 mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <span className="text-brand-primary font-bold text-lg">
                    ¥{order.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-brand-text font-medium mb-2">商品信息</h4>
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.productId} className="flex items-center space-x-3">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-grow">
                          <p className="text-brand-text text-sm font-medium truncate">{item.name}</p>
                          <p className="text-brand-text-secondary text-xs">
                            ¥{item.price.toLocaleString()} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-brand-text-secondary text-sm">
                        等 {order.items.length} 件商品
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-brand-text font-medium mb-2">收货信息</h4>
                  <div className="text-brand-text-secondary text-sm">
                    <p>{order.shippingAddress.name} {order.shippingAddress.phone}</p>
                    <p>{order.shippingAddress.province} {order.shippingAddress.city} {order.shippingAddress.district}</p>
                    <p className="truncate">{order.shippingAddress.address}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-600">
                <div className="flex space-x-4 mb-2 sm:mb-0">
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-brand-primary hover:underline text-sm"
                  >
                    查看详情
                  </Link>
                  {order.status === OrderStatus.PENDING && (
                    <Link
                      to={`/payment/${order.id}`}
                      className="text-brand-primary hover:underline text-sm"
                    >
                      去支付
                    </Link>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-brand-text-secondary text-sm">
                    共 {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件商品
                  </p>
                  <p className="text-brand-text-secondary text-sm">
                    实付 <span className="text-brand-primary font-semibold">¥{order.total.toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage; 