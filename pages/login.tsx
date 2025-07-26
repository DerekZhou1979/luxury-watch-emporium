import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useAuth } from '../hooks/use-auth';
import { useLanguage } from '../hooks/use-language';
import { UserLogin } from '../seagull-watch-types';
import { AuthService } from '../services/auth-service';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleLogin = async (values: UserLogin) => {
    setIsLoading(true);
    try {
      const result = await login(values);
      if (result.success) {
        message.success(t.common.success);
        navigate('/user-center');
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e2e8f0'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          {/* 页面标题 */}
          <div>
            <Title 
              level={2} 
              style={{ 
                margin: 0,
                color: '#1e293b',
                fontSize: '28px',
                fontWeight: 700
              }}
            >
              {t.nav.login}
            </Title>
            <Text 
              type="secondary" 
              style={{ 
                fontSize: '16px',
                color: '#64748b'
              }}
            >
              {t.nav.login}到您的账户
            </Text>
          </div>

          {/* 登录表单 */}
          <Form
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            requiredMark={false}
            style={{ width: '100%' }}
          >
            <Form.Item
              name="email"
              label={
                <Text strong style={{ color: '#1e293b', fontSize: '14px' }}>
                  {t.forms.email}
                </Text>
              }
              rules={[
                { required: true, message: `${t.forms.email}${t.forms.required}` },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#64748b' }} />}
                placeholder={`请输入${t.forms.email}`}
                size="large"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '16px'
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <Text strong style={{ color: '#1e293b', fontSize: '14px' }}>
                  {t.forms.password}
                </Text>
              }
              rules={[
                { required: true, message: `${t.forms.password}${t.forms.required}` },
                { min: 6, message: '密码至少6位字符' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#64748b' }} />}
                placeholder={`请输入${t.forms.password}`}
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                style={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '16px'
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: '16px' }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
              >
                {t.nav.login}
              </Button>
            </Form.Item>
          </Form>

          {/* 分割线 */}
          <Divider style={{ margin: '0', color: '#94a3b8' }}>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              或
            </Text>
          </Divider>

          {/* 注册链接 */}
          <div>
            <Text style={{ color: '#64748b', fontSize: '14px' }}>
              还没有账户？{' '}
              <Link 
                to="/register"
                style={{
                  color: '#3b82f6',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
                className="hover:underline"
              >
                {t.nav.register}
              </Link>
            </Text>
          </div>

          {/* 忘记密码 */}
          <div>
            <Link 
              to="/forgot-password"
              style={{
                color: '#64748b',
                fontSize: '14px',
                textDecoration: 'none'
              }}
              className="hover:text-blue-600"
            >
              忘记密码？
            </Link>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default LoginPage; 