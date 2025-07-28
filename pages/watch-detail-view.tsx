import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Image,
  Typography, 
  Space,
  Tag,
  Divider,
  message,
  Steps,
  Modal,
  Progress,
  Tabs
} from 'antd';
import {
  HeartOutlined,
  EyeOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SettingOutlined,
  ShoppingCartOutlined
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
import { useLanguage } from '../hooks/use-language';
import { CustomizationMultiLangService } from '../services/customization-multilang-service';

const { Title, Text, Paragraph } = Typography;

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const [customizationConfig, setCustomizationConfig] = useState<CustomizationConfiguration | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  
  // 实时预览状态
  const [previewRotation, setPreviewRotation] = useState(0);
  
  // 定制步骤状态
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // 扩展预览配置，添加秒针和机芯
  const [previewConfig, setPreviewConfig] = useState({
    case: 'steel',
    dial: 'white', 
    hands: 'classic',
    secondHand: 'classic', // 新增秒针样式
    movement: 'automatic', // 新增机芯类型
    strap: 'leather'
  });
  
  // 先初始化hooks
  const { addItem, addCustomizedItem } = useCart();
  const { t } = useLanguage();

  // 新增确认定制状态
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 使用多语言服务生成定制步骤配置
  const customizationSteps = useMemo(() => {
    const language = t.userCenter?.title === '个人中心' ? 'zh' : 'en';
    const categories = CustomizationMultiLangService.getCategories();
    
    return categories.map(category => ({
      id: category.id,
      title: CustomizationMultiLangService.getLocalizedCategoryTitle(category, language),
      icon: category.icon,
      description: CustomizationMultiLangService.getLocalizedCategoryDescription(category, language),
      options: CustomizationMultiLangService.getOptionsByCategory(category.id).map(option => ({
        value: option.value,
        name: CustomizationMultiLangService.getLocalizedName(option, language),
        desc: CustomizationMultiLangService.getLocalizedDesc(option, language),
        price: option.price,
        icon: option.icon,
        popular: option.popular
      }))
    }));
  }, [t.userCenter?.title]);

  // 计算累计价格
  const calculateStepPrice = useCallback((stepId: string, value: string) => {
    const step = customizationSteps.find(s => s.id === stepId);
    const option = step?.options.find(o => o.value === value);
    return option?.price || 0;
  }, [customizationSteps]);

  const totalCustomizationPrice = useMemo(() => {
    if (!product) return 0;
    let total = product.price;
    
    Object.entries(previewConfig).forEach(([key, value]) => {
      if (key !== 'strap') { // 表带不在这5个步骤中
        total += calculateStepPrice(key, value);
      }
    });
    
    return total;
  }, [product, previewConfig, calculateStepPrice]);

  // 处理步骤选择 - 移除自动跳转
  const handleStepSelection = useCallback((stepId: string, value: string) => {
    setPreviewConfig(prev => ({
      ...prev,
      [stepId]: value
    }));
    
    // 标记当前步骤为完成
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    
    // 移除自动跳转逻辑，只通过按钮跳转
    // if (currentStep < customizationSteps.length - 1) {
    //   setTimeout(() => {
    //     setCurrentStep(prev => prev + 1);
    //   }, 300);
    // }
  }, [currentStep, completedSteps]);

  // 步骤导航
  const goToStep = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
  }, []);
  
  // 计算预览价格
  const previewPrice = useMemo(() => {
    if (!product) return 0;
    let totalPrice = product.price;
    
    // 表壳价格
    if (previewConfig.case === 'gold') totalPrice += 4200;
    else if (previewConfig.case === 'titanium') totalPrice += 1500;
    
    // 表盘价格
    if (previewConfig.dial === 'black') totalPrice += 200;
    else if (previewConfig.dial === 'blue') totalPrice += 300;
    
    // 指针价格
    if (previewConfig.hands === 'luminous') totalPrice += 800;
    else if (previewConfig.hands === 'gold') totalPrice += 1200;
    
    // 秒针价格
    if (previewConfig.secondHand === 'colored') totalPrice += 150;
    else if (previewConfig.secondHand === 'diamond') totalPrice += 2800;
    
    // 机芯价格
    if (previewConfig.movement === 'manual') totalPrice += 500;
    else if (previewConfig.movement === 'tourbillon') totalPrice += 15000;
    
    // 表带价格
    if (previewConfig.strap === 'metal') totalPrice += 1500;
    else if (previewConfig.strap === 'rubber') totalPrice += 300;
    
    return totalPrice;
  }, [product, previewConfig]);
  
  // 处理预览配置变化
  const handlePreviewChange = useCallback((category: string, value: string) => {
    setPreviewConfig(prev => ({
      ...prev,
      [category]: value
    }));
  }, []);

  // 数据获取函数
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
      message.success({
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
      message.success({
        message: '定制手表已添加到购物车',
        description: '您的个性化手表已成功添加到购物车！',
      });
      Link('/products');
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
                <Text type="secondary" className="text-sm">
                  {t.userCenter.title === '个人中心' ? '起价（可定制）' : 'Starting from (Customizable)'}
                </Text>
              </div>
            </div>
            
            {/* 右侧：操作按钮 */}
            <div className="flex gap-3 lg:flex-shrink-0">
              <Button 
                type="primary"
                size="large"
                icon={<SettingOutlined />}
                onClick={() => setIsCustomizerOpen(true)}
                className="h-12 text-base font-medium px-6"
              >
                {t.userCenter.title === '个人中心' ? '立即定制' : 'Start Customization'}
              </Button>
              <Button 
                icon={<HeartOutlined />}
                size="large"
                type="text"
                className="h-12"
              >
                {t.userCenter.title === '个人中心' ? '收藏' : 'Favorite'}
              </Button>
              <Button 
                icon={<EyeOutlined />}
                size="large"
                type="text"
                className="h-12"
              >
                {t.userCenter.title === '个人中心' ? '分享' : 'Share'}
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
              <span className="text-lg">📋 {t.userCenter.title === '个人中心' ? '产品完整信息' : 'Product Information'}</span>
            </div>
          }>
            <Tabs 
              defaultActiveKey="description" 
              className="product-info-tabs"
              items={[
                {
                  key: 'description',
                  label: `📝 ${t.userCenter.title === '个人中心' ? '产品说明' : 'Product Description'}`,
                  children: (
                    <div>
                      <Paragraph className="text-gray-700 mb-4 leading-relaxed">
                        {product.description}
                      </Paragraph>

                      <div className="mb-4">
                        <Title level={5} className="mb-3 text-gray-700 flex items-center">
                          <span className="mr-2">✨</span>
                          {t.userCenter.title === '个人中心' ? '主要特色' : 'Key Features'}
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
                            <Text type="secondary" className="block">
                              {t.userCenter.title === '个人中心' ? '产品编号' : 'Product SKU'}
                            </Text>
                            <Text strong>{product.sku}</Text>
                          </div>
                          <div>
                            <Text type="secondary" className="block">
                              {t.userCenter.title === '个人中心' ? '库存状态' : 'Stock Status'}
                            </Text>
                            <Text strong className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                              {product.stock > 0 
                                ? (t.userCenter.title === '个人中心' ? `${product.stock} 件可售` : `${product.stock} Available`)
                                : (t.userCenter.title === '个人中心' ? '缺货' : 'Out of Stock')
                              }
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'specifications',
                  label: `📋 ${t.userCenter.title === '个人中心' ? '详细规格' : 'Specifications'}`,
                  children: (
                    <div>
                      <Title level={5} className="mb-4">
                        {t.userCenter.title === '个人中心' ? '产品规格' : 'Product Specifications'}
                      </Title>
                      <Row gutter={[16, 12]}>
                        <Col span={12}>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Text strong className="block text-gray-600 text-sm">
                              {t.userCenter.title === '个人中心' ? '品牌' : 'Brand'}
                            </Text>
                            <Text className="text-base">{product.brand}</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Text strong className="block text-gray-600 text-sm">
                              {t.userCenter.title === '个人中心' ? '型号' : 'Model'}
                            </Text>
                            <Text className="text-base">{product.sku}</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Text strong className="block text-gray-600 text-sm">
                              {t.userCenter.title === '个人中心' ? '分类' : 'Category'}
                            </Text>
                            <Text className="text-base">{product.category}</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Text strong className="block text-gray-600 text-sm">
                              {t.userCenter.title === '个人中心' ? '库存' : 'Stock'}
                            </Text>
                            <Text className="text-base">
                              {t.userCenter.title === '个人中心' ? `${product.stock} 件` : `${product.stock} Units`}
                            </Text>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )
                },
                {
                  key: 'shipping',
                  label: `📦 ${t.userCenter.title === '个人中心' ? '配送物流' : 'Shipping & Logistics'}`,
                  children: (
                    <div>
                      <Title level={5} className="mb-4">
                        {t.userCenter.title === '个人中心' ? '配送政策' : 'Shipping Policy'}
                      </Title>
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
                  label: `💎 ${t.userCenter.title === '个人中心' ? '服务保障' : 'Service Guarantee'}`,
                  children: (
                    <div>
                      <Title level={5} className="mb-4">
                        {t.userCenter.title === '个人中心' ? '售后服务' : 'After-sales Service'}
                      </Title>
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

      {/* 集成定制区域 - 分步骤定制 */}
      {product && (
        <Card 
          className="shadow-lg border-0 mt-6" 
          title={
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎨</span>
              <div>
                <span className="text-xl font-bold text-gray-800">{t.userCenter.title === '个人中心' ? '专属定制工坊 - 打造独一无二的专属手表' : 'Exclusive Customization Studio'}</span>
              </div>
            </div>
          }
        >
          <div className="customization-stepper">
            <Row gutter={32}>
              {/* 左侧：3D实时预览 */}
              <Col xs={24} lg={11}>
                <div className="preview-section">
                  <Card 
                    title={
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">👁️</span>
                          <span>{t.userCenter.title === '个人中心' ? '实时预览' : 'Live Preview'}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            type="text" 
                            size="small"
                            icon={<RotateLeftOutlined />}
                            onClick={() => setPreviewRotation(prev => prev - 30)}
                            className="text-gray-600 hover:text-blue-600"
                            title={t.userCenter.title === '个人中心' ? '向左旋转' : 'Rotate Left'}
                          />
                          <Button 
                            type="text" 
                            size="small"
                            icon={<RotateRightOutlined />}
                            onClick={() => setPreviewRotation(prev => prev + 30)}
                            className="text-gray-600 hover:text-blue-600"
                            title={t.userCenter.title === '个人中心' ? '向右旋转' : 'Rotate Right'}
                          />
                        </div>
                      </div>
                    }
                    className="h-full"
                  >
                    {/* 3D预览区域 - 保持现有样式 */}
                    <div 
                      className="preview-container"
                      style={{
                        height: '320px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* 手表预览组件保持不变 */}
                      <div 
                        className="watch-preview" 
                        style={{ 
                          position: 'relative',
                          transform: `rotateY(${previewRotation}deg) rotateX(10deg)`,
                          transformStyle: 'preserve-3d',
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        {/* 表带上部 */}
                        <div style={{
                          position: 'absolute',
                          top: '-60px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '30px',
                          height: '80px',
                          background: previewConfig.strap === 'metal' 
                            ? 'linear-gradient(0deg, #a0a0a0, #c0c0c0)' 
                            : previewConfig.strap === 'rubber' 
                            ? 'linear-gradient(0deg, #2d2d2d, #404040)'
                            : 'linear-gradient(0deg, #8b4513, #a0522d)',
                          borderRadius: '15px 15px 8px 8px',
                          zIndex: 1
                        }} />
                        
                        {/* 表带下部 */}
                        <div style={{
                          position: 'absolute',
                          bottom: '-60px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '30px',
                          height: '80px',
                          background: previewConfig.strap === 'metal' 
                            ? 'linear-gradient(0deg, #a0a0a0, #c0c0c0)' 
                            : previewConfig.strap === 'rubber' 
                            ? 'linear-gradient(0deg, #2d2d2d, #404040)'
                            : 'linear-gradient(0deg, #8b4513, #a0522d)',
                          borderRadius: '8px 8px 15px 15px',
                          zIndex: 1
                        }} />

                        {/* 表壳 */}
                        <div style={{
                          width: '130px',
                          height: '130px',
                          borderRadius: '50%',
                          background: 
                            previewConfig.case === 'gold' ? 'linear-gradient(145deg, #f4d03f, #d4ac0d)' :
                            previewConfig.case === 'titanium' ? 'linear-gradient(145deg, #bdc3c7, #95a5a6)' :
                            previewConfig.case === 'platinum' ? 'linear-gradient(145deg, #e5e7eb, #d1d5db)' :
                            previewConfig.case === 'carbon' ? 'linear-gradient(145deg, #1f2937, #111827)' :
                            previewConfig.case === 'ceramic' ? 'linear-gradient(145deg, #f9fafb, #f3f4f6)' :
                            'linear-gradient(145deg, #e8e8e8, #c0c0c0)',
                          border: '4px solid #a8a8a8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                        }}>
                          {/* 表盘 */}
                          <div style={{
                            width: '90px',
                            height: '90px',
                            borderRadius: '50%',
                            background: previewConfig.dial === 'black' 
                              ? '#1a1a1a' 
                              : previewConfig.dial === 'blue' 
                              ? 'linear-gradient(135deg, #3b82f6, #1e40af)'
                              : previewConfig.dial === 'green' 
                              ? 'linear-gradient(135deg, #10b981, #047857)'
                              : previewConfig.dial === 'silver' 
                              ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                              : previewConfig.dial === 'champagne' 
                              ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                              : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            boxShadow: 'inset 0 0 15px rgba(0,0,0,0.1)'
                          }}>
                            {/* 时针 */}
                            <div style={{
                              position: 'absolute',
                              width: '2px',
                              height: '25px',
                              background: previewConfig.hands === 'luminous' 
                                ? '#00ff88' 
                                : previewConfig.hands === 'gold' 
                                ? '#ffd700'
                                : previewConfig.hands === 'diamond' 
                                ? '#ff69b4'
                                : previewConfig.hands === 'skeleton' 
                                ? '#666'
                                : previewConfig.hands === 'blued' 
                                ? '#1e40af'
                                : '#333',
                              borderRadius: '1px',
                              transformOrigin: 'bottom center',
                              transform: 'rotate(45deg)',
                              bottom: '50%',
                              boxShadow: previewConfig.hands === 'luminous' ? '0 0 6px #00ff88' : 
                                         previewConfig.hands === 'diamond' ? '0 0 6px #ff69b4' : 'none'
                            }} />
                            {/* 分针 */}
                            <div style={{
                              position: 'absolute',
                              width: '1px',
                              height: '35px',
                              background: previewConfig.hands === 'luminous' 
                                ? '#00ff88' 
                                : previewConfig.hands === 'gold' 
                                ? '#ffd700'
                                : previewConfig.hands === 'diamond' 
                                ? '#ff69b4'
                                : previewConfig.hands === 'skeleton' 
                                ? '#666'
                                : previewConfig.hands === 'blued' 
                                ? '#1e40af'
                                : '#333',
                              borderRadius: '0.5px',
                              transformOrigin: 'bottom center',
                              transform: 'rotate(120deg)',
                              bottom: '50%',
                              boxShadow: previewConfig.hands === 'luminous' ? '0 0 6px #00ff88' : 
                                         previewConfig.hands === 'diamond' ? '0 0 6px #ff69b4' : 'none'
                            }} />
                            {/* 秒针 */}
                            <div style={{
                              position: 'absolute',
                              width: '0.5px',
                              height: '40px',
                              background: previewConfig.secondHand === 'colored' 
                                ? '#ff4444' 
                                : previewConfig.secondHand === 'diamond' 
                                ? '#ff69b4'
                                : previewConfig.secondHand === 'luminous' 
                                ? '#00ff88'
                                : previewConfig.secondHand === 'arrow' 
                                ? '#f97316'
                                : previewConfig.secondHand === 'counterweight' 
                                ? '#8b5cf6'
                                : '#666',
                              borderRadius: '0.25px',
                              transformOrigin: 'bottom center',
                              transform: 'rotate(200deg)',
                              bottom: '50%',
                              boxShadow: previewConfig.secondHand === 'diamond' ? '0 0 4px #ff69b4' :
                                         previewConfig.secondHand === 'luminous' ? '0 0 4px #00ff88' : 'none'
                            }} />
                            {/* 中心点 */}
                            <div style={{
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              background: previewConfig.hands === 'luminous' 
                                ? '#00ff88' 
                                : previewConfig.hands === 'gold' 
                                ? '#ffd700'
                                : previewConfig.hands === 'diamond' 
                                ? '#ff69b4'
                                : '#333',
                              boxShadow: previewConfig.hands === 'luminous' ? '0 0 4px #00ff88' :
                                         previewConfig.hands === 'diamond' ? '0 0 4px #ff69b4' : 'none'
                            }} />

                            {/* 机芯类型的视觉效果 */}
                            {/* 陀飞轮 - 6点位置小窗口 */}
                            {previewConfig.movement === 'tourbillon' && (
                              <div style={{
                                position: 'absolute',
                                bottom: '12px',
                                width: '16px',
                                height: '16px',
                                border: '1px solid #666',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <div style={{
                                  width: '10px',
                                  height: '10px',
                                  border: '1px solid #333',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(45deg, transparent 40%, #666 40%, #666 60%, transparent 60%)',
                                  animation: 'spin 3s linear infinite'
                            }} />
                          </div>
                            )}

                            {/* 计时机芯 - 副表盘 */}
                            {previewConfig.movement === 'chronograph' && (
                              <>
                                <div style={{
                                  position: 'absolute',
                                  top: '8px',
                                  width: '8px',
                                  height: '8px',
                                  border: '1px solid #666',
                                  borderRadius: '50%',
                                  background: 'rgba(255,255,255,0.3)'
                                }} />
                                <div style={{
                                  position: 'absolute',
                                  left: '8px',
                                  width: '8px',
                                  height: '8px',
                                  border: '1px solid #666',
                                  borderRadius: '50%',
                                  background: 'rgba(255,255,255,0.3)'
                                }} />
                                <div style={{
                                  position: 'absolute',
                                  right: '8px',
                                  width: '8px',
                                  height: '8px',
                                  border: '1px solid #666',
                                  borderRadius: '50%',
                                  background: 'rgba(255,255,255,0.3)'
                                }} />
                              </>
                            )}

                            {/* GMT - 额外的24小时指针 */}
                            {previewConfig.movement === 'gmt' && (
                              <div style={{
                                position: 'absolute',
                                width: '1px',
                                height: '30px',
                                background: '#ff6b35',
                                borderRadius: '0.5px',
                                transformOrigin: 'bottom center',
                                transform: 'rotate(220deg)',
                                bottom: '50%',
                                boxShadow: '0 0 3px #ff6b35'
                              }} />
                            )}

                            {/* 万年历 - 复杂表盘刻度 */}
                            {previewConfig.movement === 'perpetual' && (
                              <>
                                {/* 月份显示窗口 */}
                                <div style={{
                                  position: 'absolute',
                                  top: '6px',
                                  width: '12px',
                                  height: '6px',
                                  background: previewConfig.dial === 'black' ? '#333' : '#fff',
                                  border: '1px solid #666',
                                  borderRadius: '2px',
                                  fontSize: '4px',
                                  color: previewConfig.dial === 'black' ? '#fff' : '#333',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <span style={{ fontSize: '3px' }}>12</span>
                        </div>
                                {/* 日期显示窗口 */}
                                <div style={{
                                  position: 'absolute',
                                  right: '6px',
                                  width: '8px',
                                  height: '6px',
                                  background: previewConfig.dial === 'black' ? '#333' : '#fff',
                                  border: '1px solid #666',
                                  borderRadius: '2px',
                                  fontSize: '4px',
                                  color: previewConfig.dial === 'black' ? '#fff' : '#333',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <span style={{ fontSize: '3px' }}>28</span>
                                </div>
                              </>
                            )}

                            {/* 手动上链 - 表冠装饰 */}
                            {previewConfig.movement === 'manual' && (
                              <div style={{
                                position: 'absolute',
                                right: '-6px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '4px',
                                height: '8px',
                                background: 'linear-gradient(90deg, #c0c0c0, #a0a0a0)',
                                borderRadius: '0 2px 2px 0',
                                border: '1px solid #888'
                              }} />
                            )}

                            {/* 时间刻度 - 所有机芯都有，但样式略有不同 */}
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(hour => (
                              <div
                                key={hour}
                                style={{
                                  position: 'absolute',
                                  width: previewConfig.movement === 'perpetual' ? '1px' : '0.5px',
                                  height: previewConfig.movement === 'perpetual' ? '8px' : '6px',
                                  background: previewConfig.dial === 'black' ? '#fff' : '#333',
                                  transformOrigin: 'bottom center',
                                  transform: `rotate(${hour * 30}deg) translateY(-100%)`,
                                  top: '6px',
                                  left: '50%',
                                  marginLeft: '-0.25px'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 实时更新提示 */}
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        background: 'rgba(255,255,255,0.95)',
                        padding: '8px 16px',
                        borderRadius: '25px',
                        fontSize: '12px',
                        color: '#666',
                        backdropFilter: 'blur(10px)'
                      }}>
                        {t.userCenter.title === '个人中心' ? '🔄 实时更新中...' : '🔄 Live updating...'}
                      </div>
                    </div>

                    {/* 定制进度和价格 */}
                    <div className="mt-6 space-y-4">
                      {/* 步骤进度 */}
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border">
                        <div className="flex justify-between items-center mb-3">
                          <Text className="text-sm font-bold text-gray-700 flex items-center">
                            <span className="mr-2">📊</span>
                            {t.userCenter.title === '个人中心' ? '定制进度' : 'Progress'}
                      </Text>
                          <div className="flex items-center space-x-2">
                            <Text className="text-sm text-gray-600">
                              {completedSteps.length}/{customizationSteps.length}
                            </Text>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {Math.round((completedSteps.length / customizationSteps.length) * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${(completedSteps.length / customizationSteps.length) * 100}%` }}
                          />
                        </div>
                    </div>

                      {/* 价格明细 */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-xl border-2 border-blue-100">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-blue-200">
                            <Text className="text-sm text-gray-700 font-medium flex items-center">
                              <span className="mr-2">💰</span>
                              {t.userCenter.title === '个人中心' ? '基础价格' : 'Base Price'}
                            </Text>
                            <Text className="text-sm font-bold text-gray-800">¥{product.price.toLocaleString()}</Text>
                          </div>
                          
                          {Object.entries(previewConfig).map(([key, value]) => {
                            if (key === 'strap') return null; // 跳过表带
                            const price = calculateStepPrice(key, value);
                            if (price === 0) return null;
                            
                            const step = customizationSteps.find(s => s.id === key);
                            const option = step?.options.find(o => o.value === value);
                            
                            return (
                              <div key={key} className="flex justify-between items-center">
                                <Text className="text-sm text-gray-700 flex items-center">
                                  <span className="mr-2">{step?.icon}</span>
                                  {option?.name}
                                </Text>
                                <Text className="text-sm font-semibold text-blue-600">+¥{price.toLocaleString()}</Text>
                              </div>
                            );
                          })}
                          
                          <div className="border-t-2 border-blue-200 pt-3 flex justify-between items-center">
                            <Text className="font-bold text-gray-800 flex items-center text-base">
                              <span className="mr-2">🎯</span>
                              {t.userCenter.title === '个人中心' ? '定制总价' : 'Total Price'}
                            </Text>
                            <Text className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">¥{totalCustomizationPrice.toLocaleString()}</Text>
                          </div>
                        </div>
                      </div>

                      {/* 购买按钮 - 删除了其他按钮 */}
                      <div>
                      <Button 
                        type="primary" 
                        size="large" 
                          icon={<ShoppingCartOutlined />}
                        block
                          className="h-14 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                          disabled={completedSteps.length < customizationSteps.length}
                          onClick={() => {
                            const customizationDetails = {
                              id: `custom_${Date.now()}`,
                              productId: product.id,
                              configurations: previewConfig,
                              priceBreakdown: [],
                              basePrice: product.price,
                              totalModifier: totalCustomizationPrice - product.price,
                              finalPrice: totalCustomizationPrice,
                              createdAt: new Date().toISOString()
                            };
                            handleCustomAddToCart(customizationDetails);
                          }}
                        >
                          {completedSteps.length < customizationSteps.length 
                            ? (t.userCenter.title === '个人中心' ? `还需完成 ${customizationSteps.length - completedSteps.length} 个步骤` : `${customizationSteps.length - completedSteps.length} Steps Remaining`)
                            : (t.userCenter.title === '个人中心' ? '🛒 立即加入购物车' : '🛒 Add to Cart Now')
                          }
                      </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </Col>

              {/* 右侧：分步定制选项 */}
              <Col xs={24} lg={13}>
                <div className="customization-steps">
                  {/* 步骤导航 - 自动适应屏幕宽度 */}
                  <div className="steps-nav mb-8">
                    <div className="flex gap-2 w-full">
                      {customizationSteps.map((step, index) => (
                        <button
                          key={step.id}
                          onClick={() => goToStep(index)}
                          className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-1 sm:px-2 py-3 rounded-xl border-2 transition-all duration-300 min-h-[60px] ${
                            currentStep === index
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent text-white shadow-lg transform scale-105'
                              : completedSteps.includes(index)
                              ? 'bg-gradient-to-r from-green-400 to-green-500 border-transparent text-white shadow-md'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md'
                              }`}
                        >
                          <span className="text-sm sm:text-lg flex-shrink-0">{step.icon}</span>
                          <div className="text-center flex-1 min-w-0">
                            <div className="text-xs sm:text-sm font-bold truncate">{step.title}</div>
                            <div className="text-xs opacity-80">
                              {index + 1}/{customizationSteps.length}
                              </div>
                            </div>
                          {completedSteps.includes(index) && (
                            <span className="text-white text-xs sm:text-sm font-bold flex-shrink-0">✓</span>
                          )}
                        </button>
                      ))}
                              </div>
                            </div>

                  {/* 当前步骤内容 */}
                  <Card className="step-content border-2 border-blue-100">
                    <div className="step-header mb-8">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                          {customizationSteps[currentStep].icon}
                              </div>
                        <div className="flex-1">
                          <Title level={3} className="mb-1 text-gray-800">{customizationSteps[currentStep].title}</Title>
                          <Text className="text-gray-600 text-base">
                            {customizationSteps[currentStep].description}
                          </Text>
                          <div className="mt-2">
                            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                              {t.userCenter.title === '个人中心' 
                                ? `步骤 ${currentStep + 1}/${customizationSteps.length}` 
                                : `Step ${currentStep + 1}/${customizationSteps.length}`
                              }
                            </span>
                            </div>
                        </div>
                      </div>

                      {/* 删除当前选择显示区块 */}
                      {/* 之前的"当前选择"代码已移除 */}
                          </div>

                    <div className="options-grid">
                      <Row gutter={[20, 20]}>
                        {customizationSteps[currentStep].options.map((option) => {
                          const isSelected = previewConfig[customizationSteps[currentStep].id as keyof typeof previewConfig] === option.value;
                          return (
                            <Col xs={24} sm={12} xl={8} key={option.value}>
                              <button
                                onClick={() => handleStepSelection(customizationSteps[currentStep].id, option.value)}
                                className={`w-full p-6 rounded-2xl border-3 transition-all duration-300 text-center relative overflow-hidden ${
                                  isSelected
                                    ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-400 shadow-2xl transform scale-105 ring-4 ring-blue-200'
                                    : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-lg hover:scale-102'
                                }`}
                            >
                                {/* 选中标识 */}
                                {isSelected && (
                                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg animate-pulse">
                                    ✓
                                </div>
                                )}
                                
                                {/* 热门标签 */}
                                {option.popular && !isSelected && (
                                  <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                    🔥 {t.userCenter.title === '个人中心' ? '热门' : 'Popular'}
                              </div>
                                )}
                                
                                <div className="flex flex-col items-center space-y-4">
                                  <div className={`${option.icon} flex-shrink-0 transition-transform duration-300 ${isSelected ? 'scale-110' : 'hover:scale-110'}`}>
                                    {/* 图标内容保持不变 */}
                                    {option.value.includes('white') && <div className="w-4 h-4 bg-gray-400 rounded-full"></div>}
                                    {option.value.includes('black') && <div className="w-4 h-4 bg-white rounded-full"></div>}
                                    {option.value.includes('blue') && <div className="w-4 h-4 bg-white rounded-full"></div>}
                                    {option.value.includes('green') && <div className="w-4 h-4 bg-white rounded-full"></div>}
                                    {option.value.includes('silver') && <div className="w-4 h-4 bg-gray-600 rounded-full"></div>}
                                    {option.value.includes('champagne') && <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>}
                                    {option.value.includes('classic') && customizationSteps[currentStep].id === 'hands' && <div className="w-2 h-8 bg-gray-600 rounded-sm"></div>}
                                    {option.value.includes('luminous') && <div className="w-2 h-8 bg-green-500 rounded-sm shadow-green-300 shadow-lg"></div>}
                                    {option.value.includes('gold') && customizationSteps[currentStep].id === 'hands' && <div className="w-2 h-8 bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-sm"></div>}
                                    {option.value.includes('diamond') && customizationSteps[currentStep].id === 'hands' && <div className="w-2 h-8 bg-gradient-to-t from-pink-500 to-pink-400 rounded-sm shadow-pink-300 shadow-lg"></div>}
                                    {option.value.includes('skeleton') && <div className="w-2 h-8 bg-slate-400 rounded-sm border border-slate-500"></div>}
                                    {option.value.includes('blued') && <div className="w-2 h-8 bg-blue-600 rounded-sm"></div>}
                                    {option.value.includes('colored') && <div className="w-1 h-6 bg-red-500 rounded-sm"></div>}
                                    {option.value.includes('arrow') && <div className="w-1 h-6 bg-orange-500 rounded-sm"></div>}
                                    {option.value.includes('counterweight') && <div className="w-1 h-6 bg-purple-500 rounded-sm"></div>}
                                    {option.value.includes('automatic') && <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse"></div>}
                                    {option.value.includes('manual') && <div className="w-5 h-5 bg-amber-500 rounded-full"></div>}
                                    {option.value.includes('tourbillon') && <div className="w-5 h-5 bg-purple-500 rounded-full animate-spin"></div>}
                                    {option.value.includes('chronograph') && <div className="w-5 h-5 bg-green-500 rounded-full"></div>}
                                    {option.value.includes('gmt') && <div className="w-5 h-5 bg-indigo-500 rounded-full"></div>}
                                    {option.value.includes('perpetual') && <div className="w-5 h-5 bg-rose-500 rounded-full animate-pulse"></div>}
                            </div>
                                  <div>
                                    <div className={`text-base font-bold mb-2 ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                                      {option.name}
                                </div>
                                    <div className="text-sm text-gray-600 mb-3 min-h-[40px] flex items-center justify-center">
                                      {option.desc}
                              </div>
                                    <div className={`text-sm font-bold px-3 py-2 rounded-full transition-all duration-300 ${
                                      isSelected
                                        ? option.price === 0 
                                          ? 'bg-green-200 text-green-800 ring-2 ring-green-300' 
                                          : 'bg-blue-200 text-blue-800 ring-2 ring-blue-300'
                                        : option.price === 0 
                                          ? 'bg-green-100 text-green-700' 
                                          : 'bg-blue-100 text-blue-700'
                                    }`}>
                                      {option.price === 0 
                                        ? (t.userCenter.title === '个人中心' ? '✅ 基础价格' : '✅ Included') 
                                        : `💎 +¥${option.price.toLocaleString()}`
                                      }
                            </div>
                                  </div>
                                </div>
                              </button>
                          </Col>
                          );
                        })}
                      </Row>
                    </div>

                    {/* 步骤导航按钮 */}
                    <div className="step-navigation mt-8 flex justify-between items-center">
                      <Button 
                        size="large"
                        onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                        className="flex items-center space-x-2 h-12 px-6"
                      >
                        <span>←</span>
                        <span>{t.userCenter.title === '个人中心' ? '上一步' : 'Previous'}</span>
                      </Button>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{currentStep + 1}</span>
                        <span>/</span>
                        <span>{customizationSteps.length}</span>
                                </div>
                      
                      {currentStep === customizationSteps.length - 1 ? (
                        <Button 
                          type="primary"
                          size="large"
                          onClick={() => setShowConfirmModal(true)}
                          disabled={completedSteps.length < customizationSteps.length}
                          className="flex items-center space-x-2 h-12 px-6 bg-gradient-to-r from-green-500 to-blue-600 border-0"
                        >
                          <span>🎯</span>
                          <span>{t.userCenter.title === '个人中心' ? '确认个人定制' : 'Confirm Customization'}</span>
                        </Button>
                      ) : (
                        <Button 
                          type="primary"
                          size="large"
                          onClick={() => setCurrentStep(prev => Math.min(customizationSteps.length - 1, prev + 1))}
                          disabled={currentStep === customizationSteps.length - 1}
                          className="flex items-center space-x-2 h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 border-0"
                        >
                          <span>{t.userCenter.title === '个人中心' ? '下一步' : 'Next'}</span>
                          <span>→</span>
                        </Button>
                      )}
                              </div>
                  </Card>
                            </div>
                          </Col>
                        </Row>
          </div>
                      </Card>
      )}

      {/* 确认定制弹窗 */}
      <Modal
                        title={
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🎨</span>
            <div>
              <div className="text-xl font-bold">{t.userCenter.title === '个人中心' ? '确认个人定制' : 'Confirm Personal Customization'}</div>
              <div className="text-sm text-gray-600 font-normal">
                {t.userCenter.title === '个人中心' ? '请确认您的定制配置' : 'Please confirm your customization'}
              </div>
            </div>
                          </div>
                        }
        open={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        width={800}
        footer={null}
        className="customization-confirm-modal"
                      >
        <div className="space-y-6">
          {/* 3D预览 - 修正为匹配定制配置 */}
          <div className="text-center">
                            <div 
              className="inline-block preview-container"
              style={{
                width: '250px',
                height: '250px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* 完整的手表预览 - 与主预览区域保持一致 */}
              <div 
                className="watch-preview" 
                style={{ 
                  position: 'relative',
                  transform: `rotateY(${previewRotation}deg) rotateX(10deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.3s ease'
                }}
              >
                {/* 表带上部 */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '25px',
                  height: '65px',
                  background: previewConfig.strap === 'metal' 
                    ? 'linear-gradient(0deg, #a0a0a0, #c0c0c0)' 
                    : previewConfig.strap === 'rubber' 
                    ? 'linear-gradient(0deg, #2d2d2d, #404040)'
                    : 'linear-gradient(0deg, #8b4513, #a0522d)',
                  borderRadius: '12px 12px 6px 6px',
                  zIndex: 1
                }} />
                
                {/* 表带下部 */}
                <div style={{
                  position: 'absolute',
                  bottom: '-50px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '25px',
                  height: '65px',
                  background: previewConfig.strap === 'metal' 
                    ? 'linear-gradient(0deg, #a0a0a0, #c0c0c0)' 
                    : previewConfig.strap === 'rubber' 
                    ? 'linear-gradient(0deg, #2d2d2d, #404040)'
                    : 'linear-gradient(0deg, #8b4513, #a0522d)',
                  borderRadius: '6px 6px 12px 12px',
                  zIndex: 1
                }} />

                {/* 表壳 - 根据选择的材质显示 */}
                <div style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  background: 
                    previewConfig.case === 'gold' ? 'linear-gradient(145deg, #f4d03f, #d4ac0d)' :
                    previewConfig.case === 'titanium' ? 'linear-gradient(145deg, #bdc3c7, #95a5a6)' :
                    previewConfig.case === 'platinum' ? 'linear-gradient(145deg, #e5e7eb, #d1d5db)' :
                    previewConfig.case === 'carbon' ? 'linear-gradient(145deg, #1f2937, #111827)' :
                    previewConfig.case === 'ceramic' ? 'linear-gradient(145deg, #f9fafb, #f3f4f6)' :
                    'linear-gradient(145deg, #e8e8e8, #c0c0c0)', // steel
                  border: '3px solid #a8a8a8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.3)'
                }}>
                  {/* 表盘 - 根据选择的样式显示 */}
                  <div style={{
                    width: '85px',
                    height: '85px',
                    borderRadius: '50%',
                    background: 
                      previewConfig.dial === 'black' ? '#1a1a1a' :
                      previewConfig.dial === 'blue' ? 'linear-gradient(135deg, #3b82f6, #1e40af)' :
                      previewConfig.dial === 'green' ? 'linear-gradient(135deg, #10b981, #047857)' :
                      previewConfig.dial === 'silver' ? 'linear-gradient(135deg, #9ca3af, #6b7280)' :
                      previewConfig.dial === 'champagne' ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' :
                      '#ffffff', // white
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.1)'
                  }}>
                    {/* 时针 - 根据选择的指针样式显示 */}
                    <div style={{
                      position: 'absolute',
                      width: '2px',
                      height: '24px',
                      background: 
                        previewConfig.hands === 'luminous' ? '#00ff88' :
                        previewConfig.hands === 'gold' ? '#ffd700' :
                        previewConfig.hands === 'diamond' ? '#ff69b4' :
                        previewConfig.hands === 'skeleton' ? '#666' :
                        previewConfig.hands === 'blued' ? '#1e40af' :
                        '#333', // classic
                      borderRadius: '1px',
                      transformOrigin: 'bottom center',
                      transform: 'rotate(45deg)',
                      bottom: '50%',
                      boxShadow: 
                        previewConfig.hands === 'luminous' ? '0 0 6px #00ff88' : 
                        previewConfig.hands === 'diamond' ? '0 0 6px #ff69b4' : 'none'
                    }} />
                    
                    {/* 分针 - 根据选择的指针样式显示 */}
                    <div style={{
                      position: 'absolute',
                      width: '1px',
                      height: '32px',
                      background: 
                        previewConfig.hands === 'luminous' ? '#00ff88' :
                        previewConfig.hands === 'gold' ? '#ffd700' :
                        previewConfig.hands === 'diamond' ? '#ff69b4' :
                        previewConfig.hands === 'skeleton' ? '#666' :
                        previewConfig.hands === 'blued' ? '#1e40af' :
                        '#333', // classic
                      borderRadius: '0.5px',
                      transformOrigin: 'bottom center',
                      transform: 'rotate(120deg)',
                      bottom: '50%',
                      boxShadow: 
                        previewConfig.hands === 'luminous' ? '0 0 6px #00ff88' : 
                        previewConfig.hands === 'diamond' ? '0 0 6px #ff69b4' : 'none'
                    }} />
                    
                    {/* 秒针 - 根据选择的秒针样式显示 */}
                    <div style={{
                      position: 'absolute',
                      width: '0.5px',
                      height: '36px',
                      background: 
                        previewConfig.secondHand === 'colored' ? '#ff4444' :
                        previewConfig.secondHand === 'diamond' ? '#ff69b4' :
                        previewConfig.secondHand === 'luminous' ? '#00ff88' :
                        previewConfig.secondHand === 'arrow' ? '#f97316' :
                        previewConfig.secondHand === 'counterweight' ? '#8b5cf6' :
                        '#666', // classic
                      borderRadius: '0.25px',
                      transformOrigin: 'bottom center',
                      transform: 'rotate(200deg)',
                      bottom: '50%',
                      boxShadow: 
                        previewConfig.secondHand === 'diamond' ? '0 0 4px #ff69b4' :
                        previewConfig.secondHand === 'luminous' ? '0 0 4px #00ff88' : 'none'
                    }} />
                    
                    {/* 中心点 - 根据选择的指针样式显示 */}
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: 
                        previewConfig.hands === 'luminous' ? '#00ff88' :
                        previewConfig.hands === 'gold' ? '#ffd700' :
                        previewConfig.hands === 'diamond' ? '#ff69b4' :
                        '#333',
                      boxShadow: 
                        previewConfig.hands === 'luminous' ? '0 0 4px #00ff88' :
                        previewConfig.hands === 'diamond' ? '0 0 4px #ff69b4' : 'none'
                    }} />

                    {/* 机芯装饰效果 */}
                    {previewConfig.movement === 'tourbillon' && (
                      <div style={{
                        position: 'absolute',
                        bottom: '15%',
                        width: '12px',
                        height: '12px',
                        border: '1px solid #666',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          border: '1px solid #333',
                          borderRadius: '50%',
                          margin: '1px',
                          animation: 'spin 3s linear infinite'
                        }} />
                                </div>
                    )}
                              </div>
                            </div>
              </div>

              {/* 旋转按钮 */}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                display: 'flex',
                gap: '5px'
              }}>
                <button
                  onClick={() => setPreviewRotation(prev => prev - 45)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  ←
                </button>
                <button
                  onClick={() => setPreviewRotation(prev => prev + 45)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  →
                </button>
                                </div>
                              </div>
                            </div>

          {/* 定制明细 - 确保数据匹配 */}
          <div className="bg-gray-50 rounded-xl p-6">
            <Title level={4} className="mb-4 text-center text-gray-800">
              {t.userCenter.title === '个人中心' ? '🎯 定制配置明细' : '🎯 Customization Details'}
            </Title>
            
            <div className="space-y-4">
              {customizationSteps.map((step) => {
                const selectedValue = previewConfig[step.id as keyof typeof previewConfig];
                const selectedOption = step.options.find(opt => opt.value === selectedValue);
                
                return (
                  <div key={step.id} className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{step.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-800">{step.title}</div>
                          <div className="text-sm text-blue-600 font-medium">{selectedOption?.name}</div>
                          <div className="text-xs text-gray-500">{selectedOption?.desc}</div>
                          </div>
                                </div>
                      <div className="text-right">
                        <div className={`font-bold text-lg ${selectedOption?.price === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                          {selectedOption?.price === 0 ? '基础价格' : `+¥${selectedOption?.price.toLocaleString()}`}
                              </div>
                            </div>
                                </div>
                              </div>
                );
              })}
                            </div>
                                </div>

          {/* 价格汇总 - 确保计算正确 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Text className="text-gray-700 font-medium">
                  {t.userCenter.title === '个人中心' ? '基础价格' : 'Base Price'}
                </Text>
                <Text className="font-bold text-gray-800">¥{product.price.toLocaleString()}</Text>
                              </div>
              
              {Object.entries(previewConfig).map(([key, value]) => {
                if (key === 'strap') return null; // 表带不在5个定制步骤中
                const price = calculateStepPrice(key, value);
                if (price === 0) return null;
                
                const step = customizationSteps.find(s => s.id === key);
                const option = step?.options.find(o => o.value === value);
                
                return (
                  <div key={key} className="flex justify-between items-center">
                    <Text className="text-gray-700 flex items-center">
                      <span className="mr-2">{step?.icon}</span>
                      {option?.name}
                    </Text>
                    <Text className="font-semibold text-blue-600">+¥{price.toLocaleString()}</Text>
                            </div>
                );
              })}
              
              <div className="border-t-2 border-blue-300 pt-3 flex justify-between items-center">
                <Text className="text-xl font-bold text-gray-800">
                  {t.userCenter.title === '个人中心' ? '定制总价' : 'Total Price'}
                </Text>
                <Text className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  ¥{totalCustomizationPrice.toLocaleString()}
                </Text>
                </div>
          </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-4">
            <Button 
              size="large"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 h-12"
            >
              {t.userCenter.title === '个人中心' ? '返回修改' : 'Back to Edit'}
            </Button>
            <Button 
              type="primary"
              size="large"
              onClick={() => {
                const customizationDetails = {
                  id: `custom_${Date.now()}`,
                  productId: product.id,
                  configurations: previewConfig,
                  priceBreakdown: [],
                  basePrice: product.price,
                  totalModifier: totalCustomizationPrice - product.price,
                  finalPrice: totalCustomizationPrice,
                  createdAt: new Date().toISOString()
                };
                handleCustomAddToCart(customizationDetails);
                setShowConfirmModal(false);
                // 这里可以添加跳转到订单页面的逻辑
                // navigate('/checkout');
              }}
              className="flex-1 h-12 bg-gradient-to-r from-green-500 to-blue-600 border-0"
            >
              {t.userCenter.title === '个人中心' ? '🛒 提交订单' : '🛒 Submit Order'}
            </Button>
          </div>
        </div>

        {/* 添加CSS动画支持 */}
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </Modal>

      {/* 定制器模态框 */}
      {product && (
        <WatchCustomizer
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          product={product}
          onConfirm={(customization) => {
            // 将新的定制数据格式转换为现有系统期望的格式
            const customizationDetails: CustomizationDetails = {
              id: `custom_${Date.now()}`,
              productId: product.id,
              configurations: {
                case: customization.case,
                dial: customization.dial,
                hands: customization.hands,
                strap: customization.strap,
                engraving: customization.engraving
              },
              priceBreakdown: [],
              basePrice: product.price,
              totalModifier: customization.totalPrice - product.price,
              finalPrice: customization.totalPrice,
              createdAt: new Date().toISOString()
            };
            handleCustomAddToCart(customizationDetails);
            setIsCustomizerOpen(false);
          }}
        />
      )}

      {/* 全局CSS动画样式 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
};

export default ProductDetailPage;
