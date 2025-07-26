import React from 'react';
import { 
  Button, 
  Card, 
  Space, 
  Typography, 
  Tag, 
  Badge, 
  Avatar,
  Row,
  Col,
  Divider
} from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const AntdTest: React.FC = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Title level={2}>🧪 Ant Design 组件测试</Title>
      <Paragraph>此页面用于测试 Ant Design 组件是否正确加载和显示样式。</Paragraph>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="基础组件测试" hoverable>
            <Space direction="vertical" className="w-full">
              <div>
                <Text strong>按钮组件：</Text>
                <div className="mt-2">
                  <Space>
                    <Button type="primary" icon={<ShoppingCartOutlined />}>
                      主要按钮
                    </Button>
                    <Button type="default">默认按钮</Button>
                    <Button type="dashed">虚线按钮</Button>
                    <Button type="text">文本按钮</Button>
                  </Space>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <Text strong>标签和徽章：</Text>
                <div className="mt-2">
                  <Space>
                    <Tag color="blue">蓝色标签</Tag>
                    <Tag color="green">绿色标签</Tag>
                    <Tag color="gold">金色标签</Tag>
                    <Badge count={5}>
                      <Avatar shape="square" icon={<UserOutlined />} />
                    </Badge>
                  </Space>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <Text strong>图标测试：</Text>
                <div className="mt-2">
                  <Space size="large">
                    <ShoppingCartOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
                    <UserOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                    <SettingOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                    <HeartOutlined style={{ fontSize: '24px', color: '#f5222d' }} />
                  </Space>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="布局组件测试" hoverable>
            <Space direction="vertical" className="w-full">
              <div>
                <Text strong>头像组件：</Text>
                <div className="mt-2">
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                    <Avatar style={{ backgroundColor: '#1677ff' }}>USER</Avatar>
                    <Avatar size="large" style={{ backgroundColor: '#f56a00' }}>U</Avatar>
                  </Space>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <Text strong>文字排版：</Text>
                <div className="mt-2">
                  <Title level={4}>这是一个四级标题</Title>
                  <Paragraph>
                    这是一段普通的文字描述，用来测试 Typography 组件的渲染效果。
                    <Text strong>这是粗体文字</Text>，
                    <Text type="secondary">这是次要文字</Text>，
                    <Text type="success">这是成功状态文字</Text>。
                  </Paragraph>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <Text strong>卡片嵌套：</Text>
                <div className="mt-2">
                  <Card size="small" title="嵌套卡片">
                    <Text>这是一个嵌套在主卡片内的小卡片。</Text>
                  </Card>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
      
      <div className="mt-8 p-4 bg-white rounded-lg border">
        <Title level={4}>样式状态检查</Title>
        <ul>
          <li>✅ 如果按钮有蓝色背景 = Ant Design CSS 正常加载</li>
          <li>✅ 如果卡片有阴影效果 = 布局组件正常</li>
          <li>✅ 如果图标正确显示 = 图标字体正常</li>
          <li>✅ 如果文字有正确的间距 = Typography 正常</li>
        </ul>
      </div>
    </div>
  );
};

export default AntdTest; 