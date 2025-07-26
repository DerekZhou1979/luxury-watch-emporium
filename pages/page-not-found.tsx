import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Space } from 'antd';
import { HomeOutlined, ShoppingOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh', 
      textAlign: 'center', 
      padding: '32px 16px' 
    }}>
      <Title 
        level={1} 
        style={{ 
          fontSize: '8rem', 
          margin: '0 0 16px 0', 
          fontWeight: 'bold',
          color: '#1a1a1a' 
        }}
      >
        404
      </Title>
      
      <Title 
        level={2} 
        style={{ 
          fontSize: '2rem', 
          margin: '0 0 24px 0', 
          fontWeight: 600 
        }}
      >
        页面未找到
      </Title>
      
      <Paragraph 
        style={{ 
          fontSize: '16px',
          color: '#666666',
          marginBottom: '32px',
          maxWidth: '400px',
          lineHeight: 1.6
        }}
      >
        抱歉！您访问的页面似乎不存在。它可能已被移动、删除，或者从未存在过。
      </Paragraph>
      
      <Space size="large">
        <Link to="/">
          <Button 
            type="primary" 
            size="large"
            icon={<HomeOutlined />}
            style={{ 
              height: '48px',
              padding: '0 24px',
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            返回首页
          </Button>
        </Link>
        
        <Link to="/products">
          <Button 
            type="default" 
            size="large"
            icon={<ShoppingOutlined />}
            style={{ 
              height: '48px',
              padding: '0 24px',
              fontSize: '16px',
              fontWeight: 600,
              borderColor: '#1a1a1a',
              color: '#1a1a1a'
            }}
          >
            探索腕表
          </Button>
        </Link>
      </Space>
    </div>
  );
};

export default NotFoundPage;
