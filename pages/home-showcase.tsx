import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Row, Col, Space, Button, notification, Card, Image } from 'antd';
import { ShoppingCartOutlined, TrophyOutlined, ArrowRightOutlined } from '@ant-design/icons';
import HeroSection from '../components/hero-banner';
import ProductCard from '../components/watch-product-card';
import LoadingSpinner from '../components/loading-indicator';
import { Product, ProductCategory } from '../seagull-watch-types';
import { databaseProductService } from '../services/database-product-service';
import { useCart } from '../hooks/use-shopping-cart';
import { useLanguage } from '../hooks/use-language';
import { BRAND_INFO } from '../seagull-brand-config';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { t, formatString } = useLanguage();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const featuredProductsData = await databaseProductService.getFeaturedProducts();
        // 如果没有设置特色产品，则取前3个产品
        if (featuredProductsData.length === 0) {
          const allProducts = await databaseProductService.getProducts();
          setFeaturedProducts(allProducts.slice(0, 3));
        } else {
          setFeaturedProducts(featuredProductsData.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    notification.success({
      message: t.cart.addToCart,
      description: `${product.name} ${t.cart.addToCart}！`,
    });
  };

  return (
    <div style={{ padding: '0', display: 'flex', flexDirection: 'column', gap: '64px' }}>
      <HeroSection />

      {/* 精选时计区域 */}
      <section style={{ padding: '0 24px' }}>
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '40px',
            padding: '0 8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <TrophyOutlined 
              style={{ 
                fontSize: '28px', 
                color: '#f59e0b',
                filter: 'drop-shadow(0 1px 2px rgba(245, 158, 11, 0.2))'
              }} 
            />
            <Title 
              level={2} 
              style={{ 
                margin: 0,
                background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {t.home.featuredWatches}
            </Title>
          </div>
          <Link to="/products">
            <Button 
              type="link" 
              size="large"
              icon={<ArrowRightOutlined />}
              style={{
                color: '#3b82f6',
                fontSize: '16px',
                fontWeight: 500,
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              className="hover:bg-blue-50"
            >
              {t.home.viewAllSeries}
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
            <LoadingSpinner message={t.common.loading} />
          </div>
        ) : featuredProducts.length > 0 ? (
          <Row gutter={[24, 24]}>
            {featuredProducts.map((product, index) => (
              <Col xs={24} md={12} lg={8} key={`featured-${product.id}-${index}`}>
                <ProductCard 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  showCustomizable={true}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', color: '#cbd5e1' }}>🕰️</div>
            <Paragraph 
              style={{ 
                fontSize: '18px', 
                color: '#64748b',
                margin: 0
              }}
            >
              {t.products.noProducts}
            </Paragraph>
          </div>
        )}
      </section>

      {/* 品牌承诺区域 */}
      <section style={{ padding: '0 24px' }}>
        <Card 
          style={{ 
            padding: '48px 32px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          <Row gutter={[48, 32]} align="middle">
            <Col xs={24} md={12}>
              <div>
                <Title 
                  level={2} 
                  style={{ 
                    marginBottom: '20px',
                    color: '#1e293b',
                    fontSize: '32px',
                    fontWeight: 'bold'
                  }}
                >
                  {t.home.brandPromise}
                </Title>
                <Paragraph 
                  style={{ 
                    color: '#64748b', 
                    marginBottom: '16px', 
                    fontSize: '16px', 
                    lineHeight: '1.7',
                    textAlign: 'justify'
                  }}
                >
                  {t.home.brandPromiseDesc1}
                </Paragraph>
                <Paragraph 
                  style={{ 
                    color: '#64748b', 
                    marginBottom: '24px', 
                    fontSize: '16px', 
                    lineHeight: '1.7',
                    textAlign: 'justify'
                  }}
                >
                  {t.home.brandPromiseDesc2}
                </Paragraph>
                <Link to="/about">
                  <Button 
                    type="primary" 
                    size="large"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '16px',
                      fontWeight: '500',
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                    className="hover:shadow-lg hover:scale-105"
                  >
                    {t.home.learnOurStory}
                  </Button>
                </Link>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div 
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                <Image
                  src="./images/seagull_team_main.jpg" 
                  alt="汉时辰制制表工艺" 
                  style={{ 
                    width: '100%', 
                    height: '320px', 
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                  preview={false}
                />
                {/* 图片上的渐变遮罩 */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.1) 100%)',
                    borderRadius: '12px'
                  }}
                />
              </div>
            </Col>
          </Row>
        </Card>
      </section>
      
      {/* 按系列探索 */}
      <section style={{ padding: '0 24px' }}>
        <Title 
          level={2} 
          style={{ 
            textAlign: 'center', 
            marginBottom: '40px',
            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '32px',
            fontWeight: 'bold'
          }}
        >
          🎯 {t.home.exploreByCategory}
        </Title>
        <Row gutter={[24, 24]}>
          {Object.values(ProductCategory).map(category => (
            <Col xs={12} sm={12} lg={6} key={category}>
              <Link to={`/products?category=${encodeURIComponent(category)}`}>
                <Card 
                  hoverable
                  style={{ 
                    textAlign: 'center', 
                    height: '140px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    transition: 'all 0.3s ease'
                  }}
                  styles={{ body: { padding: '24px' } }}
                  className="hover:shadow-lg hover:scale-105"
                >
                  <Title 
                    level={4} 
                    style={{ 
                      margin: '0 0 8px 0',
                      color: '#1e293b',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    {category}
                  </Title>
                  <Paragraph 
                    style={{ 
                      margin: 0, 
                      fontSize: '13px',
                      color: '#64748b',
                      lineHeight: '1.4'
                    }}
                  >
                    {formatString(t.home.exploreCategory, { category })}
                  </Paragraph>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
};

export default HomePage;
