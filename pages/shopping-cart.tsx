import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  List, 
  Button, 
  InputNumber, 
  Typography, 
  Space, 
  Divider, 
  Empty,
  Row,
  Col,
  Image,
  Tag
} from 'antd';
import { 
  DeleteOutlined, 
  ShoppingOutlined, 
  CreditCardOutlined,
  MinusOutlined,
  PlusOutlined 
} from '@ant-design/icons';
import { useCart } from '../hooks/use-shopping-cart';
import { useLanguage } from '../hooks/use-language';
import { CartItem } from '../seagull-watch-types';
import { CustomizationMultiLangService } from '../services/customization-multilang-service';

const { Title, Text } = Typography;

const ShoppingCartPage: React.FC = () => {
  const { cart, removeItem, updateQuantity, totalPrice } = useCart();
  const { t, formatString } = useLanguage();

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemoveItem = (item: CartItem) => {
    removeItem(item.id);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card 
          style={{ 
            textAlign: 'center', 
            padding: '40px',
            maxWidth: '500px',
            width: '100%',
            margin: '0 20px'
          }}
        >
          <Empty
            image={
              <div style={{ fontSize: '80px', color: '#cbd5e1', marginBottom: '20px' }}>
                🛒
              </div>
            }
            description={
              <div>
                <Title level={3} style={{ color: '#64748b', marginBottom: '8px' }}>
                  {t.cart.emptyCart}
                </Title>
                <Text style={{ color: '#94a3b8', fontSize: '16px' }}>
                  {t.products.tryOtherCategories}
                </Text>
              </div>
            }
          >
            <Link to="/products">
              <Button 
                type="primary" 
                size="large"
                icon={<ShoppingOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: 500,
                  fontSize: '16px'
                }}
              >
                {t.cart.continueShopping}
              </Button>
            </Link>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '30px', textAlign: 'center' }}>
        🛒 {t.nav.cart}
      </Title>

      <Row gutter={[24, 24]}>
        {/* 购物车商品列表 */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <span style={{ fontSize: '18px', fontWeight: 600 }}>
                {formatString(t.products.foundWatches, { count: totalItems })}
              </span>
            }
            style={{ marginBottom: '20px' }}
          >
            <List
              dataSource={cart}
              renderItem={(item) => (
                <List.Item
                  style={{ 
                    padding: '16px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  <Row style={{ width: '100%' }} gutter={[16, 16]} align="middle">
                    {/* 产品图片 */}
                    <Col xs={24} sm={6} md={4}>
                      <Link to={`/products/${item.id}`}>
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          style={{ 
                            width: '100%',
                            maxWidth: '100px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                          preview={false}
                        />
                      </Link>
                    </Col>

                    {/* 产品信息 */}
                    <Col xs={24} sm={18} md={12}>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Link to={`/products/${item.id.split('_custom_')[0] || item.id}`}>
                          <Title 
                            level={5} 
                            style={{ 
                              margin: 0,
                              color: '#1e293b',
                              fontSize: '16px',
                              cursor: 'pointer'
                            }}
                            className="hover:text-blue-600"
                          >
                            {item.name}
                            {item.isCustomized && (
                              <Tag color="orange" style={{ marginLeft: '8px' }}>
                                🎨 定制版
                              </Tag>
                            )}
                          </Title>
                        </Link>
                        
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                          {t.products.sku}: {item.sku}
                        </Text>
                        
                        <Tag color="blue" style={{ width: 'fit-content' }}>
                          {item.category}
                        </Tag>

                        {/* 定制信息展示 - 使用多语言服务 */}
                        {item.customization && (
                          <div className="mb-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            <Text className="text-sm font-semibold text-blue-800 block mb-2">
                              {t.userCenter?.title === '个人中心' ? '🎨 个人定制配置' : '🎨 Custom Configuration'}
                            </Text>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {item.customization.configurations && Object.entries(item.customization.configurations).map(([key, value]) => {
                                const language = t.userCenter?.title === '个人中心' ? 'zh' : 'en';
                                const category = CustomizationMultiLangService.getCategories().find(c => c.id === key);
                                const option = CustomizationMultiLangService.getOption(key, value as string);
                                
                                if (!category || !option) return null;
                                
                                return (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-gray-600">
                                      {CustomizationMultiLangService.getLocalizedCategoryTitle(category, language)}:
                                    </span>
                                    <span className="font-medium text-blue-700">
                                      {CustomizationMultiLangService.getLocalizedName(option, language)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            {item.customization.finalPrice && (
                              <div className="mt-2 pt-2 border-t border-blue-200">
                                <Text className="text-sm font-bold text-blue-800">
                                  {t.userCenter?.title === '个人中心' ? '定制总价: ' : 'Custom Price: '}
                                  ¥{item.customization.finalPrice.toLocaleString()}
                                </Text>
                              </div>
                            )}
                          </div>
                        )}
                      </Space>
                    </Col>

                    {/* 数量控制 */}
                    <Col xs={12} sm={12} md={4}>
                      <Space direction="vertical" align="center" size="small">
                        <Text strong style={{ fontSize: '13px', color: '#64748b' }}>
                          {t.cart.quantity}
                        </Text>
                        <Space.Compact>
                          <Button
                            size="small"
                            icon={<MinusOutlined />}
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          />
                          <InputNumber
                            size="small"
                            min={1}
                            max={item.stock}
                            value={item.quantity}
                            onChange={(value) => handleQuantityChange(item, value || 1)}
                            style={{ width: '60px', textAlign: 'center' }}
                          />
                          <Button
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          />
                        </Space.Compact>
                      </Space>
                    </Col>

                    {/* 价格和操作 */}
                    <Col xs={12} sm={12} md={4}>
                      <Space direction="vertical" align="end" size="small" style={{ width: '100%' }}>
                        <Text 
                          strong 
                          style={{ 
                            fontSize: '16px',
                            color: '#3b82f6'
                          }}
                        >
                          ¥{(item.price * item.quantity).toLocaleString()}
                        </Text>
                        <Text 
                          type="secondary" 
                          style={{ fontSize: '12px' }}
                        >
                          ¥{item.price.toLocaleString()} x {item.quantity}
                        </Text>
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveItem(item)}
                          style={{ padding: '4px 8px' }}
                        >
                          {t.cart.removeFromCart}
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 订单摘要 */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <span style={{ fontSize: '18px', fontWeight: 600 }}>
                {t.cart.total}
              </span>
            }
            style={{ position: 'sticky', top: '100px' }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* 价格明细 */}
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>{t.cart.subtotal}:</Text>
                  <Text strong>¥{totalPrice.toLocaleString()}</Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">配送费:</Text>
                  <Text type="secondary">免费</Text>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={4} style={{ margin: 0, color: '#1e293b' }}>
                    {t.cart.total}:
                  </Title>
                  <Title 
                    level={4} 
                    style={{ 
                      margin: 0,
                      color: '#3b82f6',
                      fontSize: '20px'
                    }}
                  >
                    ¥{totalPrice.toLocaleString()}
                  </Title>
                </div>
              </Space>

              {/* 结账按钮 */}
              <Link to="/checkout" style={{ width: '100%' }}>
                <Button 
                  type="primary" 
                  size="large"
                  icon={<CreditCardOutlined />}
                  style={{
                    width: '100%',
                    height: '48px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600
                  }}
                >
                  {t.cart.checkout}
                </Button>
              </Link>

              {/* 继续购物 */}
              <Link to="/products" style={{ width: '100%' }}>
                <Button 
                  type="default"
                  size="large"
                  icon={<ShoppingOutlined />}
                  style={{
                    width: '100%',
                    height: '44px',
                    borderColor: '#e2e8f0',
                    color: '#64748b',
                    fontWeight: 500,
                    borderRadius: '8px'
                  }}
                >
                  {t.cart.continueShopping}
                </Button>
              </Link>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ShoppingCartPage;
