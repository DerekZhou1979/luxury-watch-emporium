import React from 'react';

const ImageTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">🖼️ 图片加载测试页面</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 测试1: images-minimal目录下的图片 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">📁 images-minimal/seagull-logo.png</h2>
            <div className="mb-4">
              <img 
                src="./images-minimal/seagull-logo.png" 
                alt="Logo测试" 
                className="w-full h-32 object-contain border"
                onLoad={() => console.log('✅ Logo加载成功')}
                onError={() => console.log('❌ Logo加载失败')}
              />
            </div>
            <p className="text-sm text-gray-600">相对路径: ./images-minimal/seagull-logo.png</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">📁 images-minimal/seagull_team_main.jpg</h2>
            <div className="mb-4">
              <img 
                src="./images-minimal/seagull_team_main.jpg" 
                alt="团队测试" 
                className="w-full h-32 object-cover border"
                onLoad={() => console.log('✅ 团队图片加载成功')}
                onError={() => console.log('❌ 团队图片加载失败')}
              />
            </div>
            <p className="text-sm text-gray-600">相对路径: ./images-minimal/seagull_team_main.jpg</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">📁 images-minimal/test-product.jpg</h2>
            <div className="mb-4">
              <img 
                src="./images-minimal/test-product.jpg" 
                alt="产品测试" 
                className="w-full h-32 object-cover border"
                onLoad={() => console.log('✅ 产品图片加载成功')}
                onError={() => console.log('❌ 产品图片加载失败')}
              />
            </div>
            <p className="text-sm text-gray-600">相对路径: ./images-minimal/test-product.jpg</p>
          </div>

          {/* 测试2: 原来images目录下的图片 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">📁 images/seagull-logo.png</h2>
            <div className="mb-4">
              <img 
                src="./images/seagull-logo.png" 
                alt="原Logo测试" 
                className="w-full h-32 object-contain border"
                onLoad={() => console.log('✅ 原Logo加载成功')}
                onError={() => console.log('❌ 原Logo加载失败')}
              />
            </div>
            <p className="text-sm text-gray-600">相对路径: ./images/seagull-logo.png</p>
          </div>

          {/* 测试3: 绝对路径 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">🔗 绝对路径测试</h2>
            <div className="mb-4">
              <img 
                src="/images-minimal/seagull-logo.png" 
                alt="绝对路径Logo测试" 
                className="w-full h-32 object-contain border"
                onLoad={() => console.log('✅ 绝对路径Logo加载成功')}
                onError={() => console.log('❌ 绝对路径Logo加载失败')}
              />
            </div>
            <p className="text-sm text-gray-600">绝对路径: /images-minimal/seagull-logo.png</p>
          </div>

          {/* 测试4: 带base URL的路径 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">🏠 Base URL测试</h2>
            <div className="mb-4">
              <img 
                src="/luxury-watch-emporium/images-minimal/seagull-logo.png" 
                alt="Base URL Logo测试" 
                className="w-full h-32 object-contain border"
                onLoad={() => console.log('✅ Base URL Logo加载成功')}
                onError={() => console.log('❌ Base URL Logo加载失败')}
              />
            </div>
            <p className="text-sm text-gray-600">Base URL路径: /luxury-watch-emporium/images-minimal/seagull-logo.png</p>
          </div>

        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">🔍 测试说明</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>打开浏览器开发者工具的控制台查看图片加载日志</li>
            <li>检查网络面板查看图片请求状态</li>
            <li>对比不同路径方式的加载结果</li>
            <li>验证 .nojekyll 文件是否生效</li>
          </ul>
        </div>

        <div className="mt-4 bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">📝 当前部署信息</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>网站URL: https://derekzhou1979.github.io/luxury-watch-emporium/</li>
            <li>Base路径: /luxury-watch-emporium/</li>
            <li>.nojekyll: 已添加</li>
            <li>构建工具: Vite</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImageTest; 