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
  Divider
} from 'antd';
import {
  CheckOutlined,
  LeftOutlined,
  RightOutlined,
  ShoppingCartOutlined
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
  const [validation, setValidation] = useState<CustomizationValidation>({
    isValid: true,
    errors: [],
    warnings: []
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 定制步骤配置
  const customizationSteps = [
    {
      title: t.customization.caseTitle,
      key: 'case_material',
      description: t.customization.caseDescription,
      icon: '⚙️'
    },
    {
      title: t.customization.dialTitle,
      key: 'dial_style',
      description: t.customization.dialDescription,
      icon: '🎨'
    },
    {
      title: t.customization.handsTitle,
      key: 'hour_minute_hands',
      description: t.customization.handsDescription,
      icon: '🕐'
    },
    {
      title: t.customization.secondHandTitle,
      key: 'second_hand',
      description: t.customization.secondHandDescription,
      icon: '⏱️'
    },
    {
      title: t.customization.strapTitle,
      key: 'strap_type',
      description: t.customization.strapDescription,
      icon: '🔗'
    },
    {
      title: t.customization.movementTitle,
      key: 'movement_type',
      description: t.customization.movementDescription,
      icon: '⚡'
    }
  ].filter(step => {
    return product.customizationOptions.some(option => option.id === step.key);
  });

  // 计算价格
  const calculatePricing = useCallback((config: Record<string, string>) => {
    let totalModifier = 0;
    const breakdown: any[] = [];

    // 基础价格
    breakdown.push({
      category: t.customization.basePrice,
      name: product.name,
      price: product.basePrice,
      type: 'base'
    });

    // 计算每个选项的价格修正
    Object.entries(config).forEach(([optionId, valueId]) => {
      const option = product.customizationOptions.find(opt => opt.id === optionId);
      if (option) {
        const selectedValue = option.values.find(val => val.id === valueId);
        if (selectedValue && selectedValue.priceModifier > 0) {
          totalModifier += selectedValue.priceModifier;
          breakdown.push({
            category: option.displayName,
            name: selectedValue.displayName,
            price: selectedValue.priceModifier,
            type: 'option'
          });
        }
      }
    });

    const finalPrice = product.basePrice + totalModifier;

    setPricing({
      basePrice: product.basePrice,
      optionPricing: {},
      totalModifier,
      finalPrice,
      breakdown
    });
  }, [product, t]);

  // 验证配置
  const validateConfiguration = useCallback((config: Record<string, string>) => {
    const errors: any[] = [];
    const warnings: any[] = [];

    product.customizationOptions.forEach(option => {
      if (option.required && !config[option.id]) {
        errors.push({
          optionId: option.id,
          message: `${t.customization.selectOption}: ${option.displayName}`,
          code: 'REQUIRED_MISSING'
        });
      }
    });

    setValidation({
      isValid: errors.length === 0,
      errors,
      warnings
    });
  }, [product.customizationOptions, t]);

  // 配置变更处理
  const handleConfigChange = useCallback((optionId: string, valueId: string) => {
    const newConfig = { ...configuration, [optionId]: valueId };
    setConfiguration(newConfig);
    calculatePricing(newConfig);
    validateConfiguration(newConfig);
  }, [configuration, calculatePricing, validateConfiguration]);

  // 渲染选项
  const renderOptions = (option: CustomizationOption) => {
    if (option.type === 'select') {
      return (
        <Select
          value={configuration[option.id]}
          onChange={(value) => handleConfigChange(option.id, value)}
          placeholder={t.customization.selectOption}
          style={{ width: '100%' }}
        >
          {option.values.map(value => (
            <Option key={value.id} value={value.id} disabled={!value.isAvailable}>
              {value.displayName}
              {value.priceModifier > 0 && (
                <span className="ml-2 text-blue-500">
                  +¥{value.priceModifier.toLocaleString()}
                </span>
              )}
            </Option>
          ))}
        </Select>
      );
    }

    // 默认使用图片网格
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {option.values.map(value => {
          const isSelected = configuration[option.id] === value.id;
          return (
            <div 
              key={value.id}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 relative
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${!value.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => value.isAvailable && handleConfigChange(option.id, value.id)}
            >
              {value.imageUrl && (
                <div className="mb-3">
                  <Image
                    src={value.imageUrl}
                    alt={value.displayName}
                    width={80}
                    height={80}
                    className="rounded-md object-cover mx-auto"
                    preview={false}
                  />
                </div>
              )}
              
              <div className="text-center">
                <div className="font-medium text-gray-800 mb-1">{value.displayName}</div>
                {value.description && (
                  <div className="text-sm text-gray-500 mb-2">{value.description}</div>
                )}
                
                {value.priceModifier > 0 && (
                  <div className="text-sm font-semibold text-blue-600">
                    +¥{value.priceModifier.toLocaleString()}
                  </div>
                )}
              </div>
              
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <CheckOutlined className="text-blue-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染当前步骤
  const renderCurrentStep = () => {
    const step = customizationSteps[currentStep];
    const option = product.customizationOptions.find(opt => opt.id === step.key);
    
    if (!option) {
      return <div>{t.customization.optionNotFound}</div>;
    }

    return (
      <Card className="shadow-sm border border-gray-200">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold">{option.displayName}</span>
                {option.required && <Badge color="red" text={t.customization.required} size="small" />}
              </div>
              {option.description && (
                <Text type="secondary" className="text-sm block mt-1">
                  {option.description}
                </Text>
              )}
            </div>
            
            {configuration[option.id] && (
              <div className="text-right">
                <Text type="secondary" className="text-xs block">{t.customization.selected}</Text>
                <Text className="text-sm font-medium">
                  {option.values.find(v => v.id === configuration[option.id])?.displayName}
                </Text>
              </div>
            )}
          </div>
          
          <Paragraph className="text-gray-600 mb-4">
            {step.description}
          </Paragraph>
        </div>
        
        <div className="min-h-[300px]">
          {renderOptions(option)}
        </div>
      </Card>
    );
  };

  // 处理添加到购物车
  const handleAddToCart = () => {
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
      basePrice: pricing.basePrice,
      totalModifier: pricing.totalModifier,
      finalPrice: pricing.finalPrice,
      createdAt: new Date().toISOString()
    };

    onAddToCart(customizationDetails);
    
    notification.success({
      message: t.customization.customWatchAddedToCart,
      description: t.customization.customWatchSuccessfullyAddedToCart,
      duration: 3,
    });

    setShowConfirmModal(false);
  };

  // 步骤导航
  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const nextStep = () => {
    if (currentStep < customizationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="watch-customizer">
      {/* 调试信息 */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <div className="text-sm font-semibold text-green-800 mb-2">{t.customization.customizationNormal}</div>
        <div className="text-xs text-green-700">
          {t.customization.step} {currentStep + 1}/{customizationSteps.length} | 
          {t.customization.selectedOptions}: {Object.keys(configuration).length} | 
          {t.customization.totalPrice}: ¥{pricing.finalPrice.toLocaleString()}
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

      {/* 验证提示 */}
      {validation.errors.length > 0 && (
        <Alert
          type="error"
          message={t.customization.configError}
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

      {/* 当前步骤内容 */}
      <div className="min-h-96 mb-6">
        {renderCurrentStep()}
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <Button
          onClick={previousStep}
          disabled={currentStep === 0}
          icon={<LeftOutlined />}
          size="large"
        >
          {t.customization.previousStep}
        </Button>

        <div className="text-center flex-1 mx-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">{t.customization.estimatedCustomizationFee}</div>
            <div className="text-lg font-bold text-blue-600">
              ¥{pricing.finalPrice.toLocaleString()}
            </div>
            {pricing.totalModifier > 0 && (
              <div className="text-xs text-gray-500">
                {t.customization.basePrice} ¥{pricing.basePrice.toLocaleString()} + {t.customization.customizationFee} ¥{pricing.totalModifier.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {currentStep < customizationSteps.length - 1 ? (
          <Button
            onClick={nextStep}
            type="primary"
            icon={<RightOutlined />}
            size="large"
          >
            {t.customization.nextStep}
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            size="large"
            onClick={() => setShowConfirmModal(true)}
          >
            {t.customization.confirmCustomization}
          </Button>
        )}
      </div>

      {/* 确认弹窗 */}
      <Modal
        open={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        footer={null}
        width={600}
        className="confirmation-modal"
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">⌚</div>
            <Title level={3} className="mb-2">{t.customization.confirmCustomWatch}</Title>
            <Text type="secondary">{t.customization.pleaseReviewConfig}</Text>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-100">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-2xl">⌚</span>
              </div>
              <div className="flex-1">
                <Title level={4} className="mb-1">{product.name}</Title>
                <Text type="secondary" className="block">{product.description}</Text>
                <Tag color="blue" className="mt-2">{t.customization.customVersion}</Tag>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Title level={5} className="mb-4 flex items-center">
              <span className="mr-2">🎨</span>
              {t.customization.customConfigList}
            </Title>
            <div className="space-y-3">
              {Object.entries(configuration).map(([optionId, valueId]) => {
                const option = product.customizationOptions.find(opt => opt.id === optionId);
                const value = option?.values.find(val => val.id === valueId);
                if (!option || !value) return null;

                return (
                  <div key={optionId} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                    <span className="text-gray-700">{option.displayName}:</span>
                    <span className="font-medium text-gray-900">{value.displayName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
            <Title level={5} className="mb-3 flex items-center">
              <span className="mr-2">💰</span>
              {t.customization.priceBreakdown}
            </Title>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t.customization.basePrice}</span>
                <span>¥{pricing.basePrice.toLocaleString()}</span>
              </div>
              {pricing.totalModifier > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>{t.customization.customizationFee}</span>
                  <span>+¥{pricing.totalModifier.toLocaleString()}</span>
                </div>
              )}
              <Divider className="my-2" />
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>{t.customization.total}</span>
                <span>¥{pricing.finalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Alert
            message={t.customization.tip}
            description={t.customization.customWatchProductionTime}
            type="info"
            showIcon
            className="mb-6"
          />

          <div className="flex justify-end space-x-3">
            <Button 
              size="large"
              onClick={() => setShowConfirmModal(false)}
            >
              {t.customization.returnToModify}
            </Button>
            <Button 
              type="primary" 
              size="large"
              onClick={handleAddToCart}
              className="px-8"
            >
              {t.customization.confirmAndAddToCart}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WatchCustomizer; 