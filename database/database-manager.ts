/**
 * 数据库管理器 - 单例模式
 * 用户、产品、订单、购物车管理，数据持久化
 */

import { BrowserDatabaseEngine, QueryCondition, QueryOptions, BrowserDatabaseConfig } from './browser-database-engine';
import { DatabaseSchema, UserRecord, ProductRecord, OrderRecord, CategoryRecord } from './schema';
import { CustomizationService } from '../services/customization-service';

/**
 * 数据库管理器类 - 单例模式
 * 
 * 提供所有数据库操作的高级接口，包装底层数据库引擎的复杂性。
 * 所有业务逻辑和数据验证都在这里进行。
 */
export class DatabaseManager {
  private static instance: DatabaseManager;
  private engine: BrowserDatabaseEngine;
  private config: BrowserDatabaseConfig;

  private constructor() {
    // 默认配置 - 浏览器JSON数据库（存储在localStorage中）
    this.config = {
      storageKey: 'seagull-watch-db',
      options: {
        autoBackup: true,      // 启用自动备份
        maxBackups: 24,        // 最多保留24个备份文件
        enableLogging: true    // 启用操作日志
      }
    };

    this.engine = new BrowserDatabaseEngine(this.config);
  }

  // 获取单例实例
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * 初始化数据库（包括定制数据）
   */
  async initialize(): Promise<void> {
    try {
      console.log('🔄 初始化数据库...');
      
             // 初始化基础数据库
       console.log('🔄 正在连接数据库引擎...');
       await this.engine.connect();
       
       console.log('📊 正在初始化基础数据...');
       await this.initializeBaseData();
      
      // 初始化定制数据
      await CustomizationService.initializeCustomizationData();
      
      console.log('✅ 数据库初始化完成');
    } catch (error) {
      console.error('❌ 数据库初始化失败:', error);
      throw error;
    }
  }

  /**
   * 关闭数据库连接
   * 执行清理工作，确保数据持久化
   */
  async close(): Promise<void> {
    console.log('🔒 正在关闭数据库连接...');
    await this.engine.disconnect();
  }

  /**
   * 获取底层数据库引擎实例
   * 用于执行高级或自定义操作
   * 
   * @returns {BrowserDatabaseEngine} 数据库引擎实例
   */
  getEngine(): BrowserDatabaseEngine {
    return this.engine;
  }

  // ===== 用户管理操作 =====

  /**
   * 创建新用户
   * 
   * @param userData 用户数据（不包含ID和时间戳）
   * @returns {Promise<UserRecord>} 创建的用户记录
   */
  async createUser(userData: Omit<UserRecord, 'id' | 'created_at' | 'updated_at'>): Promise<UserRecord> {
    return this.engine.insert('users', {
      ...userData,
      email_verified: false,    // 新用户邮箱默认未验证
      status: 'active'          // 新用户状态默认活跃
    } as UserRecord);
  }

  /**
   * 根据邮箱查找用户
   * 用于登录验证和重复邮箱检查
   * 
   * @param email 用户邮箱
   * @returns {Promise<UserRecord | null>} 用户记录或null
   */
  async findUserByEmail(email: string): Promise<UserRecord | null> {
    return this.engine.findOne('users', [
      { field: 'email', operator: '=' as const, value: email }
    ]);
  }

  /**
   * 根据ID查找用户
   * 
   * @param id 用户ID
   * @returns {Promise<UserRecord | null>} 用户记录或null
   */
  async findUserById(id: string): Promise<UserRecord | null> {
    return this.engine.findById('users', id);
  }

  /**
   * 更新用户信息
   * 
   * @param id 用户ID
   * @param updates 要更新的字段
   * @returns {Promise<number>} 受影响的记录数
   */
  async updateUser(id: string, updates: Partial<UserRecord>): Promise<number> {
    return this.engine.updateById('users', id, updates);
  }

  /**
   * 删除用户
   * 注意：这将删除用户的所有关联数据
   * 
   * @param id 用户ID
   * @returns {Promise<number>} 受影响的记录数
   */
  async deleteUser(id: string): Promise<number> {
    return this.engine.deleteById('users', id);
  }

  // ===== 商品管理操作 =====

  /**
   * 创建新商品
   * 
   * @param productData 商品数据（不包含ID和时间戳）
   * @returns {Promise<ProductRecord>} 创建的商品记录
   */
  async createProduct(productData: Omit<ProductRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ProductRecord> {
    return this.engine.insert('products', {
      ...productData,
      status: 'active',           // 新商品默认状态为活跃
      is_featured: false,         // 新商品默认非精选
      tags: productData.tags || [] // 确保tags字段存在
    } as ProductRecord);
  }

  /**
   * 查找商品列表
   * 支持分页、排序、筛选等高级查询
   * 
   * @param options 查询选项
   * @returns {Promise<ProductRecord[]>} 商品记录数组
   */
  async findProducts(options?: QueryOptions): Promise<ProductRecord[]> {
    return this.engine.find('products', options);
  }

  /**
   * 根据ID查找商品
   * 
   * @param id 商品ID
   * @returns {Promise<ProductRecord | null>} 商品记录或null
   */
  async findProductById(id: string): Promise<ProductRecord | null> {
    return this.engine.findById('products', id);
  }

  /**
   * 根据SKU查找商品
   * SKU应该是唯一的商品标识
   * 
   * @param sku 商品SKU
   * @returns {Promise<ProductRecord | null>} 商品记录或null
   */
  async findProductsBySku(sku: string): Promise<ProductRecord | null> {
    return this.engine.findOne('products', [
      { field: 'sku', operator: '=', value: sku }
    ]);
  }

  /**
   * 根据分类查找商品
   * 
   * @param categoryId 分类ID
   * @param options 附加查询选项
   * @returns {Promise<ProductRecord[]>} 商品记录数组
   */
  async findProductsByCategory(categoryId: string, options?: QueryOptions): Promise<ProductRecord[]> {
    const conditions: QueryCondition[] = [{ field: 'category_id', operator: '=' as const, value: categoryId }];
    return this.engine.find('products', {
      ...options,
      where: [...(options?.where || []), ...conditions]
    });
  }

  /**
   * 更新商品信息
   * 
   * @param id 商品ID
   * @param updates 要更新的字段
   * @returns {Promise<number>} 受影响的记录数
   */
  async updateProduct(id: string, updates: Partial<ProductRecord>): Promise<number> {
    return this.engine.updateById('products', id, updates);
  }

  /**
   * 删除商品
   * 
   * @param id 商品ID
   * @returns {Promise<number>} 受影响的记录数
   */
  async deleteProduct(id: string): Promise<number> {
    return this.engine.deleteById('products', id);
  }

  /**
   * 更新商品库存
   * 根据库存数量自动调整商品状态
   * 
   * @param productId 商品ID
   * @param newQuantity 新的库存数量
   * @returns {Promise<number>} 受影响的记录数
   */
  async updateProductStock(productId: string, newQuantity: number): Promise<number> {
    return this.engine.updateById('products', productId, { 
      stock_quantity: newQuantity,
      status: newQuantity > 0 ? 'active' : 'out_of_stock'  // 库存为0时自动设为缺货
    });
  }

  // ===== 订单管理操作 =====

  /**
   * 创建新订单
   * 
   * @param orderData 订单数据（不包含ID和时间戳）
   * @returns {Promise<OrderRecord>} 创建的订单记录
   */
  async createOrder(orderData: Omit<OrderRecord, 'id' | 'created_at' | 'updated_at'>): Promise<OrderRecord> {
    return this.engine.insert('orders', {
      ...orderData,
      status: 'pending',          // 新订单状态为待处理
      payment_status: 'pending'   // 支付状态为待支付
    } as OrderRecord);
  }

  /**
   * 查找订单列表
   * 默认按下单时间倒序排列
   * 
   * @param options 查询选项
   * @returns {Promise<OrderRecord[]>} 订单记录数组
   */
  async findOrders(options?: QueryOptions): Promise<OrderRecord[]> {
    return this.engine.find('orders', {
      ...options,
      orderBy: [{ field: 'ordered_at', direction: 'desc' }, ...(options?.orderBy || [])]
    });
  }

  /**
   * 查找用户的订单
   * 
   * @param userId 用户ID
   * @param options 附加查询选项
   * @returns {Promise<OrderRecord[]>} 订单记录数组
   */
  async findOrdersByUser(userId: string, options?: QueryOptions): Promise<OrderRecord[]> {
    const conditions: QueryCondition[] = [{ field: 'user_id', operator: '=' as const, value: userId }];
    return this.engine.find('orders', {
      ...options,
      where: [...(options?.where || []), ...conditions],
      orderBy: [{ field: 'ordered_at', direction: 'desc' }, ...(options?.orderBy || [])]
    });
  }

  /**
   * 根据订单号查找订单
   * 
   * @param orderNumber 订单号
   * @returns {Promise<OrderRecord | null>} 订单记录或null
   */
  async findOrderByNumber(orderNumber: string): Promise<OrderRecord | null> {
    return this.engine.findOne('orders', [
      { field: 'order_number', operator: '=', value: orderNumber }
    ]);
  }

  /**
   * 根据ID获取订单
   * 
   * @param orderId 订单ID
   * @returns {Promise<OrderRecord | null>} 订单记录或null
   */
  async getOrderById(orderId: string): Promise<OrderRecord | null> {
    return this.engine.findById('orders', orderId);
  }

  /**
   * 获取用户订单（支持游客模式）
   * 
   * @param userId 用户ID，可选
   * @returns {Promise<OrderRecord[]>} 订单记录数组
   */
  async getUserOrders(userId?: string): Promise<OrderRecord[]> {
    if (userId) {
      return this.findOrdersByUser(userId);
    } else {
      // 对于游客模式，返回空数组
      return [];
    }
  }

  /**
   * 更新订单信息
   * 
   * @param id 订单ID
   * @param updates 要更新的字段
   * @returns {Promise<number>} 受影响的记录数
   */
  async updateOrder(id: string, updates: Partial<OrderRecord>): Promise<number> {
    return this.engine.updateById('orders', id, updates);
  }

  /**
   * 更新订单状态
   * 根据状态自动更新相应的时间字段和支付状态
   * 
   * @param id 订单ID
   * @param status 新状态
   * @param statusTime 状态变更时间（可选，默认当前时间）
   * @returns {Promise<number>} 受影响的记录数
   */
  async updateOrderStatus(id: string, status: OrderRecord['status'], statusTime?: string): Promise<number> {
    const updates: Partial<OrderRecord> = { status };
    
    // 根据状态更新相应的时间字段
    switch (status) {
      case 'paid':
        updates.paid_at = statusTime || new Date().toISOString();
        updates.payment_status = 'paid';
        break;
      case 'shipped':
        updates.shipped_at = statusTime || new Date().toISOString();
        break;
      case 'delivered':
        updates.delivered_at = statusTime || new Date().toISOString();
        break;
      case 'cancelled':
        updates.cancelled_at = statusTime || new Date().toISOString();
        break;
    }
    
    return this.engine.updateById('orders', id, updates);
  }

  // 分类相关操作
  async createCategory(categoryData: Omit<CategoryRecord, 'id' | 'created_at' | 'updated_at'>): Promise<CategoryRecord> {
    return this.engine.insert('categories', {
      ...categoryData,
      status: 'active',
      sort_order: categoryData.sort_order || 0
    } as CategoryRecord);
  }

  async findCategories(options?: QueryOptions): Promise<CategoryRecord[]> {
    return this.engine.find('categories', {
      ...options,
      orderBy: [{ field: 'sort_order', direction: 'asc' }, ...(options?.orderBy || [])]
    });
  }

  async findCategoryById(id: string): Promise<CategoryRecord | null> {
    return this.engine.findById('categories', id);
  }

  async findCategoryBySlug(slug: string): Promise<CategoryRecord | null> {
    return this.engine.findOne('categories', [
      { field: 'slug', operator: '=', value: slug }
    ]);
  }

  // 购物车相关操作
  async addToCart(userId: string | null, sessionId: string | null, productId: string, quantity: number) {
    const existingItem = await this.engine.findOne('cart_items', [
      { field: 'product_id', operator: '=' as const, value: productId },
      ...(userId ? [{ field: 'user_id', operator: '=' as const, value: userId }] : []),
      ...(sessionId ? [{ field: 'session_id', operator: '=' as const, value: sessionId }] : [])
    ]);

    if (existingItem) {
      // 更新数量
      return this.engine.updateById('cart_items', existingItem.id, {
        quantity: existingItem.quantity + quantity,
        updated_at: new Date().toISOString()
      });
    } else {
      // 创建新项目
      return this.engine.insert('cart_items', {
        user_id: userId || undefined,
        session_id: sessionId || undefined,
        product_id: productId,
        quantity,
        added_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as any);
    }
  }

  async getCartItems(userId: string | null, sessionId: string | null) {
    const conditions: QueryCondition[] = [];
    
    if (userId) {
      conditions.push({ field: 'user_id', operator: '=', value: userId });
    }
    if (sessionId) {
      conditions.push({ field: 'session_id', operator: '=', value: sessionId });
    }
    
    return this.engine.find('cart_items', { where: conditions });
  }

  async clearCart(userId: string | null, sessionId: string | null): Promise<number> {
    const conditions: QueryCondition[] = [];
    
    if (userId) {
      conditions.push({ field: 'user_id', operator: '=', value: userId });
    }
    if (sessionId) {
      conditions.push({ field: 'session_id', operator: '=', value: sessionId });
    }
    
    return this.engine.delete('cart_items', conditions);
  }

  // 搜索功能
  async searchProducts(query: string, options?: QueryOptions): Promise<ProductRecord[]> {
    const searchConditions: QueryCondition[] = [
      { field: 'name', operator: 'like', value: query }
    ];
    
    return this.engine.find('products', {
      ...options,
      where: [...(options?.where || []), ...searchConditions]
    });
  }

  // 备份和恢复
  async backup(): Promise<string> {
    return this.engine.backup();
  }

  async restore(backupPath: string): Promise<void> {
    return this.engine.restore(backupPath);
  }

  // 初始化基础数据
  private async initializeBaseData(): Promise<void> {
    // 检查是否已有数据
    const userCount = await this.engine.count('users');
    const categoryCount = await this.engine.count('categories');
    const productCount = await this.engine.count('products');
    
    if (userCount === 0 && categoryCount === 0 && productCount === 0) {
      try {
        // 从JSON文件加载初始数据
        const response = await fetch('./database/seagull-watch-db.json');
        if (!response.ok) {
          throw new Error(`无法加载数据文件: ${response.statusText}`);
        }
        
        const initialData = await response.json();
        console.log('成功加载数据文件');

        // 导入分类数据
        for (const category of initialData.categories) {
          await this.engine.insert('categories', category);
        }
        console.log('产品分类导入完成:', initialData.categories.length);

        // 导入产品数据
        for (const product of initialData.products) {
          // 检查产品是否已存在（按SKU或ID检查）
          const existingProduct = await this.findProductsBySku(product.sku) || 
                                 await this.findProductById(product.id);
          
          if (!existingProduct) {
            await this.engine.insert('products', product);
          } else {
            console.log('产品已存在，跳过:', product.sku, product.name);
          }
        }
        console.log('产品导入完成:', initialData.products.length);

        // 导入用户数据
        for (const user of initialData.users) {
          const existingUser = await this.findUserByEmail(user.email);
          if (!existingUser) {
            await this.engine.insert('users', user);
          } else {
            console.log('用户已存在，跳过:', user.email);
          }
        }
        console.log('用户导入完成:', initialData.users.length);
        
        console.log('基础数据初始化完成（从JSON文件）');
      } catch (error) {
        console.error('JSON数据加载失败:', error);
        throw new Error(`数据库初始化失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    } else {
      console.log('数据库已有数据，跳过初始化');
    }
  }
}

// 导出单例实例
export const db = DatabaseManager.getInstance();

export default DatabaseManager; 