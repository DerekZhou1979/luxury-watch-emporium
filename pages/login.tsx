import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { UserLogin } from '../seagull-watch-types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading } = useAuth();
  
  const [formData, setFormData] = useState<UserLogin>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 如果已登录，重定向到首页或来源页面
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }
    
    if (!formData.password) {
      newErrors.password = '请输入密码';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // 登录成功后会自动重定向（通过useEffect）
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '登录失败，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-brand-surface p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-serif font-bold text-brand-text text-center mb-6">登录</h1>
        
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-brand-text-secondary mb-2">
              邮箱 *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 bg-brand-bg border border-gray-600 rounded-md text-brand-text focus:border-brand-primary focus:outline-none"
              placeholder="请输入邮箱"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-brand-text-secondary mb-2">
              密码 *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 bg-brand-bg border border-gray-600 rounded-md text-brand-text focus:border-brand-primary focus:outline-none"
              placeholder="请输入密码"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 text-brand-primary bg-brand-bg border-gray-600 rounded focus:ring-brand-primary focus:ring-2"
              />
              <span className="text-brand-text-secondary text-sm">记住我</span>
            </label>
            
            <Link 
              to="/forgot-password" 
              className="text-brand-primary hover:underline text-sm"
            >
              忘记密码？
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary text-brand-bg font-bold py-3 px-6 rounded-md text-lg hover:bg-brand-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-brand-text-secondary">
            还没有账户？{' '}
            <Link 
              to="/register" 
              className="text-brand-primary hover:underline font-medium"
            >
              立即注册
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-brand-text-secondary text-sm">
            登录即表示您同意我们的{' '}
            <Link to="/terms" className="text-brand-primary hover:underline">
              服务条款
            </Link>
            {' '}和{' '}
            <Link to="/privacy" className="text-brand-primary hover:underline">
              隐私政策
            </Link>
          </p>
        </div>
      </div>

      {/* 快速登录提示 */}
      <div className="mt-6 bg-brand-surface/50 p-4 rounded-lg">
        <h3 className="text-brand-text font-medium mb-2">🚀 快速体验</h3>
        <p className="text-brand-text-secondary text-sm mb-3">
          您可以先注册一个账户，或者以游客身份继续购物。登录后可以：
        </p>
        <ul className="text-brand-text-secondary text-sm space-y-1">
          <li>• 查看和管理您的订单</li>
          <li>• 保存收货地址</li>
          <li>• 享受会员专享优惠</li>
          <li>• 获得更好的购物体验</li>
        </ul>
        <div className="mt-4 space-x-3">
          <Link 
            to="/register"
            className="inline-block bg-brand-primary text-brand-bg text-sm font-medium py-2 px-4 rounded-md hover:bg-brand-primary-dark transition-colors"
          >
            立即注册
          </Link>
          <Link 
            to="/products"
            className="inline-block border border-brand-primary text-brand-primary text-sm font-medium py-2 px-4 rounded-md hover:bg-brand-primary hover:text-brand-bg transition-colors"
          >
            继续购物
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 