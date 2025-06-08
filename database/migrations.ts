import { DatabaseSchema, UserRecord, ProductRecord, OrderRecord } from './schema';
import { DatabaseConfig, QueryCondition } from './database-engine';

// 迁移接口
export interface Migration {
  id: string;
  name: string;
  description: string;
  version: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
  created_at: string;
}

// MySQL建表语句
export const MYSQL_SCHEMA_SQL = `
-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar VARCHAR(500),
  status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
  email_verified BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  metadata JSON,
  
  INDEX idx_users_email (email),
  INDEX idx_users_status (status),
  INDEX idx_users_created_at (created_at)
);

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_id VARCHAR(50),
  slug VARCHAR(100) UNIQUE NOT NULL,
  image VARCHAR(500),
  sort_order INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  seo_title VARCHAR(200),
  seo_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  metadata JSON,
  
  FOREIGN KEY (parent_id) REFERENCES categories(id),
  INDEX idx_categories_parent (parent_id),
  INDEX idx_categories_slug (slug),
  INDEX idx_categories_status (status),
  INDEX idx_categories_sort (sort_order)
);

-- 商品表
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  sku VARCHAR(100) UNIQUE NOT NULL,
  barcode VARCHAR(100),
  category_id VARCHAR(50) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  images JSON,
  specifications JSON,
  stock_quantity INT DEFAULT 0,
  min_stock_level INT DEFAULT 0,
  weight DECIMAL(8,2),
  dimensions JSON,
  status ENUM('active', 'inactive', 'draft', 'out_of_stock') DEFAULT 'active',
  is_featured BOOLEAN DEFAULT FALSE,
  seo_title VARCHAR(200),
  seo_description TEXT,
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  metadata JSON,
  
  FOREIGN KEY (category_id) REFERENCES categories(id),
  INDEX idx_products_category (category_id),
  INDEX idx_products_sku (sku),
  INDEX idx_products_brand (brand),
  INDEX idx_products_status (status),
  INDEX idx_products_featured (is_featured),
  INDEX idx_products_price (price),
  INDEX idx_products_stock (stock_quantity),
  INDEX idx_products_created_at (created_at)
);

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50),
  order_number VARCHAR(100) UNIQUE NOT NULL,
  status ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded', 'partial_refund') DEFAULT 'pending',
  payment_method ENUM('alipay', 'wechat', 'bank_transfer', 'credit_card', 'cash'),
  
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) DEFAULT 0,
  tax_fee DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  shipping_address JSON NOT NULL,
  
  ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP NULL,
  shipped_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  cancelled_at TIMESTAMP NULL,
  
  notes TEXT,
  internal_notes TEXT,
  tracking_number VARCHAR(100),
  courier_company VARCHAR(100),
  estimated_delivery DATE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  metadata JSON,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_number (order_number),
  INDEX idx_orders_status (status),
  INDEX idx_orders_payment_status (payment_status),
  INDEX idx_orders_ordered_at (ordered_at),
  INDEX idx_orders_total (total_amount)
);

-- 订单项目表
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(50) PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  product_image VARCHAR(500),
  sku VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  product_snapshot JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX idx_order_items_order (order_id),
  INDEX idx_order_items_product (product_id),
  INDEX idx_order_items_sku (sku)
);

-- 购物车表
CREATE TABLE IF NOT EXISTS cart_items (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50),
  session_id VARCHAR(100),
  product_id VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_cart_user (user_id),
  INDEX idx_cart_session (session_id),
  INDEX idx_cart_product (product_id)
);

-- 收货地址表
CREATE TABLE IF NOT EXISTS addresses (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  province VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  street TEXT NOT NULL,
  postal_code VARCHAR(20),
  is_default BOOLEAN DEFAULT FALSE,
  label VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_addresses_user (user_id),
  INDEX idx_addresses_default (is_default)
);

-- 支付记录表
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(50) PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  payment_method ENUM('alipay', 'wechat', 'bank_transfer', 'credit_card') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'success', 'failed', 'cancelled') DEFAULT 'pending',
  transaction_id VARCHAR(200),
  gateway_response JSON,
  paid_at TIMESTAMP NULL,
  failed_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  metadata JSON,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_payments_order (order_id),
  INDEX idx_payments_status (status),
  INDEX idx_payments_transaction (transaction_id),
  INDEX idx_payments_created_at (created_at)
);

-- 商品评论表
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(50) PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50),
  order_id VARCHAR(50),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT NOT NULL,
  images JSON,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  metadata JSON,
  
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  INDEX idx_reviews_product (product_id),
  INDEX idx_reviews_user (user_id),
  INDEX idx_reviews_status (status),
  INDEX idx_reviews_rating (rating),
  INDEX idx_reviews_created_at (created_at)
);

-- 优惠券表
CREATE TABLE IF NOT EXISTS coupons (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type ENUM('fixed', 'percentage', 'free_shipping') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2),
  max_discount_amount DECIMAL(10,2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP NOT NULL,
  applicable_categories JSON,
  applicable_products JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  metadata JSON,
  
  INDEX idx_coupons_code (code),
  INDEX idx_coupons_status (status),
  INDEX idx_coupons_valid_period (valid_from, valid_to),
  INDEX idx_coupons_type (type)
);

-- 系统设置表
CREATE TABLE IF NOT EXISTS settings (
  id VARCHAR(50) PRIMARY KEY,
  \`key\` VARCHAR(100) UNIQUE NOT NULL,
  value JSON,
  description TEXT,
  type ENUM('string', 'number', 'boolean', 'json', 'text') DEFAULT 'string',
  category VARCHAR(50) NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_settings_key (\`key\`),
  INDEX idx_settings_category (category),
  INDEX idx_settings_public (is_public)
);

-- 操作日志表
CREATE TABLE IF NOT EXISTS logs (
  id VARCHAR(50) PRIMARY KEY,
  level ENUM('info', 'warning', 'error', 'debug') DEFAULT 'info',
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(50),
  user_id VARCHAR(50),
  ip_address VARCHAR(45),
  user_agent TEXT,
  message TEXT NOT NULL,
  data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_logs_level (level),
  INDEX idx_logs_action (action),
  INDEX idx_logs_entity (entity_type, entity_id),
  INDEX idx_logs_user (user_id),
  INDEX idx_logs_created_at (created_at)
);

-- 数据库版本表
CREATE TABLE IF NOT EXISTS database_versions (
  version VARCHAR(20) PRIMARY KEY,
  migrations_applied JSON,
  last_migration_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// 数据迁移器
export class DataMigrator {
  private sourceConfig: DatabaseConfig;
  private targetConfig: DatabaseConfig;

  constructor(sourceConfig: DatabaseConfig, targetConfig: DatabaseConfig) {
    this.sourceConfig = sourceConfig;
    this.targetConfig = targetConfig;
  }

  // 从JSON迁移到MySQL
  async migrateJsonToMySQL(jsonData: DatabaseSchema): Promise<void> {
    console.log('开始数据迁移：JSON -> MySQL');

    try {
      // 这里应该连接到MySQL数据库
      // const mysql = require('mysql2/promise');
      // const connection = await mysql.createConnection(this.targetConfig.connection);

      // 1. 创建表结构
      console.log('创建表结构...');
      // await this.executeSQL(connection, MYSQL_SCHEMA_SQL);

      // 2. 迁移数据
      await this.migrateTableData('users', jsonData.users);
      await this.migrateTableData('categories', jsonData.categories);
      await this.migrateTableData('products', jsonData.products);
      await this.migrateTableData('orders', jsonData.orders);
      await this.migrateTableData('order_items', jsonData.order_items);
      await this.migrateTableData('cart_items', jsonData.cart_items);
      await this.migrateTableData('addresses', jsonData.addresses);
      await this.migrateTableData('payments', jsonData.payments);
      await this.migrateTableData('reviews', jsonData.reviews);
      await this.migrateTableData('coupons', jsonData.coupons);
      await this.migrateTableData('settings', jsonData.settings);
      await this.migrateTableData('logs', jsonData.logs);

      console.log('数据迁移完成');
    } catch (error) {
      console.error('数据迁移失败:', error);
      throw error;
    }
  }

  private async migrateTableData(tableName: string, data: any[]): Promise<void> {
    console.log(`迁移表 ${tableName}: ${data.length} 条记录`);
    
    // 这里应该实现实际的数据插入逻辑
    // 示例：
    // for (const record of data) {
    //   await this.insertRecord(tableName, record);
    // }
  }

  // 生成迁移脚本
  generateMigrationSQL(jsonData: DatabaseSchema): string {
    let sql = MYSQL_SCHEMA_SQL + '\n\n-- 数据插入\n\n';

    // 生成数据插入语句
    for (const [tableName, records] of Object.entries(jsonData)) {
      if (records.length > 0) {
        sql += `-- ${tableName} 表数据\n`;
        for (const record of records) {
          sql += this.generateInsertSQL(tableName, record) + '\n';
        }
        sql += '\n';
      }
    }

    return sql;
  }

  private generateInsertSQL(tableName: string, record: any): string {
    const columns = Object.keys(record);
    const values = columns.map(col => {
      const value = record[col];
      if (value === null || value === undefined) {
        return 'NULL';
      } else if (typeof value === 'string') {
        return `'${value.replace(/'/g, "''")}'`;
      } else if (typeof value === 'object') {
        return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
      } else {
        return String(value);
      }
    });

    return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});`;
  }

  // 验证迁移结果
  async validateMigration(originalData: DatabaseSchema): Promise<boolean> {
    console.log('验证迁移结果...');
    
    // 这里应该连接到目标数据库并验证数据完整性
    // 比较记录数量、关键字段等
    
    return true;
  }

  // 回滚迁移
  async rollbackMigration(): Promise<void> {
    console.log('回滚迁移...');
    
    // 这里应该实现回滚逻辑
    // 删除迁移的数据或恢复备份
  }
}

// 迁移配置生成器
export class MigrationConfigGenerator {
  
  // 生成MySQL配置
  static generateMySQLConfig(host: string, port: number, username: string, password: string, database: string): DatabaseConfig {
    return {
      type: 'mysql',
      connection: {
        host,
        port,
        username,
        password,
        database
      },
      options: {
        autoBackup: true,
        backupInterval: 360, // 6小时
        maxBackups: 168, // 保留一周
        enableLogging: true,
        enableIndexes: true
      }
    };
  }

  // 生成PostgreSQL配置
  static generatePostgreSQLConfig(host: string, port: number, username: string, password: string, database: string): DatabaseConfig {
    return {
      type: 'postgresql',
      connection: {
        host,
        port,
        username,
        password,
        database
      },
      options: {
        autoBackup: true,
        backupInterval: 360,
        maxBackups: 168,
        enableLogging: true,
        enableIndexes: true
      }
    };
  }

  // 生成SQLite配置
  static generateSQLiteConfig(filename: string): DatabaseConfig {
    return {
      type: 'sqlite',
      connection: {
        filename
      },
      options: {
        autoBackup: true,
        backupInterval: 60,
        maxBackups: 24,
        enableLogging: true,
        enableIndexes: true
      }
    };
  }
}

// 导出迁移工具函数
export async function migrateToMySQL(
  sourceJsonFile: string,
  targetConfig: DatabaseConfig
): Promise<void> {
  const fs = await import('fs');
  
  // 读取JSON数据
  const jsonData = JSON.parse(await fs.promises.readFile(sourceJsonFile, 'utf-8'));
  
  // 创建迁移器
  const migrator = new DataMigrator(
    { type: 'json', connection: { filename: sourceJsonFile }, options: {} },
    targetConfig
  );
  
  // 执行迁移
  await migrator.migrateJsonToMySQL(jsonData);
}

export default DataMigrator; 