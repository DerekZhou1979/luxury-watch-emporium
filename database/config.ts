import { DatabaseConfig } from './database-engine';

// 开发环境配置
export const DEVELOPMENT_CONFIG: DatabaseConfig = {
  type: 'json',
  connection: {
    filename: 'database/seagull-watch-db.json'
  },
  options: {
    autoBackup: true,
    backupInterval: 30,
    maxBackups: 48,
    enableLogging: true,
    enableIndexes: true
  }
};

// 获取当前环境配置
export function getDatabaseConfig(): DatabaseConfig {
  return DEVELOPMENT_CONFIG;
}

export default getDatabaseConfig; 