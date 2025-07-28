import React, { useState } from 'react';
import { Button, Card, Typography, Space, Alert, Divider } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useLanguage } from '../hooks/use-language';
import WatchCustomizer from '../components/watch-customizer';
import BasicCustomizationInfo from '../components/basic-customization-info';
import { CustomizationService } from '../services/customization-service';
import { CUSTOMIZATION_SEED_DATA } from '../database/customization-seed-data';
import type { Product } from '../seagull-watch-types';
import { ProductCategory } from '../seagull-watch-types';

const { Title, Text, Paragraph } = Typography;

const CustomizationTest: React.FC = () => {
  const { language } = useLanguage();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  // 模拟产品数据
  const testProduct: Product = {
    id: 'ST1903',
    name: '海鸥1963飞行员复刻版',
    price: 2800,
    imageUrl: '/images/seagull_product_1963pilot_main_01.png',
    description: '经典飞行员手表，精准可靠',
    brand: 'Seagull',
    shortDescription: '经典飞行员手表',
    features: ['自动机芯', '防水30米', '不锈钢表壳'],
    category: ProductCategory.SPORTS,
    stock: 10,
    sku: 'ST1903-001'
  };

  // 测试基础定制功能
  const runBasicCustomizationTest = async () => {
    const results = [];
    
    try {
      // 测试1: 检查基础定制检测
      const basicOptions = {
        case_material: 'case_stainless_steel',
        dial_style: 'dial_white_sunburst',
        hour_minute_hands: 'hands_classic_sword',
        second_hand: 'second_red_thin',
        strap_type: 'strap_leather_brown',
        movement_type: 'movement_automatic_basic'
      };

      const categories = CUSTOMIZATION_SEED_DATA.categories as any[];
      const optionsByCategory: Record<string, any[]> = {};
      
      // 构建选项映射
      for (const category of categories) {
        optionsByCategory[category.id] = CUSTOMIZATION_SEED_DATA.options.filter(
          (opt: any) => opt.category_id === category.id
        );
      }

      const isBasic = CustomizationService.isBasicCustomization(basicOptions, optionsByCategory);
      results.push({
        test: '基础定制检测',
        status: isBasic ? 'PASS' : 'FAIL',
        message: isBasic ? '正确识别基础定制' : '未能识别基础定制'
      });

      // 测试2: 价格计算
      const priceResult = CustomizationService.calculateCustomizationPrice(
        testProduct.price,
        basicOptions,
        optionsByCategory
      );

      results.push({
        test: '基础定制价格计算',
        status: priceResult.isBasicCustomization ? 'PASS' : 'FAIL',
        message: `总价: ¥${priceResult.totalPrice}, 基础定制: ${priceResult.isBasicCustomization ? '是' : '否'}`
      });

      // 测试3: 配置完整性验证
      const validation = CustomizationService.validateCustomizationCompleteness(
        basicOptions,
        categories as any,
        optionsByCategory
      );

      results.push({
        test: '配置完整性验证',
        status: validation.isValid ? 'PASS' : 'FAIL',
        message: validation.isValid ? '配置完整' : `配置不完整: ${validation.errors.join(', ')}`
      });

      // 测试4: 基础配置推荐
      const recommendation = CustomizationService.getBasicCustomizationRecommendation(
        categories as any,
        optionsByCategory
      );

      results.push({
        test: '基础配置推荐',
        status: Object.keys(recommendation).length > 0 ? 'PASS' : 'FAIL',
        message: `推荐了 ${Object.keys(recommendation).length} 个基础配置`
      });

    } catch (error) {
      results.push({
        test: '测试执行',
        status: 'ERROR',
        message: `测试执行失败: ${error}`
      });
    }

    setTestResults(results);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
        {language === 'zh' ? '🔧 基础定制功能测试' : '🔧 Basic Customization Test'}
      </Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 功能说明 */}
        <Card>
          <Title level={4}>
            {language === 'zh' ? '📋 测试目标' : '📋 Test Objectives'}
          </Title>
          <Paragraph>
            {language === 'zh' 
              ? '验证基础定制功能的完整性，确保用户即使只选择基础价格选项也能完成完整的定制流程。'
              : 'Verify the completeness of basic customization functionality, ensuring users can complete the full customization process even when only selecting basic price options.'
            }
          </Paragraph>
          
          <BasicCustomizationInfo isVisible={true} />
        </Card>

        {/* 测试控制 */}
        <Card>
          <Title level={4}>
            {language === 'zh' ? '🧪 功能测试' : '🧪 Function Tests'}
          </Title>
          
          <Space>
            <Button 
              type="primary" 
              icon={<PlayCircleOutlined />}
              onClick={runBasicCustomizationTest}
            >
              {language === 'zh' ? '运行基础定制测试' : 'Run Basic Customization Test'}
            </Button>
            
            <Button 
              icon={<CheckCircleOutlined />}
              onClick={() => setIsCustomizerOpen(true)}
            >
              {language === 'zh' ? '打开定制器测试' : 'Open Customizer Test'}
            </Button>
          </Space>
        </Card>

        {/* 测试结果 */}
        {testResults.length > 0 && (
          <Card>
            <Title level={4}>
              {language === 'zh' ? '📊 测试结果' : '📊 Test Results'}
            </Title>
            
            <Space direction="vertical" style={{ width: '100%' }}>
              {testResults.map((result, index) => (
                <Alert
                  key={index}
                  message={result.test}
                  description={result.message}
                  type={
                    result.status === 'PASS' ? 'success' :
                    result.status === 'FAIL' ? 'error' : 'warning'
                  }
                  showIcon
                  icon={
                    result.status === 'PASS' ? <CheckCircleOutlined /> :
                    result.status === 'FAIL' ? <InfoCircleOutlined /> : <InfoCircleOutlined />
                  }
                />
              ))}
            </Space>
          </Card>
        )}

        {/* 功能特性 */}
        <Card>
          <Title level={4}>
            {language === 'zh' ? '✨ 增强功能' : '✨ Enhanced Features'}
          </Title>
          
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
              message={language === 'zh' ? '基础定制检测' : 'Basic Customization Detection'}
              description={language === 'zh' 
                ? '自动识别用户是否选择了基础配置，提供相应的视觉反馈和提示'
                : 'Automatically detect if users have selected basic configurations and provide appropriate visual feedback and tips'
              }
              type="info"
              showIcon
            />
            
            <Alert
              message={language === 'zh' ? '进度指示器' : 'Progress Indicator'}
              description={language === 'zh'
                ? '显示定制进度，让用户了解当前完成状态'
                : 'Display customization progress to let users know the current completion status'
              }
              type="info"
              showIcon
            />
            
            <Alert
              message={language === 'zh' ? '价格计算优化' : 'Price Calculation Optimization'}
              description={language === 'zh'
                ? '实时计算价格，区分基础定制和高级定制的成本'
                : 'Real-time price calculation, distinguishing between basic and premium customization costs'
              }
              type="info"
              showIcon
            />
            
            <Alert
              message={language === 'zh' ? '用户体验增强' : 'User Experience Enhancement'}
              description={language === 'zh'
                ? '提供清晰的基础配置标识，帮助用户做出选择'
                : 'Provide clear basic configuration identification to help users make choices'
              }
              type="info"
              showIcon
            />
          </Space>
        </Card>
      </Space>

      {/* 定制器模态框 */}
      <WatchCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        product={testProduct}
        onConfirm={(customization) => {
          console.log('定制确认:', customization);
          setIsCustomizerOpen(false);
        }}
      />
    </div>
  );
};

export default CustomizationTest; 