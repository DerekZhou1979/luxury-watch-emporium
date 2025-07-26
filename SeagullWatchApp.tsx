/*
 * 汉时辰制ChronoLab电商平台主应用
 * 
 * 这是整个网站的主入口组件，负责路由配置、主题设置、以及全局状态管理。
 * 整合了产品展示、购物车、用户认证、多语言等核心功能。
 */

import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-switcher-new';
import { AuthProvider } from './hooks/use-auth';
import { LanguageProvider } from './hooks/use-language';
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
import UserCenterPage from './pages/user-center';
import AboutPage from './pages/brand-story';
import NotFoundPage from './pages/page-not-found';
import AntdTest from './components/antd-test';
import LoadingSpinner from './components/loading-indicator';

// 延迟加载组件
const LazyCustomizer = React.lazy(() => import('./components/watch-customizer'));

/**
 * 主应用组件 - HashRouter路由，数据库初始化，认证管理，主题系统
 */
const App: React.FC = () => {
  // 数据库初始化状态
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  // 数据库错误状态
  const [dbError, setDbError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 数据库初始化
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

  // 模拟应用初始化
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 模拟一些初始化工作
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error("应用初始化失败:", error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // 数据库错误处理界面
  if (dbError) {
    return (
      <LanguageProvider>
        <ThemeProvider>
          <div className="flex items-center justify-center min-h-screen bg-red-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-red-600 mb-4">系统初始化失败</h1>
              <p className="text-gray-600 mb-6">{dbError}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 bg-brand-primary text-brand-bg rounded-lg hover:bg-brand-primary-dark transition-all duration-200 font-medium"
              >
                🔄 重新加载页面
              </button>
            </div>

          </div>
        </ThemeProvider>
      </LanguageProvider>
    );
  }

  // 如果应用正在加载，显示加载界面
  if (isLoading) {
    return (
      <LanguageProvider>
        <ThemeProvider>
          <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#f1f5f9' }}>
            <div className="text-center p-8">
              {/* 加载动画 */}
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="h-2 w-2 bg-brand-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="h-2 w-2 bg-brand-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="h-2 w-2 bg-brand-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
              <h2 className="text-xl font-semibold text-brand-text mb-2">汉时辰制ChronoLab官网</h2>
              <p className="text-brand-text-secondary">正在为您加载精品时计...</p>
            </div>
          </div>
        </ThemeProvider>
      </LanguageProvider>
    );
  }

  // 数据库初始化加载界面
  if (!isDbInitialized) {
    return (
      <ThemeProvider>
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#f1f5f9' }}>
          <div className="text-center p-8">
            {/* 加载动画 */}
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-primary border-t-transparent mb-6"></div>
            <h2 className="text-2xl font-semibold text-brand-text mb-2">🕰️ 正在初始化汉时辰制ChronoLab系统</h2>
            <p className="text-brand-text-secondary">正在加载产品数据和用户信息...</p>
            <div className="mt-4 flex justify-center space-x-1">
              <div className="h-2 w-2 bg-brand-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="h-2 w-2 bg-brand-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="h-2 w-2 bg-brand-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>

        </div>
      </ThemeProvider>
    );
  }

  // 主应用路由和布局
  return (
    <LanguageProvider>
      <ThemeProvider>
        <HashRouter>
          <AuthProvider>
            <div className="App flex flex-col min-h-screen" style={{ backgroundColor: '#f1f5f9' }}>
              {/* 页面头部导航 */}
              <Header />
              
              {/* 主要内容区域 */}
              <main className="main-content flex-grow container mx-auto px-4 py-8">
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
                  <Route path="/user-center" element={<UserCenterPage />} />
                  
                  {/* 品牌信息页面 */}
                  <Route path="/about" element={<AboutPage />} />
                  
                  {/* Ant Design 测试页面 */}
                  <Route path="/antd-test" element={<AntdTest />} />
                  
                  {/* 产品定制页面 - 暂时重定向到产品详情页 */}
                  <Route 
                    path="/customize/:productId" 
                    element={<ProductDetailPage />}
                  />
                  
                  {/* 404错误页面 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              
              {/* 页面底部 */}
              <Footer />
            </div>
          </AuthProvider>
        </HashRouter>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
