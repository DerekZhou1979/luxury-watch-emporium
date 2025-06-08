import { DatabaseSchema, DATABASE_INDEXES, DatabaseIndex } from './schema';

// 浏览器端查询条件和选项类型
export interface QueryCondition {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'like' | 'in' | 'not_in';
  value: any;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface QueryOptions {
  where?: QueryCondition[];
  orderBy?: SortOption[];
  limit?: number;
  offset?: number;
  select?: string[];
}

// 浏览器数据库配置
export interface BrowserDatabaseConfig {
  storageKey: string;
  options?: {
    autoBackup?: boolean;
    maxBackups?: number;
    enableLogging?: boolean;
  };
}

// 浏览器JSON数据库引擎实现
export class BrowserDatabaseEngine {
  private storageKey: string;
  private schema!: DatabaseSchema;
  private isConnected: boolean = false;
  private indexes: Map<string, Map<string, string>> = new Map();
  private config: BrowserDatabaseConfig;

  constructor(config: BrowserDatabaseConfig) {
    this.config = config;
    this.storageKey = config.storageKey;
    this.initializeEmptySchema();
  }

  private initializeEmptySchema(): void {
    this.schema = {
      users: [],
      products: [],
      categories: [],
      orders: [],
      order_items: [],
      cart_items: [],
      addresses: [],
      payments: [],
      reviews: [],
      coupons: [],
      settings: [],
      logs: []
    };
  }

  async connect(): Promise<void> {
    try {
      // 尝试加载现有数据
      const data = this.loadFromStorage();
      if (data) {
        this.schema = data;
      } else {
        // 创建新的数据库
        await this.saveToStorage();
      }

      // 构建索引
      this.buildIndexes();
      
      this.isConnected = true;
      
      if (this.config.options?.enableLogging) {
        console.log('浏览器数据库连接成功');
      }
    } catch (error) {
      throw new Error(`Failed to connect to browser database: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.saveToStorage();
      this.isConnected = false;
    }
  }

  async insert<T extends keyof DatabaseSchema>(table: T, data: DatabaseSchema[T][0]): Promise<DatabaseSchema[T][0]> {
    const record = {
      ...data,
      id: (data as any).id || this.generateId()
    } as any;

    // 只为有这些字段的记录添加时间戳
    if ('created_at' in data || table !== 'cart_items') {
      record.created_at = (data as any).created_at || this.timestamp();
    }
    if ('updated_at' in data || table !== 'cart_items') {
      record.updated_at = this.timestamp();
    }
    
    // cart_items 表使用不同的时间字段
    if (table === 'cart_items') {
      if (!record.added_at) record.added_at = this.timestamp();
      record.updated_at = this.timestamp();
    }

    this.schema[table].push(record);
    await this.saveToStorage();
    
    return record as DatabaseSchema[T][0];
  }

  async update<T extends keyof DatabaseSchema>(
    table: T, 
    conditions: QueryCondition[], 
    data: Partial<DatabaseSchema[T][0]>
  ): Promise<number> {
    const records = this.schema[table] as any[];
    let updatedCount = 0;

    for (let i = 0; i < records.length; i++) {
      if (this.matchesConditions(records[i], conditions)) {
        records[i] = {
          ...records[i],
          ...data,
          updated_at: this.timestamp()
        };
        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      await this.saveToStorage();
    }

    return updatedCount;
  }

  async updateById<T extends keyof DatabaseSchema>(
    table: T, 
    id: string, 
    data: Partial<DatabaseSchema[T][0]>
  ): Promise<number> {
    return this.update(table, [{ field: 'id', operator: '=', value: id }], data);
  }

  async delete<T extends keyof DatabaseSchema>(table: T, conditions: QueryCondition[]): Promise<number> {
    const records = this.schema[table] as any[];
    const initialLength = records.length;

    this.schema[table] = records.filter(record => 
      !this.matchesConditions(record, conditions)
    ) as any;

    const deletedCount = initialLength - this.schema[table].length;
    
    if (deletedCount > 0) {
      await this.saveToStorage();
    }

    return deletedCount;
  }

  async deleteById<T extends keyof DatabaseSchema>(table: T, id: string): Promise<number> {
    return this.delete(table, [{ field: 'id', operator: '=', value: id }]);
  }

  async find<T extends keyof DatabaseSchema>(table: T, options?: QueryOptions): Promise<DatabaseSchema[T]> {
    let records = [...this.schema[table]] as any[];

    // 应用where条件
    if (options?.where) {
      records = records.filter(record => 
        this.matchesConditions(record, options.where!)
      );
    }

    // 应用排序
    if (options?.orderBy) {
      records.sort((a, b) => {
        for (const sort of options.orderBy!) {
          const aVal = a[sort.field];
          const bVal = b[sort.field];
          const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          if (comparison !== 0) {
            return sort.direction === 'desc' ? -comparison : comparison;
          }
        }
        return 0;
      });
    }

    // 应用分页
    if (options?.offset || options?.limit) {
      const start = options.offset || 0;
      const end = options.limit ? start + options.limit : undefined;
      records = records.slice(start, end);
    }

    // 应用字段选择
    if (options?.select) {
      records = records.map(record => {
        const selected: any = {};
        options.select!.forEach(field => {
          selected[field] = record[field];
        });
        return selected;
      });
    }

    return records as DatabaseSchema[T];
  }

  async findById<T extends keyof DatabaseSchema>(table: T, id: string): Promise<DatabaseSchema[T][0] | null> {
    const results = await this.find(table, { where: [{ field: 'id', operator: '=', value: id }], limit: 1 });
    return results.length > 0 ? results[0] : null;
  }

  async findOne<T extends keyof DatabaseSchema>(table: T, conditions: QueryCondition[]): Promise<DatabaseSchema[T][0] | null> {
    const results = await this.find(table, { where: conditions, limit: 1 });
    return results.length > 0 ? results[0] : null;
  }

  async count<T extends keyof DatabaseSchema>(table: T, conditions?: QueryCondition[]): Promise<number> {
    if (!conditions) {
      return this.schema[table].length;
    }

    const records = this.schema[table] as any[];
    return records.filter(record => this.matchesConditions(record, conditions)).length;
  }

  // 条件匹配
  private matchesConditions(record: any, conditions: QueryCondition[]): boolean {
    return conditions.every(condition => {
      const fieldValue = record[condition.field];
      
      switch (condition.operator) {
        case '=':
          return fieldValue === condition.value;
        case '!=':
          return fieldValue !== condition.value;
        case '>':
          return fieldValue > condition.value;
        case '<':
          return fieldValue < condition.value;
        case '>=':
          return fieldValue >= condition.value;
        case '<=':
          return fieldValue <= condition.value;
        case 'like':
          return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(fieldValue);
        case 'not_in':
          return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
        default:
          return false;
      }
    });
  }

  private buildIndexes(): void {
    if (this.config.options?.enableLogging) {
      console.log('Building database indexes...');
    }
    
    DATABASE_INDEXES.forEach(indexDef => {
      this.buildIndex(indexDef);
    });
  }

  private buildIndex(indexDef: DatabaseIndex): void {
    // 浏览器数据库的简单索引实现
    const indexKey = `${indexDef.table}_${indexDef.name}`;
    const index = new Map();
    
    const records = this.schema[indexDef.table] as any[];
    records.forEach(record => {
      const key = indexDef.fields.map(field => record[field]).join('|');
      if (indexDef.unique && index.has(key)) {
        console.warn(`Unique constraint violation for index ${indexDef.name}, skipping duplicate key: ${key}`);
        return;
      }
      index.set(key, record.id);
    });
    
    this.indexes.set(indexKey, index);
  }

  async backup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupKey = `${this.storageKey}_backup_${timestamp}`;
    
    const data = JSON.stringify(this.schema);
    localStorage.setItem(backupKey, data);
    
    // 清理旧备份
    if (this.config.options?.maxBackups) {
      this.cleanupOldBackups();
    }
    
    return backupKey;
  }

  async restore(backupKey: string): Promise<void> {
    const data = localStorage.getItem(backupKey);
    if (!data) {
      throw new Error(`Backup not found: ${backupKey}`);
    }
    
    this.schema = JSON.parse(data);
    await this.saveToStorage();
    this.buildIndexes();
  }

  // 存储操作方法
  private async saveToStorage(): Promise<void> {
    const data = JSON.stringify(this.schema, null, 2);
    localStorage.setItem(this.storageKey, data);
  }

  private loadFromStorage(): DatabaseSchema | null {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load data from storage:', error);
      return null;
    }
  }

  private cleanupOldBackups(): void {
    const maxBackups = this.config.options?.maxBackups || 10;
    const keys = Object.keys(localStorage);
    const backupKeys = keys
      .filter(key => key.startsWith(`${this.storageKey}_backup_`))
      .sort((a, b) => {
        // 按时间戳排序
        const timestampA = a.substring(a.lastIndexOf('_') + 1);
        const timestampB = b.substring(b.lastIndexOf('_') + 1);
        return timestampA.localeCompare(timestampB);
      });

    // 删除多余的备份
    if (backupKeys.length > maxBackups) {
      const keysToDelete = backupKeys.slice(0, backupKeys.length - maxBackups);
      keysToDelete.forEach(key => localStorage.removeItem(key));
    }
  }

  // 工具方法
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private timestamp(): string {
    return new Date().toISOString();
  }

  // 导出数据（用于调试和迁移）
  exportData(): string {
    return JSON.stringify(this.schema, null, 2);
  }

  // 导入数据
  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      this.schema = data;
      await this.saveToStorage();
      this.buildIndexes();
    } catch (error) {
      throw new Error(`Failed to import data: ${error}`);
    }
  }

  // 获取存储使用情况
  getStorageInfo(): { used: number; total: number; percentage: number } {
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
    
    // LocalStorage 限制通常是 5-10MB
    const total = 5 * 1024 * 1024; // 5MB
    const percentage = (used / total) * 100;
    
    return { used, total, percentage };
  }
}

export default BrowserDatabaseEngine; 