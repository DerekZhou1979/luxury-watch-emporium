import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Space, 
  Typography, 
  Tabs, 
  Badge,
  notification 
} from 'antd';
import {
  ShoppingCartOutlined,
  ShareAltOutlined,
  HeartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Product, CustomizationDetails } from '../seagull-watch-types';
import { 
  CustomizableProduct, 
  CustomizationConfiguration,
  CustomizationCategory
} from '../seagull-watch-customization-types';
import { databaseProductService } from '../services/database-product-service';
import LoadingSpinner from '../components/loading-indicator';
import WatchCustomizer from '../components/watch-customizer';
import { useCart } from '../hooks/use-shopping-cart';
import { createCustomizableProduct } from '../components/customization-config';

const { Title, Text, Paragraph } = Typography;

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const [customizationConfig, setCustomizationConfig] = useState<CustomizationConfiguration | null>(null);
  const { addItem, addCustomizedItem } = useCart();
  const navigate = useNavigate();

  const fetchProductData = useCallback(async () => {
    if (!productId) {
      setError("产品ID缺失。");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProduct = await databaseProductService.getProductById(productId);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct.imageUrl); 
      } else {
        setError("产品未找到。");
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setError("加载产品详情失败，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  // 判断产品是否支持定制化
  const isCustomizable = product && (product as any).isCustomizable;



  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      notification.success({
        message: '已添加到购物车',
        description: `${product.name} 已成功添加到购物车！`,
      });
    }
  };

  const handleCustomizationChange = (config: CustomizationConfiguration) => {
    setCustomizationConfig(config);
  };

  const handleCustomAddToCart = (customization: CustomizationDetails) => {
    if (product) {
      addCustomizedItem(product, customization);
      notification.success({
        message: '定制手表已添加到购物车',
        description: '您的个性化手表已成功添加到购物车！',
      });
      navigate('/products');
    }
  };



  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner message="正在加载产品详情..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center">
        <Text type="danger" className="text-xl">{error}</Text>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card className="text-center">
        <Text type="secondary" className="text-xl">产品未找到。</Text>
      </Card>
    );
  }

  const gallery = [product.imageUrl, ...(product.galleryImages || [])].filter(Boolean) as string[];

  return (
    <div className="product-detail-page max-w-7xl mx-auto">
      {/* 第一行：产品购买信息 */}
      <div className="mb-8">
        <Card className="shadow-lg border-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* 左侧：产品信息 */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 flex-1">
              <Link 
                to={`/products?category=${encodeURIComponent(product.category)}`} 
                className="text-sm text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded-md w-fit"
              >
                {product.category}
              </Link>
              
              <Title level={2} className="mb-0 text-gray-800">{product.name}</Title>
              
              <div className="flex items-baseline space-x-2">
                <Title level={3} className="text-blue-600 mb-0 font-light">¥{product.price.toLocaleString()}</Title>
                <Text type="secondary" className="text-sm">起价（可定制）</Text>
              </div>
            </div>
            
            {/* 右侧：操作按钮 */}
            <div className="flex gap-3 lg:flex-shrink-0">
              <Button 
                type="primary"
                size="large"
                icon={<SettingOutlined />}
                onClick={handleAddToCart}
                className="h-12 text-base font-medium px-6"
              >
                立即定制
              </Button>
              <Button 
                icon={<HeartOutlined />}
                size="large"
                type="text"
                className="h-12"
              >
                收藏
              </Button>
              <Button 
                icon={<ShareAltOutlined />}
                size="large"
                type="text"
                className="h-12"
              >
                分享
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* 第二行：产品图片 + 产品完整信息 */}
      <Row gutter={[20, 20]} className="mb-6">
        {/* 左侧：产品图片 (2/5) */}
        <Col xs={24} lg={10}>
          <Card className="shadow-lg border-0 h-full flex flex-col">
            <div className="flex-1 flex flex-col">
              <div className="w-full h-96 rounded-xl overflow-hidden shadow-xl mb-4 bg-gradient-to-br from-gray-50 to-gray-100">
                <img 
                  src={selectedImage || product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
              </div>
              {gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-auto">
                  {gallery.map((imgUrl, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-md ${
                        selectedImage === imgUrl 
                          ? 'border-blue-500 ring-2 ring-blue-200 scale-105' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img src={imgUrl} alt={`${product.name} 缩略图 ${idx+1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* 右侧：产品完整信息 (3/5) */}
        <Col xs={24} lg={14}>
          {/* 完整产品信息 */}
          <Card className="shadow-lg border-0 h-full" title={
            <div className="flex items-center space-x-2">
              <span className="text-lg">📋 产品完整信息</span>
            </div>
          }>
            <Tabs 
              defaultActiveKey="description" 
              className="product-info-tabs"
              items={[
                {
                  key: 'description',
                  label: '📝 产品说明',
                  children: (
                    <div>
                      <Paragraph className="text-gray-700 mb-4 leading-relaxed">
                        {product.description}
                      </Paragraph>

                      <div className="mb-4">
                        <Title level={5} className="mb-3 text-gray-700 flex items-center">
                          <span className="mr-2">✨</span>
                          主要特色
                        </Title>
                        <ul className="space-y-3">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </span>
                              <span className="text-gray-700 font-medium">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t pt-4 bg-gray-50 -mx-6 -mb-6 px-6 pb-6 mt-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Text type="secondary" className="block">产品编号</Text>
                            <Text strong>{product.sku}</Text>
                          </div>
                          <div>
                            <Text type="secondary" className="block">库存状态</Text>
                            <Text strong className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                              {product.stock > 0 ? `${product.stock} 件可售` : '缺货'}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'specifications',
                  label: '📋 详细规格',
                  children: (
                    <div>
                      <Title level={5} className="mb-4">产品规格</Title>
                      <Row gutter={[16, 12]}>
                        <Col span={12}>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Text strong className="block text-gray-600 text-sm">品牌</Text>
                            <Text className="text-base">{product.brand}</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Text strong className="block text-gray-600 text-sm">型号</Text>
                            <Text className="text-base">{product.sku}</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Text strong className="block text-gray-600 text-sm">分类</Text>
                            <Text className="text-base">{product.category}</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Text strong className="block text-gray-600 text-sm">库存</Text>
                            <Text className="text-base">{product.stock} 件</Text>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )
                },
                {
                  key: 'shipping',
                  label: '📦 配送物流',
                  children: (
                    <div>
                      <Title level={5} className="mb-4">配送政策</Title>
                      <Row gutter={[12, 12]}>
                        <Col span={12}>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <Text strong className="text-green-700 block mb-1 text-sm">🚚 免费配送</Text>
                            <Text className="text-green-600 text-xs">订单满5000元免费配送</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <Text strong className="text-blue-700 block mb-1 text-sm">⚡ 标准配送</Text>
                            <Text className="text-blue-600 text-xs">3-5个工作日</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <Text strong className="text-purple-700 block mb-1 text-sm">🎨 定制产品</Text>
                            <Text className="text-purple-600 text-xs">15-30个工作日</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <Text strong className="text-orange-700 block mb-1 text-sm">🏔️ 偏远地区</Text>
                            <Text className="text-orange-600 text-xs">额外收取25元配送费</Text>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )
                },
                {
                  key: 'service',
                  label: '💎 服务保障',
                  children: (
                    <div>
                      <Title level={5} className="mb-4">售后服务</Title>
                      <Row gutter={[12, 12]}>
                        <Col span={12}>
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <Text strong className="text-yellow-700 block mb-1 text-sm">🏆 品质保证</Text>
                            <Text className="text-yellow-600 text-xs">所有产品均为正品，提供品牌保修</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="p-3 bg-red-50 rounded-lg">
                            <Text strong className="text-red-700 block mb-1 text-sm">🔄 退换政策</Text>
                            <Text className="text-red-600 text-xs">7天无理由退换（定制产品除外）</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="p-3 bg-indigo-50 rounded-lg">
                            <Text strong className="text-indigo-700 block mb-1 text-sm">🔧 维修服务</Text>
                            <Text className="text-indigo-600 text-xs">全国联保，专业维修中心</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="p-3 bg-cyan-50 rounded-lg">
                            <Text strong className="text-cyan-700 block mb-1 text-sm">💬 客服支持</Text>
                            <Text className="text-cyan-600 text-xs">7×24小时在线客服</Text>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )
                }
              ]}
            />
          </Card>

        </Col>
      </Row>

      {/* 第三行：实时预览 + 个性化定制区域 */}
      <Row gutter={[16, 16]} className="mb-4">
        {/* 左侧：实时预览 (2/5) */}
        <Col xs={24} lg={10}>
          <Card 
            className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50" 
            style={{ minHeight: '450px' }}
            bodyStyle={{ padding: '12px' }}
            title={
              <div className="flex items-center space-x-2">
                <span className="text-sm">👁️ 定制产品 - 实时预览</span>
                <Text type="secondary" className="text-xs">所见即所得</Text>
              </div>
            }
          >
            <div className="bg-white rounded-lg p-3">
              <div className="aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-3">
                <div className="text-center">
                  <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                    <img 
                      src={product.imageUrl} 
                      alt="预览" 
                      className="w-24 h-24 object-cover rounded-full"
                    />
                  </div>
                  <Title level={5} className="text-gray-700 mb-1">{product.name}</Title>
                  <Text type="secondary" className="text-sm">定制预览模式</Text>
                </div>
              </div>

              {/* 预览信息 */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <Text type="secondary" className="block">当前配置</Text>
                    <Text strong>标准版本</Text>
                  </div>
                  <div>
                    <Text type="secondary" className="block">定制状态</Text>
                    <Text strong className="text-green-600">可定制</Text>
                  </div>
                </div>
              </div>

              {/* 预览操作 */}
              <div className="space-y-2">
                <Button 
                  type="dashed" 
                  block 
                  size="small"
                  icon={<span>🔍</span>}
                  className="border-blue-300 text-blue-600 hover:border-blue-500"
                >
                  3D预览模式
                </Button>
                <Button 
                  type="dashed" 
                  block 
                  size="small"
                  icon={<span>📱</span>}
                  className="border-green-300 text-green-600 hover:border-green-500"
                >
                  AR试戴体验
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        {/* 右侧：个性化定制区域 (3/5) */}
        <Col xs={24} lg={14}>
          <Card 
            className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50" 
            style={{ minHeight: '450px' }}
            bodyStyle={{ padding: '12px' }}
            title={
              <div className="flex items-center">
                <span className="text-base">🎨 个人定制专区</span>
                <Badge count="NEW" className="ml-2" />
              </div>
            }
          >
            <div className="bg-white rounded-lg p-3">
              <WatchCustomizer
                product={createCustomizableProduct(product)}
                onConfigurationChange={handleCustomizationChange}
                onAddToCart={handleCustomAddToCart}
              />
            </div>
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default ProductDetailPage;
