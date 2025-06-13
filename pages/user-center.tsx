import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { PaymentServiceSimple } from '../services/payment-service-simple';
import { Order, OrderStatus } from '../seagull-watch-types';
import { DatabaseManager } from '../database/database-manager';

// 个人中心子组件
import MyOrders from '../components/user-center/my-orders';
import UserSettings from '../components/user-center/user-settings';
import RecommendedProducts from '../components/user-center/recommended-products';

const UserCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
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
    delivered: 0
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
      const stats = {
        pending: userOrders.filter(order => order.status === OrderStatus.PENDING).length,
        paid: userOrders.filter(order => order.status === OrderStatus.PAID).length,
        shipped: userOrders.filter(order => order.status === OrderStatus.SHIPPED).length,
        delivered: userOrders.filter(order => order.status === OrderStatus.DELIVERED).length
      };
      setOrderStats(stats);
    } catch (error) {
      console.error('加载用户数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('确定要退出登录吗？')) {
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-gold border-t-transparent mx-auto mb-4"></div>
          <p className="text-brand-text">正在加载个人中心...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-brand-text mb-2">个人中心</h1>
        <p className="text-brand-text-secondary">
          欢迎回来，{user.name}！管理您的订单、设置和发现精选推荐。
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <div className="bg-brand-surface rounded-xl p-6 shadow-lg border border-gray-800">
            {/* 用户头像和信息 */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-gold to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-brand-bg text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-brand-text font-semibold text-lg">{user.name}</h3>
              <p className="text-brand-text-secondary text-sm">{user.email}</p>
              <div className="mt-2 inline-flex items-center px-2 py-1 bg-brand-gold bg-opacity-20 rounded-full">
                <span className="text-brand-gold text-xs font-medium">VIP 会员</span>
              </div>
            </div>

            {/* 导航菜单 */}
            <nav className="space-y-3">
              <button
                onClick={() => handleTabChange('overview')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                  activeTab === 'overview'
                    ? 'bg-brand-gold text-brand-bg shadow-md'
                    : 'text-brand-text-secondary hover:bg-gray-700 hover:text-brand-text'
                }`}
              >
                <span className="text-xl">📊</span>
                <span className="font-medium">概览</span>
              </button>
              
              <button
                onClick={() => handleTabChange('orders')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                  activeTab === 'orders'
                    ? 'bg-brand-gold text-brand-bg shadow-md'
                    : 'text-brand-text-secondary hover:bg-gray-700 hover:text-brand-text'
                }`}
              >
                <span className="text-xl">📦</span>
                <div className="flex-1 flex justify-between items-center">
                  <span className="font-medium">我的订单</span>
                  {orders.length > 0 && (
                    <span className="bg-brand-gold bg-opacity-20 text-brand-gold text-xs px-2 py-1 rounded-full">
                      {orders.length}
                    </span>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => handleTabChange('settings')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                  activeTab === 'settings'
                    ? 'bg-brand-gold text-brand-bg shadow-md'
                    : 'text-brand-text-secondary hover:bg-gray-700 hover:text-brand-text'
                }`}
              >
                <span className="text-xl">⚙️</span>
                <span className="font-medium">设置</span>
              </button>
              
              <button
                onClick={() => handleTabChange('recommendations')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                  activeTab === 'recommendations'
                    ? 'bg-brand-gold text-brand-bg shadow-md'
                    : 'text-brand-text-secondary hover:bg-gray-700 hover:text-brand-text'
                }`}
              >
                <span className="text-xl">💎</span>
                <span className="font-medium">猜你喜欢</span>
              </button>

              <div className="border-t border-gray-700 pt-4 mt-6">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-800 hover:bg-opacity-20 transition-all duration-200 flex items-center space-x-3"
                >
                  <span className="text-xl">🚪</span>
                  <span className="font-medium">退出登录</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="lg:col-span-3">
          <div className="bg-brand-surface rounded-xl p-8 shadow-lg border border-gray-800">
            {/* 概览页面 */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-3xl font-semibold text-brand-text mb-8 flex items-center">
                  <span className="mr-3">📊</span>
                  账户概览
                </h2>
                
                {/* 订单状态统计 */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100 text-sm">待支付</p>
                        <p className="text-3xl font-bold">{orderStats.pending}</p>
                      </div>
                      <span className="text-4xl opacity-80">⏳</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">已支付</p>
                        <p className="text-3xl font-bold">{orderStats.paid}</p>
                      </div>
                      <span className="text-4xl opacity-80">✅</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">已发货</p>
                        <p className="text-3xl font-bold">{orderStats.shipped}</p>
                      </div>
                      <span className="text-4xl opacity-80">🚚</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">已完成</p>
                        <p className="text-3xl font-bold">{orderStats.delivered}</p>
                      </div>
                      <span className="text-4xl opacity-80">🎉</span>
                    </div>
                  </div>
                </div>

                {/* 最近订单 */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-brand-text">最近订单</h3>
                    <button 
                      onClick={() => handleTabChange('orders')}
                      className="text-brand-gold hover:text-yellow-300 transition-colors text-sm font-medium"
                    >
                      查看全部 →
                    </button>
                  </div>
                  
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="border border-gray-700 rounded-lg p-4 hover:border-brand-gold transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-brand-text font-medium">订单 #{order.id.slice(-8)}</p>
                              <p className="text-brand-text-secondary text-sm">
                                {new Date(order.createdAt).toLocaleDateString('zh-CN')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-brand-gold font-semibold">¥{order.total.toLocaleString()}</p>
                              <span className="inline-block px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs rounded-full">
                                {order.status === OrderStatus.PENDING ? '待支付' : 
                                 order.status === OrderStatus.PAID ? '已支付' :
                                 order.status === OrderStatus.SHIPPED ? '已发货' : '已完成'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <span className="text-6xl mb-4 block">📦</span>
                      <p className="text-brand-text-secondary">还没有订单</p>
                      <Link to="/products" className="inline-block mt-4 px-6 py-2 bg-brand-gold text-brand-bg rounded-lg hover:bg-yellow-600 transition-colors">
                        去购物
                      </Link>
                    </div>
                  )}
                </div>

                {/* 快捷操作 */}
                <div>
                  <h3 className="text-xl font-semibold text-brand-text mb-6">快捷操作</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button 
                      onClick={() => handleTabChange('orders')}
                      className="p-6 border border-gray-700 rounded-lg hover:border-brand-gold transition-colors text-center group"
                    >
                      <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">📋</span>
                      <p className="text-brand-text font-medium">查看订单</p>
                      <p className="text-brand-text-secondary text-sm">管理我的订单</p>
                    </button>
                    
                    <button 
                      onClick={() => handleTabChange('settings')}
                      className="p-6 border border-gray-700 rounded-lg hover:border-brand-gold transition-colors text-center group"
                    >
                      <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">👤</span>
                      <p className="text-brand-text font-medium">个人设置</p>
                      <p className="text-brand-text-secondary text-sm">修改个人信息</p>
                    </button>
                    
                    <Link 
                      to="/products"
                      className="p-6 border border-gray-700 rounded-lg hover:border-brand-gold transition-colors text-center group block"
                    >
                      <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">🛍️</span>
                      <p className="text-brand-text font-medium">继续购物</p>
                      <p className="text-brand-text-secondary text-sm">发现更多产品</p>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 我的订单 */}
            {activeTab === 'orders' && <MyOrders orders={orders} onRefresh={loadUserData} />}

            {/* 设置 */}
            {activeTab === 'settings' && <UserSettings user={user} />}

            {/* 猜你喜欢 */}
            {activeTab === 'recommendations' && <RecommendedProducts user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCenterPage; 