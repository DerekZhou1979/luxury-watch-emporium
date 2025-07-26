import React from 'react';
import ReactDOM from 'react-dom/client';
import SeagullWatchApp from './SeagullWatchApp';
import { DatabaseManager } from './database/database-manager';
import { CustomizationService } from './services/customization-service';
import './public/index.css';

// 初始化数据库和定制数据
async function initializeApp() {
  try {
    console.log('🚀 启动应用初始化...');
    
    // 初始化数据库
    const db = DatabaseManager.getInstance();
    await db.initialize();
    
    // 确保定制数据已初始化
    await CustomizationService.initializeCustomizationData();
    
    console.log('✅ 应用初始化完成');
  } catch (error) {
    console.error('❌ 应用初始化失败:', error);
  }
}

// 启动应用
initializeApp().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <SeagullWatchApp />
    </React.StrictMode>,
  );
});
