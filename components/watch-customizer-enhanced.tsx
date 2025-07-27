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
  Timeline,
  Switch,
  Slider,
  Affix
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
  HistoryOutlined,
  SettingOutlined
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

interface WatchCustomizerEnhancedProps {
  product: CustomizableProduct;
  onConfigurationChange: (config: any) => void;
  onAddToCart: (customization: CustomizationDetails) => void;
  initialConfiguration?: any;
}

const WatchCustomizerEnhanced: React.FC<WatchCustomizerEnhancedProps> = ({
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
  const [showConfigHistory, setShowConfigHistory] = useState(false);
  const [configHistory, setConfigHistory] = useState<Array<{time: string, action: string, details: string, price?: number}>>([]);

  // 定制步骤配置
  const customizationSteps = [
    {
      title: t.customization?.caseTitle || '表壳材质',
      key: 'case_material',
      description: t.customization?.caseDescription || '选择您喜欢的表壳材质',
      icon: '⚙️',
      color: '#1890ff',
      preview: '影响手表的质感和耐用性'
    },
    {
      title: t.customization?.dialTitle || '表盘风格', 
      key: 'dial_style',
      description: t.customization?.dialDescription || '个性化您的表盘设计',
      icon: '🎨',
      color: '#52c41a',
      preview: '决定手表的视觉风格'
    },
    {
      title: t.customization?.handsTitle || '指针样式',
      key: 'hour_minute_hands', 
      description: t.customization?.handsDescription || '选择时分针设计',
      icon: '🕐',
      color: '#fa8c16',
      preview: '影响读时的清晰度和美观'
    },
    {
      title: t.customization?.secondHandTitle || '秒针设计',
      key: 'second_hand',
      description: t.customization?.secondHandDescription || '个性化秒针风格',
      icon: '⏱️',
      color: '#eb2f96',
      preview: '增加动态美感'
    },
    {
      title: t.customization?.strapTitle || '表带类型',
      key: 'strap_type',
      description: t.customization?.strapDescription || '选择舒适的表带材质',
      icon: '🔗',
      color: '#722ed1',
      preview: '影响佩戴舒适度'
    },
    {
      title: t.customization?.movementTitle || '机芯配置',
      key: 'movement_type',
      description: t.customization?.movementDescription || '选择精密机芯',
      icon: '⚡',
      color: '#13c2c2',
      preview: '决定精度和功能'
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
        action: `${option.displayName}`,
        details: `选择: ${value.displayName}`,
        price: value.priceModifier || 0
      };
      setConfigHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
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

  // 计算完成进度
  const completedSteps = Object.keys(configuration).length;
  const progressPercentage = Math.round((completedSteps / customizationSteps.length) * 100);

  // 渲染增强型预览区域 (左侧 42%)
  const renderEnhancedPreview = () => (
    <Card 
      className="shadow-lg border-0" 
      style={{ minHeight: '450px' }}
      bodyStyle={{ padding: '12px' }}
      title={
        <div className="flex items-center justify-between">
          <span className="text-base">🔍 实时预览</span>
          <div className="flex items-center space-x-2">
            <Button
              type="text"
              size="small"
              icon={showConfigHistory ? <EyeOutlined /> : <HistoryOutlined />}
              onClick={() => setShowConfigHistory(!showConfigHistory)}
              className="text-blue-600"
            />
            <Button
              type="text"
              size="small"
              icon={isAutoRotating ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className="text-blue-600"
            />
          </div>
        </div>
      }
    >
      <div className="bg-white rounded-lg">
        {/* 3D预览区域 */}
        <div className="aspect-square w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
          {/* 手表主体预览 */}
          <div 
            className={`relative transition-all duration-1000 ease-in-out ${
              isAutoRotating ? 'animate-spin' : ''
            }`}
            style={{ 
              animationDuration: isAutoRotating ? `${4 / rotationSpeed}s` : '0s'
            }}
          >
            {/* 手表外壳 */}
            <div className="w-56 h-56 bg-gradient-to-br from-white to-gray-100 rounded-full shadow-2xl border-4 border-gray-300 flex items-center justify-center relative">
              {/* 表盘区域 */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-900 to-black shadow-inner border border-gray-600">
                {/* 表盘装饰 */}
                <div className="absolute inset-2 rounded-full border border-yellow-400/50">
                  {/* 时标 */}
                  {[...Array(12)].map((_, i) => (
                    <div key={i}>
                      {[0, 3, 6, 9].includes(i) ? (
                        <div
                          className="absolute w-1 h-6 bg-yellow-400 shadow-lg"
                          style={{
                            top: '6px',
                            left: '50%',
                            transformOrigin: 'bottom center',
                            transform: `translateX(-50%) rotate(${i * 30}deg)`
                          }}
                        />
                      ) : (
                        <div
                          className="absolute w-0.5 h-3 bg-yellow-300"
                          style={{
                            top: '9px',
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
                      className="absolute w-1 bg-gradient-to-t from-white to-gray-200 rounded-full shadow-lg"
                      style={{
                        height: '35px',
                        top: '35px',
                        left: '50%',
                        transformOrigin: 'bottom center',
                        transform: 'translateX(-50%) rotate(45deg)'
                      }}
                    />
                    {/* 分针 */}
                    <div 
                      className="absolute w-0.5 bg-gradient-to-t from-white to-gray-100 rounded-full shadow-lg"
                      style={{
                        height: '50px',
                        top: '25px',
                        left: '50%',
                        transformOrigin: 'bottom center', 
                        transform: 'translateX(-50%) rotate(90deg)'
                      }}
                    />
                    {/* 秒针 */}
                    <div 
                      className="absolute w-px bg-gradient-to-t from-red-500 to-red-400"
                      style={{
                        height: '55px',
                        top: '20px',
                        left: '50%',
                        transformOrigin: 'bottom center',
                        transform: 'translateX(-50%) rotate(180deg)'
                      }}
                    />
                    {/* 中心点 */}
                    <div className="w-3 h-3 bg-gradient-to-br from-white to-gray-300 rounded-full shadow-lg" />
                  </div>
                  
                  {/* 品牌标识 */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                    <div className="text-yellow-400 text-xs font-bold">SEAGULL</div>
                  </div>
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                    <div className="text-yellow-300 text-[8px]">AUTOMATIC</div>
                  </div>
                </div>
              </div>
              
              {/* 表冠 */}
              <div className="absolute right-0 top-1/2 w-6 h-8 bg-gradient-to-r from-gray-600 to-gray-400 rounded-r-xl transform -translate-y-1/2 shadow-lg" />
            </div>
            
            {/* 表带 */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-32 bg-gradient-to-b from-amber-800 to-amber-900 rounded-t-xl shadow-xl" />
            </div>
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-32 bg-gradient-to-t from-amber-800 to-amber-900 rounded-b-xl shadow-xl" />
            </div>
          </div>
          
          {/* 预览控制浮层 */}
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
              <div className="flex items-center space-x-1">
                <Button
                  type="text"
                  icon={<RotateLeftOutlined />}
                  size="small"
                  className="text-gray-600"
                />
                <Button
                  type="text"
                  icon={<RotateRightOutlined />}
                  size="small"
                  className="text-gray-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 配置状态信息 */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex justify-between items-center mb-2">
            <div>
              <Text strong className="block">{product.name}</Text>
              <Text type="secondary" className="text-sm">个人定制版本</Text>
            </div>
            <div className="text-right">
              <Statistic
                value={pricing.finalPrice}
                prefix="¥"
                valueStyle={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Text type="secondary" className="text-xs">配置进度</Text>
              <Progress 
                percent={progressPercentage}
                size="small"
                strokeColor="#1890ff"
                className="w-20"
              />
            </div>
            <Text className="text-xs text-gray-500">
              {completedSteps}/{customizationSteps.length}
            </Text>
          </div>
        </div>

        {/* 快速配置概览 */}
        <div className="space-y-2">
          <Text strong className="text-sm block">✨ 已选配置</Text>
          {Object.keys(configuration).length > 0 ? (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {Object.entries(configuration).map(([optionId, valueId]) => {
                const option = product.customizationOptions.find(opt => opt.id === optionId);
                const value = option?.values.find(val => val.id === valueId);
                const step = customizationSteps.find(s => s.key === optionId);
                if (!option || !value || !step) return null;

                return (
                  <div key={optionId} className="flex justify-between items-center py-1 px-2 bg-white rounded border">
                    <div className="flex items-center space-x-2">
                      <span style={{ color: step.color }}>{step.icon}</span>
                      <Text className="text-xs">{option.displayName}</Text>
                    </div>
                    <div className="text-right">
                      <Text className="text-xs font-medium">{value.displayName}</Text>
                      {value.priceModifier > 0 && (
                        <Text className="text-xs text-blue-600 block">+¥{value.priceModifier}</Text>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <Text type="secondary" className="text-sm">开始您的定制之旅</Text>
            </div>
          )}
        </div>

        {/* 配置历史侧边栏 */}
        {showConfigHistory && configHistory.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex justify-between items-center mb-2">
              <Text strong className="text-sm">🕐 配置历史</Text>
              <Button 
                type="text" 
                size="small"
                onClick={() => setShowConfigHistory(false)}
                className="text-xs"
              >
                收起
              </Button>
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {configHistory.slice(0, 3).map((item, index) => (
                <div key={index} className="text-xs">
                  <Text className="text-gray-600">{item.time}</Text>
                  <Text className="block">{item.action}: {item.details}</Text>
                  {item.price && item.price > 0 && (
                    <Text className="text-blue-600">+¥{item.price}</Text>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  // 渲染定制面板 (右侧 58%)
  const renderCustomizationPanel = () => {
    const step = customizationSteps[currentStep];
    const option = product.customizationOptions.find(opt => opt.id === step.key);
    
    if (!option) {
      return <div>选项未找到</div>;
    }

    return (
      <Card 
        className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50" 
        style={{ minHeight: '450px' }}
        bodyStyle={{ padding: '12px' }}
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-base">🎨 个人定制专区</span>
              <Badge count="NEW" className="ml-2" />
            </div>
            <div className="flex items-center space-x-2">
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
          </div>
        }
      >
        <div className="bg-white rounded-lg p-3">
          {/* 步骤导航 */}
          <div className="mb-4">
            <Steps
              current={currentStep}
              onChange={setCurrentStep}
              size="small"
              direction="horizontal"
              className="mb-3"
              items={customizationSteps.map((step, index) => ({
                title: step.icon,
                description: configuration[step.key] ? '✓' : '',
                disabled: false
              }))}
            />
          </div>

          {/* 当前步骤信息 */}
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3 mb-2">
              <Avatar 
                size="small" 
                style={{ backgroundColor: step.color }}
                icon={step.icon}
              />
              <div className="flex-1">
                <Text strong className="block">{step.title}</Text>
                <Text type="secondary" className="text-sm">{step.description}</Text>
              </div>
              {option.required && <Badge color="red" text="必选" size="small" />}
            </div>
            <Alert
              message={step.preview}
              type="info"
              showIcon={false}
              className="text-xs"
              banner
            />
          </div>

          {/* 选项列表 */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {option.values.map(value => {
              const isSelected = configuration[option.id] === value.id;
              return (
                <div
                  key={value.id}
                  className={`
                    p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 relative
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }
                    ${!value.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => value.isAvailable && handleConfigChange(option.id, value.id)}
                >
                  {/* 选择状态指示器 */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckOutlined className="text-white text-xs" />
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Text strong className="text-sm">{value.displayName}</Text>
                        {!value.isAvailable && (
                                                     <Tag color="red">暂不可选</Tag>
                        )}
                      </div>
                      
                      {value.description && (
                        <Text type="secondary" className="text-xs block">
                          {value.description}
                        </Text>
                      )}
                    </div>
                    
                    {/* 价格信息 */}
                    <div className="text-right ml-3">
                      {value.priceModifier > 0 ? (
                        <div>
                          <Text className="text-sm font-bold text-blue-600">
                            +¥{value.priceModifier.toLocaleString()}
                          </Text>
                          <Text type="secondary" className="text-xs block">定制费</Text>
                        </div>
                      ) : (
                        <div>
                          <Text className="text-sm font-bold text-green-600">免费</Text>
                          <Text type="secondary" className="text-xs block">标准</Text>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 底部操作区 */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <Text type="secondary" className="text-sm block">当前总价</Text>
                <Text strong className="text-lg text-blue-600">
                  ¥{pricing.finalPrice.toLocaleString()}
                </Text>
                {pricing.totalModifier > 0 && (
                  <Text type="secondary" className="text-xs block">
                    基础 ¥{pricing.basePrice.toLocaleString()} + 定制 ¥{pricing.totalModifier.toLocaleString()}
                  </Text>
                )}
              </div>
              
              <div className="space-x-2">
                {completedSteps === customizationSteps.length ? (
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => {
                                                                    const customizationDetails: CustomizationDetails = {
                         id: `custom_${Date.now()}`,
                         productId: product.id,
                         configurations: configuration,
                         priceBreakdown: [],
                         basePrice: pricing.basePrice,
                         totalModifier: pricing.totalModifier,
                         finalPrice: pricing.finalPrice,
                         createdAt: new Date().toISOString()
                       };
                      onAddToCart(customizationDetails);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600"
                  >
                    加入购物车
                  </Button>
                ) : (
                  <Button size="large" disabled>
                    请完成所有配置
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Row gutter={24} className="min-h-[500px]">
      {/* 左侧：实时预览区域 (42%) */}
      <Col xs={24} lg={10}>
        {renderEnhancedPreview()}
      </Col>

      {/* 右侧：定制配置区域 (58%) */}
      <Col xs={24} lg={14}>
        {renderCustomizationPanel()}
      </Col>
    </Row>
  );
};

export default WatchCustomizerEnhanced; 