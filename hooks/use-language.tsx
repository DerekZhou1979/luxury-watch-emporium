import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, getTranslations, Translations } from '../i18n/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: Translations;
  formatString: (str: string, params: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // 从localStorage获取保存的语言设置，默认为中文
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'zh') ? saved : 'zh';
  });

  // 更新语言设置并保存到localStorage
  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // 获取当前语言的翻译对象
  const t = getTranslations(language);

  // 格式化字符串函数，支持变量替换
  const formatString = (str: string, params: Record<string, string | number> = {}): string => {
    return str.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        t, 
        formatString 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// 使用语言Hook
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default useLanguage; 