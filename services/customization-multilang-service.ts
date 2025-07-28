import { CustomizationCategoryMultiLang, CustomizationOptionMultiLang } from '../database/schema';
import { customizationCategories, customizationOptions } from '../database/customization-multilang-data';

export class CustomizationMultiLangService {
  // 获取所有定制类别
  static getCategories(): CustomizationCategoryMultiLang[] {
    return customizationCategories;
  }

  // 根据类别ID获取选项
  static getOptionsByCategory(categoryId: string): CustomizationOptionMultiLang[] {
    return customizationOptions.filter(option => option.category === categoryId);
  }

  // 根据类别和值获取特定选项
  static getOption(categoryId: string, value: string): CustomizationOptionMultiLang | undefined {
    return customizationOptions.find(option => 
      option.category === categoryId && option.value === value
    );
  }

  // 获取本地化的名称
  static getLocalizedName(option: CustomizationOptionMultiLang, language: 'zh' | 'en'): string {
    return language === 'zh' ? option.name_zh : option.name_en;
  }

  // 获取本地化的描述
  static getLocalizedDesc(option: CustomizationOptionMultiLang, language: 'zh' | 'en'): string {
    return language === 'zh' ? option.desc_zh : option.desc_en;
  }

  // 获取本地化的类别标题
  static getLocalizedCategoryTitle(category: CustomizationCategoryMultiLang, language: 'zh' | 'en'): string {
    return language === 'zh' ? category.title_zh : category.title_en;
  }

  // 获取本地化的类别描述
  static getLocalizedCategoryDescription(category: CustomizationCategoryMultiLang, language: 'zh' | 'en'): string {
    return language === 'zh' ? category.description_zh : category.description_en;
  }
} 