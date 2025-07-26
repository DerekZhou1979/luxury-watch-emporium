import React from 'react';
import { ConfigProvider } from 'antd';
import { bamfordMinimalTheme } from '../theme/antd-theme';

// 简化的主题提供者 - 只使用Bamford极简主题
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 直接应用Bamford极简主题
  return (
    <ConfigProvider theme={bamfordMinimalTheme}>
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider; 