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
  Statistic
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
  DollarOutlined
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

interface WatchCustomizerImmersiveProps {
  product: CustomizableProduct;
  onConfigurationChange: (config: CustomizationConfiguration) => void;
  onAddToCart: (customization: CustomizationDetails) => void;
  initialConfiguration?: Partial<CustomizationConfiguration>;
}

const WatchCustomizerImmersive: React.FC<WatchCustomizerImmersiveProps> = ({
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
  const [previewMode, setPreviewMode] = useState<'3d' | 'detailed' | 'comparison'>('3d');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotationAngle, setRotationAngle] = useState(0);

  // 定制步骤配置
  const customizationSteps = [
    {
      title: t.customization?.caseTitle || '表壳材质',
      key: 'case_material',
      description: t.customization?.caseDescription || '选择您喜欢的表壳材质',
      icon: '⚙️',
      color: '#1890ff'
    },
    {
      title: t.customization?.dialTitle || '表盘风格',
      key: 'dial_style',
      description: t.customization?.dialDescription || '个性化您的表盘设计',
      icon: '🎨',
      color: '#52c41a'
    },
    {
      title: t.customization?.handsTitle || '指针样式',
      key: 'hour_minute_hands',
      description: t.customization?.handsDescription || '选择时分针设计',
      icon: '🕐',
      color: '#fa8c16'
    },
    {
      title: t.customization?.secondHandTitle || '秒针设计',
      key: 'second_hand',
      description: t.customization?.secondHandDescription || '个性化秒针风格',
      icon: '⏱️',
      color: '#eb2f96'
    },
    {
      title: t.customization?.strapTitle || '表带类型',
      key: 'strap_type',
      description: t.customization?.strapDescription || '选择舒适的表带材质',
      icon: '🔗',
      color: '#722ed1'
    },
    {
      title: t.customization?.movementTitle || '机芯配置',
      key: 'movement_type',
      description: t.customization?.movementDescription || '选择精密机芯',
      icon: '⚡',
      color: '#13c2c2'
    }
  ];

  // 计算完成进度
  const completedSteps = Object.keys(configuration).length;
  const progressPercentage = Math.round((completedSteps / customizationSteps.length) * 100);

  // 处理配置变更
  const handleConfigChange = useCallback((optionId: string, valueId: string) => {
    const newConfig = { ...configuration, [optionId]: valueId };
    setConfiguration(newConfig);
    
    // 计算新价格
    const option = product.customizationOptions.find(opt => opt.id === optionId);
    const value = option?.values.find(val => val.id === valueId);
    
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

  // 渲染3D预览区域
  const render3DPreview = () => (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
      {/* 3D预览控制条 */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex justify-between items-center bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
          <div className="flex items-center space-x-2">
            <Button
              type="text"
              icon={<RotateLeftOutlined />}
              onClick={() => setRotationAngle(prev => prev - 15)}
              size="small"
            />
            <Button
              type="text"
              icon={<RotateRightOutlined />}
              onClick={() => setRotationAngle(prev => prev + 15)}
              size="small"
            />
            <Divider type="vertical" />
            <Button
              type="text"
              icon={<ZoomOutOutlined />}
              onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}
              size="small"
            />
            <span className="text-xs text-gray-500">{zoomLevel}%</span>
            <Button
              type="text"
              icon={<ZoomInOutlined />}
              onClick={() => setZoomLevel(prev => Math.min(200, prev + 10))}
              size="small"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              type={previewMode === '3d' ? 'primary' : 'text'}
              size="small"
              onClick={() => setPreviewMode('3d')}
            >
              3D
            </Button>
            <Button
              type={previewMode === 'detailed' ? 'primary' : 'text'}
              size="small"
              onClick={() => setPreviewMode('detailed')}
            >
              细节
            </Button>
            <Button
              type={previewMode === 'comparison' ? 'primary' : 'text'}
              size="small"
              onClick={() => setPreviewMode('comparison')}
            >
              对比
            </Button>
          </div>
        </div>
      </div>

      {/* 主预览区域 */}
      <div className="flex items-center justify-center h-full">
        <div 
          className="relative transition-all duration-500 ease-in-out"
          style={{ 
            transform: `rotate(${rotationAngle}deg) scale(${zoomLevel / 100})`,
            transformOrigin: 'center'
          }}
        >
          {/* 手表主体预览 */}
          <div className="w-80 h-80 bg-white rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden">
            {/* 表盘背景 */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 shadow-inner">
              {/* 表盘装饰 */}
              <div className="absolute inset-2 rounded-full border-2 border-gold-400">
                {/* 时标 */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-6 bg-gold-400"
                    style={{
                      top: '10px',
                      left: '50%',
                      transformOrigin: 'bottom center',
                      transform: `translateX(-50%) rotate(${i * 30}deg)`
                    }}
                  />
                ))}
                
                {/* 指针 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* 时针 */}
                  <div 
                    className="absolute w-1 bg-white shadow-lg"
                    style={{
                      height: '60px',
                      top: '40px',
                      left: '50%',
                      transformOrigin: 'bottom center',
                      transform: 'translateX(-50%) rotate(45deg)'
                    }}
                  />
                  {/* 分针 */}
                  <div 
                    className="absolute w-0.5 bg-white shadow-lg"
                    style={{
                      height: '80px',
                      top: '30px',
                      left: '50%',
                      transformOrigin: 'bottom center',
                      transform: 'translateX(-50%) rotate(90deg)'
                    }}
                  />
                  {/* 秒针 */}
                  <div 
                    className="absolute w-px bg-red-500"
                    style={{
                      height: '90px',
                      top: '25px',
                      left: '50%',
                      transformOrigin: 'bottom center',
                      transform: 'translateX(-50%) rotate(180deg)'
                    }}
                  />
                  {/* 中心圆 */}
                  <div className="w-3 h-3 bg-white rounded-full shadow-lg" />
                </div>
              </div>
            </div>
            
            {/* 表冠 */}
            <div className="absolute right-0 top-1/2 w-6 h-8 bg-gradient-to-r from-gray-600 to-gray-400 rounded-r-lg transform -translate-y-1/2 shadow-lg" />
          </div>
          
          {/* 表带 */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-40 bg-gradient-to-b from-amber-800 to-amber-900 rounded-t-lg shadow-lg" />
          </div>
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-40 bg-gradient-to-t from-amber-800 to-amber-900 rounded-b-lg shadow-lg" />
          </div>
        </div>
      </div>

      {/* 预览信息覆盖层 */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <Text strong className="block">{product.name}</Text>
              <Text type="secondary" className="text-sm">个人定制版本</Text>
            </div>
            <div className="text-right">
              <Statistic
                value={pricing.finalPrice}
                prefix="¥"
                valueStyle={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}
              />
              {pricing.totalModifier > 0 && (
                <Text type="secondary" className="text-xs">
                  (基础价格 ¥{pricing.basePrice.toLocaleString()} + 定制费用 ¥{pricing.totalModifier.toLocaleString()})
                </Text>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 渲染配置总览
  const renderConfigSummary = () => (
    <Card className="mb-4" size="small">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Title level={5} className="mb-0">🎯 定制进度</Title>
          <Progress
            percent={progressPercentage}
            size="small"
            strokeColor="#1890ff"
            showInfo={false}
            className="w-20"
          />
        </div>
        
        <List
          size="small"
          dataSource={customizationSteps}
          renderItem={(step, index) => {
            const isCompleted = configuration[step.key];
            const option = product.customizationOptions.find(opt => opt.id === step.key);
            const selectedValue = isCompleted ? option?.values.find(v => v.id === configuration[step.key]) : null;
            
            return (
              <List.Item 
                className={`py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentStep === index 
                    ? 'bg-blue-50 border-l-4 border-blue-500' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      size="small" 
                      style={{ 
                        backgroundColor: isCompleted ? step.color : '#f0f0f0',
                        color: isCompleted ? 'white' : '#999'
                      }}
                    >
                      {isCompleted ? <CheckOutlined /> : step.icon}
                    </Avatar>
                  }
                  title={
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.title}
                      </span>
                      {selectedValue && (
                        <Tag size="small" color={step.color}>
                          {selectedValue.displayName}
                        </Tag>
                      )}
                    </div>
                  }
                  description={
                    selectedValue && selectedValue.priceModifier > 0 && (
                      <Text type="secondary" className="text-xs">
                        +¥{selectedValue.priceModifier.toLocaleString()}
                      </Text>
                    )
                  }
                />
              </List.Item>
            );
          }}
        />
      </div>
    </Card>
  );

  // 渲染当前步骤选项
  const renderCurrentStepOptions = () => {
    const step = customizationSteps[currentStep];
    const option = product.customizationOptions.find(opt => opt.id === step.key);
    
    if (!option) {
      return <div>选项未找到</div>;
    }

    return (
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <span style={{ color: step.color }}>{step.icon}</span>
            <span>{step.title}</span>
            {option.required && <Badge color="red" text="必选" size="small" />}
          </div>
        }
        size="small"
      >
        <Paragraph className="text-gray-600 mb-4 text-sm">
          {step.description}
        </Paragraph>
        
        <div className="space-y-3">
          {option.values.map(value => {
            const isSelected = configuration[option.id] === value.id;
            return (
              <div
                key={value.id}
                className={`
                  p-3 border-2 rounded-lg cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }
                  ${!value.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={() => value.isAvailable && handleConfigChange(option.id, value.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Text strong className="text-sm">{value.displayName}</Text>
                      {isSelected && (
                        <CheckOutlined className="text-blue-500" />
                      )}
                    </div>
                    {value.description && (
                      <Text type="secondary" className="text-xs block mt-1">
                        {value.description}
                      </Text>
                    )}
                  </div>
                  
                  {value.priceModifier > 0 && (
                    <div className="text-right">
                      <Text className="text-sm font-semibold text-blue-600">
                        +¥{value.priceModifier.toLocaleString()}
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部进度导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Title level={4} className="mb-0">🎨 个人定制专区</Title>
              <Text type="secondary">为您打造独一无二的时计作品</Text>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <Text type="secondary" className="block text-xs">完成进度</Text>
                <Text strong>{completedSteps}/{customizationSteps.length}</Text>
              </div>
              <Progress
                percent={progressPercentage}
                strokeColor="#1890ff"
                className="w-32"
              />
            </div>
          </div>
          
          <Steps
            current={currentStep}
            onChange={setCurrentStep}
            size="small"
            items={customizationSteps.map((step, index) => ({
              title: step.title,
              icon: configuration[step.key] ? <CheckOutlined /> : step.icon,
              description: configuration[step.key] ? '已完成' : '待配置'
            }))}
          />
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Row gutter={24} className="min-h-[600px]">
          {/* 左侧：3D预览区域 (2/3) */}
          <Col xs={24} lg={16}>
            <Card className="h-full" bodyStyle={{ padding: 0, height: '600px' }}>
              {render3DPreview()}
            </Card>
          </Col>

          {/* 右侧：定制面板 (1/3) */}
          <Col xs={24} lg={8}>
            <div className="space-y-4">
              {/* 配置总览 */}
              {renderConfigSummary()}
              
              {/* 当前步骤选项 */}
              {renderCurrentStepOptions()}
              
              {/* 操作按钮 */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Button
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    icon={<LeftOutlined />}
                  >
                    上一步
                  </Button>
                  <Button
                    type="primary"
                    disabled={currentStep === customizationSteps.length - 1}
                    onClick={() => setCurrentStep(prev => Math.min(customizationSteps.length - 1, prev + 1))}
                    icon={<RightOutlined />}
                  >
                    下一步
                  </Button>
                </div>
                
                {completedSteps === customizationSteps.length && (
                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<ShoppingCartOutlined />}
                    onClick={() => {
                      const customizationDetails: CustomizationDetails = {
                        configuration,
                        totalPrice: pricing.finalPrice,
                        priceBreakdown: pricing.breakdown
                      };
                      onAddToCart(customizationDetails);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg"
                  >
                    立即加入购物车 - ¥{pricing.finalPrice.toLocaleString()}
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default WatchCustomizerImmersive; 