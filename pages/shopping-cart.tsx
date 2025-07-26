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

                        {/* 定制配置详情 */}
                        {item.isCustomized && item.customization && (
                          <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <Text strong style={{ fontSize: '13px', color: '#374151', display: 'block', marginBottom: '8px' }}>
                              📋 定制配置
                            </Text>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                              {Object.entries(item.customization.configurations).map(([key, value]) => {
                                // 中文映射
                                const configNameMap: Record<string, string> = {
                                  'case_material': '表壳材质',
                                  'dial_style': '表盘样式',
                                  'hour_minute_hands': '时分针样式',
                                  'second_hand': '秒针样式',
                                  'strap_type': '表带类型',
                                  'movement_type': '机芯类型',
                                  // 兼容旧版本
                                  'dial_color': '表盘颜色',
                                  'strap_material': '表带材质',
                                  'engraving_text': '个性刻字'
                                };
                                
                                const valueMap: Record<string, string> = {
                                  // 表壳材质
                                  'stainless_steel': '不锈钢',
                                  'titanium': '钛合金',
                                  'rose_gold': '玫瑰金',
                                  'ceramic': '陶瓷',
                                  // 表盘样式
                                  'white_sunburst': '白色太阳纹',
                                  'black_glossy': '黑色光面',
                                  'blue_gradient': '深海蓝渐变',
                                  'silver_textured': '银色麦粒纹',
                                  // 时分针样式
                                  'classic_sword': '经典剑形针',
                                  'dauphine_hands': '太子妃针',
                                  'arrow_hands': '箭头式指针',
                                  'baton_hands': '棒形指针',
                                  // 秒针样式
                                  'red_thin': '红色细针',
                                  'blue_counterweight': '蓝色配重针',
                                  'orange_racing': '橙色赛车针',
                                  'white_lume': '白色夜光针',
                                  // 表带类型
                                  'leather_brown': '棕色真皮',
                                  'steel_bracelet': '钢制表链',
                                  'rubber_black': '黑色硅胶',
                                  'nato_strap': 'NATO尼龙',
                                  'mesh_steel': '钢网表带',
                                  // 机芯类型
                                  'automatic_basic': '基础自动机芯',
                                  'automatic_premium': '高级自动机芯',
                                  'chronograph': '计时机芯',
                                  'gmt': 'GMT双时区',
                                  // 兼容旧版本
                                  'white': '白色',
                                  'black': '黑色',
                                  'blue': '深蓝',
                                  'leather': '真皮表带',
                                  'rubber': '硅胶表带'
                                };
                                
                                const displayName = configNameMap[key] || key.replace('_', ' ');
                                const displayValue = valueMap[value] || value;
                                
                                if (!value) return null;
                                
                                return (
                                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                    <Text type="secondary">{displayName}:</Text>
                                    <Text style={{ color: '#374151', fontWeight: '500' }}>{displayValue}</Text>
                                  </div>
                                );
                              })}
                            </Space>
                            
                            {/* 价格明细 */}
                            <Divider style={{ margin: '8px 0' }} />
                            <Text strong style={{ fontSize: '12px', color: '#374151', display: 'block', marginBottom: '6px' }}>
                              💰 价格明细
                            </Text>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                              {item.customization.priceBreakdown.map((breakdown, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                  <Text type="secondary">{breakdown.name}:</Text>
                                  <Text style={{ 
                                    color: breakdown.type === 'base' ? '#374151' : '#059669',
                                    fontWeight: breakdown.type === 'base' ? 'normal' : '500'
                                  }}>
                                    {breakdown.type === 'base' ? '' : '+'}¥{breakdown.price.toLocaleString()}
                                  </Text>
                                </div>
                              ))}
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #e5e7eb' }}>
                                <Text strong style={{ color: '#374151' }}>定制总价:</Text>
                                <Text strong style={{ color: '#3b82f6' }}>¥{item.customization.finalPrice.toLocaleString()}</Text>
                              </div>
                            </Space>
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
