import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/use-language';
import {
  Card,
  Steps,
  Button,
  Space,
  Typography,
  Select,
  Radio,
  Badge,
  Alert,
  notification,
  Modal,
  Image,
  Tag,
  Divider,
  Row,
  Col,
  Progress,
  Tooltip,
  List,
  Avatar,
  Statistic,
  Affix,
  Timeline,
  Switch,
  Slider
} from 'antd';
import {
  CheckOutlined,
  LeftOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  FullscreenOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  EyeOutlined,
  DollarOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  CompressOutlined,
  ExpandOutlined
} from '@ant-design/icons';
import {
  CustomizableProduct,
  CustomizationOption,
  CustomizationConfiguration,
  CustomizationPricing,
  CustomizationValidation
} from '../seagull-watch-customization-types';
import { CustomizationDetails, CustomizationPriceBreakdown } from '../seagull-watch-types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface WatchCustomizerSplitScreenProps {
  product: CustomizableProduct;
  onConfigurationChange: (config: any) => void; // 临时使用 any 避免类型错误
  onAddToCart: (customization: CustomizationDetails) => void;
  initialConfiguration?: any; // 临时使用 any
}

const WatchCustomizerSplitScreen: React.FC<WatchCustomizerSplitScreenProps> = ({
  product,
  onConfigurationChange,
  onAddToCart,
  initialConfiguration = {}
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [configuration, setConfiguration] = useState<Record<string, string>>({});
  const [pricing, setPricing] = useState<CustomizationPricing>({
    basePrice: product.basePrice,
    optionPricing: {},
    totalModifier: 0,
    finalPrice: product.basePrice,
    breakdown: []
  });
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showConfigHistory, setShowConfigHistory] = useState(false);
  const [configHistory, setConfigHistory] = useState<Array<{time: string, action: string, details: string}>>([]);

  // 定制步骤配置
  const customizationSteps = [
    {
      title: t.customization?.caseTitle || '表壳材质',
      key: 'case_material',
      description: t.customization?.caseDescription || '选择您喜欢的表壳材质',
      icon: '⚙️',
      color: '#1890ff',
      preview: '影响表壳外观和质感'
    },
    {
      title: t.customization?.dialTitle || '表盘风格', 
      key: 'dial_style',
      description: t.customization?.dialDescription || '个性化您的表盘设计',
      icon: '🎨',
      color: '#52c41a',
      preview: '影响表盘颜色和纹理'
    },
    {
      title: t.customization?.handsTitle || '指针样式',
      key: 'hour_minute_hands', 
      description: t.customization?.handsDescription || '选择时分针设计',
      icon: '🕐',
      color: '#fa8c16',
      preview: '影响指针形状和颜色'
    },
    {
      title: t.customization?.secondHandTitle || '秒针设计',
      key: 'second_hand',
      description: t.customization?.secondHandDescription || '个性化秒针风格',
      icon: '⏱️',
      color: '#eb2f96',
      preview: '影响秒针颜色和造型'
    },
    {
      title: t.customization?.strapTitle || '表带类型',
      key: 'strap_type',
      description: t.customization?.strapDescription || '选择舒适的表带材质',
      icon: '🔗',
      color: '#722ed1',
      preview: '影响表带材质和颜色'
    },
    {
      title: t.customization?.movementTitle || '机芯配置',
      key: 'movement_type',
      description: t.customization?.movementDescription || '选择精密机芯',
      icon: '⚡',
      color: '#13c2c2',
      preview: '影响精度和功能'
    }
  ];

  // 处理配置变更
  const handleConfigChange = useCallback((optionId: string, valueId: string) => {
    const newConfig = { ...configuration, [optionId]: valueId };
    setConfiguration(newConfig);
    
    // 记录配置历史
    const option = product.customizationOptions.find(opt => opt.id === optionId);
    const value = option?.values.find(val => val.id === valueId);
    if (option && value) {
      const newHistoryItem = {
        time: new Date().toLocaleTimeString(),
        action: `更改${option.displayName}`,
        details: `选择了 "${value.displayName}"${value.priceModifier > 0 ? ` (+¥${value.priceModifier})` : ''}`
      };
      setConfigHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]); // 保留最近10条记录
    }
    
    // 计算新价格
    if (value) {
      const newTotalModifier = Object.entries(newConfig).reduce((total, [optId, valId]) => {
        const opt = product.customizationOptions.find(o => o.id === optId);
        const val = opt?.values.find(v => v.id === valId);
        return total + (val?.priceModifier || 0);
      }, 0);
      
      setPricing(prev => ({
        ...prev,
        totalModifier: newTotalModifier,
        finalPrice: product.basePrice + newTotalModifier
      }));
    }
    
    onConfigurationChange(newConfig);
  }, [configuration, product, onConfigurationChange]);

  // 渲染实时预览区域
  const renderRealTimePreview = () => (
    <div className={`relative w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden transition-all duration-300 ${
      isFullscreen ? 'fixed inset-0 z-50' : 'h-[500px]'
    }`}>
      {/* 预览控制栏 */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex justify-between items-center bg-white/95 backdrop-blur-md rounded-lg px-4 py-3 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Button
                type="text"
                icon={isAutoRotating ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                size="small"
                className="text-blue-600"
              />
              <span className="text-xs text-gray-500">自动旋转</span>
            </div>
            
            <Divider type="vertical" />
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">速度</span>
              <Slider
                min={0.5}
                max={3}
                step={0.5}
                value={rotationSpeed}
                onChange={setRotationSpeed}
                className="w-16"
                size="small"
              />
            </div>
            
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
              size="small"
              title="重置视角"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge count={Object.keys(configuration).length} color="#1890ff">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => setShowConfigHistory(!showConfigHistory)}
                size="small"
                title="配置历史"
              />
            </Badge>
            
            <Button
              type="text"
              icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
              onClick={() => setIsFullscreen(!isFullscreen)}
              size="small"
              title={isFullscreen ? "退出全屏" : "全屏预览"}
            />
          </div>
        </div>
      </div>

      {/* 主预览区域 - 手表3D视图 */}
      <div className="flex items-center justify-center h-full relative">
        <div 
          className={`relative transition-all duration-1000 ease-in-out ${
            isAutoRotating ? 'animate-spin' : ''
          }`}
          style={{ 
            animationDuration: isAutoRotating ? `${4 / rotationSpeed}s` : '0s'
          }}
        >
          {/* 手表主体 */}
          <div className="w-72 h-72 bg-gradient-to-br from-white to-gray-100 rounded-full shadow-2xl border-8 border-gray-300 flex items-center justify-center relative overflow-hidden">
            {/* 表盘区域 */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-gray-900 to-black shadow-inner border-2 border-gray-600">
              {/* 表盘装饰圈 */}
              <div className="absolute inset-2 rounded-full border border-yellow-400">
                {/* 时标 */}
                {[...Array(12)].map((_, i) => (
                  <div key={i}>
                    {/* 主要时标 (3, 6, 9, 12点) */}
                    {[0, 3, 6, 9].includes(i) ? (
                      <div
                        className="absolute w-1 h-8 bg-yellow-400 shadow-lg"
                        style={{
                          top: '8px',
                          left: '50%',
                          transformOrigin: 'bottom center',
                          transform: `translateX(-50%) rotate(${i * 30}deg)`
                        }}
                      />
                    ) : (
                      <div
                        className="absolute w-0.5 h-4 bg-yellow-300"
                        style={{
                          top: '12px',
                          left: '50%',
                          transformOrigin: 'bottom center',
                          transform: `translateX(-50%) rotate(${i * 30}deg)`
                        }}
                      />
                    )}
                  </div>
                ))}
                
                {/* 指针系统 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* 时针 */}
                  <div 
                    className="absolute w-1.5 bg-gradient-to-t from-white to-gray-200 rounded-full shadow-lg"
                    style={{
                      height: '50px',
                      top: '45px',
                      left: '50%',
                      transformOrigin: 'bottom center',
                      transform: 'translateX(-50%) rotate(45deg)'
                    }}
                  />
                  {/* 分针 */}
                  <div 
                    className="absolute w-1 bg-gradient-to-t from-white to-gray-100 rounded-full shadow-lg"
                    style={{
                      height: '70px',
                      top: '35px',
                      left: '50%',
                      transformOrigin: 'bottom center', 
                      transform: 'translateX(-50%) rotate(90deg)'
                    }}
                  />
                  {/* 秒针 */}
                  <div 
                    className="absolute w-0.5 bg-gradient-to-t from-red-500 to-red-400 rounded-full"
                    style={{
                      height: '80px',
                      top: '30px',
                      left: '50%',
                      transformOrigin: 'bottom center',
                      transform: 'translateX(-50%) rotate(180deg)'
                    }}
                  />
                  {/* 中心螺丝 */}
                  <div className="w-4 h-4 bg-gradient-to-br from-white to-gray-300 rounded-full shadow-lg border border-gray-400" />
                </div>
                
                {/* 品牌标识区域 */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                  <div className="text-yellow-400 text-xs font-bold tracking-wider">SEAGULL</div>
                </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="text-yellow-300 text-[8px] tracking-wide">AUTOMATIC</div>
                </div>
              </div>
            </div>
            
            {/* 表冠 */}
            <div className="absolute right-0 top-1/2 w-8 h-10 bg-gradient-to-r from-gray-600 to-gray-400 rounded-r-xl transform -translate-y-1/2 shadow-lg border-l border-gray-500" />
            
            {/* 按钮 */}
            <div className="absolute right-0 top-1/3 w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-400 rounded-r-lg transform -translate-y-1/2 shadow-md" />
            <div className="absolute right-0 bottom-1/3 w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-400 rounded-r-lg transform translate-y-1/2 shadow-md" />
          </div>
          
          {/* 表带 */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-48 bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900 rounded-t-xl shadow-xl border-l border-r border-amber-600" 
                 style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />
          </div>
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-48 bg-gradient-to-t from-amber-800 via-amber-700 to-amber-900 rounded-b-xl shadow-xl border-l border-r border-amber-600"
                 style={{ clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)' }} />
          </div>
        </div>
      </div>

      {/* 实时配置信息浮层 */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20">
          <Row gutter={16}>
            <Col span={12}>
              <div>
                <Text strong className="block text-lg">{product.name}</Text>
                <Text type="secondary" className="text-sm">个人定制版本</Text>
                <div className="flex items-center mt-2 space-x-2">
                  <Progress 
                    percent={Math.round((Object.keys(configuration).length / customizationSteps.length) * 100)}
                    size="small"
                    strokeColor="#1890ff"
                    className="flex-1"
                  />
                  <Text className="text-xs text-gray-500">
                    {Object.keys(configuration).length}/{customizationSteps.length}
                  </Text>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="text-right">
                <Statistic
                  value={pricing.finalPrice}
                  prefix="¥"
                  valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}
                />
                {pricing.totalModifier > 0 && (
                  <Text type="secondary" className="text-xs block">
                    基础 ¥{pricing.basePrice.toLocaleString()} + 定制 ¥{pricing.totalModifier.toLocaleString()}
                  </Text>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* 配置历史侧边栏 */}
      {showConfigHistory && (
        <div className="absolute top-0 right-0 bottom-0 w-80 bg-white/95 backdrop-blur-md border-l border-gray-200 shadow-xl overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <Title level={5} className="mb-0">🕐 配置历史</Title>
              <Button 
                type="text" 
                size="small"
                onClick={() => setShowConfigHistory(false)}
              >
                ✕
              </Button>
            </div>
            
            <Timeline
              size="small"
              items={configHistory.map((item, index) => ({
                color: index === 0 ? '#1890ff' : '#d9d9d9',
                children: (
                  <div>
                    <Text strong className="text-sm block">{item.action}</Text>
                    <Text type="secondary" className="text-xs block">{item.details}</Text>
                    <Text type="secondary" className="text-xs">{item.time}</Text>
                  </div>
                )
              }))}
            />
            
            {configHistory.length === 0 && (
              <div className="text-center py-8">
                <Text type="secondary">暂无配置记录</Text>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // 渲染快速配置总览
  const renderQuickConfigOverview = () => (
    <Card size="small" className="mb-4" title="⚡ 快速配置">
      <div className="grid grid-cols-2 gap-3">
        {customizationSteps.map((step, index) => {
          const isCompleted = configuration[step.key];
          const option = product.customizationOptions.find(opt => opt.id === step.key);
          const selectedValue = isCompleted ? option?.values.find(v => v.id === configuration[step.key]) : null;
          
          return (
            <div
              key={step.key}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                currentStep === index 
                  ? 'border-blue-500 bg-blue-50' 
                  : isCompleted 
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{step.title}</span>
                <span style={{ color: step.color }}>{step.icon}</span>
              </div>
              
              {selectedValue ? (
                <div>
                  <Text className="text-xs text-green-600 block">{selectedValue.displayName}</Text>
                  {selectedValue.priceModifier > 0 && (
                    <Text className="text-xs text-blue-600">+¥{selectedValue.priceModifier}</Text>
                  )}
                </div>
              ) : (
                <Text type="secondary" className="text-xs">待选择</Text>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );

  // 渲染详细定制面板
  const renderDetailedCustomizationPanel = () => {
    const step = customizationSteps[currentStep];
    const option = product.customizationOptions.find(opt => opt.id === step.key);
    
    if (!option) {
      return <div>选项未找到</div>;
    }

    return (
      <Card 
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar 
                size="small" 
                style={{ backgroundColor: step.color }}
                icon={step.icon}
              />
              <div>
                <span className="font-medium">{step.title}</span>
                {option.required && <Badge color="red" text="必选" size="small" className="ml-2" />}
              </div>
            </div>
            <Text type="secondary" className="text-sm">
              第 {currentStep + 1} 步，共 {customizationSteps.length} 步
            </Text>
          </div>
        }
        size="small"
        extra={
          <div className="flex space-x-2">
            <Button
              size="small"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              icon={<LeftOutlined />}
            >
              上一步
            </Button>
            <Button
              size="small"
              type="primary"
              disabled={currentStep === customizationSteps.length - 1}
              onClick={() => setCurrentStep(prev => Math.min(customizationSteps.length - 1, prev + 1))}
              icon={<RightOutlined />}
            >
              下一步
            </Button>
          </div>
        }
      >
        <div className="mb-4">
          <Paragraph className="text-gray-600 text-sm mb-2">
            {step.description}
          </Paragraph>
          <Alert
            message={step.preview}
            type="info"
            showIcon={false}
            className="text-xs"
            banner
          />
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {option.values.map(value => {
            const isSelected = configuration[option.id] === value.id;
            return (
              <div
                key={value.id}
                className={`
                  p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 relative
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }
                  ${!value.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={() => value.isAvailable && handleConfigChange(option.id, value.id)}
              >
                {/* 选择状态指示器 */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckOutlined className="text-white text-xs" />
                  </div>
                )}
                
                <Row gutter={16}>
                  {/* 左侧：图片预览 */}
                  {value.imageUrl && (
                    <Col span={6}>
                      <div className="w-full h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={value.imageUrl}
                          alt={value.displayName}
                          width="100%"
                          height="100%"
                          className="object-cover"
                          preview={false}
                        />
                      </div>
                    </Col>
                  )}
                  
                  {/* 右侧：配置信息 */}
                  <Col span={value.imageUrl ? 18 : 24}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Text strong className="text-base">{value.displayName}</Text>
                          {!value.isAvailable && (
                            <Tag color="red" className="text-xs">暂不可选</Tag>
                          )}
                        </div>
                        
                        {value.description && (
                          <Text type="secondary" className="text-sm block mb-2">
                            {value.description}
                          </Text>
                        )}
                        
                        {/* 特性标签 */}
                        {value.tags && (
                          <div className="flex flex-wrap gap-1">
                            {value.tags.map(tag => (
                              <Tag key={tag} color="blue" className="text-xs">
                                {tag}
                              </Tag>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* 价格信息 */}
                      <div className="text-right">
                        {value.priceModifier > 0 ? (
                          <div>
                            <Text className="text-lg font-bold text-blue-600">
                              +¥{value.priceModifier.toLocaleString()}
                            </Text>
                            <Text type="secondary" className="text-xs block">定制费用</Text>
                          </div>
                        ) : (
                          <div>
                            <Text className="text-lg font-bold text-green-600">免费</Text>
                            <Text type="secondary" className="text-xs block">标准配置</Text>
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto p-4">
        <Row gutter={24} className="min-h-[600px]">
          {/* 左侧：实时预览区域 (50%) */}
          <Col xs={24} lg={12}>
            <div className="space-y-4">
              {/* 实时预览 */}
              {renderRealTimePreview()}
              
              {/* 快速配置总览 */}
              {renderQuickConfigOverview()}
            </div>
          </Col>

          {/* 右侧：详细定制面板 (50%) */}
          <Col xs={24} lg={12}>
            <div className="space-y-4">
              {/* 定制进度指示器 */}
              <Card size="small">
                <Steps
                  current={currentStep}
                  onChange={setCurrentStep}
                  size="small"
                  direction="horizontal"
                  items={customizationSteps.map((step, index) => ({
                    title: step.icon,
                    description: configuration[step.key] ? '✓' : '',
                    disabled: false
                  }))}
                />
              </Card>
              
              {/* 详细定制选项 */}
              {renderDetailedCustomizationPanel()}
            </div>
          </Col>
        </Row>
      </div>

      {/* 底部浮动操作栏 */}
      <Affix offsetBottom={0}>
        <div className="bg-white border-t shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Row gutter={24} align="middle">
              <Col span={8}>
                <div className="flex items-center space-x-4">
                  <div>
                    <Text type="secondary" className="text-sm block">配置进度</Text>
                    <Progress 
                      percent={Math.round((Object.keys(configuration).length / customizationSteps.length) * 100)}
                      size="small"
                      strokeColor="#1890ff"
                      className="w-32"
                    />
                  </div>
                </div>
              </Col>
              
              <Col span={8}>
                <div className="text-center">
                  <Statistic
                    title="总价"
                    value={pricing.finalPrice}
                    prefix="¥"
                    valueStyle={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff' }}
                  />
                  {pricing.totalModifier > 0 && (
                    <Text type="secondary" className="text-sm">
                      (基础 ¥{pricing.basePrice.toLocaleString()} + 定制 ¥{pricing.totalModifier.toLocaleString()})
                    </Text>
                  )}
                </div>
              </Col>
              
              <Col span={8}>
                <div className="text-right space-x-3">
                  <Button size="large">
                    保存配置
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    disabled={Object.keys(configuration).length < customizationSteps.length}
                    onClick={() => {
                      const customizationDetails: CustomizationDetails = {
                        configuration,
                        totalPrice: pricing.finalPrice,
                        priceBreakdown: [] // 临时为空数组避免类型错误
                      };
                      onAddToCart(customizationDetails);
                    }}
                    className="min-w-[140px]"
                  >
                    立即购买
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Affix>
    </div>
  );
};

export default WatchCustomizerSplitScreen; 