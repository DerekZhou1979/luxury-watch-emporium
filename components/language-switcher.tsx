import React from 'react';
import { Button, Dropdown, Space } from 'antd';
import { GlobalOutlined, DownOutlined } from '@ant-design/icons';
import { useLanguage } from '../hooks/use-language';
import { supportedLanguages, SupportedLanguage } from '../i18n/translations';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (value: SupportedLanguage) => {
    setLanguage(value);
  };

  // 下拉菜单项
  const menuItems = Object.entries(supportedLanguages).map(([key, label]) => ({
    key: key as SupportedLanguage,
    label: (
      <div 
        onClick={() => handleLanguageChange(key as SupportedLanguage)}
        style={{
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: language === key ? 600 : 500,
          color: language === key ? '#3b82f6' : '#1e293b',
          background: language === key ? '#f1f5f9' : 'transparent',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        <span style={{ fontSize: '16px' }}>
          {key === 'zh' ? '🇨🇳' : '🇺🇸'}
        </span>
        <span>{label}</span>
        {language === key && (
          <span style={{ color: '#3b82f6', marginLeft: 'auto', fontSize: '14px' }}>✓</span>
        )}
      </div>
    ),
  }));

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      placement="bottomRight"
      arrow
    >
      <Button
        size="middle"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          height: '36px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #e2e8f0',
          color: '#1e293b',
          fontWeight: 500,
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#3b82f6';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <GlobalOutlined style={{ color: '#3b82f6', fontSize: '16px' }} />
        <span style={{ fontSize: '14px' }}>
          {language === 'zh' ? '🇨🇳' : '🇺🇸'}
        </span>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>
          {supportedLanguages[language]}
        </span>
        <DownOutlined style={{ color: '#64748b', fontSize: '10px' }} />
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher; 