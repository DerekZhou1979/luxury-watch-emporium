import type { ThemeConfig } from 'antd';

// 科技感淡色系主题配置 - 参考 Chrono24 风格
export const bamfordMinimalTheme: ThemeConfig = {
  token: {
    // 主色系 - 更淡的科技蓝
    colorPrimary: '#3b82f6', // 更淡的科技蓝
    colorPrimaryHover: '#2563eb',
    colorPrimaryActive: '#1d4ed8',
    
    // 背景色系 - 淡色科技感
    colorBgContainer: '#ffffff', // 纯白背景
    colorBgElevated: '#f8fafc', // 淡灰背景
    colorBgLayout: '#f1f5f9', // 更淡的灰背景
    colorBgMask: 'rgba(0, 0, 0, 0.45)',
    
    // 文字色系 - 深色文字
    colorText: '#1e293b', // 深灰文字
    colorTextSecondary: '#64748b', // 中灰文字
    colorTextTertiary: '#94a3b8', // 浅灰文字
    colorTextDescription: '#cbd5e1', // 最浅灰文字
    
    // 边框色系 - 淡色边框
    colorBorder: '#e2e8f0', // 淡灰边框
    colorBorderSecondary: '#f1f5f9', // 更淡的边框
    
    // 字体系统 - 现代科技字体
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    fontSizeHeading1: 40,
    fontSizeHeading2: 32,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    
    // 圆角系统 - 现代圆角
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // 间距系统 - 现代间距
    padding: 24,
    paddingLG: 32,
    paddingSM: 16,
    paddingXS: 8,
    
    // 阴影系统 - 微妙阴影
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    
    // 状态色系 - 现代配色
    colorSuccess: '#10b981', // 绿色
    colorWarning: '#f59e0b', // 橙色
    colorError: '#ef4444', // 红色
    colorInfo: '#3b82f6', // 蓝色
    
    // 控件高度 - 现代尺寸
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
    
    // 线条宽度
    lineWidth: 1,
    lineWidthBold: 2,
    
    // 动画配置 - 流畅过渡
    motionDurationFast: '0.15s',
    motionDurationMid: '0.25s',
    motionDurationSlow: '0.35s',
  },
  
  components: {
    // Button 组件定制 - 科技感按钮
    Button: {
      borderRadius: 8,
      fontWeight: 500,
      primaryShadow: 'none',
      defaultShadow: 'none',
      colorBgContainer: '#ffffff',
      colorBorder: '#e2e8f0',
      colorText: '#1e293b',
      colorPrimaryHover: '#2563eb',
      colorPrimaryActive: '#1d4ed8',
    },
    
    // Card 组件定制 - 科技感卡片
    Card: {
      borderRadiusLG: 12,
      boxShadowTertiary: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      headerHeight: 56,
      colorBgContainer: '#ffffff',
      headerBg: '#f8fafc',
      colorBorderSecondary: '#f1f5f9',
      colorText: '#1e293b',
    },
    
    // Input 组件定制 - 科技感输入框
    Input: {
      borderRadius: 8,
      paddingBlock: 10,
      paddingInline: 14,
      colorBgContainer: '#ffffff',
      colorBorder: '#e2e8f0',
      colorText: '#1e293b',
      colorTextPlaceholder: '#94a3b8',
      colorInfoBorderHover: '#3b82f6',
      colorInfoBorder: '#3b82f6',
    },
    
    // Menu 组件定制 - 科技感菜单
    Menu: {
      borderRadius: 8,
      colorItemBgSelected: '#3b82f6',
      colorItemTextSelected: '#ffffff',
      colorBgContainer: '#ffffff',
      colorItemBg: 'transparent',
      colorItemBgHover: '#f8fafc',
      colorItemText: '#64748b',
      colorItemTextHover: '#1e293b',
    },
    
    // Layout 组件定制 - 科技感布局
    Layout: {
      colorBgHeader: '#ffffff',
      colorBgBody: '#f1f5f9',
      colorBgTrigger: '#f8fafc',
    },
    
    // Typography 组件定制 - 科技感字体
    Typography: {
      colorText: '#1e293b',
      colorTextSecondary: '#64748b',
      colorTextDescription: '#94a3b8',
      fontFamilyCode: "'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace",
    },
    
    // Table 组件定制 - 科技感表格
    Table: {
      colorBgContainer: '#ffffff',
      colorBorderSecondary: '#f1f5f9',
      colorFillAlter: '#f8fafc',
      headerBg: '#f1f5f9',
      headerColor: '#1e293b',
      rowHoverBg: '#f8fafc',
      colorText: '#1e293b',
    },
    
    // Modal 组件定制 - 科技感弹窗
    Modal: {
      contentBg: '#ffffff',
      headerBg: '#f8fafc',
      titleColor: '#1e293b',
      borderRadiusLG: 12,
      colorText: '#1e293b',
    },
    
    // Notification 组件定制 - 科技感通知
    Notification: {
      colorBgElevated: '#ffffff',
      colorText: '#1e293b',
      colorTextHeading: '#1e293b',
      borderRadiusLG: 8,
    },
    
    // Select 组件定制 - 科技感选择器
    Select: {
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
      colorBorder: '#e2e8f0',
      borderRadius: 8,
      optionSelectedBg: '#f8fafc',
      colorText: '#1e293b',
      colorTextPlaceholder: '#94a3b8',
    },
    
    // Slider 组件定制 - 科技感滑块
    Slider: {
      colorPrimaryBorderHover: '#3b82f6',
      handleColor: '#3b82f6',
      handleActiveColor: '#2563eb',
      railBg: '#e2e8f0',
      railHoverBg: '#cbd5e1',
      trackBg: '#3b82f6',
      trackHoverBg: '#2563eb',
    },
    
    // Steps 组件定制 - 科技感步骤
    Steps: {
      colorPrimary: '#3b82f6',
      colorText: '#1e293b',
      colorTextDescription: '#64748b',
    },
    
    // Badge 组件定制 - 科技感徽章
    Badge: {
      colorBgContainer: '#3b82f6',
      colorText: '#ffffff',
    },
    
    // Drawer 组件定制 - 科技感抽屉
    Drawer: {
      colorBgElevated: '#ffffff',
      colorBgMask: 'rgba(0, 0, 0, 0.45)',
      borderRadiusLG: 12,
    },
    
    // Form 组件定制 - 科技感表单
    Form: {
      colorText: '#1e293b',
      colorTextSecondary: '#64748b',
      colorTextDescription: '#94a3b8',
    },
    
    // Alert 组件定制 - 科技感警告
    Alert: {
      colorBgContainer: '#ffffff',
      colorText: '#1e293b',
      colorTextHeading: '#1e293b',
      borderRadiusLG: 8,
    },
    
    // Divider 组件定制 - 科技感分割线
    Divider: {
      colorSplit: '#e2e8f0',
      colorText: '#94a3b8',
    },
    
    // Checkbox 组件定制 - 科技感复选框
    Checkbox: {
      colorBgContainer: '#ffffff',
      colorBorder: '#e2e8f0',
      colorPrimary: '#3b82f6',
      colorPrimaryHover: '#2563eb',
    },
    
    // Radio 组件定制 - 科技感单选框
    Radio: {
      colorBgContainer: '#ffffff',
      colorBorder: '#e2e8f0',
      colorPrimary: '#3b82f6',
      colorPrimaryHover: '#2563eb',
    },
    
    // Tabs 组件定制 - 科技感标签页
    Tabs: {
      colorBgContainer: '#ffffff',
      colorText: '#64748b',
      colorTextHeading: '#1e293b',
      colorPrimary: '#3b82f6',
      colorBorderSecondary: '#f1f5f9',
    },
    
    // Pagination 组件定制 - 科技感分页
    Pagination: {
      colorBgContainer: '#ffffff',
      colorBorder: '#e2e8f0',
      colorText: '#1e293b',
      colorPrimary: '#3b82f6',
    },
    
    // Tooltip 组件定制 - 科技感提示
    Tooltip: {
      colorBgSpotlight: '#1e293b',
      colorTextLightSolid: '#ffffff',
      borderRadius: 6,
    },
    
    // Popover 组件定制 - 科技感弹出框
    Popover: {
      colorBgElevated: '#ffffff',
      colorText: '#1e293b',
      borderRadiusLG: 8,
    },
    
    // Message 组件定制 - 科技感消息
    Message: {
      colorBgElevated: '#ffffff',
      colorText: '#1e293b',
      borderRadiusLG: 8,
    },
    
    // Spin 组件定制 - 科技感加载
    Spin: {
      colorPrimary: '#3b82f6',
      colorText: '#1e293b',
    },
    
    // Progress 组件定制 - 科技感进度条
    Progress: {
      colorBgContainer: '#f1f5f9',
      colorSuccess: '#10b981',
      colorText: '#1e293b',
    },
    
    // Rate 组件定制 - 科技感评分
    Rate: {
      colorFillContent: '#e2e8f0',
      colorFill: '#f59e0b',
    },
    
    // Switch 组件定制 - 科技感开关
    Switch: {
      colorBgContainer: '#e2e8f0',
      colorPrimary: '#3b82f6',
    },
    
    // Upload 组件定制 - 科技感上传
    Upload: {
      colorBgContainer: '#ffffff',
      colorBorder: '#e2e8f0',
      colorText: '#1e293b',
    },
    
    // Tree 组件定制 - 科技感树形控件
    Tree: {
      colorBgContainer: '#ffffff',
      colorText: '#1e293b',
      colorBorder: '#e2e8f0',
    },
    
    // Transfer 组件定制 - 科技感穿梭框
    Transfer: {
      colorBgContainer: '#ffffff',
      colorBorder: '#e2e8f0',
      colorText: '#1e293b',
    },
    
    // Cascader 组件定制 - 科技感级联选择
    Cascader: {
      colorBgContainer: '#ffffff',
      colorBorder: '#e2e8f0',
      colorText: '#1e293b',
    }
  }
};

// 导出为默认主题
export default bamfordMinimalTheme; 