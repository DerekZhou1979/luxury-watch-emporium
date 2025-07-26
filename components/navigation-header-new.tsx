import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  Layout, 
  Menu, 
  Badge, 
  Avatar, 
  Dropdown, 
  Button, 
  Drawer,
  Space,
  Typography,
  Divider
} from 'antd';
import {
  ShoppingCartOutlined,
  SettingOutlined,
  UserOutlined,
  MenuOutlined,
  LoginOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { useCart } from '../hooks/use-shopping-cart';
import { useAuth } from '../hooks/use-auth';
import { BRAND_INFO, NAVIGATION_LINKS } from '../seagull-brand-config';

const { Header } = Layout;
const { Text } = Typography;

const NavigationHeader: React.FC = () => {
  const { cart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const location = useLocation();
  
  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 用户菜单点击处理
  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
    }
  };

  // 用户菜单项
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/user-center">个人中心</Link>,
    },
    {
      key: 'orders',
      icon: <OrderedListOutlined />,
      label: <Link to="/orders">我的订单</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/profile">账户设置</Link>,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  // 移动端菜单项
  const mobileMenuItems = [
    ...NAVIGATION_LINKS.map(link => ({
      key: link.path,
      label: <Link to={link.path} onClick={() => setMobileMenuVisible(false)}>{link.name}</Link>,
    })),
    {
      type: 'divider' as const,
    },
         ...(isAuthenticated 
       ? userMenuItems.filter(item => item.key !== 'logout').map(item => ({
           ...item,
           label: typeof item.label === 'object' && React.isValidElement(item.label) 
             ? React.cloneElement(item.label as React.ReactElement<any>, {
                 onClick: () => setMobileMenuVisible(false)
               })
             : item.label
         }))
       : [
          {
            key: 'login',
            icon: <LoginOutlined />,
            label: <Link to="/login" onClick={() => setMobileMenuVisible(false)}>登录</Link>,
          },
          {
            key: 'register',
            icon: <UserOutlined />,
            label: <Link to="/register" onClick={() => setMobileMenuVisible(false)}>注册</Link>,
          }
        ]
    )
  ];

  return (
    <>
      <Header 
        className="bg-white shadow-sm border-b border-gray-100 px-0 h-16 leading-16"
        style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 1000,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          {/* 品牌Logo区域 */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 no-underline">
              <div className="w-8 h-8 flex items-center justify-center">
                {BRAND_INFO.logoSvg}
              </div>
              <div className="hidden sm:block">
                <Text 
                  strong 
                  className="text-2xl text-black tracking-tight"
                  style={{ 
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontWeight: 700,
                    color: '#1a1a1a'
                  }}
                >
                  {BRAND_INFO.name}
                </Text>
              </div>
            </Link>
          </div>

          {/* 桌面端导航菜单 */}
          <div className="hidden lg:flex flex-1 justify-center">
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              className="border-0 bg-transparent min-w-0"
              style={{ 
                backgroundColor: 'transparent',
                borderBottom: 'none',
                lineHeight: '64px'
              }}
              items={NAVIGATION_LINKS.map(link => ({
                key: link.path,
                label: (
                  <NavLink 
                    to={link.path}
                    className="text-gray-700 hover:text-black transition-colors duration-200 font-medium"
                    style={({ isActive }) => ({
                      color: isActive ? '#1a1a1a' : '#666666',
                      textDecoration: 'none',
                      fontWeight: isActive ? 600 : 500
                    })}
                  >
                    {link.name}
                  </NavLink>
                ),
              }))}
            />
          </div>

          {/* 右侧操作区域 */}
          <div className="flex items-center space-x-2">
            {/* 定制清单 */}
            <Link to="/cart">
              <Badge count={totalItemsInCart} size="small" color="#1a1a1a">
                <Button
                  type="text"
                  icon={<SettingOutlined />}
                  className="flex items-center justify-center w-10 h-10 hover:bg-gray-50"
                  style={{ border: 'none', color: '#666666' }}
                />
              </Badge>
            </Link>

            {/* 用户区域 */}
            {isAuthenticated && user ? (
              <Dropdown
                menu={{ 
                  items: userMenuItems,
                  onClick: handleUserMenuClick
                }}
                placement="bottomRight"
                trigger={['click']}
                overlayClassName="mt-2"
              >
                <Button
                  type="text"
                  className="flex items-center space-x-2 px-3 py-2 h-10 hover:bg-gray-50"
                  style={{ border: 'none' }}
                >
                  <Avatar 
                    size="small" 
                    icon={<UserOutlined />}
                    src={user.avatar}
                    style={{ backgroundColor: '#1a1a1a' }}
                  />
                  <span className="hidden md:inline text-gray-700 font-medium max-w-20 truncate">
                    {user.name.length > 8 ? user.name.substring(0, 8) + '...' : user.name}
                  </span>
                </Button>
              </Dropdown>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login">
                  <Button 
                    type="text" 
                    icon={<LoginOutlined />}
                    className="font-medium"
                    style={{ color: '#666666' }}
                  >
                    登录
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    type="primary"
                    className="font-medium"
                    style={{ 
                      backgroundColor: '#1a1a1a',
                      borderColor: '#1a1a1a',
                      borderRadius: '6px'
                    }}
                  >
                    注册
                  </Button>
                </Link>
              </div>
            )}

            {/* 移动端菜单按钮 */}
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuVisible(true)}
              className="lg:hidden flex items-center justify-center w-10 h-10 hover:bg-gray-50"
              style={{ border: 'none', color: '#666666' }}
            />
          </div>
        </div>
      </Header>

      {/* 移动端侧边菜单 */}
      <Drawer
        title={
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 flex items-center justify-center">
              {BRAND_INFO.logoSvg}
            </div>
            <Text strong className="text-lg">{BRAND_INFO.name}</Text>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
        className="lg:hidden"
        styles={{
          body: { padding: 0 },
          header: { 
            borderBottom: '1px solid #f0f0f0',
            backgroundColor: '#fafafa'
          }
        }}
      >
        <div className="flex flex-col h-full">
          {/* 用户信息区域 */}
          {isAuthenticated && user && (
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Avatar 
                  size="large" 
                  icon={<UserOutlined />}
                  src={user.avatar}
                  style={{ backgroundColor: '#1a1a1a' }}
                />
                <div>
                  <Text strong className="block">{user.name}</Text>
                  <Text type="secondary" className="text-sm">{user.email}</Text>
                </div>
              </div>
            </div>
          )}

          {/* 菜单项 */}
          <div className="flex-1">
            <Menu
              mode="vertical"
              selectedKeys={[location.pathname]}
              className="border-0 h-full"
              style={{ backgroundColor: 'transparent' }}
              items={mobileMenuItems}
            />
          </div>

          {/* 底部操作区域 */}
          {isAuthenticated && (
            <div className="p-4 border-t border-gray-100">
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={() => {
                  logout();
                  setMobileMenuVisible(false);
                }}
                className="w-full text-left justify-start"
                danger
              >
                退出登录
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default NavigationHeader; 