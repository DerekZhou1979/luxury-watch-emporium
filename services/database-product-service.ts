import { DatabaseManager } from '../database/database-manager';
import { Product, ProductCategory } from '../seagull-watch-types';
import { ProductRecord } from '../database/schema';

const db = DatabaseManager.getInstance();

// 产品分类映射 - 从数据库slug到ProductCategory
const categoryMapping: Record<string, ProductCategory> = {
  'luxury': ProductCategory.LUXURY,      // "大师海鸥"
  'sports': ProductCategory.SPORTS,      // "飞行系列"
  'classic': ProductCategory.CLASSIC,    // "海洋系列"
  'minimalist': ProductCategory.MINIMALIST // "潮酷品线"
};

// 反向映射 - 从ProductCategory到数据库slug
const reverseCategoryMapping: Record<ProductCategory, string> = {
  [ProductCategory.LUXURY]: 'luxury',
  [ProductCategory.SPORTS]: 'sports', 
  [ProductCategory.CLASSIC]: 'classic',
  [ProductCategory.MINIMALIST]: 'minimalist'
};

// 数据库产品记录转换为前端Product类型
function convertProductRecord(productRecord: ProductRecord, categorySlug: string): Product {
  return {
    id: productRecord.id,
    name: productRecord.name,
    brand: productRecord.brand,
    price: productRecord.price,
    imageUrl: productRecord.images[0] || '',
    galleryImages: productRecord.images,
    description: productRecord.description,
    shortDescription: productRecord.short_description || '',
    features: productRecord.tags,
    category: categoryMapping[categorySlug] || ProductCategory.LUXURY,
    stock: productRecord.stock_quantity,
    sku: productRecord.sku
  };
}

// 数据库产品服务
export const databaseProductService = {
  // 获取产品列表（可按分类筛选）
  getProducts: async (category?: ProductCategory): Promise<Product[]> => {
    try {
      console.log('开始获取产品，分类:', category);
      
      // 获取所有分类信息
      const categories = await db.findCategories();
      console.log('获取到的分类数量:', categories.length);
      
      let products: Product[] = [];

      if (category) {
        // 通过反向映射找到对应的slug
        const targetSlug = reverseCategoryMapping[category];
        console.log('目标分类slug:', targetSlug);
        
        const targetCategory = categories.find(cat => cat.slug === targetSlug);
        console.log('找到目标分类:', targetCategory?.name);

        if (targetCategory) {
          // 只获取指定分类的产品
          const productRecords = await db.findProductsByCategory(targetCategory.id);
          console.log('获取到的产品记录数量:', productRecords.length);
          
          products = productRecords
            .filter(p => p.status === 'active')
            .map(record => convertProductRecord(record, targetCategory.slug));
        }
      } else {
        // 获取所有产品
        const productRecords = await db.findProducts({
          where: [{ field: 'status', operator: '=', value: 'active' }]
        });
        console.log('获取到的所有产品记录数量:', productRecords.length);

        products = [];
        for (const record of productRecords) {
          const category = categories.find(cat => cat.id === record.category_id);
          if (category) {
            products.push(convertProductRecord(record, category.slug));
          }
        }
      }

      console.log('最终返回的产品数量:', products.length);
      return products;
    } catch (error) {
      console.error('获取产品列表失败:', error);
      return [];
    }
  },

  // 根据ID获取单个产品
  getProductById: async (id: string): Promise<Product | undefined> => {
    try {
      const productRecord = await db.findProductById(id);
      if (!productRecord || productRecord.status !== 'active') {
        return undefined;
      }

      // 获取分类信息
      const categories = await db.findCategories();
      const category = categories.find(cat => cat.id === productRecord.category_id);
      
      if (!category) {
        return undefined;
      }

      return convertProductRecord(productRecord, category.slug);
    } catch (error) {
      console.error('获取产品详情失败:', error);
      return undefined;
    }
  },

  // 获取所有产品分类
  getProductCategories: async (): Promise<ProductCategory[]> => {
    try {
      const categories = await db.findCategories({
        where: [{ field: 'status', operator: '=', value: 'active' }]
      });
      
      // 确保分类不重复且有效
      const uniqueCategories = categories
        .map(cat => categoryMapping[cat.slug])
        .filter((cat): cat is ProductCategory => cat !== undefined);
      
      return uniqueCategories;
    } catch (error) {
      console.error('获取产品分类失败:', error);
      return [];
    }
  },

  // 搜索产品
  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const productRecords = await db.searchProducts(query, {
        where: [{ field: 'status', operator: '=', value: 'active' }]
      });

      const categories = await db.findCategories();
      const products: Product[] = [];

      for (const record of productRecords) {
        const category = categories.find(cat => cat.id === record.category_id);
        if (category) {
          products.push(convertProductRecord(record, category.slug));
        }
      }

      return products;
    } catch (error) {
      console.error('搜索产品失败:', error);
      return [];
    }
  },

  // 获取特色产品
  getFeaturedProducts: async (): Promise<Product[]> => {
    try {
      const productRecords = await db.findProducts({
        where: [
          { field: 'status', operator: '=', value: 'active' },
          { field: 'is_featured', operator: '=', value: true }
        ]
      });

      const categories = await db.findCategories();
      const products: Product[] = [];

      for (const record of productRecords) {
        const category = categories.find(cat => cat.id === record.category_id);
        if (category) {
          products.push(convertProductRecord(record, category.slug));
        }
      }

      return products;
    } catch (error) {
      console.error('获取特色产品失败:', error);
      return [];
    }
  }
};

export default databaseProductService; 