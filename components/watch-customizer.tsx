import React, { useState, useEffect } from 'react';
import { Modal, Button, Steps, Radio, Typography, Space, Row, Col, Alert, Progress } from 'antd';
import { CloseOutlined, CheckOutlined, RotateLeftOutlined, RotateRightOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useLanguage } from '../hooks/use-language';
import { useCart } from '../hooks/use-shopping-cart';
import BasicCustomizationInfo from './basic-customization-info';
import type { Product } from '../seagull-watch-types';

const { Title, Text } = Typography;
const { Step } = Steps;

interface WatchCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onConfirm?: (customization: any) => void;
}

interface CustomizationState {
  case: string;
  dial: string;
  hands: string;
  strap: string;
  engraving: string;
  totalPrice: number;
  isBasicCustomization: boolean;
}

const WatchCustomizer: React.FC<WatchCustomizerProps> = ({
  isOpen, 
  onClose, 
  product,
  onConfirm 
}) => {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [customization, setCustomization] = useState<CustomizationState>({
    case: 'stainless',
    dial: 'white',
    hands: 'classic',
    strap: 'leather',
    engraving: '',
    totalPrice: product?.price || 0,
    isBasicCustomization: true
  });

  // 实时计算价格和检查是否为基础定制
  useEffect(() => {
    const basePrice = product?.price || 0;
    const additionalCost = calculateAdditionalCost();
    const isBasic = checkIfBasicCustomization();
    
    setCustomization(prev => ({
      ...prev,
      totalPrice: basePrice + additionalCost,
      isBasicCustomization: isBasic
    }));
  }, [customization.case, customization.dial, customization.hands, customization.strap, product?.price]);

  // 检查是否为基础定制（所有选项都是基础价格）
  const checkIfBasicCustomization = (): boolean => {
    const caseCosts: Record<string, number> = {
      stainless: 0,
      gold: 5000,
      rose_gold: 4000,
      titanium: 2000
    };
    
    const dialCosts: Record<string, number> = {
      white: 0,
      black: 200,
      blue: 300,
      silver: 150
    };
    
    const handsCosts: Record<string, number> = {
      classic: 0,
      luminous: 800,
      gold_hands: 1200,
      blue_hands: 600
    };
    
    const strapCosts: Record<string, number> = {
      leather: 0,
      metal: 1500,
      rubber: 300,
      nato: 200
    };
    
    return (
      caseCosts[customization.case] === 0 &&
      dialCosts[customization.dial] === 0 &&
      handsCosts[customization.hands] === 0 &&
      strapCosts[customization.strap] === 0
    );
  };

  // 计算额外费用
  const calculateAdditionalCost = (): number => {
    let cost = 0;
    
    const caseCosts: Record<string, number> = {
      stainless: 0,
      gold: 5000,
      rose_gold: 4000,
      titanium: 2000
    };
    
    const dialCosts: Record<string, number> = {
      white: 0,
      black: 200,
      blue: 300,
      silver: 150
    };
    
    const handsCosts: Record<string, number> = {
      classic: 0,
      luminous: 800,
      gold_hands: 1200,
      blue_hands: 600
    };
    
    const strapCosts: Record<string, number> = {
      leather: 0,
      metal: 1500,
      rubber: 300,
      nato: 200
    };
    
    cost += caseCosts[customization.case] || 0;
    cost += dialCosts[customization.dial] || 0;
    cost += handsCosts[customization.hands] || 0;
    cost += strapCosts[customization.strap] || 0;
    
    return cost;
  };

  // 旋转控制
  const handleRotateLeft = () => {
    setRotationAngle(prev => prev - 45);
  };

  const handleRotateRight = () => {
    setRotationAngle(prev => prev + 45);
  };

  // 材质样式映射
  const getCaseStyle = (caseType: string) => {
    const styles: Record<string, React.CSSProperties> = {
      stainless: {
        background: 'linear-gradient(145deg, #e8e8e8, #c0c0c0)',
        border: '4px solid #a8a8a8',
        boxShadow: '0 0 20px rgba(192, 192, 192, 0.6)'
      },
      gold: {
        background: 'linear-gradient(145deg, #ffd700, #ffed4e)',
        border: '4px solid #daa520',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)'
      },
      rose_gold: {
        background: 'linear-gradient(145deg, #e8b4a0, #d4a574)',
        border: '4px solid #b8860b',
        boxShadow: '0 0 20px rgba(212, 165, 116, 0.6)'
      },
      titanium: {
        background: 'linear-gradient(145deg, #c8c8c8, #a8a8a8)',
        border: '4px solid #808080',
        boxShadow: '0 0 20px rgba(168, 168, 168, 0.6)'
      }
    };
    return styles[caseType] || styles.stainless;
  };

  const getDialStyle = (dialType: string) => {
    const styles: Record<string, React.CSSProperties> = {
      white: { background: '#ffffff', color: '#333333' },
      black: { background: '#1a1a1a', color: '#ffffff' },
      blue: { background: 'radial-gradient(circle, #1e3a8a, #3b82f6)', color: '#ffffff' },
      silver: { background: 'radial-gradient(circle, #e5e7eb, #d1d5db)', color: '#333333' }
    };
    return styles[dialType] || styles.white;
  };

  const getHandsStyle = (handsType: string) => {
    const styles: Record<string, React.CSSProperties> = {
      classic: { background: '#333333' },
      luminous: { 
        background: '#00ff88',
        boxShadow: '0 0 15px #00ff88',
        filter: 'brightness(1.2)'
      },
      gold_hands: { 
        background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
        boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
      },
      blue_hands: { 
        background: 'linear-gradient(45deg, #1e40af, #3b82f6)',
        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
      }
    };
    return styles[handsType] || styles.classic;
  };

  const getStrapStyle = (strapType: string) => {
    const styles: Record<string, React.CSSProperties> = {
      leather: {
        background: 'linear-gradient(0deg, #8b4513 0%, #a0522d 50%, #8b4513 100%)',
        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)'
      },
      metal: {
        background: 'linear-gradient(0deg, #c0c0c0 0%, #e8e8e8 50%, #c0c0c0 100%)',
        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 6px)',
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)'
      },
      rubber: {
        background: 'linear-gradient(0deg, #2d2d2d 0%, #404040 50%, #2d2d2d 100%)',
        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)',
        boxShadow: 'inset 0 0 8px rgba(0,0,0,0.4)'
      },
      nato: {
        background: 'repeating-linear-gradient(0deg, #e53e3e 0px, #e53e3e 8px, #ffffff 8px, #ffffff 16px, #1a202c 16px, #1a202c 24px)',
        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.3)'
      }
    };
    return styles[strapType] || styles.leather;
  };

  // 3D预览组件
  const render3DPreview = () => {
    const caseStyle = getCaseStyle(customization.case);
    const dialStyle = getDialStyle(customization.dial);
    const handsStyle = getHandsStyle(customization.hands);
    const strapStyle = getStrapStyle(customization.strap);

      return (
      <div 
        className="watch-3d-preview"
        style={{
          position: 'relative',
          width: '100%',
          height: '500px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          perspective: '1000px',
          perspectiveOrigin: 'center center'
        }}
      >
        {/* 主手表容器 */}
        <div 
          className="watch-container"
          style={{
            transform: `rotateY(${rotationAngle}deg) rotateX(10deg)`,
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            transformStyle: 'preserve-3d',
            position: 'relative',
            width: '220px',
            height: '220px'
          }}
        >
          {/* 上表带 */}
          <div 
            className="strap-top"
            style={{
              position: 'absolute',
              top: '-110px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '130px',
              borderRadius: '20px 20px 10px 10px',
              zIndex: 1,
              transition: 'all 0.3s ease',
              ...strapStyle
            }}
          />
          
          {/* 下表带 */}
          <div 
            className="strap-bottom"
            style={{
              position: 'absolute',
              bottom: '-110px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '130px',
              borderRadius: '10px 10px 20px 20px',
              zIndex: 1,
              transition: 'all 0.3s ease',
              ...strapStyle
            }}
          />

          {/* 表壳 */}
          <div 
            className="watch-case"
            style={{
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              position: 'relative',
              zIndex: 2,
              transition: 'all 0.5s ease',
              ...caseStyle
            }}
          >
            {/* 表冠 */}
            <div style={{
              position: 'absolute',
              right: '-10px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '35px',
              borderRadius: '10px',
              zIndex: 3,
              ...caseStyle
            }} />

            {/* 表盘 */}
            <div 
              className="watch-dial"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                ...dialStyle
              }}
            >
              {/* 时标 */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '50%',
                    width: '3px',
                    height: i % 3 === 0 ? '25px' : '15px',
                    background: dialStyle.color,
                    transformOrigin: '50% 80px',
                    transform: `translateX(-50%) rotate(${i * 30}deg)`,
                    borderRadius: '2px'
                  }}
                />
              ))}

              {/* 指针组 */}
              <div className="watch-hands" style={{ position: 'relative' }}>
                {/* 时针 */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '90px',
                    left: '50%',
                    width: '5px',
                    height: '55px',
                    borderRadius: '3px',
                    transformOrigin: 'bottom center',
                    transform: 'translateX(-50%) rotate(45deg)',
                    zIndex: 2,
                    transition: 'all 0.3s ease',
                    ...handsStyle
                  }}
                />
                
                {/* 分针 */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '90px',
                    left: '50%',
                    width: '3px',
                    height: '75px',
                    borderRadius: '2px',
                    transformOrigin: 'bottom center',
                    transform: 'translateX(-50%) rotate(120deg)',
                    zIndex: 3,
                    transition: 'all 0.3s ease',
                    ...handsStyle
                  }}
                />

                {/* 秒针 */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '90px',
                    left: '50%',
                    width: '1px',
                    height: '85px',
                    background: '#e74c3c',
                    borderRadius: '1px',
                    transformOrigin: 'bottom center',
                    transform: 'translateX(-50%) rotate(200deg)',
                    zIndex: 4
                  }}
                />
                
                {/* 中心轴 */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 5,
                    border: `2px solid ${dialStyle.color}`,
                    transition: 'all 0.3s ease',
                    ...handsStyle
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 旋转控制按钮 */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          gap: '12px',
          zIndex: 10
        }}>
          <Button 
            type="primary"
            shape="circle"
            size="large"
            icon={<RotateLeftOutlined />} 
            onClick={handleRotateLeft}
            style={{ 
              background: 'rgba(255,255,255,0.95)',
              border: 'none',
              color: '#1890ff',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              width: '48px',
              height: '48px'
            }}
          />
          <Button 
            type="primary"
            shape="circle"
            size="large"
            icon={<RotateRightOutlined />} 
            onClick={handleRotateRight}
            style={{ 
              background: 'rgba(255,255,255,0.95)',
              border: 'none',
              color: '#1890ff',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              width: '48px',
              height: '48px'
            }}
          />
        </div>

        {/* 定制状态指示器 */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: customization.isBasicCustomization 
            ? 'rgba(82, 196, 26, 0.9)' 
            : 'rgba(24, 144, 255, 0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <InfoCircleOutlined />
          {customization.isBasicCustomization 
            ? (language === 'zh' ? '基础定制' : 'Basic Customization')
            : (language === 'zh' ? '高级定制' : 'Premium Customization')
          }
        </div>
      </div>
    );
  };

  // 定制步骤配置
  const customizationSteps = [
    {
      title: language === 'zh' ? '表壳材质' : 'Case Material',
      key: 'case' as keyof CustomizationState,
      options: [
        { value: 'stainless', label: language === 'zh' ? '不锈钢' : 'Stainless Steel', price: 0, isBasic: true },
        { value: 'gold', label: language === 'zh' ? '黄金' : 'Gold', price: 5000, isBasic: false },
        { value: 'rose_gold', label: language === 'zh' ? '玫瑰金' : 'Rose Gold', price: 4000, isBasic: false },
        { value: 'titanium', label: language === 'zh' ? '钛合金' : 'Titanium', price: 2000, isBasic: false }
      ]
    },
    {
      title: language === 'zh' ? '表盘样式' : 'Dial Style',
      key: 'dial' as keyof CustomizationState,
      options: [
        { value: 'white', label: language === 'zh' ? '白色经典' : 'Classic White', price: 0, isBasic: true },
        { value: 'black', label: language === 'zh' ? '黑色运动' : 'Sport Black', price: 200, isBasic: false },
        { value: 'blue', label: language === 'zh' ? '蓝色商务' : 'Business Blue', price: 300, isBasic: false },
        { value: 'silver', label: language === 'zh' ? '银色优雅' : 'Elegant Silver', price: 150, isBasic: false }
      ]
    },
    {
      title: language === 'zh' ? '指针样式' : 'Hands Style',
      key: 'hands' as keyof CustomizationState,
      options: [
        { value: 'classic', label: language === 'zh' ? '经典剑形针' : 'Classic Sword', price: 0, isBasic: true },
        { value: 'luminous', label: language === 'zh' ? '夜光指针' : 'Luminous', price: 800, isBasic: false },
        { value: 'gold_hands', label: language === 'zh' ? '金色指针' : 'Gold Hands', price: 1200, isBasic: false },
        { value: 'blue_hands', label: language === 'zh' ? '蓝钢指针' : 'Blue Steel', price: 600, isBasic: false }
      ]
    },
    {
      title: language === 'zh' ? '表带材质' : 'Strap Material',
      key: 'strap' as keyof CustomizationState,
      options: [
        { value: 'leather', label: language === 'zh' ? '真皮表带' : 'Leather Strap', price: 0, isBasic: true },
        { value: 'metal', label: language === 'zh' ? '金属表带' : 'Metal Bracelet', price: 1500, isBasic: false },
        { value: 'rubber', label: language === 'zh' ? '橡胶表带' : 'Rubber Strap', price: 300, isBasic: false },
        { value: 'nato', label: language === 'zh' ? 'NATO表带' : 'NATO Strap', price: 200, isBasic: false }
      ]
    }
  ];

  const handleOptionChange = (key: keyof CustomizationState, value: string) => {
    setCustomization(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderCustomizationStep = () => {
    const currentStepConfig = customizationSteps[currentStep];
    if (!currentStepConfig) return null;

    return (
      <div style={{ padding: '20px 0' }}>
        <Title level={4} style={{ marginBottom: 20, color: '#1890ff' }}>
          {currentStepConfig.title}
        </Title>
        
        {/* 基础定制提示 */}
        {currentStep === 0 && (
          <>
            <BasicCustomizationInfo isVisible={true} />
            <Alert
              message={language === 'zh' ? '💡 定制提示' : '💡 Customization Tip'}
              description={language === 'zh' 
                ? '您可以选择基础配置（免费）或升级配置（额外费用）。即使只选择基础配置，也能完成完整的定制流程。'
                : 'You can choose basic configurations (free) or premium configurations (additional cost). Even with only basic configurations, you can complete the full customization process.'
              }
              type="info"
              showIcon
              style={{ marginBottom: 20 }}
            />
          </>
        )}
        
        <Radio.Group 
          value={customization[currentStepConfig.key]}
          onChange={(e) => handleOptionChange(currentStepConfig.key, e.target.value)}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {currentStepConfig.options.map(option => (
              <Radio.Button 
                key={option.value} 
                value={option.value}
                style={{ 
                  width: '100%', 
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '14px',
                  border: option.isBasic ? '2px solid #52c41a' : '2px solid #d9d9d9',
                  background: option.isBasic ? '#f6ffed' : '#ffffff'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 500 }}>{option.label}</span>
                  {option.isBasic && (
                    <span style={{ 
                      background: '#52c41a', 
                      color: 'white', 
                      padding: '2px 6px', 
                      borderRadius: '10px', 
                      fontSize: '10px' 
                    }}>
                      {language === 'zh' ? '基础' : 'Basic'}
                    </span>
                  )}
                </div>
                <span style={{ 
                  color: option.price > 0 ? '#52c41a' : '#52c41a', 
                  fontWeight: 600 
                }}>
                  {option.price > 0 ? `+¥${option.price}` : (language === 'zh' ? '免费' : 'Free')}
                </span>
              </Radio.Button>
            ))}
          </Space>
        </Radio.Group>
        </div>
    );
  };

  const handleConfirm = () => {
    const customizedProduct = {
      ...product,
      price: customization.totalPrice,
      isCustomized: true,
      customization: customization,
      image: product.imageUrl
    };
    
    addItem(customizedProduct);
    
    if (onConfirm) {
      onConfirm(customization);
    }
    
    onClose();
  };

  // 计算完成进度
  const completionProgress = ((currentStep + 1) / customizationSteps.length) * 100;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1400}
      title={
        <div style={{ textAlign: 'center' }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            {language === 'zh' ? '🎨 手表定制工坊' : '🎨 Watch Customization Studio'}
          </Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {language === 'zh' 
              ? '选择基础配置或升级配置，打造您的专属手表'
              : 'Choose basic or premium configurations to create your exclusive watch'
            }
          </Text>
        </div>
      }
      closeIcon={<CloseOutlined />}
      className="watch-customizer-modal"
      destroyOnHidden={true}
    >
      <Row gutter={32}>
        {/* 左侧3D预览 */}
        <Col span={14}>
          {render3DPreview()}
          
          {/* 价格显示 */}
          <div style={{
            marginTop: '20px',
            padding: '20px',
            background: customization.isBasicCustomization 
              ? 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <Title level={4} style={{ color: 'white', margin: 0 }}>
              {language === 'zh' ? '定制总价' : 'Total Price'}: 
              <span style={{ fontSize: '32px', marginLeft: '10px' }}>
                ¥{customization.totalPrice.toLocaleString()}
              </span>
            </Title>
            {customization.isBasicCustomization && (
              <Text style={{ color: 'white', fontSize: '14px', opacity: 0.9 }}>
                {language === 'zh' ? '✨ 基础定制 - 性价比之选' : '✨ Basic Customization - Best Value'}
              </Text>
            )}
          </div>
        </Col>

        {/* 右侧定制选项 */}
        <Col span={10}>
          {/* 进度条 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text strong>{language === 'zh' ? '定制进度' : 'Customization Progress'}</Text>
              <Text type="secondary">{Math.round(completionProgress)}%</Text>
            </div>
            <Progress 
              percent={completionProgress} 
              strokeColor={customization.isBasicCustomization ? '#52c41a' : '#1890ff'}
              showInfo={false}
            />
          </div>

          <Steps
            current={currentStep}
            direction="vertical" 
            size="small"
            style={{ marginBottom: 20 }}
          >
            {customizationSteps.map((step, index) => (
              <Step 
                key={index}
                title={step.title}
                status={index < currentStep ? 'finish' : index === currentStep ? 'process' : 'wait'}
              />
            ))}
          </Steps>

          {renderCustomizationStep()}

          {/* 操作按钮 */}
          <div style={{ marginTop: 30, display: 'flex', gap: '12px' }}>
            {currentStep > 0 && (
        <Button
          size="large"
                onClick={() => setCurrentStep(prev => prev - 1)}
        >
                {language === 'zh' ? '上一步' : 'Previous'}
        </Button>
            )}

        {currentStep < customizationSteps.length - 1 ? (
          <Button
            type="primary"
            size="large"
                onClick={() => setCurrentStep(prev => prev + 1)}
                style={{ flex: 1 }}
          >
                {language === 'zh' ? '下一步' : 'Next'}
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
                icon={<CheckOutlined />}
                onClick={handleConfirm}
                style={{ flex: 1 }}
          >
                {language === 'zh' ? '确认定制并加入购物车' : 'Confirm & Add to Cart'}
          </Button>
        )}
          </div>
        </Col>
      </Row>
      </Modal>
  );
};

export default WatchCustomizer; 