import React, { useState, useEffect, useCallback } from 'react';
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
  notification
} from 'antd';
import {
  CheckOutlined,
  InfoCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import {
  CustomizableProduct,
  CustomizationOption,
  CustomizationConfiguration,
  CustomizationCategory,
  CustomizationPricing,
  CustomizationValidation
} from '../seagull-watch-customization-types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface WatchCustomizerProps {
  product: CustomizableProduct;
  onConfigurationChange: (config: CustomizationConfiguration) => void;
  onAddToCart: (config: CustomizationConfiguration) => void;
  initialConfiguration?: Partial<CustomizationConfiguration>;
}

const WatchCustomizer: React.FC<WatchCustomizerProps> = ({
  product,
  onConfigurationChange,
  onAddToCart,
  initialConfiguration
}) => {
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


  // 按类别分组的定制选项
  const optionsByCategory = product.customizationOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<CustomizationCategory, CustomizationOption[]>);

  // 定制步骤配置
  const customizationSteps = [
    {
      title: '表壳',
      key: CustomizationCategory.CASE,
      description: '选择表壳材质、尺寸和颜色',
      icon: '⌚'
    },
    {
      title: '表盘',
      key: CustomizationCategory.DIAL,
      description: '配置表盘颜色和样式',
      icon: '🎨'
    },
    {
      title: '指针',
      key: CustomizationCategory.HANDS,
      description: '选择指针样式和颜色',
      icon: '⏱️'
    },
    {
      title: '表带',
      key: CustomizationCategory.STRAP,
      description: '选择表带类型和颜色',
      icon: '🔗'
    },
    {
      title: '刻字',
      key: CustomizationCategory.ENGRAVING,
      description: '个性化刻字服务',
      icon: '✍️'
    }
  ].filter(step => optionsByCategory[step.key as CustomizationCategory]);

  // 初始化配置
  useEffect(() => {
    if (initialConfiguration?.configurations) {
      setConfiguration(initialConfiguration.configurations);
    } else {
      // 设置默认值
      const defaultConfig: Record<string, string> = {};
      product.customizationOptions.forEach(option => {
        if (option.defaultValue) {
          defaultConfig[option.id] = option.defaultValue;
        }
      });
      setConfiguration(defaultConfig);
    }
  }, [initialConfiguration, product.customizationOptions]);

  // 计算价格
  const calculatePricing = useCallback((config: Record<string, string>) => {
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
      if (selectedValueId) {
        const selectedValue = option.values.find(v => v.id === selectedValueId);
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

    setPricing({
      basePrice: product.basePrice,
      optionPricing,
      totalModifier,
      finalPrice: product.basePrice + totalModifier,
      breakdown
    });
  }, [product]);

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
        const selectedValue = option.values.find(v => v.id === selectedValueId);
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
    const newConfig = { ...configuration, [optionId]: valueId };
    setConfiguration(newConfig);
    calculatePricing(newConfig);
    validateConfiguration(newConfig);

    // 生成预览图片（模拟） - 预览功能已移至独立区域

    // 通知父组件
    const fullConfig: CustomizationConfiguration = {
      id: '',
      productId: product.id,
      configurations: newConfig,
      totalPriceModifier: pricing.totalModifier,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isValid: validation.isValid
    };
    onConfigurationChange(fullConfig);
  }, [configuration, calculatePricing, validateConfiguration, pricing.totalModifier, validation.isValid, product.id, onConfigurationChange]);

  // 渲染选项控件
  const renderOptionControl = (option: CustomizationOption) => {
    const selectedValue = configuration[option.id];

    switch (option.type) {
      case 'select':
        return (
          <Select
            value={selectedValue}
            onChange={(value) => handleConfigurationChange(option.id, value)}
            placeholder={`请选择${option.displayName}`}
            className="w-full"
            size="large"
          >
            {option.values.map(value => (
              <Option 
                key={value.id} 
                value={value.id}
                disabled={!value.isAvailable}
              >
                <div className="flex items-center justify-between">
                  <span>{value.displayName}</span>
                  {value.priceModifier !== 0 && (
                    <span className="text-sm text-gray-500">
                      {value.priceModifier > 0 ? '+' : ''}¥{value.priceModifier}
                    </span>
                  )}
                </div>
              </Option>
            ))}
          </Select>
        );

      case 'color':
        return (
          <div className="grid grid-cols-6 gap-3">
            {option.values.map(value => (
              <Tooltip key={value.id} title={value.displayName}>
                <div
                  className={`w-12 h-12 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedValue === value.id 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!value.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: value.hexColor }}
                  onClick={() => value.isAvailable && handleConfigurationChange(option.id, value.id)}
                >
                  {selectedValue === value.id && (
                    <div className="w-full h-full flex items-center justify-center">
                      <CheckOutlined className="text-white text-xl" />
                    </div>
                  )}
                </div>
              </Tooltip>
            ))}
          </div>
        );

      case 'text':
        return (
          <Input
            value={selectedValue || ''}
            onChange={(e) => handleConfigurationChange(option.id, e.target.value)}
            placeholder={option.description}
            maxLength={option.maxLength}
            showCount
            size="large"
          />
        );

      case 'image':
        return (
          <div className="grid grid-cols-3 gap-4">
            {option.values.map(value => (
              <div
                key={value.id}
                className={`relative p-2 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedValue === value.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${!value.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => value.isAvailable && handleConfigurationChange(option.id, value.id)}
              >
                <img 
                  src={value.imageUrl} 
                  alt={value.displayName}
                  className="w-full h-20 object-cover rounded"
                />
                <div className="text-center mt-2 text-sm">{value.displayName}</div>
                {selectedValue === value.id && (
                  <div className="absolute top-1 right-1 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center">
                    <CheckOutlined className="text-white text-xs" />
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // 渲染当前步骤内容
  const renderStepContent = () => {
    if (currentStep >= customizationSteps.length) return null;

    const step = customizationSteps[currentStep];
    const categoryOptions = optionsByCategory[step.key as CustomizationCategory] || [];

    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="text-4xl mb-2">{step.icon}</div>
          <Title level={3}>{step.title}</Title>
          <Paragraph type="secondary">{step.description}</Paragraph>
        </div>

        {categoryOptions.map(option => (
          <Card 
            key={option.id}
            title={
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <span>{option.displayName}</span>
                  {option.required && <Badge color="red" text="必选" />}
                </span>
                {option.description && (
                  <Tooltip title={option.description}>
                    <InfoCircleOutlined className="text-gray-400" />
                  </Tooltip>
                )}
              </div>
            }
            className="shadow-sm"
          >
            {renderOptionControl(option)}
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="watch-customizer">
      {/* 步骤指示器 */}
      <Steps
        current={currentStep}
        size="small"
        className="mb-8"
        items={customizationSteps.map(step => ({
          title: step.title,
          icon: <span className="text-lg">{step.icon}</span>
        }))}
      />

      {/* 步骤进度指示 */}
      <div className="text-center mb-6">
        <Text type="secondary">
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
      <div className="min-h-64 mb-8">
        {renderStepContent()}
      </div>

      {/* 价格显示 */}
      <Card className="shadow-sm mb-6" title="价格明细">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4">
            <div>
              <Text type="secondary" className="block">基础价格</Text>
              <Text className="text-lg">¥{pricing.basePrice.toLocaleString()}</Text>
            </div>
            {pricing.totalModifier !== 0 && (
              <>
                <div className="text-gray-300">+</div>
                <div>
                  <Text type="secondary" className="block">定制费用</Text>
                  <Text className={`text-lg ${pricing.totalModifier > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                    {pricing.totalModifier > 0 ? '+' : ''}¥{pricing.totalModifier.toLocaleString()}
                  </Text>
                </div>
              </>
            )}
            <div className="text-gray-300">=</div>
            <div>
              <Text type="secondary" className="block">最终价格</Text>
              <Title level={4} className="text-blue-600 m-0">
                ¥{pricing.finalPrice.toLocaleString()}
              </Title>
            </div>
          </div>
        </div>
      </Card>

      <Divider />

      {/* 步骤导航 - 放在最底部 */}
      <div className="flex justify-between items-center">
        <Button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(prev => prev - 1)}
          size="large"
        >
          上一步
        </Button>
        
        <Space>
          {currentStep < customizationSteps.length - 1 ? (
            <Button
              type="primary"
              size="large"
              onClick={() => setCurrentStep(prev => prev + 1)}
            >
              下一步
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              disabled={!validation.isValid}
              onClick={() => {
                const fullConfig: CustomizationConfiguration = {
                  id: '',
                  productId: product.id,
                  configurations: configuration,
                  totalPriceModifier: pricing.totalModifier,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  isValid: validation.isValid
                };
                onAddToCart(fullConfig);
                notification.success({
                  message: '已添加到定制清单',
                  description: '您的定制手表已成功添加到定制清单！',
                });
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
            >
              确认定制 (¥{pricing.finalPrice.toLocaleString()})
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
};

export default WatchCustomizer; 