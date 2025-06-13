import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/watch-product-card';
import LoadingSpinner from '../components/loading-indicator';
import { Product, ProductCategory } from '../seagull-watch-types';
import { databaseProductService } from '../services/database-product-service';
import { useCart } from '../hooks/use-shopping-cart';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  
  const selectedCategory = searchParams.get('category') as ProductCategory | null;
  const { addItem } = useCart();

  // 获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await databaseProductService.getProductCategories();
        const uniqueCategories = Array.from(new Set(fetchedCategories));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("获取分类失败:", error);
      }
    };
    fetchCategories();
  }, []);

  // 获取产品列表的函数
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('正在获取产品，分类:', selectedCategory);
      const fetchedProducts = await databaseProductService.getProducts(selectedCategory || undefined);
      console.log('获取到的产品数量:', fetchedProducts.length);
      
      // 强制更新状态
      setProducts([]); // 先清空当前列表
      setTimeout(() => {
        setProducts(fetchedProducts);
        setLastUpdated(Date.now());
      }, 0);
    } catch (error) {
      console.error("获取产品失败:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  // 监听分类变化
  useEffect(() => {
    console.log('分类变化，触发刷新');
    fetchProducts();
  }, [selectedCategory, fetchProducts]);

  // 监听lastUpdated变化，确保UI更新
  useEffect(() => {
    console.log('产品列表已更新，时间戳:', lastUpdated);
  }, [lastUpdated]);

  const handleCategoryChange = (category: ProductCategory | null) => {
    console.log('切换分类:', category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-brand-text mb-2">
          {selectedCategory ? selectedCategory : "全部腕表"}
        </h1>
        <p className="text-brand-text-secondary max-w-xl mx-auto">
          探索我们精心策划的高端腕表收藏，每一枚都以精湛工艺和满怀激情制作。
        </p>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 p-4 bg-brand-surface rounded-lg shadow-md">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            !selectedCategory ? 'bg-brand-primary text-brand-bg' : 'bg-gray-600 text-brand-text-secondary hover:bg-gray-500'
          }`}
        >
          全部腕表
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              selectedCategory === cat ? 'bg-brand-primary text-brand-bg' : 'bg-gray-600 text-brand-text-secondary hover:bg-gray-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 产品列表 */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" key={lastUpdated}>
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-brand-text-secondary">暂无相关产品</p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
