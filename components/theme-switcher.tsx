import React, { useState, useEffect } from 'react';

// 主题类型定义
export type ThemeType = 'luxury-classic' | 'minimal-modern' | 'tech-future';

// 主题配置
const THEMES = {
  'luxury-classic': {
    name: '奢华经典',
    description: '深色背景，金色点缀，经典优雅',
    icon: '👑'
  },
  'minimal-modern': {
    name: '极简现代', 
    description: '纯白背景，简洁设计，现代感强',
    icon: '🎯'
  },
  'tech-future': {
    name: '科技绿洲',
    description: '浅绿背景，科技感强，清新自然',
    icon: '🌿'
  }
} as const;

// 主题Context
interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themes: typeof THEMES;
}

export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

// 主题Provider
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('luxury-classic');

  // 从localStorage加载主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('seagull-watch-theme') as ThemeType;
    if (savedTheme && THEMES[savedTheme]) {
      setThemeState(savedTheme);
    }
  }, []);

  // 应用主题到DOM
  useEffect(() => {
    // 移除所有主题类
    document.documentElement.removeAttribute('data-theme');
    
    // 应用新主题
    if (theme !== 'luxury-classic') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    
    // 保存到localStorage
    localStorage.setItem('seagull-watch-theme', theme);
    
    // 为系统主题检测添加类
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 使用主题的Hook
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 主题切换器组件
export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, themes } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState<ThemeType | null>(null);

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    setIsExpanded(false);
    
    // 添加轻微的触觉反馈（如果支持）
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // 显示主题切换提示
    const notification = document.createElement('div');
    notification.className = 'theme-change-notification';
    notification.textContent = `已切换到${themes[newTheme].name}主题`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--brand-surface);
      color: var(--brand-text);
      padding: 12px 20px;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      z-index: 1000;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid var(--border-color);
      animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="theme-switcher">
        {/* 主按钮 */}
        <button
          className={`theme-toggle-btn ${isExpanded ? 'expanded' : ''}`}
          onClick={toggleExpanded}
          aria-label="主题切换器"
          title="点击选择主题"
        >
          <span className="theme-icon">{themes[theme].icon}</span>
          <span className="theme-indicator">
            <span className="theme-dot"></span>
          </span>
        </button>

        {/* 主题选项 */}
        <div className={`theme-options ${isExpanded ? 'expanded' : ''}`}>
          {(Object.keys(themes) as ThemeType[]).map((themeKey) => (
            <div
              key={themeKey}
              className={`theme-option theme-${themeKey.replace('-', '-')} ${
                theme === themeKey ? 'active' : ''
              }`}
              onClick={() => handleThemeChange(themeKey)}
              onMouseEnter={() => setShowTooltip(themeKey)}
              onMouseLeave={() => setShowTooltip(null)}
              role="button" 
              tabIndex={0}
              aria-label={`切换到${themes[themeKey].name}主题`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleThemeChange(themeKey);
                }
              }}
            >
              <div className="theme-preview">
                <span className="theme-emoji">{themes[themeKey].icon}</span>
              </div>
              
              {/* 工具提示 */}
              {showTooltip === themeKey && (
                <div className="theme-tooltip">
                  <div className="tooltip-title">{themes[themeKey].name}</div>
                  <div className="tooltip-desc">{themes[themeKey].description}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 背景遮罩 */}
        {isExpanded && (
          <div 
            className="theme-switcher-backdrop" 
            onClick={() => setIsExpanded(false)}
          />
        )}
      </div>

      {/* 样式 */}
      <style>{`
        .theme-switcher {
          position: fixed;
          top: 50%;
          right: 24px;
          transform: translateY(-50%);
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .theme-toggle-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 2px solid var(--border-color);
          background: var(--brand-surface);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(10px);
        }

        .theme-toggle-btn:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-xl);
          border-color: var(--brand-primary);
        }

        .theme-toggle-btn.expanded {
          transform: scale(1.1) rotate(180deg);
          border-color: var(--brand-primary);
        }

        .theme-icon {
          font-size: 24px;
          transition: transform 0.3s ease;
        }

        .theme-indicator {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--brand-surface-light);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .theme-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--brand-primary);
          animation: pulse 2s infinite;
        }

        .theme-options {
          position: absolute;
          bottom: 70px;
          right: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .theme-options.expanded {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          pointer-events: all;
        }

        .theme-option {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          backdrop-filter: blur(10px);
        }

        .theme-option:hover {
          transform: scale(1.15);
          box-shadow: var(--shadow-lg);
        }

        .theme-option.active {
          border-color: var(--brand-primary);
          transform: scale(1.1);
          box-shadow: var(--shadow-xl);
        }

        .theme-preview {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        /* 主题特定样式 */
        .theme-luxury-classic {
          background: linear-gradient(135deg, #1A1A1A, #2C2C2C);
          color: #D4AF37;
        }

        .theme-minimal-modern {  
          background: linear-gradient(135deg, #FFFFFF, #F9FAFB);
          color: #2563EB;
          border-color: #E5E7EB;
        }

        .theme-tech-future {
          background: linear-gradient(135deg, #064E3B, #065F46);
          color: #10B981;
          position: relative;
        }

        .theme-tech-future::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(16, 185, 129, 0.2), rgba(34, 197, 94, 0.2));
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .theme-tech-future:hover::before {
          opacity: 1;
        }

        .theme-tooltip {
          position: absolute;
          right: 60px;
          top: 50%;
          transform: translateY(-50%);
          background: var(--brand-surface);
          color: var(--brand-text);
          padding: 8px 12px;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          white-space: nowrap;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .tooltip-title {
          font-weight: 600;
          font-size: 12px;
          margin-bottom: 2px;
        }

        .tooltip-desc {
          font-size: 10px;
          color: var(--brand-text-secondary);
          max-width: 150px;
        }

        .theme-switcher-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
        }

        /* 移动端适配 */
        @media (max-width: 639px) {
          .theme-switcher {
            bottom: 24px;
            right: 24px;
            top: auto;
            transform: none;
            flex-direction: row;
            align-items: flex-end;
          }

          .theme-options {
            position: absolute;
            bottom: 0;
            right: 70px;
            flex-direction: row;
            gap: 8px;
          }

          .theme-toggle-btn {
            width: 48px;
            height: 48px;
          }

          .theme-option {
            width: 40px;
            height: 40px;
          }

          .theme-tooltip {
            display: none; /* 移动端隐藏工具提示 */
          }
        }

        /* 科技绿洲主题的特殊效果 */
        :global([data-theme="tech-future"]) .theme-toggle-btn {
          background: linear-gradient(135deg, var(--brand-surface), var(--brand-surface-light));
          border-color: var(--brand-primary);
        }

        :global([data-theme="tech-future"]) .theme-toggle-btn:hover {
          box-shadow: 
            var(--shadow-xl),
            0 0 20px rgba(16, 185, 129, 0.3);
        }

        /* 主题切换动画 */
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1; 
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.2);
          }
        }
      `}</style>
    </>
  );
};

export default ThemeSwitcher; 