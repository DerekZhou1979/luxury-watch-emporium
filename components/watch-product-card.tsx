
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Tag, Space, Typography } from 'antd';
import { ShoppingCartOutlined, SettingOutlined } from '@ant-design/icons';
import { Product } from '../seagull-watch-types';
import { useLanguage } from '../hooks/use-language';

const { Paragraph, Text } = Typography;

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  showCustomizable?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  showCustomizable = false 
}) => {
  const { t, formatString } = useLanguage();
  
  // 根据是否显示定制按钮来确定卡片高度
  const cardHeight = showCustomizable ? '560px' : '520px';

  // 根据库存量确定状态
  const getStockStatus = () => {
    if (product.stock > 10) {
      return { text: t.products.inStock, color: 'success' };
    } else if (product.stock > 0) {
      return { 
        text: formatString(t.products.remaining, { count: product.stock }), 
        color: 'warning' 
      };
    } else {
      return { text: t.products.outOfStock, color: 'error' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <Card
      className="product-card overflow-hidden transition-all duration-300 hover:shadow-lg border-0"
      style={{
        height: cardHeight, // 动态卡片高度
        display: 'flex',
        flexDirection: 'column'
      }}
      styles={{
        body: { 
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between'
        },
        header: { borderBottom: '1px solid #f1f5f9' }
      }}
      cover={
        <div className="aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative">
          {showCustomizable ? (
            <Link to={`/customize/${product.id}`} className="block w-full h-full group">
              <div className="relative w-full h-full">
                <img
                  alt={product.name}
                  src={product.imageUrl}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                  style={{ aspectRatio: '1/1' }}
                />
                {/* 悬停时显示定制提示 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                  <div className="text-white text-center">
                    <div className="text-2xl mb-2">🎨</div>
                    <div className="text-sm font-semibold">点击进入定制</div>
                    <div className="text-xs opacity-90">个性化您的专属腕表</div>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <img
              alt={product.name}
              src={product.imageUrl}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              style={{ aspectRatio: '1/1' }}
            />
          )}
          
          {/* 可定制标签 - 移至左上角 */}
          {showCustomizable && (
            <div
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 600,
                padding: '6px 10px',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                zIndex: 20,
                pointerEvents: 'none' // 确保不阻挡点击事件
              }}
            >
              <SettingOutlined style={{ fontSize: '12px' }} />
              <span>{t.products.customizable}</span>
              <div style={{ 
                width: '6px', 
                height: '6px', 
                backgroundColor: '#10b981', 
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }} />
            </div>
          )}


          {/* 库存状态标签 */}
          <Tag
            color={stockStatus.color}
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 500,
              padding: '2px 6px',
              backdropFilter: 'blur(4px)',
              zIndex: 20,
              pointerEvents: 'none' // 确保不阻挡点击事件
            }}
          >
            {stockStatus.text}
          </Tag>
        </div>
      }
    >
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        justifyContent: 'space-between'
      }}>
        {/* 产品信息区域 */}
        <div style={{ flex: 1 }}>
          {/* 产品名称 */}
          <Paragraph
            strong
            style={{
              color: '#1e293b',
              fontSize: '15px',
              lineHeight: '1.3',
              marginBottom: '8px',
              height: '40px', // 固定名称区域高度
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.name}
          </Paragraph>

          {/* 产品描述 */}
          <Paragraph
            style={{
              color: '#64748b',
              fontSize: '12px',
              lineHeight: '1.4',
              marginBottom: '12px',
              height: '32px', // 固定描述区域高度
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.description}
          </Paragraph>

          {/* 价格和SKU */}
          <Space direction="vertical" size="small" style={{ width: '90%', marginBottom: '12px' }}>
            <Text
              strong
              style={{
                fontSize: '16px',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {showCustomizable 
                ? `${t.products.startingPrice} ¥${product.price.toLocaleString()}`
                : `¥${product.price.toLocaleString()}`
              }
            </Text>
            
            <Text
              type="secondary"
              style={{
                fontSize: '10px',
                color: '#94a3b8',
                fontFamily: 'monospace'
              }}
            >
              {t.products.sku}: {product.sku}
            </Text>
          </Space>
        </div>

        {/* 按钮区域 */}
        <div 
          style={{ 
            marginTop: 'auto', 
            paddingTop: showCustomizable ? '16px' : '12px',
            minHeight: showCustomizable ? '88px' : '52px' // 确保按钮区域有足够的空间
          }}
        >
          <Space 
            direction="vertical" 
            size={showCustomizable ? 8 : 0} 
            style={{ width: '100%' }}
          >
            {/* 加入购物车按钮 - 主要操作 */}
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 500,
                height: '40px',
                fontSize: '14px',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
              }}
            >
              {t.cart.addToCart}
            </Button>
            
            {/* 个人定制按钮 - 次要操作（条件显示） */}
            {showCustomizable && (
              <Link to={`/customize/${product.id}`} style={{ width: '100%' }}>
                <Button
                  type="text"
                  icon={<SettingOutlined />}
                  style={{
                    width: '100%',
                    color: '#3b82f6',
                    fontWeight: 600,
                    border: '2px solid #3b82f6',
                    borderRadius: '8px',
                    height: '36px',
                    fontSize: '13px',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)';
                    e.currentTarget.style.color = '#3b82f6';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  🎨 {t.products.addToCustom}
                </Button>
              </Link>
            )}


          </Space>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
