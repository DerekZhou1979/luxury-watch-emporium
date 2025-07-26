import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Steps,
  Button,
  Space,
  Typography,
  Select,
  Radio,
  Input,
  Slider,
  ColorPicker,
  Badge,
  Tooltip,
  Divider,
  Alert,
  notification,
  Modal,
  Image,
  Tag
} from 'antd';
import {
  CheckOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  LeftOutlined,
  RightOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import {
  CustomizableProduct,
  CustomizationOption,
  CustomizationConfiguration,
  CustomizationCategory,
  CustomizationPricing,
  CustomizationValidation
} from '../seagull-watch-customization-types';
import { CustomizationDetails, CustomizationPriceBreakdown } from '../seagull-watch-types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface WatchCustomizerProps {
  product: CustomizableProduct;
  onConfigurationChange: (config: CustomizationConfiguration) => void;
  onAddToCart: (customization: CustomizationDetails) => void;
  initialConfiguration?: Partial<CustomizationConfiguration>;
}

const WatchCustomizer: React.FC<WatchCustomizerProps> = ({
  product,
  onConfigurationChange,
  onAddToCart,
  initialConfiguration = {}
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [configuration, setConfiguration] = useState<Record<string, string>>({});
  const [pricing, setPricing] = useState<CustomizationPricing>({
    basePrice: product.basePrice,
    optionPricing: {},
    totalModifier: 0,
    finalPrice: product.basePrice,
    breakdown: []
  });
  const [validation, setValidation] = useState<CustomizationValidation>({
    isValid: true,
    errors: [],
    warnings: []
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);


  // 定制步骤配置
  const customizationSteps = [
    {
      title: '表壳',
      key: 'case_material',
      description: '选择表壳材质、工艺和处理方式',
      icon: '⚙️'
    },
    {
      title: '表盘',
      key: 'dial_style',
      description: '配置表盘颜色、纹理和样式',
      icon: '🎨'
    },
    {
      title: '时分针',
      key: 'hour_minute_hands',
      description: '选择时针和分针的设计风格',
      icon: '🕐'
    },
    {
      title: '秒针',
      key: 'second_hand',
      description: '配置秒针颜色和造型设计',
      icon: '⏱️'
    },
    {
      title: '表带',
      key: 'strap_type',
      description: '选择表带类型、材质和颜色',
      icon: '🔗'
    },
    {
      title: '机芯',
      key: 'movement_type',
      description: '选择机芯类型和功能配置',
      icon: '⚡'
    }
  ].filter(step => {
    // 检查是否有对应的选项
    return product.customizationOptions.some(option => option.id === step.key);
  });

  // 初始化配置
  useEffect(() => {
    console.log('初始化配置开始...', { initialConfiguration, productOptions: product.customizationOptions });
    
    // 设置默认值
    const defaultConfig: Record<string, string> = {};
    
    // 为每个选项设置默认值
    product.customizationOptions.forEach(option => {
      if (option.defaultValue) {
        defaultConfig[option.id] = option.defaultValue;
        console.log('设置默认值:', option.id, '=', option.defaultValue);
      }
    });
    
    console.log('完整默认配置:', defaultConfig);
    
    // 如果有初始配置，使用它，否则使用默认配置
    const finalConfig = initialConfiguration?.configurations || defaultConfig;
    console.log('最终配置:', finalConfig);
    
    setConfiguration(finalConfig);
    calculatePricing(finalConfig); // 重新启用价格计算
  }, [initialConfiguration?.configurations, product.customizationOptions]);

  // 当配置发生变化时，立即重新计算价格
  useEffect(() => {
    console.log('配置状态更新:', configuration);
    calculatePricing(configuration); // 重新启用价格计算
    validateConfiguration(configuration); // 重新启用验证
  }, [configuration]);

  // 当价格更新时，记录日志
  useEffect(() => {
    console.log('价格状态更新:', pricing); // 调试日志
  }, [pricing]);

  // 计算价格
  const calculatePricing = useCallback((config: Record<string, string>) => {
    console.log('开始计算价格:', { productBasePrice: product.basePrice, config });
    
    let totalModifier = 0;
    const optionPricing: Record<string, number> = {};
    const breakdown: any[] = [
      {
        category: '基础',
        name: product.name,
        price: product.basePrice,
        type: 'base'
      }
    ];

    product.customizationOptions.forEach(option => {
      const selectedValueId = config[option.id];
      console.log('处理选项:', option.id, '选中值:', selectedValueId);
      if (selectedValueId) {
        const selectedValue = option.values.find(v => v.value === selectedValueId);
        console.log('找到选中值详情:', selectedValue);
        if (selectedValue && selectedValue.priceModifier !== 0) {
          optionPricing[option.id] = selectedValue.priceModifier;
          totalModifier += selectedValue.priceModifier;
          breakdown.push({
            category: option.category,
            name: `${option.displayName}: ${selectedValue.displayName}`,
            price: selectedValue.priceModifier,
            type: 'option'
          });
        }
      }
    });

    const finalPricing = {
      basePrice: product.basePrice,
      optionPricing,
      totalModifier,
      finalPrice: product.basePrice + totalModifier,
      breakdown
    };
    
    console.log('计算得出的价格信息:', finalPricing);
    setPricing(finalPricing);
  }, [product.basePrice, product.customizationOptions, product.name]);

  // 验证配置
  const validateConfiguration = useCallback((config: Record<string, string>) => {
    const errors: any[] = [];
    const warnings: any[] = [];

    product.customizationOptions.forEach(option => {
      if (option.required && !config[option.id]) {
        errors.push({
          optionId: option.id,
          message: `请选择${option.displayName}`,
          code: 'REQUIRED_MISSING'
        });
      }

      const selectedValueId = config[option.id];
      if (selectedValueId) {
        const selectedValue = option.values.find(v => v.value === selectedValueId);
        if (selectedValue && !selectedValue.isAvailable) {
          warnings.push({
            optionId: option.id,
            message: `所选${option.displayName}暂时缺货`,
            code: 'OUT_OF_STOCK'
          });
        }
      }
    });

    setValidation({
      isValid: errors.length === 0,
      errors,
      warnings
    });
  }, [product.customizationOptions]);

  // 配置变更处理
  const handleConfigurationChange = useCallback((optionId: string, valueId: string) => {
    console.log('配置变更:', optionId, '=', valueId);
    const newConfig = { ...configuration, [optionId]: valueId };
    console.log('新配置:', newConfig);
    setConfiguration(newConfig);
  }, [configuration]);

  // 渲染选项控件
  const renderOptionControl = (option: CustomizationOption) => {
    const selectedValue = configuration[option.id];
    console.log('渲染选项控件:', option.id, '当前选中值:', selectedValue);

    // 改进版本 - 功能性但更美观
    if (option.type === 'image') {
      return (
        <div className="grid grid-cols-2 gap-3">
          {option.values.map(value => {
            const isSelected = selectedValue === value.value;
            console.log(`${value.displayName}: 选中=${isSelected} (${selectedValue} === ${value.value})`);
            
            return (
              <div
                key={value.id}
                style={{
                  border: isSelected ? '3px solid #3b82f6' : '2px solid #e5e7eb',
                  backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                  padding: '16px',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
                onClick={() => {
                  console.log('点击选项:', value.displayName, '值:', value.value);
                  if (value.isAvailable) {
                    handleConfigurationChange(option.id, value.value);
                  }
                }}
              >
                {/* 选中状态指示器 */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 10,
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                  }}>
                    ✓
                  </div>
                )}
                
                {/* 图标区域 */}
                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                  <div style={{
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? '#ffffff' : '#f9fafb',
                    display: 'inline-block'
                  }}>
                    <img 
                      src={value.imageUrl} 
                      alt={value.displayName}
                      style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                    />
                  </div>
                </div>
                
                {/* 选项信息 */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: isSelected ? '#1e40af' : '#374151',
                    marginBottom: '4px'
                  }}>
                    {value.displayName}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    lineHeight: '1.4',
                    marginBottom: '8px'
                  }}>
                    {value.description}
                  </div>
                  
                  {/* 价格信息 */}
                  {value.priceModifier !== 0 && (
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? '#dbeafe' : '#f3f4f6',
                      color: isSelected ? '#1d4ed8' : '#374151',
                      display: 'inline-block'
                    }}>
                      +¥{value.priceModifier.toLocaleString()}
                    </div>
                  )}
                  
                  {!value.isAvailable && (
                    <div style={{
                      fontSize: '12px',
                      color: '#ef4444',
                      fontWeight: '500',
                      marginTop: '4px'
                    }}>
                      暂无库存
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // 其他类型暂时返回简单版本
    return <div>暂不支持此选项类型: {option.type}</div>;
  };

  // 渲染当前步骤内容
  const renderStepContent = () => {
    if (currentStep >= customizationSteps.length) return null;

    const step = customizationSteps[currentStep];
    const stepOption = product.customizationOptions.find(option => option.id === step.key);

    if (!stepOption) {
      console.error('找不到步骤对应的选项:', step.key);
      return <div>配置选项不存在</div>;
    }

    return (
      <div className="space-y-5">
        <div className="text-center">
          <div className="text-3xl mb-1">{step.icon}</div>
          <Title level={4} className="mb-1">{step.title}</Title>
          <Paragraph type="secondary" className="text-sm mb-0">{step.description}</Paragraph>
        </div>

        <Card 
          key={stepOption.id}
          title={
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <span className="text-sm">{stepOption.displayName}</span>
                {stepOption.required && <Badge color="red" text="必选" size="small" />}
              </span>
              {stepOption.description && (
                <Tooltip title={stepOption.description}>
                  <InfoCircleOutlined className="text-gray-400 text-xs" />
                </Tooltip>
              )}
            </div>
          }
          className="shadow-sm"
          size="small"
          bodyStyle={{ padding: '12px' }}
        >
          {renderOptionControl(stepOption)}
        </Card>
      </div>
    );
  };

  const previousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  // 获取配置项的显示名称
  const getConfigDisplayInfo = (key: string, value: string) => {
    const option = product.customizationOptions.find(opt => opt.id === key);
    if (!option) return { name: key, displayName: value, image: null, price: 0 };
    
    const valueOption = option.values?.find(v => v.value === value);
    return {
      name: option.displayName,
      displayName: valueOption?.displayName || value,
      image: valueOption?.imageUrl || null,
      price: valueOption?.priceModifier || 0
    };
  };

  // 处理最终确认
  const handleFinalConfirm = () => {
    const customizationDetails: CustomizationDetails = {
      id: `custom_${Date.now()}`,
      productId: product.id,
      configurations: configuration,
      priceBreakdown: pricing.breakdown.map(item => ({
        category: item.category,
        name: item.name,
        price: item.price,
        type: item.type as 'base' | 'option'
      })),
      basePrice: product.basePrice,
      totalModifier: pricing.totalModifier,
      finalPrice: pricing.finalPrice,
      createdAt: new Date().toISOString()
    };
    
    onAddToCart(customizationDetails);
    setShowConfirmModal(false);
    
    notification.success({
      message: '定制手表已添加到购物车',
      description: '您的个性化手表已成功添加到购物车！',
      duration: 3,
    });

    // 延迟1.5秒后导航回产品页面，让用户看到成功消息
    setTimeout(() => {
      navigate('/products');
    }, 1500);
  };

  // 确认弹窗组件
  const ConfirmationModal = () => (
    <Modal
      title={null}
      open={showConfirmModal}
      onCancel={() => setShowConfirmModal(false)}
      footer={null}
      width={600}
      centered
      className="confirmation-modal"
    >
      <div className="p-6">
        {/* 标题部分 */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">⌚</div>
          <Title level={3} className="mb-2">确认您的定制手表</Title>
          <Text type="secondary">请仔细核对以下配置信息</Text>
        </div>

        {/* 产品基本信息 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-2xl">⌚</span>
            </div>
            <div className="flex-1">
              <Title level={4} className="mb-1">{product.name}</Title>
              <Text type="secondary" className="block">{product.description}</Text>
              <Tag color="blue" className="mt-2">定制版</Tag>
            </div>
          </div>
        </div>

        {/* 配置清单 */}
        <div className="mb-6">
          <Title level={5} className="mb-4 flex items-center">
            <span className="mr-2">🎨</span>
            定制配置清单
          </Title>
          <div className="space-y-3">
            {Object.entries(configuration).map(([key, value]) => {
              const info = getConfigDisplayInfo(key, value);
              return (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {info.image && (
                      <div className="w-8 h-8 rounded overflow-hidden">
                        <img 
                          src={info.image} 
                          alt={info.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-700">{info.name}</div>
                      <div className="text-sm text-gray-600">{info.displayName}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {info.price > 0 && (
                      <div className="text-sm text-blue-600 font-medium">
                        +¥{info.price.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 价格明细 */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6">
          <Title level={5} className="mb-3 flex items-center">
            <span className="mr-2">💰</span>
            价格明细
          </Title>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>基础价格</span>
              <span>¥{pricing.basePrice.toLocaleString()}</span>
            </div>
            {pricing.totalModifier > 0 && (
              <div className="flex justify-between text-blue-600">
                <span>定制费用</span>
                <span>+¥{pricing.totalModifier.toLocaleString()}</span>
              </div>
            )}
            <Divider className="my-2" />
            <div className="flex justify-between text-lg font-bold text-gray-800">
              <span>总计</span>
              <span>¥{pricing.finalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 温馨提示 */}
        <Alert
          message="温馨提示"
          description="定制手表制作周期约15-20个工作日，我们会及时为您更新制作进度。"
          type="info"
          showIcon
          className="mb-6"
        />

        {/* 操作按钮 */}
        <div className="flex justify-center space-x-4">
          <Button 
            size="large"
            onClick={() => setShowConfirmModal(false)}
          >
            返回修改
          </Button>
          <Button 
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={handleFinalConfirm}
            className="px-8"
          >
            确认并加入购物车
          </Button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="watch-customizer">
      {/* 调试信息显示 */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <div className="text-sm font-semibold text-green-800 mb-2">✅ 定制状态正常</div>
        <div className="text-xs text-green-700">
          <div>步骤: {currentStep + 1}/{customizationSteps.length} | 
               已选择: {Object.keys(configuration).length} 项 | 
               总价: ¥{pricing.finalPrice.toLocaleString()}</div>
        </div>
      </div>

      {/* 步骤指示器 */}
      <Steps
        current={currentStep}
        size="small"
        className="mb-5"
        items={customizationSteps.map(step => ({
          title: step.title,
          icon: <span className="text-base">{step.icon}</span>
        }))}
      />

      {/* 步骤进度指示 */}
      <div className="text-center mb-4">
        <Text type="secondary" className="text-sm">
          步骤 {currentStep + 1} / {customizationSteps.length}
        </Text>
      </div>

      {/* 验证提示 */}
      {validation.errors.length > 0 && (
        <Alert
          type="error"
          message="配置错误"
          description={
            <ul className="mb-0">
              {validation.errors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          }
          className="mb-4"
        />
      )}

      {validation.warnings.length > 0 && (
        <Alert
          type="warning"
          message="注意事项"
          description={
            <ul className="mb-0">
              {validation.warnings.map((warning, index) => (
                <li key={index}>{warning.message}</li>
              ))}
            </ul>
          }
          className="mb-4"
        />
      )}

      {/* 当前步骤内容 */}
      <div className="min-h-96">
        {renderStepContent()}
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200">
        <Button 
          disabled={currentStep === 0}
          onClick={previousStep}
          icon={<LeftOutlined />}
          size="large"
        >
          上一步
        </Button>

        <div className="text-center flex-1 mx-4">
          {/* 价格信息 */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">预计定制费用</div>
            <div className="text-lg font-bold text-blue-600">
              ¥{pricing.finalPrice.toLocaleString()}
            </div>
            {pricing.totalModifier > 0 && (
              <div className="text-xs text-gray-500">
                基础价格 ¥{pricing.basePrice.toLocaleString()} + 定制费用 ¥{pricing.totalModifier.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {currentStep < customizationSteps.length - 1 ? (
          <Button 
            type="primary"
            onClick={nextStep}
            icon={<RightOutlined />}
            size="large"
          >
            下一步
          </Button>
        ) : (
          <Button 
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            disabled={!validation.isValid || validation.warnings.length > 0}
            onClick={() => {
              setShowConfirmModal(true);
            }}
          >
            确认定制
          </Button>
        )}
      </div>
      <ConfirmationModal />
    </div>
  );
};

export default WatchCustomizer; 