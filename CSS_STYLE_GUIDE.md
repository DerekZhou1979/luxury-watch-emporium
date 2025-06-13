# 海鸥表官网 CSS 样式指南

## 概述

本项目采用统一的CSS样式管理系统，所有样式集中在 `public/index.css` 文件中。这种方式便于维护、更新和团队协作。

## 文件结构

```
luxury-watch-emporium/
├── public/
│   └── index.css          # 主要样式文件
├── index.html             # HTML入口文件
└── CSS_STYLE_GUIDE.md     # 本指南文档
```

## CSS 架构

### 1. CSS 变量系统 (CSS Custom Properties)

所有颜色、间距、字体等设计令牌都定义为CSS变量，便于全局管理和主题切换。

```css
:root {
  /* 品牌色彩 */
  --brand-primary: #D4AF37;        /* 海鸥表经典金色 */
  --brand-primary-dark: #B8860B;   /* 深金色 */
  
  /* 背景色彩 */
  --brand-bg: #1A1A1A;             /* 深色主背景 */
  --brand-surface: #2C2C2C;        /* 卡片背景 */
  
  /* 文字色彩 */
  --brand-text: #FFFFFF;            /* 主要文字颜色 */
  --brand-text-secondary: #E0E0E0;  /* 次要文字颜色 */
}
```

### 2. 组件化样式

样式按功能模块组织：
- 按钮组件 (.btn, .btn-primary, .btn-secondary)
- 卡片组件 (.card, .card-header, .card-body)
- 表单组件 (.form-input, .form-label)
- 导航组件 (.navbar, .nav-link)

### 3. 工具类系统

提供常用的工具类：
- 文字对齐: `.text-center`, `.text-left`, `.text-right`
- 字体粗细: `.font-bold`, `.font-semibold`, `.font-medium`
- 颜色: `.text-primary`, `.text-secondary`, `.bg-primary`
- 圆角: `.rounded-sm`, `.rounded-md`, `.rounded-lg`

## 使用指南

### 1. 颜色使用

```css
/* 推荐：使用CSS变量 */
.my-component {
  color: var(--brand-text);
  background-color: var(--brand-surface);
}

/* 不推荐：硬编码颜色值 */
.my-component {
  color: #FFFFFF;
  background-color: #2C2C2C;
}
```

### 2. 间距使用

```css
/* 推荐：使用预定义间距变量 */
.my-component {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

/* 不推荐：随意的间距值 */
.my-component {
  padding: 15px;
  margin-bottom: 23px;
}
```

### 3. 组件样式

```css
/* 推荐：使用现有组件类 */
<button className="btn btn-primary">点击我</button>

/* 推荐：扩展现有组件 */
.btn-custom {
  @extend .btn;
  @extend .btn-primary;
  /* 添加自定义样式 */
}
```

### 4. 响应式设计

```css
/* 移动优先的响应式设计 */
.my-component {
  padding: var(--spacing-sm);
}

@media (min-width: 640px) {
  .my-component {
    padding: var(--spacing-md);
  }
}

@media (min-width: 1024px) {
  .my-component {
    padding: var(--spacing-lg);
  }
}
```

## 主题定制

### 1. 颜色主题

要更改品牌颜色，只需修改CSS变量：

```css
:root {
  --brand-primary: #新的主色调;
  --brand-primary-dark: #新的深色调;
}
```

### 2. 字体主题

```css
:root {
  --font-sans: '新的无衬线字体', sans-serif;
  --font-serif: '新的衬线字体', serif;
}
```

### 3. 间距系统

```css
:root {
  --spacing-xs: 0.25rem;    /* 4px */
  --spacing-sm: 0.5rem;     /* 8px */
  --spacing-md: 1rem;       /* 16px */
  /* 根据需要调整 */
}
```

## 最佳实践

### 1. 命名规范

- 使用BEM命名法：`.block__element--modifier`
- 组件名使用小写字母和连字符：`.product-card`
- 状态类使用前缀：`.is-active`, `.has-error`

### 2. 样式组织

```css
/* 1. 布局属性 */
.component {
  display: flex;
  position: relative;
  
  /* 2. 盒模型属性 */
  width: 100%;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  
  /* 3. 视觉属性 */
  background-color: var(--brand-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  
  /* 4. 文字属性 */
  color: var(--brand-text);
  font-size: 1rem;
  
  /* 5. 其他属性 */
  transition: all var(--transition-normal);
}
```

### 3. 性能优化

- 避免深层嵌套选择器（最多3层）
- 使用类选择器而非标签选择器
- 合理使用CSS变量，避免重复计算

```css
/* 推荐 */
.card-title {
  color: var(--brand-text);
}

/* 不推荐 */
.card .header .title h3 {
  color: var(--brand-text);
}
```

## 维护指南

### 1. 添加新样式

1. 检查是否可以使用现有组件或工具类
2. 如需新增，按模块添加到相应部分
3. 使用CSS变量而非硬编码值
4. 添加适当的注释

### 2. 修改现有样式

1. 评估修改影响范围
2. 优先修改CSS变量而非具体样式
3. 测试所有相关组件
4. 更新文档

### 3. 删除样式

1. 确认样式未被使用
2. 使用搜索工具检查引用
3. 逐步移除，避免破坏性更改

## 调试技巧

### 1. 浏览器开发者工具

- 使用Elements面板查看应用的样式
- 使用Computed面板查看最终计算值
- 使用Sources面板编辑CSS进行实时调试

### 2. CSS变量调试

```css
/* 临时调试：显示CSS变量值 */
.debug::before {
  content: "Primary: " var(--brand-primary);
  position: fixed;
  top: 0;
  left: 0;
  background: black;
  color: white;
  padding: 10px;
  z-index: 9999;
}
```

### 3. 样式冲突解决

1. 检查选择器优先级
2. 使用更具体的选择器
3. 必要时使用 `!important`（谨慎使用）

## 常见问题

### Q: 如何添加新的颜色？
A: 在`:root`中添加新的CSS变量，然后在Tailwind配置中引用。

### Q: 如何实现暗色/亮色主题切换？
A: 使用CSS变量和媒体查询或JavaScript动态切换。

### Q: 样式没有生效怎么办？
A: 检查选择器优先级、CSS文件是否正确引入、浏览器缓存等。

### Q: 如何优化CSS性能？
A: 移除未使用的样式、合并相似规则、使用CSS压缩工具。

## 更新日志

- **v1.0.0** (2024-01-XX): 初始版本，建立基础样式系统
- 后续版本更新将在此记录

## 贡献指南

1. 遵循现有的命名规范和代码风格
2. 添加适当的注释和文档
3. 测试样式在不同设备和浏览器上的表现
4. 提交前运行样式检查工具

---

*本指南将随着项目发展持续更新，请定期查看最新版本。* 