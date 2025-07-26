import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import App from './SeagullWatchApp';
import { CartProvider } from './hooks/use-shopping-cart';
import { LanguageProvider, useLanguage } from './hooks/use-language';
import antdTheme from './theme/antd-theme';

// 确保 Ant Design 样式在自定义样式之后加载
import './antd-fix.css';

const AppWrapper: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <ConfigProvider 
      theme={antdTheme}
      locale={language === 'zh' ? zhCN : enUS}
    >
      <HashRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </HashRouter>
    </ConfigProvider>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <AppWrapper />
    </LanguageProvider>
  </React.StrictMode>
);
