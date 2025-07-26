import { DatabaseManager } from '../database/database-manager';
import { CUSTOMIZATION_SEED_DATA, PRODUCT_CUSTOMIZATION_CONFIGS } from '../database/customization-seed-data';
import type { 
  CustomizationCategoryRecord, 
  CustomizationOptionRecord, 
  ProductCustomizationConfigRecord,
  OrderCustomizationDetailRecord 
} from '../database/schema';

const db = DatabaseManager.getInstance();

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
      // 获取产品的定制配置
      const configs = await db.getEngine().find('product_customization_configs', {
        where: [{ field: 'product_id', operator: '=', value: productId }],
        orderBy: [{ field: 'sort_order', direction: 'asc' }]
      });

      // 获取相关的定制类别
      const categoryIds = configs.map(config => config.category_id);
      const categories = await db.getEngine().find('customization_categories', {
        where: categoryIds.map(id => ({ field: 'id', operator: '=', value: id })),
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
    priceBreakdown: Array<{
      type: 'base' | 'option';
      name: string;
      name_en: string;
      price: number;
    }>;
  } {
         const priceBreakdown: Array<{
       type: 'base' | 'option';
       name: string;
       name_en: string;
       price: number;
     }> = [{
       type: 'base',
       name: '基础价格',
       name_en: 'Base Price',
       price: basePrice
     }];

    let additionalPrice = 0;

    // 计算每个选项的额外费用
    for (const [categoryId, optionId] of Object.entries(selectedOptions)) {
      const categoryOptions = options[categoryId] || [];
      const selectedOption = categoryOptions.find(opt => opt.id === optionId);
      
      if (selectedOption && selectedOption.base_price > 0) {
        additionalPrice += selectedOption.base_price;
                 priceBreakdown.push({
           type: 'option',
           name: selectedOption.name,
           name_en: selectedOption.name_en,
           price: selectedOption.base_price
         });
      }
    }

    return {
      basePrice,
      additionalPrice,
      totalPrice: basePrice + additionalPrice,
      priceBreakdown
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

      const options = await db.getEngine().find('customization_options', {
        where: optionIds.map(id => ({ field: 'id', operator: '=', value: id }))
      });

      return options;
    } catch (error) {
      console.error('❌ 获取定制选项详情失败:', error);
      return [];
    }
  }
} 