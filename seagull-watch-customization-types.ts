// 手表定制化系统类型定义
export interface CustomizationOption {
  id: string;
  name: string; // 名称
  displayName: string; // 显示名称
  description?: string; // 描述
  type: 'select' | 'color' | 'text' | 'image'; // 类型
  required: boolean; // 是否必填
  maxLength?: number; // 对于文本类型
  values: CustomizationValue[]; // 选项值
  defaultValue?: string; // 默认值
  category: CustomizationCategory; // 分类
  sortOrder: number; // 排序
  isActive: boolean; // 是否激活
  priceModifier: number; // 价格修正值（正数增加，负数减少）
  stockQuantity?: number; // 特定选项的库存量
}

// 定制选项值
export interface CustomizationValue {
  id: string; // ID
  value: string; // 值
  displayName: string; // 显示名称
  description?: string; // 描述
  imageUrl?: string; // 用于颜色、材质等可视化选项
  priceModifier: number; // 该选项的价格修正
  stockQuantity: number; // 库存量
  isDefault: boolean; // 是否默认
  isAvailable: boolean; // 是否可用
  hexColor?: string; // 用于颜色选项
  materialCode?: string; // 材质编码
}

// 定制分类
export enum CustomizationCategory {
  CASE = 'case', // 表壳
  DIAL = 'dial', // 表盘
  HANDS = 'hands', // 指针
  STRAP = 'strap', // 表带
  ENGRAVING = 'engraving', // 刻字
  BEZEL = 'bezel', // 表圈
  CROWN = 'crown', // 表冠
  MARKERS = 'markers', // 时标
  COMPLICATIONS = 'complications' // 复杂功能
}

// 表壳材质枚举
export enum CaseMaterial {
  STAINLESS_STEEL = 'stainless_steel', // 不锈钢
  TITANIUM = 'titanium', // 钛金属
  ROSE_GOLD = 'rose_gold', // 玫瑰金
  WHITE_GOLD = 'white_gold', // 白金
  YELLOW_GOLD = 'yellow_gold', // 黄金
  CERAMIC = 'ceramic', // 陶瓷
  CARBON_FIBER = 'carbon_fiber', // 碳纤维
  BRONZE = 'bronze' // 青铜
}

// 表壳尺寸
export enum CaseSize {
  SIZE_36MM = '36mm',
  SIZE_38MM = '38mm',
  SIZE_40MM = '40mm',
  SIZE_42MM = '42mm',
  SIZE_44MM = '44mm',
  SIZE_46MM = '46mm'
}

// 表带类型
export enum StrapType {
  LEATHER = 'leather', // 皮革
  METAL_BRACELET = 'metal_bracelet', // 金属链
  RUBBER = 'rubber', // 橡胶
  FABRIC = 'fabric', // 织物
  NATO = 'nato', // NATO表带
  MESH = 'mesh', // 米兰链带
  CERAMIC_BRACELET = 'ceramic_bracelet' // 陶瓷链带
}

// 表盘颜色
export enum DialColor {
  BLACK = 'black',
  WHITE = 'white',
  BLUE = 'blue',
  GREEN = 'green',
  SILVER = 'silver',
  GOLD = 'gold',
  BROWN = 'brown',
  GREY = 'grey',
  SKELETON = 'skeleton', // 镂空
  MOTHER_OF_PEARL = 'mother_of_pearl' // 珍珠母贝
}

// 指针样式
export enum HandStyle {
  CLASSIC = 'classic', // 经典
  MODERN = 'modern', // 现代
  VINTAGE = 'vintage', // 复古
  SPORT = 'sport', // 运动
  SKELETON = 'skeleton', // 镂空
  LUMINOUS = 'luminous' // 夜光
}

// 用户定制配置
export interface CustomizationConfiguration {
  id: string;
  productId: string;
  userId?: string; // 可为空支持游客定制
  sessionId?: string; // 游客会话ID
  configurations: Record<string, string>; // 选项ID -> 值ID的映射
  totalPriceModifier: number; // 总价格修正
  previewImageUrl?: string; // 预览图片URL
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  isValid: boolean; // 配置是否有效
  validationErrors?: string[]; // 验证错误信息
}

// 定制产品接口（扩展基础Product）
export interface CustomizableProduct {
  id: string;
  name: string; // 名称
  brand: string; // 品牌
  basePrice: number; // 基础价格
  imageUrl: string; // 主图URL
  galleryImages?: string[]; // 图库图片URL数组
  description: string; // 描述
  shortDescription: string; // 短描述
  features: string[]; // 功能列表
  category: string; // 分类
  stock: number; // 库存
  sku: string; // SKU
  
  // 定制化相关字段
  isCustomizable: boolean; // 是否支持定制
  customizationOptions: CustomizationOption[]; // 可定制选项
  previewImages: Record<string, string>; // 预览图片映射 configuration_hash -> image_url
  manufacturingTime: number; // 制作周期（天）
  minCustomizationPrice: number; // 最低定制价格
  maxCustomizationPrice: number; // 最高定制价格
  customizationGuide?: string; // 定制指南
  sizingGuide?: string; // 尺寸指南
  careInstructions?: string; // 保养说明
}

// 定制购物车项
export interface CustomizableCartItem {
  id: string;
  productId: string;
  product: CustomizableProduct; // 产品信息
  quantity: number; // 数量
  customizationConfig?: CustomizationConfiguration; // 定制配置
  finalPrice: number; // 包含定制费用的最终价格
  previewImageUrl?: string; // 预览图片URL
  estimatedDelivery?: string; // 预计交付时间
  addedAt: string; // 添加时间 
}

// 定制订单项
export interface CustomizableOrderItem {
  id: string;
  productId: string; // 产品ID
  productName: string; // 产品名称
  basePrice: number; // 基础价格
  customizationConfig?: CustomizationConfiguration; // 定制配置
  quantity: number; // 数量
  finalPrice: number; // 最终价格
  totalPrice: number; // 总价格
  previewImageUrl?: string; // 预览图片URL
  customizationSummary: string; // 定制选项摘要
  manufacturingStatus: ManufacturingStatus; // 制造状态
  estimatedCompletion?: string; // 预计完成时间
  actualCompletion?: string; // 实际完成时间
  trackingNumber?: string; // 跟踪号
}

// 制作状态
export enum ManufacturingStatus {
  PENDING = 'pending', // 待生产
  DESIGN_CONFIRMED = 'design_confirmed', // 设计确认
  IN_PRODUCTION = 'in_production', // 生产中
  QUALITY_CHECK = 'quality_check', // 质检中
  COMPLETED = 'completed', // 制作完成
  SHIPPED = 'shipped', // 已发货
  DELIVERED = 'delivered' // 已交付
}

// 定制价格计算结果
export interface CustomizationPricing {
  basePrice: number;
  optionPricing: Record<string, number>; // 各选项价格
  totalModifier: number; // 总价格修正
  finalPrice: number; // 最终价格
  savings?: number; // 节省金额（如有折扣）
  breakdown: PriceBreakdownItem[]; // 价格明细
}

// 价格明细项
export interface PriceBreakdownItem {
  category: string;
  name: string;
  price: number;
  type: 'base' | 'option' | 'discount';
}

// 定制验证结果
export interface CustomizationValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  recommendations?: string[];
}

// 验证错误
export interface ValidationError {
  optionId: string;
  message: string;
  code: string;
}

// 验证警告
export interface ValidationWarning {
  optionId: string;
  message: string;
  code: string;
}

// 3D预览配置
export interface PreviewConfiguration {
  cameraAngle: number;
  lighting: 'studio' | 'natural' | 'dramatic';
  background: 'white' | 'black' | 'transparent' | 'environment';
  renderQuality: 'low' | 'medium' | 'high' | 'ultra';
  animationEnabled: boolean;
}

// 定制推荐
export interface CustomizationRecommendation {
  id: string; // ID
  name: string; // 名称
  description: string; // 描述
  configurations: Record<string, string>; // 配置
  previewImageUrl: string; // 预览图片URL
  popularityScore: number; // 流行度评分
  priceModifier: number; // 价格修正
  tags: string[]; // 标签
}

// 定制模板
export interface CustomizationTemplate {
  id: string; // ID
  name: string; // 名称
  description: string; // 描述
  category: string; // 分类
  previewImageUrl: string; // 预览图片URL
  configurations: Record<string, string>; // 配置
  isPopular: boolean; // 是否流行
  createdBy: 'system' | 'user'; // 创建者
  createdAt: string; // 创建时间
  usageCount: number; // 使用次数
}

export default CustomizableProduct; 