import { DatabaseManager } from '../database/database-manager';
import { CUSTOMIZATION_SEED_DATA, PRODUCT_CUSTOMIZATION_CONFIGS } from '../database/customization-seed-data';
import type { 
  CustomizationCategoryRecord, 
  CustomizationOptionRecord, 
  ProductCustomizationConfigRecord,
  OrderCustomizationDetailRecord 
} from '../database/schema';

// 类型别名，方便使用
export type CustomizationCategory = CustomizationCategoryRecord;
export type CustomizationOption = CustomizationOptionRecord;
export type ProductCustomizationConfig = ProductCustomizationConfigRecord;
export type OrderCustomizationDetail = OrderCustomizationDetailRecord;

export class CustomizationService {
  /**
   * 初始化定制数据
   */
  static async initializeCustomizationData(): Promise<void> {
    try {
      console.log('🔄 初始化定制数据...');
      const db = DatabaseManager.getInstance();

      // 检查是否已初始化
      const existingCategories = await db.getEngine().find('customization_categories', {});
      if (existingCategories.length > 0) {
        console.log('✅ 定制数据已存在，跳过初始化');
        return;
      }

      // 插入定制类别
      for (const category of CUSTOMIZATION_SEED_DATA.categories) {
        await db.getEngine().insert('customization_categories', {
          ...category,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      // 插入定制选项
      for (const option of CUSTOMIZATION_SEED_DATA.options) {
        await db.getEngine().insert('customization_options', {
          ...option,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      // 插入产品定制配置
      for (const config of PRODUCT_CUSTOMIZATION_CONFIGS) {
        await db.getEngine().insert('product_customization_configs', {
          ...config,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      console.log('✅ 定制数据初始化完成');
    } catch (error) {
      console.error('❌ 定制数据初始化失败:', error);
      throw error;
    }
  }

  /**
   * 获取产品的定制配置
   */
  static async getProductCustomizationConfig(productId: string): Promise<{
    categories: CustomizationCategory[];
    options: Record<string, CustomizationOption[]>;
    configs: ProductCustomizationConfig[];
  }> {
    try {
      const db = DatabaseManager.getInstance();
      
      // 获取产品的定制配置
      const configs = await db.getEngine().find('product_customization_configs', {
        where: [{ field: 'product_id', operator: '=', value: productId }],
        orderBy: [{ field: 'sort_order', direction: 'asc' }]
      });

      // 获取相关的定制类别
      const categoryIds = configs.map((config: any) => config.category_id);
      const categories = await db.getEngine().find('customization_categories', {
        where: categoryIds.map((id: string) => ({ field: 'id', operator: '=', value: id })),
        orderBy: [{ field: 'sort_order', direction: 'asc' }]
      });

      // 获取每个类别的选项
      const optionsByCategory: Record<string, CustomizationOption[]> = {};
      for (const categoryId of categoryIds) {
        const options = await db.getEngine().find('customization_options', {
          where: [
            { field: 'category_id', operator: '=', value: categoryId },
            { field: 'is_active', operator: '=', value: true }
          ],
          orderBy: [{ field: 'sort_order', direction: 'asc' }]
        });
        optionsByCategory[categoryId] = options;
      }

      return {
        categories,
        options: optionsByCategory,
        configs
      };
    } catch (error) {
      console.error('❌ 获取产品定制配置失败:', error);
      throw error;
    }
  }

  /**
   * 检查是否为基础定制（所有选项都是基础价格）
   */
  static isBasicCustomization(
    selectedOptions: Record<string, string>,
    options: Record<string, CustomizationOption[]>
  ): boolean {
    for (const [categoryId, optionId] of Object.entries(selectedOptions)) {
      const categoryOptions = options[categoryId] || [];
      const selectedOption = categoryOptions.find(opt => opt.id === optionId);
      
      if (selectedOption && selectedOption.base_price > 0) {
        return false; // 如果有任何付费选项，就不是基础定制
      }
    }
    return true; // 所有选项都是免费的，是基础定制
  }

  /**
   * 计算定制价格
   */
  static calculateCustomizationPrice(
    basePrice: number,
    selectedOptions: Record<string, string>,
    options: Record<string, CustomizationOption[]>
  ): {
    basePrice: number;
    additionalPrice: number;
    totalPrice: number;
    isBasicCustomization: boolean;
    priceBreakdown: Array<{
      type: 'base' | 'option';
      name: string;
      name_en: string;
      price: number;
      isBasic: boolean;
    }>;
  } {
    const priceBreakdown: Array<{
      type: 'base' | 'option';
      name: string;
      name_en: string;
      price: number;
      isBasic: boolean;
    }> = [{
      type: 'base',
      name: '基础价格',
      name_en: 'Base Price',
      price: basePrice,
      isBasic: true
    }];

    let additionalPrice = 0;
    let hasPremiumOptions = false;

    // 计算每个选项的额外费用
    for (const [categoryId, optionId] of Object.entries(selectedOptions)) {
      const categoryOptions = options[categoryId] || [];
      const selectedOption = categoryOptions.find(opt => opt.id === optionId);
      
      if (selectedOption) {
        if (selectedOption.base_price > 0) {
          additionalPrice += selectedOption.base_price;
          hasPremiumOptions = true;
        }
        
        priceBreakdown.push({
          type: 'option',
          name: selectedOption.name,
          name_en: selectedOption.name_en,
          price: selectedOption.base_price,
          isBasic: selectedOption.base_price === 0
        });
      }
    }

    const isBasicCustomization = !hasPremiumOptions;

    return {
      basePrice,
      additionalPrice,
      totalPrice: basePrice + additionalPrice,
      isBasicCustomization,
      priceBreakdown
    };
  }

  /**
   * 获取基础定制推荐配置
   */
  static getBasicCustomizationRecommendation(
    categories: CustomizationCategory[],
    options: Record<string, CustomizationOption[]>
  ): Record<string, string> {
    const recommendation: Record<string, string> = {};
    
    for (const category of categories) {
      const categoryOptions = options[category.id] || [];
      // 找到该类别中价格最低（基础）的选项
      const basicOption = categoryOptions.find(opt => opt.base_price === 0);
      if (basicOption) {
        recommendation[category.id] = basicOption.id;
      }
    }
    
    return recommendation;
  }

  /**
   * 验证定制配置的完整性
   */
  static validateCustomizationCompleteness(
    selectedOptions: Record<string, string>,
    categories: CustomizationCategory[],
    options: Record<string, CustomizationOption[]>
  ): {
    isValid: boolean;
    missingCategories: string[];
    errors: string[];
  } {
    const missingCategories: string[] = [];
    const errors: string[] = [];

    // 检查是否所有必需类别都已选择
    for (const category of categories) {
      if (!selectedOptions[category.id]) {
        missingCategories.push(category.id);
        errors.push(`缺少${category.name}的选择`);
      }
    }

    // 验证选择的选项是否有效
    for (const [categoryId, optionId] of Object.entries(selectedOptions)) {
      const categoryOptions = options[categoryId] || [];
      const selectedOption = categoryOptions.find(opt => opt.id === optionId);
      
      if (!selectedOption) {
        errors.push(`无效的选项: ${categoryId} -> ${optionId}`);
      }
    }

    return {
      isValid: missingCategories.length === 0 && errors.length === 0,
      missingCategories,
      errors
    };
  }

  /**
   * 保存订单定制详情
   */
  static async saveOrderCustomizationDetails(
    orderItemId: string,
    selectedOptions: Record<string, string>,
    categories: CustomizationCategory[],
    options: Record<string, CustomizationOption[]>
  ): Promise<void> {
    try {
      console.log('💾 保存订单定制详情:', { orderItemId, selectedOptions });
      const db = DatabaseManager.getInstance();

      for (const [categoryId, optionId] of Object.entries(selectedOptions)) {
        const category = categories.find(cat => cat.id === categoryId);
        const categoryOptions = options[categoryId] || [];
        const option = categoryOptions.find(opt => opt.id === optionId);

        if (category && option) {
          const detail: OrderCustomizationDetail = {
            id: `${orderItemId}_${categoryId}_${Date.now()}`,
            order_item_id: orderItemId,
            category_id: categoryId,
            category_name: category.name,
            category_name_en: category.name_en,
            option_id: optionId,
            option_name: option.name,
            option_name_en: option.name_en,
            option_price: option.base_price,
            price_modifier: 0,
            created_at: new Date().toISOString()
          };

          await db.getEngine().insert('order_customization_details', detail);
        }
      }

      console.log('✅ 订单定制详情保存成功');
    } catch (error) {
      console.error('❌ 保存订单定制详情失败:', error);
      throw error;
    }
  }

  /**
   * 获取订单定制详情
   */
  static async getOrderCustomizationDetails(orderItemId: string): Promise<OrderCustomizationDetail[]> {
    try {
      const db = DatabaseManager.getInstance();
      const details = await db.getEngine().find('order_customization_details', {
        where: [{ field: 'order_item_id', operator: '=', value: orderItemId }]
      });

      return details;
    } catch (error) {
      console.error('❌ 获取订单定制详情失败:', error);
      return [];
    }
  }

  /**
   * 获取定制选项详情
   */
  static async getCustomizationOptionDetails(optionIds: string[]): Promise<CustomizationOption[]> {
    try {
      if (optionIds.length === 0) return [];
      
      const db = DatabaseManager.getInstance();
      const options = await db.getEngine().find('customization_options', {
        where: optionIds.map(id => ({ field: 'id', operator: '=', value: id }))
      });

      return options;
    } catch (error) {
      console.error('❌ 获取定制选项详情失败:', error);
      return [];
    }
  }

  /**
   * 获取定制统计信息
   */
  static async getCustomizationStatistics(): Promise<{
    totalCustomizations: number;
    basicCustomizations: number;
    premiumCustomizations: number;
    averageAdditionalCost: number;
  }> {
    try {
      const db = DatabaseManager.getInstance();
      
      // 这里可以添加统计查询逻辑
      // 由于当前使用浏览器数据库，这里返回模拟数据
      return {
        totalCustomizations: 0,
        basicCustomizations: 0,
        premiumCustomizations: 0,
        averageAdditionalCost: 0
      };
    } catch (error) {
      console.error('❌ 获取定制统计信息失败:', error);
      return {
        totalCustomizations: 0,
        basicCustomizations: 0,
        premiumCustomizations: 0,
        averageAdditionalCost: 0
      };
    }
  }
} 