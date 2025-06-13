import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { PaymentService } from '../services/payment-service';
import { Order, OrderStatus } from '../seagull-watch-types';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateProfile, changePassword } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'password'>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 个人信息表单
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // 密码修改表单
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 检查登录状态
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { from: { pathname: '/profile' } },
        replace: true 
      });
      return;
    }

    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.phone || ''
      });
    }

    loadUserOrders();
  }, [isAuthenticated, user, navigate]);

  const loadUserOrders = async () => {
    try {
      const userOrders = await PaymentService.getUserOrders();
      // 只显示当前用户的订单
      const filteredOrders = user ? userOrders.filter(order => order.userId === user.id) : [];
      setOrders(filteredOrders);
    } catch (error) {
      console.error('加载订单失败:', error);
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

  const getStatusText = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.PENDING: return '待支付';
      case OrderStatus.PAID: return '已支付';
      case OrderStatus.PROCESSING: return '处理中';
      case OrderStatus.SHIPPED: return '已发货';
      case OrderStatus.DELIVERED: return '已送达';
      case OrderStatus.CANCELLED: return '已取消';
      default: return '未知状态';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-brand-text mb-2">个人中心</h1>
        <p className="text-brand-text-secondary">
          欢迎回来，{user.name}！管理您的个人信息和订单。
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <div className="bg-brand-surface p-6 rounded-lg">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-brand-bg text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-brand-text font-semibold">{user.name}</h3>
              <p className="text-brand-text-secondary text-sm">{user.email}</p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-brand-primary text-brand-bg'
                    : 'text-brand-text-secondary hover:bg-gray-700 hover:text-brand-text'
                }`}
              >
                个人信息
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-brand-primary text-brand-bg'
                    : 'text-brand-text-secondary hover:bg-gray-700 hover:text-brand-text'
                }`}
              >
                我的订单 ({orders.length})
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-md text-red-400 hover:bg-red-800/50 transition-colors"
              >
                退出登录
              </button>
            </nav>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="lg:col-span-3">
          <div className="bg-brand-surface p-6 rounded-lg">
            {/* 个人信息 */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-semibold text-brand-text mb-6">个人信息</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-brand-text-secondary mb-2">姓名</label>
                    <p className="text-brand-text">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-brand-text-secondary mb-2">邮箱</label>
                    <p className="text-brand-text">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-brand-text-secondary mb-2">手机号</label>
                    <p className="text-brand-text">{user.phone || '未设置'}</p>
                  </div>
                  <div>
                    <label className="block text-brand-text-secondary mb-2">注册时间</label>
                    <p className="text-brand-text">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 我的订单 */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-brand-text">我的订单</h2>
                  <Link 
                    to="/user-center#orders"
                    className="text-brand-primary hover:underline"
                  >
                    查看全部订单 →
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl text-brand-text mb-2">暂无订单</h3>
                    <p className="text-brand-text-secondary mb-6">您还没有任何订单记录</p>
                    <Link 
                      to="/products"
                      className="bg-brand-primary text-brand-bg font-semibold py-3 px-6 rounded-md hover:bg-brand-primary-dark transition-colors"
                    >
                      开始购物
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="border border-gray-600 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-brand-text font-medium">订单号: {order.id}</h4>
                            <p className="text-brand-text-secondary text-sm">
                              下单时间: {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-brand-primary/20 text-brand-primary">
                              {getStatusText(order.status)}
                            </span>
                            <p className="text-brand-primary font-semibold mt-1">
                              ¥{order.total.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-brand-text-secondary text-sm">
                            共{order.items.length}件商品
                          </span>
                          <Link
                            to={`/orders/${order.id}`}
                            className="text-brand-primary hover:underline text-sm"
                          >
                            查看详情
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage; 