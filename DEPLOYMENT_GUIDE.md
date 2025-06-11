# 🚀 部署指南

## 📋 概述

通过GitHub Actions自动部署到GitHub Pages的完整流程指南。

## 🛠️ 前置要求

- GitHub账号
- Node.js ≥ 16
- Git命令行工具

## 🔧 GitHub Pages配置

### 1. 仓库设置
```bash
# 创建或推送到GitHub仓库
git init
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

### 2. 启用GitHub Pages
1. 进入仓库 → Settings → Pages
2. Source选择：GitHub Actions
3. 等待首次部署完成

## ⚙️ GitHub Actions配置

### 自动部署工作流
文件位置：`.github/workflows/deploy.yml`

```yaml
name: 🚀 Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: 📥 检出代码
        uses: actions/checkout@v4

      - name: 🔧 设置Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: 📦 安装依赖
        run: npm ci

      - name: 🔨 构建项目
        run: npm run build

      - name: 🚫 添加 .nojekyll 文件
        run: touch ./dist/.nojekyll

      - name: 📤 上传构建产物
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: 🌐 部署到GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 📁 项目配置

### Vite配置
```typescript
// vite.config.ts
export default defineConfig({
  base: mode === 'production' ? '/your-repo-name/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
```

### .gitignore设置
```gitignore
node_modules/
dist/
*.log
.DS_Store
# 注意：不要忽略public目录
```

## 🔄 部署流程

### 手动部署
```bash
# 1. 提交代码更改
git add .
git commit -m "更新内容"
git push origin main

# 2. GitHub Actions自动触发
# 3. 约2-3分钟后部署完成
```

### 本地预览
```bash
# 本地构建预览
npm run build
npm run preview
```

## 📊 部署状态检查

### GitHub Actions监控
1. 进入仓库 → Actions页面
2. 查看最新工作流状态
3. 点击查看详细日志

### 部署成功验证
```bash
# 访问部署地址
https://USERNAME.github.io/REPO_NAME/

# 检查关键页面
https://USERNAME.github.io/REPO_NAME/#/products
https://USERNAME.github.io/REPO_NAME/#/cart
```

## 🐛 常见问题

### 404错误
**问题**: 页面显示404
**解决**: 
1. 检查base路径配置
2. 确认.nojekyll文件存在
3. 使用HashRouter而非BrowserRouter

### 图片加载失败
**问题**: 图片无法显示
**解决**:
1. 检查.gitignore是否忽略了public目录
2. 确认图片路径使用相对路径
3. 验证图片文件已提交到仓库

### 构建失败
**问题**: GitHub Actions构建失败
**解决**:
1. 检查package.json依赖版本
2. 确认Node.js版本兼容性
3. 查看构建日志详细错误信息

## 🔧 高级配置

### 自定义域名
```bash
# 1. 在仓库根目录创建CNAME文件
echo "your-domain.com" > CNAME

# 2. 在域名DNS中添加CNAME记录
# 指向: USERNAME.github.io

# 3. GitHub Pages设置中配置自定义域名
```

### 环境变量
```yaml
# 在GitHub Actions中设置环境变量
env:
  VITE_APP_TITLE: "海鸥表电商平台"
  VITE_API_BASE_URL: "https://api.yourdomain.com"
```

### 部署通知
```yaml
# 添加部署完成通知
- name: 📢 部署完成通知
  run: |
    echo "✅ 部署成功"
    echo "🌐 访问地址: https://USERNAME.github.io/REPO_NAME/"
```

## 📈 性能优化

### 构建优化
```typescript
// vite.config.ts 构建优化
export default defineConfig({
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
});
```

### 缓存策略
```yaml
# GitHub Actions缓存优化
- name: 📦 安装依赖
  run: npm ci
  env:
    npm_config_cache: ~/.npm
```

## 🔒 安全考虑

### 敏感信息保护
- 不在代码中硬编码API密钥
- 使用GitHub Secrets存储敏感配置
- 定期更新依赖版本

### 访问权限
```yaml
# 最小权限原则
permissions:
  contents: read    # 只读代码
  pages: write     # 写入Pages
  id-token: write  # 身份验证
```

## 📋 部署检查清单

**部署前检查**
- [ ] 代码已提交到main分支
- [ ] package.json版本更新
- [ ] 构建命令正常运行
- [ ] 图片资源已包含

**部署后验证**
- [ ] 网站可正常访问
- [ ] 所有页面路由工作正常
- [ ] 图片和静态资源加载成功
- [ ] 移动端显示正常
- [ ] 购物车功能正常

## 📚 相关资源

- [GitHub Pages文档](https://docs.github.com/en/pages)
- [GitHub Actions文档](https://docs.github.com/en/actions)
- [Vite部署指南](https://vitejs.dev/guide/static-deploy.html)

---

**部署地址**: https://derekzhou1979.github.io/luxury-watch-emporium/
**自动化程度**: 100% - 推送代码即自动部署 