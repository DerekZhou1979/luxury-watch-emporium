# Google API 配置指南

## 📍 配置位置

### 1. 环境变量文件 (.env)

在项目根目录创建 `.env` 文件：

```bash
# Google Gemini API 配置
GEMINI_API_KEY=your_api_key_here

# 开发环境配置
NODE_ENV=development
```

### 2. Vite 配置文件 (vite.config.ts)

当前配置位置：`luxury-watch-emporium/vite.config.ts`

```typescript
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      // ... 其他配置
    };
});
```

### 3. AI 服务文件 (services/ai-content-service.ts)

API密钥使用位置：`luxury-watch-emporium/services/ai-content-service.ts`

```typescript
const API_KEY = process.env.API_KEY;

if (API_KEY && API_KEY.trim() !== "") {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
  }
}
```

## 🔑 获取 Google Gemini API 密钥

1. 访问：https://makersuite.google.com/app/apikey
2. 登录您的 Google 账户
3. 点击 "Create API Key"
4. 复制生成的API密钥

## ⚙️ 配置步骤

### 本地开发环境

1. **创建 .env 文件**
   ```bash
   cd luxury-watch-emporium
   touch .env
   ```

2. **编辑 .env 文件**
   ```bash
   # 使用您的实际API密钥替换 your_api_key_here
   GEMINI_API_KEY=AIzaSyC1q9AcDH4lvD4sU8ribire9S3C7kX548k
   ```

3. **重启开发服务器**
   ```bash
   npm run dev
   ```

### 生产环境 (GitHub Pages)

由于GitHub Pages是静态托管，API密钥会在构建时被嵌入到代码中。

**方法1：GitHub Secrets (推荐)**

1. 进入GitHub仓库设置
2. 点击 "Settings" → "Secrets and variables" → "Actions"
3. 添加新的Repository Secret：
   - Name: `GEMINI_API_KEY`
   - Value: 您的API密钥

4. 修改GitHub Actions工作流（如果有）

**方法2：本地构建部署**

1. 在本地 `.env` 文件中设置API密钥
2. 运行构建命令：
   ```bash
   npm run build
   npm run deploy
   ```

## 🔒 安全注意事项

1. **永远不要将 .env 文件提交到Git**
   - 确保 `.gitignore` 包含 `.env`

2. **API密钥权限管理**
   - 在Google Cloud Console中限制API密钥的使用范围
   - 设置HTTP引用限制

3. **定期轮换密钥**
   - 定期更新API密钥以提高安全性

## 🧪 测试配置

运行以下命令测试API配置：

```bash
# 启动开发服务器
npm run dev

# 在浏览器中访问产品详情页
# 查看是否有AI生成的产品描述
```

## 🔧 故障排除

### 常见问题

1. **API密钥无效**
   - 检查密钥是否正确复制
   - 确认API密钥在Google Console中已启用

2. **环境变量未加载**
   - 确认 `.env` 文件在项目根目录
   - 重启开发服务器

3. **生产环境API不工作**
   - 检查构建时环境变量是否正确传递
   - 查看浏览器控制台错误信息

### 调试命令

```bash
# 检查环境变量
echo $GEMINI_API_KEY

# 查看构建输出
npm run build -- --debug

# 检查生产构建
npm run preview
```

## 📝 相关文件

- `.env` - 环境变量配置
- `vite.config.ts` - Vite构建配置
- `services/ai-content-service.ts` - AI服务实现
- `seagull-brand-config.tsx` - 品牌配置
- `.gitignore` - Git忽略文件配置

## 🌐 API 使用范围

当前项目中Google Gemini API用于：

- 生成产品的创意描述
- AI驱动的产品推荐文案
- 智能内容生成功能

---

**注意：** 请确保遵守Google API的使用条款和配额限制。 