import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/use-language';
import { DatabaseManager } from '../../database/database-manager';
import { User, Product } from '../../seagull-watch-types';
import { 
  HeartOutlined, 
  FireOutlined, 
  StarOutlined, 
  ShoppingCartOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  GiftOutlined,
  TagOutlined
} from '@ant-design/icons';

interface RecommendedProductsProps {
  user: User;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ user }) => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | 'trending' | 'similar' | 'new'>('all');

  const categories = [
    { 
      id: 'all' as const, 
      name: t.userCenter.recommendedForYou, 
      icon: HeartOutlined,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    { 
      id: 'trending' as const, 
      name: t.userCenter.trending, 
      icon: FireOutlined,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      id: 'similar' as const, 
      name: t.userCenter.basedOnHistory, 
      icon: StarOutlined,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      id: 'new' as const, 
      name: t.userCenter.newArrivals, 
      icon: GiftOutlined,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  useEffect(() => {
    loadRecommendedProducts();
  }, [user.id]);

  const loadRecommendedProducts = async () => {
    setLoading(true);
    try {
      const db = DatabaseManager.getInstance();
      const allProducts = await db.findProducts();
      
      // 将数据库产品转换为Product类型并模拟推荐算法
      const convertedProducts: Product[] = allProducts.map((dbProduct: any) => ({
        id: dbProduct.id,
        name: dbProduct.name,
        brand: dbProduct.brand,
        price: dbProduct.price,
        imageUrl: dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images[0] : './images/seagull-logo.png',
        galleryImages: dbProduct.images || [],
        description: dbProduct.description,
        shortDescription: dbProduct.description ? dbProduct.description.substring(0, 100) + '...' : '',
        features: dbProduct.features || [],
        category: dbProduct.category,
        stock: dbProduct.stock || 10,
        sku: dbProduct.sku
      }));
      
      const shuffledProducts = [...convertedProducts].sort(() => Math.random() - 0.5);
      setProducts(shuffledProducts.slice(0, 8));
    } catch (error) {
      console.error('加载推荐产品失败:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    switch (activeCategory) {
      case 'trending':
        return products.slice(0, 4);
      case 'similar':
        return products.slice(2, 6);
      case 'new':
        return products.slice(4, 8);
      default:
        return products;
    }
  };

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <HeartOutlined className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t.userCenter.recommendedForYou}</h2>
            <p className="text-gray-500 text-sm">{t.userCenter.basedOnHistory}</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/50 animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
          <HeartOutlined className="text-white text-lg" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t.userCenter.recommendedForYou}</h2>
          <p className="text-gray-500 text-sm">{t.userCenter.basedOnHistory}</p>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/50">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeCategory === category.id
                  ? `${category.bgColor} ${category.color} shadow-sm`
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <category.icon className={`text-lg ${activeCategory === category.id ? category.color : ''}`} />
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 产品列表 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getFilteredProducts().map((product) => (
          <div key={product.id} className="group bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* 产品图片 */}
            <div className="relative overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* 标签 */}
              <div className="absolute top-3 left-3 flex flex-col space-y-1">
                {Math.random() > 0.7 && (
                  <span className="inline-flex items-center px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    <FireOutlined className="mr-1 text-xs" />
                    {t.userCenter.title === '个人中心' ? '热销' : 'Hot'}
                  </span>
                )}
                {Math.random() > 0.8 && (
                  <span className="inline-flex items-center px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    <GiftOutlined className="mr-1 text-xs" />
                    {t.userCenter.title === '个人中心' ? '新品' : 'New'}
                  </span>
                )}
              </div>

              {/* 悬停操作 */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex space-x-2">
                  <Link
                    to={`/products/${product.id}`}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <EyeOutlined />
                  </Link>
                  <Link
                    to={`/customize/${product.id}`}
                    className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                  >
                    <ShoppingCartOutlined />
                  </Link>
                </div>
              </div>
            </div>

            {/* 产品信息 */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">{product.brand}</p>
              </div>

              {/* 评分 */}
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <StarOutlined
                    key={i}
                    className={`text-sm ${
                      i < Math.floor(4 + Math.random())
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-2">
                  {(4 + Math.random()).toFixed(1)}
                </span>
              </div>

              {/* 价格 */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-lg font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </div>
                  {Math.random() > 0.6 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(Math.floor(product.price * 1.2))}
                      </span>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        {t.userCenter.title === '个人中心' ? '限时优惠' : 'Sale'}
                      </span>
                    </div>
                  )}
                </div>

                <Link
                  to={`/customize/${product.id}`}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {t.userCenter.addToCustomization}
                </Link>
              </div>

              {/* 定制标签 */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-blue-600">
                  <CrownOutlined />
                  <span>{t.products.customizable}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <ThunderboltOutlined />
                  <span>{t.userCenter.title === '个人中心' ? '快速定制' : 'Quick Custom'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {getFilteredProducts().length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HeartOutlined className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {t.userCenter.title === '个人中心' ? '暂无推荐产品' : 'No recommendations yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {t.userCenter.title === '个人中心' 
              ? '浏览更多产品来获得个性化推荐' 
              : 'Browse more products to get personalized recommendations'
            }
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShoppingCartOutlined />
            <span>{t.userCenter.title === '个人中心' ? '浏览产品' : 'Browse Products'}</span>
          </Link>
        </div>
      )}

      {/* 查看更多 */}
      {getFilteredProducts().length > 0 && (
        <div className="text-center">
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            <EyeOutlined />
            <span>{t.userCenter.title === '个人中心' ? '查看全部产品' : 'View All Products'}</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecommendedProducts; 