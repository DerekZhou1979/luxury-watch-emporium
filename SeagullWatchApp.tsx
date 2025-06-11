/**
 * 海鸥表电商平台 - 主应用组件
 * 
 * 这是应用的根组件，负责：
 * 1. 数据库初始化和管理
 * 2. 路由配置和管理
 * 3. 全局状态提供（认证上下文）
 * 4. 错误处理和加载状态显示
 * 
 * @author AI Assistant
 * @version 1.0.0
 */

import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/use-auth';
import { DatabaseManager } from './database/database-manager';

// 导入布局组件
import Header from './components/navigation-header';
import Footer from './components/brand-footer';

// 导入页面组件
import HomePage from './pages/home-showcase';
import ProductsPage from './pages/watch-catalog';
import ProductDetailPage from './pages/watch-detail-view';
import CartPage from './pages/shopping-cart';
import CheckoutPage from './pages/checkout';
import PaymentPage from './pages/payment';
import OrdersPage from './pages/orders';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import UserProfilePage from './pages/user-profile';
import AboutPage from './pages/brand-story';
import NotFoundPage from './pages/page-not-found';

/**
 * 主应用组件
 * 
 * 功能特性：
 * - 使用HashRouter避免服务器配置问题
 * - 数据库自动初始化和错误处理
 * - 响应式加载状态显示
 * - 全局认证状态管理
 */
const App: React.FC = () => {
  // 数据库初始化状态
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  // 数据库错误状态
  const [dbError, setDbError] = useState<string | null>(null);

  /**
   * 初始化数据库
   * 在组件挂载时自动执行，确保数据库准备就绪
   */
  useEffect(() => {
    const initDatabase = async () => {
      try {
        console.log('🔄 初始化数据库...');
        await DatabaseManager.getInstance().initialize();
        console.log('✅ 数据库初始化成功');
        setIsDbInitialized(true);
      } catch (error) {
        console.error('❌ 数据库初始化失败:', error);
        setDbError('数据库初始化失败，请刷新页面重试');
      }
    };

    initDatabase();
  }, []);

  /**
   * 数据库错误处理界面
   * 显示友好的错误信息和重试选项
   */
  if (dbError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">系统初始化失败</h1>
          <p className="text-gray-600 mb-6">{dbError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-brand-gold text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
          >
            🔄 重新加载页面
          </button>
        </div>
      </div>
    );
  }

  /**
   * 数据库初始化加载界面
   * 显示优雅的加载动画和提示信息
   */
  if (!isDbInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg">
        <div className="text-center p-8">
          {/* 加载动画 */}
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-gold border-t-transparent mb-6"></div>
          <h2 className="text-2xl font-semibold text-brand-navy mb-2">🕰️ 正在初始化海鸥表系统</h2>
          <p className="text-gray-600">正在加载产品数据和用户信息...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="h-2 w-2 bg-brand-gold rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="h-2 w-2 bg-brand-gold rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="h-2 w-2 bg-brand-gold rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * 主应用渲染
   * 包含完整的路由配置和布局结构
   */
  return (
    <HashRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-brand-bg">
          {/* 页面头部导航 */}
          <Header />
          
          {/* 主要内容区域 */}
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* 首页 */}
              <Route path="/" element={<HomePage />} />
              
              {/* 产品相关页面 */}
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:productId" element={<ProductDetailPage />} />
              
              {/* 购物流程页面 */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment/:orderId" element={<PaymentPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:orderId" element={<OrdersPage />} />
              
              {/* 用户认证页面 */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              
              {/* 品牌信息页面 */}
              <Route path="/about" element={<AboutPage />} />
              
              {/* 404错误页面 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          
          {/* 页面底部 */}
          <Footer />
        </div>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
