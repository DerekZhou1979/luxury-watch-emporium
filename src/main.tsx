import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import SeagullWatchApp from './SeagullWatchApp';
import { LanguageProvider, useLanguage } from './hooks/use-language';
import { antdTheme } from './theme/antd-theme';
import './antd-fix.css';

const AppWrapper: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <ConfigProvider 
      theme={antdTheme}
      locale={language === 'zh' ? zhCN : enUS}
    >
      <HashRouter>
        <SeagullWatchApp />
      </HashRouter>
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <AppWrapper />
    </LanguageProvider>
  </React.StrictMode>,
); 