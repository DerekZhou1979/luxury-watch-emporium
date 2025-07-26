import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/use-language';
import { Order, OrderStatus, OrderItem } from '../../seagull-watch-types';
import { 
  CalendarOutlined, 
  CreditCardOutlined, 
  ShoppingOutlined, 
  EyeOutlined,
  ReloadOutlined,
  TagOutlined,
  SettingOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  GiftOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

interface MyOrdersProps {
  orders: Order[];
  onRefresh: () => void;
}

const MyOrders: React.FC<MyOrdersProps> = ({ orders, onRefresh }) => {
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

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

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: ClockCircleOutlined,
          text: t.userCenter.pendingPayment,
          dotColor: 'bg-yellow-400'
        };
      case OrderStatus.PAID:
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: CheckCircleOutlined,
          text: t.userCenter.paid,
          dotColor: 'bg-green-400'
        };
      case OrderStatus.PROCESSING:
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          icon: SettingOutlined,
          text: t.userCenter.processing,
          dotColor: 'bg-blue-400'
        };
      case OrderStatus.SHIPPED:
        return {
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          icon: TruckOutlined,
          text: t.userCenter.shipped,
          dotColor: 'bg-purple-400'
        };
      case OrderStatus.DELIVERED:
        return {
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          icon: GiftOutlined,
          text: t.userCenter.delivered,
          dotColor: 'bg-emerald-400'
        };
      case OrderStatus.CANCELLED:
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: CloseCircleOutlined,
          text: t.userCenter.cancelled,
          dotColor: 'bg-red-400'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: InfoCircleOutlined,
          text: status,
          dotColor: 'bg-gray-400'
        };
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(t.userCenter.title === '个人中心' ? 'zh-CN' : 'en-US', {
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

  const renderCustomizationDetails = (item: OrderItem) => {
    if (!item.isCustomized || !item.customization) {
      return null;
    }

    const customization = item.customization;
    
    return (
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
        <div className="flex items-center space-x-2 mb-3">
          <SettingOutlined className="text-blue-600" />
          <span className="font-semibold text-blue-800">{t.userCenter.customizationDetails}</span>
        </div>
        
        {/* 定制选项 */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {Object.entries(customization.configurations).map(([category, value]) => (
            <div key={category} className="flex justify-between items-center py-2 px-3 bg-white rounded-md border border-blue-100">
              <span className="text-gray-600 text-sm capitalize">{category}:</span>
              <span className="font-medium text-gray-800">{value}</span>
            </div>
          ))}
        </div>

        {/* 价格明细 */}
        <div className="border-t border-blue-200 pt-3">
          <div className="space-y-2">
            {customization.priceBreakdown.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {item.type === 'base' ? t.userCenter.basePrice : item.name}:
                </span>
                <span className={`font-medium ${item.type === 'base' ? 'text-gray-800' : 'text-blue-600'}`}>
                  {item.price > 0 ? `+¥${item.price.toLocaleString()}` : '¥0'}
                </span>
              </div>
            ))}
            <div className="border-t border-blue-200 pt-2 flex justify-between items-center font-semibold">
              <span className="text-gray-800">{t.userCenter.finalPrice}:</span>
              <span className="text-blue-700 text-lg">¥{customization.finalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const statusFilters = [
    { key: 'all' as const, label: t.userCenter.allOrders, count: getStatusCount('all') },
    { key: OrderStatus.PENDING, label: t.userCenter.pendingPayment, count: getStatusCount(OrderStatus.PENDING) },
    { key: OrderStatus.PAID, label: t.userCenter.paid, count: getStatusCount(OrderStatus.PAID) },
    { key: OrderStatus.PROCESSING, label: t.userCenter.processing, count: getStatusCount(OrderStatus.PROCESSING) },
    { key: OrderStatus.SHIPPED, label: t.userCenter.shipped, count: getStatusCount(OrderStatus.SHIPPED) },
    { key: OrderStatus.DELIVERED, label: t.userCenter.delivered, count: getStatusCount(OrderStatus.DELIVERED) },
    { key: OrderStatus.CANCELLED, label: t.userCenter.cancelled, count: getStatusCount(OrderStatus.CANCELLED) },
  ];

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <ShoppingOutlined className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t.userCenter.myOrders}</h2>
            <p className="text-gray-500 text-sm">{t.userCenter.orderManagement}</p>
          </div>
        </div>
        
        <button 
          onClick={onRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
        >
          <ReloadOutlined />
          <span>{t.userCenter.refresh}</span>
        </button>
      </div>

      {/* 筛选和排序 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/50">
        {/* 状态筛选 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            {statusFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  statusFilter === filter.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{filter.label}</span>
                {filter.count > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    statusFilter === filter.key 
                      ? 'bg-white/20 text-white' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 排序选项 */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 text-sm font-medium">{t.common.sort}:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setSortBy('date')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                sortBy === 'date'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {t.userCenter.sortByDate}
            </button>
            <button
              onClick={() => setSortBy('amount')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                sortBy === 'amount'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {t.userCenter.sortByAmount}
            </button>
          </div>
        </div>
      </div>

      {/* 订单列表 */}
      {sortedOrders.length > 0 ? (
        <div className="space-y-6">
          {sortedOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const isExpanded = expandedOrder === order.id;
            
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
                {/* 订单头部 */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg flex items-center justify-center`}>
                        <statusConfig.icon className={`${statusConfig.color} text-lg`} />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-bold text-gray-800 text-lg">
                            #{order.id.slice(-8)}
                          </h3>
                          <div className={`flex items-center space-x-2 px-3 py-1 ${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-full`}>
                            <div className={`w-2 h-2 ${statusConfig.dotColor} rounded-full`}></div>
                            <span className={`text-sm font-medium ${statusConfig.color}`}>
                              {statusConfig.text}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <CalendarOutlined />
                            <span>{t.userCenter.orderDate}: {formatDate(order.createdAt)}</span>
                          </div>
                          {order.paidAt && (
                            <div className="flex items-center space-x-1">
                              <CreditCardOutlined />
                              <span>{t.userCenter.paymentDate}: {formatDate(order.paidAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold text-blue-600">
                        ¥{order.total.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} {t.userCenter.orderItems}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 订单商品列表（展开/收起） */}
                <div className="p-6 space-y-4">
                  {order.items.slice(0, isExpanded ? undefined : 2).map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h4 className="font-semibold text-gray-800 truncate">{item.name}</h4>
                              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                              {item.isCustomized && (
                                <div className="flex items-center space-x-1">
                                  <TagOutlined className="text-blue-600 text-xs" />
                                  <span className="text-xs text-blue-600 font-medium">
                                    {t.userCenter.customizedProduct}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="text-right space-y-1">
                              <div className="font-semibold text-gray-800">
                                ¥{item.price.toLocaleString()} × {item.quantity}
                              </div>
                              <div className="text-lg font-bold text-blue-600">
                                ¥{(item.price * item.quantity).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          {/* 定制详情 */}
                          {isExpanded && renderCustomizationDetails(item)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* 展开/收起按钮 */}
                  {order.items.length > 2 && (
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="w-full py-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                    >
                      {isExpanded 
                        ? `${t.userCenter.title === '个人中心' ? '收起' : 'Show Less'} ↑`
                        : `${t.userCenter.title === '个人中心' ? '查看更多' : 'Show More'} (${order.items.length - 2}+) ↓`
                      }
                    </button>
                  )}
                </div>

                {/* 订单操作 */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/orders/${order.id}`}
                        className="flex items-center space-x-2 px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <EyeOutlined />
                        <span>{t.userCenter.viewDetails}</span>
                      </Link>
                      
                      {order.status === OrderStatus.PENDING && (
                        <Link
                          to={`/payment/${order.id}`}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <CreditCardOutlined />
                          <span>{t.userCenter.payNow}</span>
                        </Link>
                      )}
                      
                      {order.status === OrderStatus.DELIVERED && (
                        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <ReloadOutlined />
                          <span>{t.userCenter.buyAgain}</span>
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <DollarOutlined />
                      <span>{t.userCenter.orderTotal}: ¥{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200/50">
          <div className="space-y-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingOutlined className="text-4xl text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {statusFilter === 'all' 
                  ? (t.userCenter.title === '个人中心' ? '暂无订单' : 'No orders yet')
                  : (t.userCenter.title === '个人中心' ? '暂无此状态的订单' : 'No orders with this status')
                }
              </h3>
              <p className="text-gray-500">
                {t.userCenter.title === '个人中心' 
                  ? '开始您的定制之旅，创造独一无二的时计作品' 
                  : 'Start your bespoke journey and create unique timepiece masterpieces'
                }
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <GiftOutlined />
              <span>{t.userCenter.title === '个人中心' ? '开始定制' : 'Start Customization'}</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders; 