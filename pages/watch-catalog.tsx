import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography, Input, Select, Row, Col, Empty, Space, Button } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import ProductCard from '../components/watch-product-card';
import LoadingSpinner from '../components/loading-indicator';
import { Product, ProductCategory } from '../seagull-watch-types';
import { databaseProductService } from '../services/database-product-service';
import { useCart } from '../hooks/use-shopping-cart';
import { useLanguage } from '../hooks/use-language';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchParams] = useSearchParams();
  const { addItem } = useCart();
  const { t, formatString } = useLanguage();

  // 从URL参数获取初始分类
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // 获取产品数据
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const productData = await databaseProductService.getProducts();
        setProducts(productData);
        setFilteredProducts(productData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 产品筛选逻辑
  useEffect(() => {
    let filtered = products;
    
    // 分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // 获取分类列表（包括"全部"选项）
  const categoryOptions = [
    { value: 'all', label: t.products.allWatches },
    ...Object.values(ProductCategory).map(category => ({
      value: category,
      label: category
    }))
  ];

  return (
    <div className="min-h-screen" style={{ padding: '0 24px' }}>
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <Title 
          level={1} 
          className="text-4xl font-serif font-bold mb-4"
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          🕰️ {t.products.allWatches}
        </Title>
      </div>

      {/* 搜索和筛选栏 */}
      <div className="mb-8">
        <Row gutter={[16, 16]} align="middle" justify="center">
          <Col xs={24} sm={16} md={12} lg={8}>
            <Search
              placeholder={t.products.searchPlaceholder}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: '100%' }}
              prefix={<SearchOutlined style={{ color: '#64748b' }} />}
              size="large"
            />
          </Col>
          <Col xs={24} sm={8} md={6} lg={4}>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{ width: '100%' }}
              size="large"
              suffixIcon={<FilterOutlined style={{ color: '#64748b' }} />}
            >
              {categoryOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      {/* 分类快速筛选按钮 */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 p-6 rounded-xl shadow-sm" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <Button
          type={selectedCategory === 'all' ? 'primary' : 'default'}
          onClick={() => handleCategoryChange('all')}
          className={selectedCategory === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}
          style={{ borderRadius: '8px', fontWeight: 500 }}
        >
          {t.products.allWatches}
        </Button>
        {Object.values(ProductCategory).map(category => (
          <Button
            key={category}
            type={selectedCategory === category ? 'primary' : 'default'}
            onClick={() => handleCategoryChange(category)}
            className={selectedCategory === category ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}
            style={{ borderRadius: '8px', fontWeight: 500 }}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* 产品计数 */}
      {!isLoading && (
        <div className="mb-6 text-center">
          <p className="text-brand-text-secondary text-lg">
            {formatString(t.products.foundWatches, { count: filteredProducts.length })}
          </p>
        </div>
      )}

      {/* 产品列表 */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner message={t.common.loading} />
        </div>
      ) : filteredProducts.length > 0 ? (
        <Row gutter={[24, 24]}>
          {filteredProducts.map((product, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={`${product.id}-${index}`}>
              <ProductCard 
                product={product} 
                onAddToCart={handleAddToCart}
                showCustomizable={true}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <Empty
            image={
              <div style={{ fontSize: '80px', color: '#cbd5e1', marginBottom: '20px' }}>
                🕰️
              </div>
            }
            description={
              <div>
                <Title level={4} style={{ color: '#64748b', marginBottom: '8px' }}>
                  {t.products.noProducts}
                </Title>
                <p style={{ color: '#94a3b8', fontSize: '16px' }}>
                  {t.products.tryOtherCategories}
                </p>
              </div>
            }
          >
            <Button 
              type="primary" 
              size="large"
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
              }}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: 500
              }}
            >
              {t.products.allWatches}
            </Button>
          </Empty>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
