import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './SeagullWatchApp';
import { CartProvider } from './hooks/use-shopping-cart';

// 确保 Ant Design 样式在自定义样式之后加载
import './antd-fix.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
