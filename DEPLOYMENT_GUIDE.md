# 🚀 海鸥表电商平台 - 部署指南

## 📋 概述

本指南将帮助你将海鸥表电商平台部署到各种托管平台，包括GitHub Pages、Vercel、Netlify等。

## 📦 构建准备

### 🔧 构建生产版本
```bash
# 安装依赖
npm install

# 构建生产版本
npm run build

# 预览构建结果（可选）
npm run preview
```

### 📁 构建输出
构建完成后，`dist/` 目录包含所有静态文件：
```
dist/
├── index.html          # 入口HTML文件
├── assets/            # 静态资源
│   ├── index-*.js     # 主应用JS文件
│   ├── index-*.css    # 样式文件
│   └── images/        # 图片资源
└── vite.svg           # Vite图标
```

## 🌐 部署平台

### 1. GitHub Pages 部署

#### 方法一：GitHub Actions 自动部署（推荐）

1. **创建GitHub仓库**
```bash
# 在GitHub上创建新仓库
# 然后推送代码
git remote add origin https://github.com/DerekZhou1979/luxury-watch-emporium.git
git branch -M main
git push -u origin main
```

2. **创建GitHub Actions工作流**
创建 `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

3. **配置GitHub Pages**
- 进入仓库 Settings → Pages
- Source 选择 "Deploy from a branch"
- Branch 选择 "gh-pages"
- 保存设置

#### 方法二：手动部署
```bash
# 构建项目
npm run build

# 使用gh-pages工具部署
npm install -g gh-pages
gh-pages -d dist
```

### 2. Vercel 部署（推荐）

#### 在线部署
1. 访问 [vercel.com](https://vercel.com)
2. 连接GitHub账户
3. 导入你的仓库
4. Vercel会自动检测为Vite项目
5. 点击Deploy，几分钟内完成部署

#### 命令行部署
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署
vercel

# 部署到生产环境
vercel --prod
```

#### Vercel配置文件 (`vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. Netlify 部署

#### 拖拽部署
1. 构建项目：`npm run build`
2. 访问 [netlify.com](https://netlify.com)
3. 将 `dist` 文件夹拖拽到部署区域

#### Git集成部署
1. 连接GitHub仓库
2. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
3. 点击Deploy site

#### Netlify配置文件 (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### 4. 阿里云OSS部署

```bash
# 安装阿里云CLI工具
npm install -g @alicloud/fun

# 配置阿里云账号
aliyun configure

# 上传到OSS
aliyun oss cp dist/ oss://your-bucket-name/ --recursive
```

### 5. 腾讯云COS部署

```bash
# 安装腾讯云CLI
npm install -g coscmd

# 配置腾讯云账号
coscmd config

# 上传文件
coscmd upload -r dist/ /
```

## 🔧 构建优化

### Vite配置优化 (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // 使用相对路径，适用于各种部署环境
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,  // 生产环境不生成sourcemap
    minify: 'terser',  // 使用terser压缩
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@tailwindcss/forms']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  preview: {
    port: 5173,
    host: true
  }
})
```

### 环境变量配置

#### 开发环境 (`.env.local`)
```bash
VITE_APP_TITLE=海鸥表电商平台（开发版）
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_ANALYTICS=false
```

#### 生产环境 (`.env.production`)
```bash
VITE_APP_TITLE=海鸥表电商平台
VITE_API_BASE_URL=https://api.seagullwatch.com
VITE_ENABLE_ANALYTICS=true
VITE_GA_ID=GA_MEASUREMENT_ID
```

## 🌍 CDN配置

### CloudFlare设置
```javascript
// _headers 文件（对于Netlify）
/*
  Cache-Control: public, max-age=31536000
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/index.html
  Cache-Control: public, max-age=0, must-revalidate

/api/*
  Cache-Control: public, max-age=300
```

### 阿里云CDN配置
```javascript
// 缓存规则
{
  "rules": [
    {
      "pathPattern": "*.html",
      "ttl": 0,
      "ignoreParams": false
    },
    {
      "pathPattern": "*.js,*.css,*.png,*.jpg,*.webp",
      "ttl": 31536000,
      "ignoreParams": true
    }
  ]
}
```

## 🔒 安全配置

### HTTPS配置
确保所有部署平台都启用HTTPS：
- GitHub Pages: 自动HTTPS
- Vercel: 自动HTTPS
- Netlify: 自动HTTPS
- 自定义域名: 需要SSL证书

### 安全头设置
```javascript
// netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
```

## 📊 性能监控

### Google Analytics集成
```typescript
// analytics.ts
export const initAnalytics = () => {
  if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', import.meta.env.VITE_GA_ID);
  }
};
```

### 性能监控
```typescript
// performance.ts
export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};
```

## 🔄 自动化部署

### GitHub Actions完整工作流
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run type-check
    - run: npm run lint
    - run: npm run build

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run build
    - name: Deploy to Staging
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
        destination_dir: staging

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run build
    - name: Deploy to Production
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🐛 故障排除

### 常见部署问题

#### 路由404错误
**问题**: SPA路由在刷新时返回404
**解决**: 配置服务器重定向所有请求到index.html

#### 资源加载失败
**问题**: CSS/JS文件404
**解决**: 检查base路径配置，确保使用相对路径

#### 环境变量未生效
**问题**: 生产环境环境变量无效
**解决**: 确保环境变量以VITE_开头，检查.env文件配置

#### 构建内存不足
**问题**: 构建时内存溢出
**解决**: 增加Node.js内存限制
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### 调试工具
```bash
# 本地预览生产构建
npm run preview

# 分析构建包大小
npm run build:analyze

# 检查构建输出
ls -la dist/
```

## 📞 技术支持

如果遇到部署问题，请：
1. 检查构建日志
2. 验证环境变量配置
3. 确认网络和权限设置
4. 在GitHub Issues中提问

---

**祝你部署成功！** 🎉

选择适合你的部署平台，按照对应步骤即可快速上线海鸥表电商平台。 