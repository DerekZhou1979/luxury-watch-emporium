import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DatabaseManager } from '../../database/database-manager';
import { User } from '../../seagull-watch-types';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  description: string;
  rating: number;
  isNew?: boolean;
  isHot?: boolean;
  discount?: number;
}

interface RecommendedProductsProps {
  user: User;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | 'trending' | 'similar' | 'new'>('all');

  const categories = [
    { id: 'all', name: '全部推荐', icon: '💎' },
    { id: 'trending', name: '热销推荐', icon: '🔥' },
    { id: 'similar', name: '相似偏好', icon: '💫' },
    { id: 'new', name: '新品推荐', icon: '✨' }
  ];

  useEffect(() => {
    loadRecommendedProducts();
  }, [user.id]);

  const loadRecommendedProducts = async () => {
    setLoading(true);
    try {
      const db = DatabaseManager.getInstance();
      const allProducts = await db.findProducts();
      
      // 模拟推荐算法：基于用户信息和产品特征生成推荐
      const recommendedProducts: Product[] = allProducts.map((product: any) => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.price * 1.2, // 模拟原价
        imageUrl: product.images && product.images.length > 0 ? product.images[0] : './images/seagull-logo.png', // 使用数据库中的第一张图片
        category: product.category,
        description: product.description,
        rating: 4.2 + Math.random() * 0.8, // 模拟评分
        isNew: Math.random() > 0.7,
        isHot: Math.random() > 0.6,
        discount: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : undefined
      })).slice(0, 12); // 限制推荐数量

      setProducts(recommendedProducts);
    } catch (error) {
      console.error('加载推荐产品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    switch (activeCategory) {
      case 'trending':
        return products.filter(p => p.isHot);
      case 'similar':
        return products.filter((_, index) => index % 3 === 0); // 模拟相似偏好
      case 'new':
        return products.filter(p => p.isNew);
      default:
        return products;
    }
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('zh-CN');
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('🌟');
    }

    return stars.join('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-gold border-t-transparent mx-auto mb-4"></div>
          <p className="text-brand-text">正在为您推荐精选好表...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-brand-text flex items-center">
          <span className="mr-3">💎</span>
          猜你喜欢
        </h2>
        <button 
          onClick={loadRecommendedProducts}
          className="px-4 py-2 bg-brand-gold text-brand-bg rounded-lg hover:bg-yellow-600 transition-colors font-medium"
        >
          🔄 换一批
        </button>
      </div>

      {/* 个性化推荐说明 */}
      <div className="bg-gradient-to-r from-brand-gold/10 to-yellow-600/10 rounded-xl p-6 mb-8 border border-brand-gold/30">
        <div className="flex items-start space-x-4">
          <span className="text-3xl">🎯</span>
          <div>
            <h3 className="text-lg font-semibold text-brand-text mb-2">专属推荐</h3>
            <p className="text-brand-text-secondary">
              基于您的购买历史、浏览偏好和个人品味，我们为您精心挑选了以下腕表。
              每一款都经过专业团队的严格筛选，确保品质与您的期待相符。
            </p>
          </div>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id as any)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              activeCategory === category.id
                ? 'bg-brand-gold text-brand-bg shadow-md'
                : 'bg-gray-700 text-brand-text-secondary hover:bg-gray-600 hover:text-brand-text'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* 产品网格 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {getFilteredProducts().map((product) => (
          <div key={product.id} className="bg-gray-800 bg-opacity-30 rounded-xl overflow-hidden border border-gray-700 hover:border-brand-gold transition-all duration-300 hover:shadow-xl group">
            {/* 产品图片 */}
            <div className="relative overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = './images/seagull-logo.png';
                }}
                loading="lazy"
              />
              
              {/* 标签 */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    新品
                  </span>
                )}
                {product.isHot && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    热销
                  </span>
                )}
                {product.discount && (
                  <span className="bg-brand-gold text-brand-bg text-xs px-2 py-1 rounded-full font-medium">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* 快速操作按钮 */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-opacity-30 transition-colors">
                  ❤️
                </button>
              </div>
            </div>

            {/* 产品信息 */}
            <div className="p-4">
              <div className="mb-2">
                <h3 className="text-brand-text font-semibold text-lg leading-tight group-hover:text-brand-gold transition-colors">
                  {product.name}
                </h3>
                <p className="text-brand-text-secondary text-sm">{product.brand}</p>
              </div>

              {/* 评分 */}
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-yellow-400 text-sm">
                  {renderStars(product.rating)}
                </span>
                <span className="text-brand-text-secondary text-sm">
                  {product.rating.toFixed(1)}
                </span>
              </div>

              {/* 价格 */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-brand-gold font-bold text-xl">
                  ¥{formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-brand-text-secondary text-sm line-through">
                    ¥{formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex space-x-2">
                <Link
                  to={`/products/${product.id}`}
                  className="flex-1 bg-brand-gold text-brand-bg py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium text-center"
                >
                  查看详情
                </Link>
                <button className="bg-gray-700 text-brand-text py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                  🛒
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {getFilteredProducts().length === 0 && (
        <div className="text-center py-16">
          <span className="text-8xl mb-6 block">🔍</span>
          <h3 className="text-xl font-semibold text-brand-text mb-2">暂无推荐产品</h3>
          <p className="text-brand-text-secondary mb-6">
            试试其他分类或稍后再来看看
          </p>
          <button
            onClick={loadRecommendedProducts}
            className="px-6 py-3 bg-brand-gold text-brand-bg rounded-lg hover:bg-yellow-600 transition-colors font-medium"
          >
            重新推荐
          </button>
        </div>
      )}

      {/* 推荐理由 */}
      {getFilteredProducts().length > 0 && (
        <div className="mt-12 bg-gray-800 bg-opacity-30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-brand-text mb-4 flex items-center">
            <span className="mr-3">🧠</span>
            推荐理由
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="text-brand-text font-medium mb-1">个人偏好分析</h4>
                <p className="text-brand-text text-sm opacity-80">
                  基于您的浏览和购买历史，推荐符合您品味的腕表
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔥</span>
              <div>
                <h4 className="text-brand-text font-medium mb-1">热门趋势</h4>
                <p className="text-brand-text text-sm opacity-80">
                  结合当前流行趋势和其他用户的购买行为
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⭐</span>
              <div>
                <h4 className="text-brand-text font-medium mb-1">品质保证</h4>
                <p className="text-brand-text text-sm opacity-80">
                  只推荐高评分和优质品牌的精选产品
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 底部行动呼吁 */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-brand-gold/20 to-yellow-600/20 rounded-xl p-6 border border-brand-gold/30">
          <span className="text-3xl">💼</span>
          <div className="text-left">
            <h4 className="text-brand-text font-semibold mb-1">找不到心仪的腕表？</h4>
            <p className="text-brand-text-secondary text-sm">浏览全部产品，发现更多精彩</p>
          </div>
          <Link
            to="/products"
            className="px-6 py-3 bg-brand-gold text-brand-bg rounded-lg hover:bg-yellow-600 transition-colors font-medium whitespace-nowrap"
          >
            查看全部
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecommendedProducts; 