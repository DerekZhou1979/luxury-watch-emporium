import { DatabaseSchema, DATABASE_INDEXES, DatabaseIndex } from './schema';

// 查询条件接口
export interface QueryCondition {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'like' | 'in' | 'not_in';
  value: any;
}

// 查询选项
export interface QueryOptions {
  where?: QueryCondition[];
  orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  limit?: number;
  offset?: number;
  select?: string[];
}

// 数据库事务接口
export interface DatabaseTransaction {
  id: string;
  operations: DatabaseOperation[];
  status: 'pending' | 'committed' | 'rollback';
  created_at: string;
}

// 数据库操作
export interface DatabaseOperation {
  type: 'insert' | 'update' | 'delete';
  table: keyof DatabaseSchema;
  data?: any;
  conditions?: QueryCondition[];
}

// 数据库连接配置
export interface DatabaseConfig {
  type: 'json' | 'mysql' | 'postgresql' | 'sqlite';
  connection: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database?: string;
    filename?: string; // 用于 JSON 或 SQLite
  };
  options: {
    autoBackup?: boolean;
    backupInterval?: number; // 分钟
    maxBackups?: number;
    enableLogging?: boolean;
    enableIndexes?: boolean;
  };
}

// 抽象数据库引擎类
export abstract class DatabaseEngine {
  protected config: DatabaseConfig;
  protected schema: DatabaseSchema;
  protected indexes: Map<string, any> = new Map();
  protected isConnected: boolean = false;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.schema = this.initializeSchema();
  }

  // 初始化空的数据库结构
  protected initializeSchema(): DatabaseSchema {
    return {
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

  // 抽象方法，由具体实现类重写
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract insert<T extends keyof DatabaseSchema>(table: T, data: DatabaseSchema[T][0]): Promise<DatabaseSchema[T][0]>;
  abstract update<T extends keyof DatabaseSchema>(table: T, conditions: QueryCondition[], data: Partial<DatabaseSchema[T][0]>): Promise<number>;
  abstract delete<T extends keyof DatabaseSchema>(table: T, conditions: QueryCondition[]): Promise<number>;
  abstract find<T extends keyof DatabaseSchema>(table: T, options?: QueryOptions): Promise<DatabaseSchema[T]>;
  abstract findOne<T extends keyof DatabaseSchema>(table: T, conditions: QueryCondition[]): Promise<DatabaseSchema[T][0] | null>;
  abstract count<T extends keyof DatabaseSchema>(table: T, conditions?: QueryCondition[]): Promise<number>;

  // 通用方法
  async findById<T extends keyof DatabaseSchema>(table: T, id: string): Promise<DatabaseSchema[T][0] | null> {
    return this.findOne(table, [{ field: 'id', operator: '=', value: id }]);
  }

  async updateById<T extends keyof DatabaseSchema>(table: T, id: string, data: Partial<DatabaseSchema[T][0]>): Promise<number> {
    return this.update(table, [{ field: 'id', operator: '=', value: id }], data);
  }

  async deleteById<T extends keyof DatabaseSchema>(table: T, id: string): Promise<number> {
    return this.delete(table, [{ field: 'id', operator: '=', value: id }]);
  }

  // 生成唯一ID
  protected generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 生成时间戳
  protected timestamp(): string {
    return new Date().toISOString();
  }

  // 构建索引
  protected buildIndexes(): void {
    if (!this.config.options.enableIndexes) return;
    
    DATABASE_INDEXES.forEach(indexDef => {
      this.buildIndex(indexDef);
    });
  }

  protected abstract buildIndex(indexDef: DatabaseIndex): void;

  // 验证数据
  protected validateData<T extends keyof DatabaseSchema>(table: T, data: any): boolean {
    // 基础验证逻辑，子类可以重写
    return data && typeof data === 'object';
  }

  // 事务支持（简单实现）
  async transaction(operations: DatabaseOperation[]): Promise<boolean> {
    const transaction: DatabaseTransaction = {
      id: this.generateId(),
      operations,
      status: 'pending',
      created_at: this.timestamp()
    };

    try {
      // 执行所有操作
      for (const op of operations) {
        switch (op.type) {
          case 'insert':
            await this.insert(op.table, op.data);
            break;
          case 'update':
            await this.update(op.table, op.conditions || [], op.data);
            break;
          case 'delete':
            await this.delete(op.table, op.conditions || []);
            break;
        }
      }
      
      transaction.status = 'committed';
      return true;
    } catch (error) {
      transaction.status = 'rollback';
      throw error;
    }
  }

  // 备份数据库
  abstract backup(): Promise<string>;
  
  // 恢复数据库
  abstract restore(backupPath: string): Promise<void>;

  // 获取数据库统计信息
  async getStats(): Promise<Record<string, any>> {
    const stats: Record<string, any> = {};
    
    for (const table of Object.keys(this.schema) as Array<keyof DatabaseSchema>) {
      stats[table] = await this.count(table);
    }
    
    return stats;
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      await this.count('users');
      return true;
    } catch (error) {
      return false;
    }
  }
}

// JSON文件数据库引擎实现
export class JsonDatabaseEngine extends DatabaseEngine {
  private dataFile: string;
  private backupDir: string;

  constructor(config: DatabaseConfig) {
    super(config);
    this.dataFile = config.connection.filename || 'database.json';
    this.backupDir = 'database/backups';
  }

  async connect(): Promise<void> {
    try {
      // 尝试加载现有数据
      if (await this.fileExists(this.dataFile)) {
        const data = await this.readFile(this.dataFile);
        this.schema = JSON.parse(data);
      } else {
        // 创建新的数据库文件
        await this.saveToFile();
      }

      // 构建索引
      this.buildIndexes();
      
      this.isConnected = true;
      
      // 设置自动备份
      if (this.config.options.autoBackup) {
        this.setupAutoBackup();
      }
    } catch (error) {
      throw new Error(`Failed to connect to JSON database: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.saveToFile();
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
    await this.saveToFile();
    
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
      await this.saveToFile();
    }

    return updatedCount;
  }

  async delete<T extends keyof DatabaseSchema>(table: T, conditions: QueryCondition[]): Promise<number> {
    const records = this.schema[table] as any[];
    const initialLength = records.length;

    this.schema[table] = records.filter(record => 
      !this.matchesConditions(record, conditions)
    ) as any;

    const deletedCount = initialLength - this.schema[table].length;
    
    if (deletedCount > 0) {
      await this.saveToFile();
    }

    return deletedCount;
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

  protected buildIndex(indexDef: DatabaseIndex): void {
    // JSON数据库的简单索引实现
    const indexKey = `${indexDef.table}_${indexDef.name}`;
    const index = new Map();
    
    const records = this.schema[indexDef.table] as any[];
    records.forEach(record => {
      const key = indexDef.fields.map(field => record[field]).join('|');
      if (indexDef.unique && index.has(key)) {
        throw new Error(`Unique constraint violation for index ${indexDef.name}`);
      }
      index.set(key, record.id);
    });
    
    this.indexes.set(indexKey, index);
  }

  async backup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `${this.backupDir}/backup_${timestamp}.json`;
    
    await this.ensureDirectoryExists(this.backupDir);
    await this.writeFile(backupFile, JSON.stringify(this.schema, null, 2));
    
    // 清理旧备份
    if (this.config.options.maxBackups) {
      await this.cleanupOldBackups();
    }
    
    return backupFile;
  }

  async restore(backupPath: string): Promise<void> {
    const data = await this.readFile(backupPath);
    this.schema = JSON.parse(data);
    await this.saveToFile();
    this.buildIndexes();
  }

  // 文件操作方法
  private async saveToFile(): Promise<void> {
    const data = JSON.stringify(this.schema, null, 2);
    await this.writeFile(this.dataFile, data);
  }

  private async fileExists(filename: string): Promise<boolean> {
    try {
      await import('fs').then(fs => fs.promises.access(filename));
      return true;
    } catch {
      return false;
    }
  }

  private async readFile(filename: string): Promise<string> {
    const fs = await import('fs');
    return fs.promises.readFile(filename, 'utf-8');
  }

  private async writeFile(filename: string, data: string): Promise<void> {
    const fs = await import('fs');
    const path = await import('path');
    
    // 确保目录存在
    await this.ensureDirectoryExists(path.dirname(filename));
    
    await fs.promises.writeFile(filename, data, 'utf-8');
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    const fs = await import('fs');
    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
    } catch (error) {
      // 目录可能已存在
    }
  }

  private setupAutoBackup(): void {
    const interval = (this.config.options.backupInterval || 60) * 60 * 1000; // 转换为毫秒
    setInterval(() => {
      this.backup().catch(console.error);
    }, interval);
  }

  private async cleanupOldBackups(): Promise<void> {
    const fs = await import('fs');
    const path = await import('path');
    
    try {
      const files = await fs.promises.readdir(this.backupDir);
      const backupFiles = files
        .filter(file => file.startsWith('backup_') && file.endsWith('.json'))
        .map(file => ({
          name: file,
          path: path.join(this.backupDir, file),
          stat: fs.promises.stat(path.join(this.backupDir, file))
        }));

      if (backupFiles.length > this.config.options.maxBackups!) {
        // 按修改时间排序，删除最老的文件
        const sortedFiles = await Promise.all(
          backupFiles.map(async file => ({
            ...file,
            stat: await file.stat
          }))
        );
        
        sortedFiles.sort((a, b) => a.stat.mtime.getTime() - b.stat.mtime.getTime());
        
        const filesToDelete = sortedFiles.slice(0, sortedFiles.length - this.config.options.maxBackups!);
        
        for (const file of filesToDelete) {
          await fs.promises.unlink(file.path);
        }
      }
    } catch (error) {
      console.error('清理备份文件失败:', error);
    }
  }
}

export default DatabaseEngine; 