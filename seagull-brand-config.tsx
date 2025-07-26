import React from 'react'; // JSX支持所需
import { BrandInfo } from './seagull-watch-types';

// API密钥错误提示信息
export const API_KEY_ERROR_MESSAGE = "API密钥错误，请检查环境变量";

// 品牌信息配置
export const BRAND_INFO: BrandInfo = {
  name: "ChronoLab",
  chineseName: "汉时辰制",
  tagline: "高级定制手表，独一无二，自研高定机芯",
  logoSvg: (
    <svg width="70" height="50" viewBox="0 0 70 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter invert brightness-200">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#C9B037', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#B8860D', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      {/* 主表盘 */}
      <circle cx="25" cy="25" r="20" fill="none" stroke="url(#logoGradient)" strokeWidth="2"/>
      <circle cx="25" cy="25" r="15" fill="none" stroke="url(#logoGradient)" strokeWidth="1" opacity="0.6"/>
      {/* 时标 */}
      <line x1="25" y1="7" x2="25" y2="11" stroke="url(#logoGradient)" strokeWidth="2"/>
      <line x1="43" y1="25" x2="39" y2="25" stroke="url(#logoGradient)" strokeWidth="2"/>
      <line x1="25" y1="43" x2="25" y2="39" stroke="url(#logoGradient)" strokeWidth="2"/>
      <line x1="7" y1="25" x2="11" y2="25" stroke="url(#logoGradient)" strokeWidth="2"/>
      {/* 指针 */}
      <line x1="25" y1="25" x2="25" y2="15" stroke="url(#logoGradient)" strokeWidth="2"/>
      <line x1="25" y1="25" x2="33" y2="19" stroke="url(#logoGradient)" strokeWidth="1.5"/>
      {/* 中心点 */}
      <circle cx="25" cy="25" r="2" fill="url(#logoGradient)"/>
      {/* 品牌名 */}
      <text x="52" y="22" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="currentColor">ChronoLab</text>
      <text x="52" y="32" fontFamily="SimSun, serif" fontSize="6" fill="currentColor" opacity="0.8">汉时辰制</text>
    </svg>
  )
};

// Gemini AI模型配置
export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_MODEL_IMAGE = 'imagen-3.0-generate-002'; // 图像生成模型（如需要）
export const GEMINI_API_KEY = 'AIzaSyC1q9AcDH4lvD4sU8ribire9S3C7kX548k';//Gemini API密钥

// 网站导航链接配置
export const NAVIGATION_LINKS = [
  { name: '首页', path: '/' },
  { name: '定制时计', path: '/products' },
  { name: '品牌故事', path: '/about' },
  { name: '个人中心', path: '/user-center' },
  // { name: '联系我们', path: '/contact' }, // 可后续添加
];

// 网站页脚链接配置
export const FOOTER_LINKS = {
  company: [
    { name: '品牌故事', path: '/about' },
    { name: '制表工艺', path: '#' }, 
    { name: '品牌资讯', path: '#' },    
  ],
  support: [
    { name: '售后服务', path: '#' },         
    { name: '联系我们', path: '#' }, 
    { name: '产品保修', path: '#' },   
  ],
  legal: [
    { name: '隐私政策', path: '#' }, 
    { name: '使用条款', path: '#' },
  ],
};
