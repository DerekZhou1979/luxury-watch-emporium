import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Order, OrderStatus } from '../../seagull-watch-types';

interface MyOrdersProps {
  orders: Order[];
  onRefresh: () => void;
}

const MyOrders: React.FC<MyOrdersProps> = ({ orders, onRefresh }) => {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  // 过滤订单
  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  // 排序订单
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.total - a.total;
    }
  });

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-500';
      case OrderStatus.PAID:
        return 'bg-green-500 bg-opacity-20 text-green-400 border-green-500';
      case OrderStatus.PROCESSING:
        return 'bg-blue-500 bg-opacity-20 text-blue-400 border-blue-500';
      case OrderStatus.SHIPPED:
        return 'bg-purple-500 bg-opacity-20 text-purple-400 border-purple-500';
      case OrderStatus.DELIVERED:
        return 'bg-emerald-500 bg-opacity-20 text-emerald-400 border-emerald-500';
      case OrderStatus.CANCELLED:
        return 'bg-red-500 bg-opacity-20 text-red-400 border-red-500';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400 border-gray-500';
    }
  };

  const getStatusText = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.PENDING:
        return '待支付';
      case OrderStatus.PAID:
        return '已支付';
      case OrderStatus.PROCESSING:
        return '处理中';
      case OrderStatus.SHIPPED:
        return '已发货';
      case OrderStatus.DELIVERED:
        return '已送达';
      case OrderStatus.CANCELLED:
        return '已取消';
      default:
        return '未知状态';
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

  const getStatusCount = (status: OrderStatus | 'all'): number => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-brand-text flex items-center">
          <span className="mr-3">📦</span>
          我的订单
        </h2>
        <button 
          onClick={onRefresh}
          className="px-4 py-2 bg-brand-gold text-brand-bg rounded-lg hover:bg-yellow-600 transition-colors font-medium"
        >
          🔄 刷新
        </button>
      </div>

      {/* 订单状态筛选标签 */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            statusFilter === 'all'
              ? 'bg-brand-gold text-brand-bg shadow-md'
              : 'bg-gray-700 text-brand-text-secondary hover:bg-gray-600 hover:text-brand-text'
          }`}
        >
          全部 ({getStatusCount('all')})
        </button>
        
        <button
          onClick={() => setStatusFilter(OrderStatus.PENDING)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            statusFilter === OrderStatus.PENDING
              ? 'bg-yellow-500 text-brand-bg shadow-md'
              : 'bg-gray-700 text-brand-text-secondary hover:bg-gray-600 hover:text-brand-text'
          }`}
        >
          待支付 ({getStatusCount(OrderStatus.PENDING)})
        </button>
        
        <button
          onClick={() => setStatusFilter(OrderStatus.PAID)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            statusFilter === OrderStatus.PAID
              ? 'bg-green-500 text-brand-bg shadow-md'
              : 'bg-gray-700 text-brand-text-secondary hover:bg-gray-600 hover:text-brand-text'
          }`}
        >
          已支付 ({getStatusCount(OrderStatus.PAID)})
        </button>
        
        <button
          onClick={() => setStatusFilter(OrderStatus.SHIPPED)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            statusFilter === OrderStatus.SHIPPED
              ? 'bg-purple-500 text-brand-bg shadow-md'
              : 'bg-gray-700 text-brand-text-secondary hover:bg-gray-600 hover:text-brand-text'
          }`}
        >
          已发货 ({getStatusCount(OrderStatus.SHIPPED)})
        </button>
        
        <button
          onClick={() => setStatusFilter(OrderStatus.DELIVERED)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            statusFilter === OrderStatus.DELIVERED
              ? 'bg-emerald-500 text-brand-bg shadow-md'
              : 'bg-gray-700 text-brand-text-secondary hover:bg-gray-600 hover:text-brand-text'
          }`}
        >
          已完成 ({getStatusCount(OrderStatus.DELIVERED)})
        </button>
      </div>

      {/* 排序控制 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-brand-text-secondary text-sm">排序方式：</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
            className="bg-gray-700 text-brand-text border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-brand-gold"
          >
            <option value="date">按时间排序</option>
            <option value="amount">按金额排序</option>
          </select>
        </div>
        <p className="text-brand-text-secondary text-sm">
          共 {sortedOrders.length} 个订单
        </p>
      </div>

      {/* 订单列表 */}
      {sortedOrders.length > 0 ? (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <div key={order.id} className="border border-gray-700 rounded-xl p-6 hover:border-brand-gold transition-all duration-200 hover:shadow-lg">
              {/* 订单头部信息 */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-brand-text mb-1">
                    订单 #{order.id.slice(-8)}
                  </h3>
                  <p className="text-brand-text-secondary text-sm">
                    下单时间：{formatDate(order.createdAt)}
                  </p>
                  {order.paidAt && (
                    <p className="text-brand-text-secondary text-sm">
                      支付时间：{formatDate(order.paidAt)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <p className="text-brand-gold font-bold text-xl mt-2">
                    ¥{order.total.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* 商品列表 */}
              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 bg-gray-800 bg-opacity-30 rounded-lg p-3">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-grow">
                      <p className="text-brand-text font-medium">{item.name}</p>
                      <p className="text-brand-text-secondary text-sm">SKU: {item.sku}</p>
                      <p className="text-brand-text-secondary text-sm">
                        ¥{item.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-brand-gold font-semibold">
                      ¥{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* 订单操作按钮 */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <div className="flex space-x-3">
                  <Link
                    to={`/orders/${order.id}`}
                    className="px-4 py-2 border border-brand-gold text-brand-gold rounded-lg hover:bg-brand-gold hover:text-brand-bg transition-colors font-medium"
                  >
                    查看详情
                  </Link>
                  
                  {order.status === OrderStatus.PENDING && (
                    <Link
                      to={`/payment/${order.id}`}
                      className="px-4 py-2 bg-brand-gold text-brand-bg rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                    >
                      立即支付
                    </Link>
                  )}
                  
                  {order.status === OrderStatus.DELIVERED && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      再次购买
                    </button>
                  )}
                </div>
                
                <div className="text-brand-text-secondary text-sm">
                  {order.items.length} 件商品
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-8xl mb-6 block">📭</span>
          <h3 className="text-xl font-semibold text-brand-text mb-2">
            {statusFilter === 'all' ? '还没有订单' : '暂无相关订单'}
          </h3>
          <p className="text-brand-text-secondary mb-6">
            {statusFilter === 'all' 
              ? '开始您的第一次购物之旅吧！' 
              : '试试其他状态的订单或去购买新商品'
            }
          </p>
          <Link 
            to="/products" 
            className="inline-block px-8 py-3 bg-brand-gold text-brand-bg rounded-lg hover:bg-yellow-600 transition-colors font-medium"
          >
            去购物
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyOrders; 