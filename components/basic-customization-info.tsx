import React from 'react';
import { Card, Typography, Space, Tag, Divider } from 'antd';
import { CheckCircleOutlined, StarOutlined, GiftOutlined, SafetyOutlined } from '@ant-design/icons';
import { useLanguage } from '../hooks/use-language';

const { Title, Text, Paragraph } = Typography;

interface BasicCustomizationInfoProps {
  isVisible: boolean;
  onClose?: () => void;
}

const BasicCustomizationInfo: React.FC<BasicCustomizationInfoProps> = ({
  isVisible,
  onClose
}) => {
  const { language } = useLanguage();

  if (!isVisible) return null;

  const benefits = [
    {
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      title: language === 'zh' ? '完整定制体验' : 'Complete Customization Experience',
      description: language === 'zh' 
        ? '即使选择基础配置，也能享受完整的定制流程和个性化服务'
        : 'Even with basic configurations, enjoy the complete customization process and personalized service'
    },
    {
      icon: <StarOutlined style={{ color: '#faad14' }} />,
      title: language === 'zh' ? '优质基础配置' : 'Quality Basic Configurations',
      description: language === 'zh'
        ? '基础配置采用优质材料，确保手表的品质和耐用性'
        : 'Basic configurations use quality materials to ensure watch quality and durability'
    },
    {
      icon: <GiftOutlined style={{ color: '#1890ff' }} />,
      title: language === 'zh' ? '性价比之选' : 'Best Value Choice',
      description: language === 'zh'
        ? '基础定制提供最佳性价比，满足大多数用户需求'
        : 'Basic customization offers the best value for money, meeting most user needs'
    },
    {
      icon: <SafetyOutlined style={{ color: '#722ed1' }} />,
      title: language === 'zh' ? '品质保证' : 'Quality Assurance',
      description: language === 'zh'
        ? '所有定制产品都享有相同的品质保证和售后服务'
        : 'All customized products enjoy the same quality assurance and after-sales service'
    }
  ];

  const basicFeatures = [
    language === 'zh' ? '不锈钢表壳' : 'Stainless Steel Case',
    language === 'zh' ? '经典白色表盘' : 'Classic White Dial',
    language === 'zh' ? '剑形指针设计' : 'Sword-shaped Hands',
    language === 'zh' ? '真皮表带' : 'Leather Strap',
    language === 'zh' ? '自动机芯' : 'Automatic Movement',
    language === 'zh' ? '防水功能' : 'Water Resistance'
  ];

  return (
    <Card
      style={{
        background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
        border: '2px solid #52c41a',
        borderRadius: '12px',
        marginBottom: '20px'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Title level={4} style={{ color: '#52c41a', margin: 0 }}>
          {language === 'zh' ? '✨ 基础定制优势' : '✨ Basic Customization Benefits'}
        </Title>
        <Text type="secondary">
          {language === 'zh' 
            ? '选择基础配置，享受完整的定制体验'
            : 'Choose basic configurations and enjoy the complete customization experience'
          }
        </Text>
      </div>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {benefits.map((benefit, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ fontSize: '20px', marginTop: '2px' }}>
              {benefit.icon}
            </div>
            <div>
              <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                {benefit.title}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {benefit.description}
              </Text>
            </div>
          </div>
        ))}
      </Space>

      <Divider style={{ margin: '20px 0' }} />

      <div>
        <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '12px' }}>
          {language === 'zh' ? '基础配置包含：' : 'Basic Configuration Includes:'}
        </Text>
        <Space wrap>
          {basicFeatures.map((feature, index) => (
            <Tag 
              key={index} 
              color="green" 
              style={{ 
                borderRadius: '16px', 
                padding: '4px 12px',
                fontSize: '12px'
              }}
            >
              {feature}
            </Tag>
          ))}
        </Space>
      </div>

      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: 'rgba(82, 196, 26, 0.1)', 
        borderRadius: '8px',
        border: '1px solid rgba(82, 196, 26, 0.2)'
      }}>
        <Text style={{ fontSize: '12px', color: '#52c41a' }}>
          💡 {language === 'zh' 
            ? '提示：基础定制完全免费，您可以随时升级到高级配置'
            : 'Tip: Basic customization is completely free, you can upgrade to premium configurations anytime'
          }
        </Text>
      </div>
    </Card>
  );
};

export default BasicCustomizationInfo; 