import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 组件导入
import NavigationHeader from './components/navigation-header';
import HomeShowcase from './pages/home-showcase';
import WatchCatalog from './pages/watch-catalog';
import WatchDetailView from './pages/watch-detail-view';
import UserCenter from './pages/user-center';
import ShoppingCart from './pages/shopping-cart';
import Checkout from './pages/checkout';
import PageNotFound from './pages/page-not-found';

// 上下文和Hooks
import { AuthProvider } from './hooks/use-auth';
import { CartProvider } from './hooks/use-shopping-cart';

// 主题系统
import { ThemeProvider, ThemeSwitcher } from './components/theme-switcher';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App">
              {/* 导航栏 */}
              <NavigationHeader />
              
              {/* 主要内容区域 */}
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomeShowcase />} />
                  <Route path="/catalog" element={<WatchCatalog />} />
                  <Route path="/watch/:id" element={<WatchDetailView />} />
                  <Route path="/user-center" element={<UserCenter />} />
                  <Route path="/cart" element={<ShoppingCart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </main>
              
              {/* 主题切换器 */}
              <ThemeSwitcher />
              
              {/* 页脚（可选） */}
              <footer className="app-footer">
                <div className="container">
                  <div className="footer-content">
                    <div className="footer-section">
                      <h4>海鸥表官网</h4>
                      <p>传承经典，精工制造</p>
                    </div>
                    <div className="footer-section">
                      <h5>快速链接</h5>
                      <ul>
                        <li><a href="/catalog">产品目录</a></li>
                        <li><a href="/user-center">个人中心</a></li>
                        <li><a href="/cart">购物车</a></li>
                      </ul>
                    </div>
                    <div className="footer-section">
                      <h5>联系方式</h5>
                      <p>客服热线：400-888-8888</p>
                      <p>邮箱：service@seagullwatch.com</p>
                    </div>
                  </div>
                  <div className="footer-bottom">
                    <p>&copy; 2024 海鸥表官网. 保留所有权利.</p>
                    <div className="theme-info">
                      <span className="theme-badge">多主题体验</span>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 