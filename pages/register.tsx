import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { UserRegistration } from '../seagull-watch-types';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading } = useAuth();
  
  const [formData, setFormData] = useState<UserRegistration>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 如果已登录，重定向到首页
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '姓名至少2个字符';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }
    
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度至少6位';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '密码需包含字母和数字';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    
    if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '手机号格式不正确';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = '请同意服务条款和隐私政策';
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
      const result = await register(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: '注册成功！正在为您登录...' });
        // 注册成功后会自动登录并重定向
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '注册失败，请重试' });
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
        <h1 className="text-3xl font-serif font-bold text-brand-text text-center mb-6">注册</h1>
        
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
            <label htmlFor="name" className="block text-brand-text-secondary mb-2">
              姓名 *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 bg-brand-bg border border-gray-600 rounded-md text-brand-text focus:border-brand-primary focus:outline-none"
              placeholder="请输入您的姓名"
              autoComplete="name"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

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
            <label htmlFor="phone" className="block text-brand-text-secondary mb-2">
              手机号 <span className="text-gray-500">(可选)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 bg-brand-bg border border-gray-600 rounded-md text-brand-text focus:border-brand-primary focus:outline-none"
              placeholder="请输入手机号"
              autoComplete="tel"
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
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
              placeholder="请输入密码（至少6位，包含字母和数字）"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-brand-text-secondary mb-2">
              确认密码 *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-3 bg-brand-bg border border-gray-600 rounded-md text-brand-text focus:border-brand-primary focus:outline-none"
              placeholder="请再次输入密码"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="w-4 h-4 text-brand-primary bg-brand-bg border-gray-600 rounded focus:ring-brand-primary focus:ring-2 mt-1"
              />
              <span className="text-brand-text-secondary text-sm">
                我已阅读并同意{' '}
                <Link to="/terms" className="text-brand-primary hover:underline">
                  服务条款
                </Link>
                {' '}和{' '}
                <Link to="/privacy" className="text-brand-primary hover:underline">
                  隐私政策
                </Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-red-400 text-sm mt-1">{errors.acceptTerms}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary text-brand-bg font-bold py-3 px-6 rounded-md text-lg hover:bg-brand-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '注册中...' : '注册'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-brand-text-secondary">
            已有账户？{' '}
            <Link 
              to="/login" 
              className="text-brand-primary hover:underline font-medium"
            >
              立即登录
            </Link>
          </p>
        </div>
      </div>

      {/* 注册优势说明 */}
      <div className="mt-6 bg-brand-surface/50 p-4 rounded-lg">
        <h3 className="text-brand-text font-medium mb-2">🎯 注册即享专属权益</h3>
        <div className="grid grid-cols-2 gap-3 text-brand-text-secondary text-sm">
          <div>
            <h4 className="text-brand-primary font-medium mb-1">购物便利</h4>
            <ul className="space-y-1">
              <li>• 订单追踪管理</li>
              <li>• 收货地址保存</li>
              <li>• 购物车同步</li>
            </ul>
          </div>
          <div>
            <h4 className="text-brand-primary font-medium mb-1">专享服务</h4>
            <ul className="space-y-1">
              <li>• 会员专属优惠</li>
              <li>• 生日特惠礼品</li>
              <li>• 优先客服支持</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 text-center">
          <Link 
            to="/products"
            className="inline-block text-brand-primary hover:underline text-sm"
          >
            暂不注册，继续浏览商品 →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 