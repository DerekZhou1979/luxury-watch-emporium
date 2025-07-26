
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../hooks/use-shopping-cart';
import { useAuth } from '../hooks/use-auth';
import { useLanguage } from '../hooks/use-language';
import { BRAND_INFO } from '../seagull-brand-config';
import { ShoppingCartIcon, MenuIcon, XIcon } from './ui-icons';
import LanguageSwitcher from './language-switcher';

const Header: React.FC = () => {
  const { cart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 导航链接配置（支持多语言）
  const navigationLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.products, path: '/products' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.profile, path: '/user-center' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          {BRAND_INFO.logoSvg}
          <span className="text-2xl font-serif font-bold text-brand-text tracking-tight">{BRAND_INFO.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-brand-text-secondary hover:text-brand-primary transition-colors duration-200 ${isActive ? 'text-brand-primary font-semibold' : ''}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/* 用户菜单 */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <Link 
                to="/user-center" 
                className="text-brand-text-secondary hover:text-brand-primary transition-colors duration-200 flex items-center space-x-1"
              >
                <span>👤</span>
                <span>{t.nav.profile}，{user.name.length > 6 ? user.name.substring(0, 6) + '...' : user.name}</span>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Link 
                to="/login" 
                className="text-brand-text-secondary hover:text-brand-primary transition-colors duration-200"
              >
                {t.nav.login}
              </Link>
              <Link 
                to="/register" 
                className="bg-brand-primary text-brand-bg px-3 py-1 rounded-md text-sm hover:bg-brand-primary-dark transition-colors"
              >
                {t.nav.register}
              </Link>
            </div>
          )}
          
          {/* 语言切换器 */}
          <LanguageSwitcher />
          
          <Link to="/cart" className="relative text-brand-text-secondary hover:text-brand-primary transition-colors duration-200">
            <ShoppingCartIcon className="w-6 h-6" />
            {totalItemsInCart > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-primary text-brand-bg text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {totalItemsInCart}
              </span>
            )}
          </Link>
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-brand-text-secondary hover:text-brand-primary focus:outline-none"
            >
              {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-surface border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'text-brand-primary bg-brand-primary/10' 
                      : 'text-brand-text-secondary hover:text-brand-primary hover:bg-gray-50'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            
            {/* Mobile Auth Links */}
            {!isAuthenticated && (
              <div className="pt-2 border-t border-gray-200">
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-brand-text-secondary hover:text-brand-primary hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.nav.login}
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-brand-text-secondary hover:text-brand-primary hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
