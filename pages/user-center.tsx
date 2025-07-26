import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { useLanguage } from '../hooks/use-language';
import { PaymentServiceSimple } from '../services/payment-service-simple';
import { Order, OrderStatus } from '../seagull-watch-types';
import { 
  UserOutlined, 
  ShoppingOutlined, 
  SettingOutlined, 
  HeartOutlined,
  LogoutOutlined,
  TrophyOutlined,
  GiftOutlined,
  CalendarOutlined,
  StarOutlined
} from '@ant-design/icons';

// 个人中心子组件
import MyOrders from '../components/user-center/my-orders';
import UserSettings from '../components/user-center/user-settings';
import RecommendedProducts from '../components/user-center/recommended-products';

const UserCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  
  // 从URL获取当前活动标签页
  const getActiveTabFromPath = () => {
    const hash = location.hash;
    if (hash === '#orders') return 'orders';
    if (hash === '#settings') return 'settings';
    if (hash === '#recommendations') return 'recommendations';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings' | 'recommendations'>(getActiveTabFromPath());
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    paid: 0,
    shipped: 0,
    delivered: 0,
    total: 0,
    totalSpent: 0
  });

  // 检查登录状态
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { from: { pathname: '/user-center' } },
        replace: true 
      });
      return;
    }
    loadUserData();
  }, [isAuthenticated, user, navigate]);

  // 监听路由变化更新活动标签
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.hash]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // 加载用户订单
      const userOrders = await PaymentServiceSimple.getUserOrders(user?.id);
      setOrders(userOrders);
      
      // 计算订单统计
      const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
      const stats = {
        pending: userOrders.filter(order => order.status === OrderStatus.PENDING).length,
        paid: userOrders.filter(order => order.status === OrderStatus.PAID).length,
        shipped: userOrders.filter(order => order.status === OrderStatus.SHIPPED).length,
        delivered: userOrders.filter(order => order.status === OrderStatus.DELIVERED).length,
        total: userOrders.length,
        totalSpent
      };
      setOrderStats(stats);
    } catch (error) {
      console.error('加载用户数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm(t.userCenter.title === '个人中心' ? '确定要退出登录吗？' : 'Are you sure you want to logout?')) {
      await logout();
      navigate('/', { replace: true });
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    navigate(`/user-center#${tab === 'overview' ? '' : tab}`, { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex justify-center items-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <UserOutlined className="text-blue-600 text-2xl" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatWelcomeMessage = () => {
    return t.userCenter.welcome.replace('{name}', user.name);
  };

  const getMembershipDuration = () => {
    const joinDate = new Date(user.createdAt || '2024-01-01');
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} ${t.userCenter.title === '个人中心' ? '天' : 'days'}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${t.userCenter.title === '个人中心' ? '个月' : 'months'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${t.userCenter.title === '个人中心' ? '年' : 'years'}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* 头部区域 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t.userCenter.title}
              </h1>
              <p className="text-gray-600 mt-1">{formatWelcomeMessage()}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <LogoutOutlined />
              <span>{t.nav.logout}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 用户信息卡片 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-white text-3xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                    <TrophyOutlined className="text-yellow-800 text-sm" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                  <div className="mt-2 inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full">
                    <StarOutlined className="text-orange-800 text-xs mr-1" />
                    <span className="text-orange-800 text-xs font-medium">{t.userCenter.vipMember}</span>
                  </div>
                </div>

                {/* 用户统计 */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200/50">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{orderStats.total}</div>
                    <div className="text-xs text-gray-500">{t.userCenter.totalOrders}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">¥{orderStats.totalSpent.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{t.userCenter.totalSpent}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                  <CalendarOutlined />
                  <span>{t.userCenter.memberSince}: {getMembershipDuration()}</span>
                </div>
              </div>
            </div>

            {/* 导航菜单 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50">
              <nav className="space-y-1">
                {[
                  { key: 'overview', icon: UserOutlined, label: t.userCenter.overview },
                  { key: 'orders', icon: ShoppingOutlined, label: t.userCenter.orders },
                  { key: 'settings', icon: SettingOutlined, label: t.userCenter.settings },
                  { key: 'recommendations', icon: HeartOutlined, label: t.userCenter.recommendations },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleTabChange(item.key as typeof activeTab)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === item.key
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <item.icon className={`text-lg ${activeTab === item.key ? 'text-white' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* 快速统计卡片 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/50">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">{t.userCenter.orderStatus}</h4>
              <div className="space-y-2">
                {[
                  { label: t.userCenter.pendingPayment, count: orderStats.pending, color: 'text-yellow-600', bg: 'bg-yellow-100' },
                  { label: t.userCenter.paid, count: orderStats.paid, color: 'text-green-600', bg: 'bg-green-100' },
                  { label: t.userCenter.shipped, count: orderStats.shipped, color: 'text-blue-600', bg: 'bg-blue-100' },
                  { label: t.userCenter.delivered, count: orderStats.delivered, color: 'text-purple-600', bg: 'bg-purple-100' },
                ].map((status, index) => (
                  <div key={index} className="flex items-center justify-between py-1">
                    <span className="text-sm text-gray-600">{status.label}</span>
                    <span className={`text-sm font-semibold px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                      {status.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 主内容区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 min-h-[600px]">
              {activeTab === 'overview' && (
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
                      <GiftOutlined className="text-blue-600" />
                      <span className="text-blue-800 font-medium">{t.userCenter.overview}</span>
                    </div>
                  </div>

                  {/* 概览统计卡片 */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { 
                        title: t.userCenter.totalOrders, 
                        value: orderStats.total.toString(), 
                        icon: ShoppingOutlined, 
                        color: 'from-blue-500 to-blue-600',
                        bgColor: 'from-blue-50 to-blue-100'
                      },
                      { 
                        title: t.userCenter.totalSpent, 
                        value: `¥${orderStats.totalSpent.toLocaleString()}`, 
                        icon: TrophyOutlined, 
                        color: 'from-green-500 to-green-600',
                        bgColor: 'from-green-50 to-green-100'
                      },
                      { 
                        title: t.userCenter.points, 
                        value: Math.floor(orderStats.totalSpent / 100).toString(), 
                        icon: StarOutlined, 
                        color: 'from-yellow-500 to-yellow-600',
                        bgColor: 'from-yellow-50 to-yellow-100'
                      },
                      { 
                        title: t.userCenter.memberSince, 
                        value: getMembershipDuration(), 
                        icon: CalendarOutlined, 
                        color: 'from-purple-500 to-purple-600',
                        bgColor: 'from-purple-50 to-purple-100'
                      },
                    ].map((stat, index) => (
                      <div key={index} className={`bg-gradient-to-br ${stat.bgColor} rounded-xl p-6 border border-gray-200/30`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                          </div>
                          <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                            <stat.icon className="text-white text-xl" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 最近订单 */}
                  <div className="bg-gray-50/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{t.userCenter.myOrders}</h3>
                      <button
                        onClick={() => handleTabChange('orders')}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        {t.userCenter.viewDetails} →
                      </button>
                    </div>
                    
                    {orders.length > 0 ? (
                      <div className="space-y-3">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="bg-white rounded-lg p-4 border border-gray-200/50 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-800">#{order.id.slice(-8)}</div>
                                <div className="text-sm text-gray-500">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-blue-600">¥{order.total.toLocaleString()}</div>
                                <div className={`text-xs px-2 py-1 rounded-full ${
                                  order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-600' :
                                  order.status === OrderStatus.SHIPPED ? 'bg-blue-100 text-blue-600' :
                                  order.status === OrderStatus.PAID ? 'bg-purple-100 text-purple-600' :
                                  'bg-yellow-100 text-yellow-600'
                                }`}>
                                  {order.status === OrderStatus.PENDING ? t.userCenter.pendingPayment :
                                   order.status === OrderStatus.PAID ? t.userCenter.paid :
                                   order.status === OrderStatus.SHIPPED ? t.userCenter.shipped :
                                   order.status === OrderStatus.DELIVERED ? t.userCenter.delivered :
                                   order.status}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingOutlined className="text-4xl text-gray-300 mb-2" />
                        <p className="text-gray-500">{t.userCenter.title === '个人中心' ? '暂无订单' : 'No orders yet'}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="p-6">
                  <MyOrders orders={orders} onRefresh={loadUserData} />
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="p-6">
                  <UserSettings user={user} />
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="p-6">
                  <RecommendedProducts user={user} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCenterPage; 