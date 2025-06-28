/**
 * @decopro/orm-drivers
 * 
 * 数据库驱动包，为 @decopro/orm 提供具体的数据库实现
 */

import "reflect-metadata";
import {
    DatabaseType,
    DatabaseDriverRegistry,
    IDatabaseManager
} from "./database";

// 导入驱动实现
import { SQLiteDatabaseManager } from "./sqlite";
import { MySQLDatabaseManager } from "./mysql";

// ============================================================================
// 驱动注册
// ============================================================================

/**
 * 注册所有内置驱动
 */
export function registerAllDrivers(): void {
    registerSQLiteDriver();
    registerMySQLDriver();
}

/**
 * 注册 SQLite 驱动
 */
export function registerSQLiteDriver(): void {
    DatabaseDriverRegistry.register(DatabaseType.SQLITE, async () => {
        return new SQLiteDatabaseManager();
    });
    console.log("[ORM Drivers] SQLite driver registered");
}

/**
 * 注册 MySQL 驱动
 */
export function registerMySQLDriver(): void {
    DatabaseDriverRegistry.register(DatabaseType.MYSQL, async () => {
        return new MySQLDatabaseManager();
    });
    console.log("[ORM Drivers] MySQL driver registered");
}

/**
 * 注册 PostgreSQL 驱动（占位符）
 */
export function registerPostgreSQLDriver(): void {
    DatabaseDriverRegistry.register(DatabaseType.POSTGRESQL, async () => {
        throw new Error("PostgreSQL driver not implemented yet");
    });
    console.log("[ORM Drivers] PostgreSQL driver registered (placeholder)");
}

// ============================================================================
// 自动注册
// ============================================================================

// 自动注册所有可用的驱动
try {
    registerAllDrivers();
} catch (error) {
    console.warn("[ORM Drivers] Failed to auto-register drivers:", error);
}

// ============================================================================
// 导出
// ============================================================================

// 导出驱动实现
export { SQLiteDatabaseManager } from "./sqlite";
export { MySQLDatabaseManager } from "./mysql";

// ============================================================================
// 便捷函数
// ============================================================================

/**
 * 检查驱动是否可用
 */
export function isDriverAvailable(type: DatabaseType): boolean {
    return DatabaseDriverRegistry.isSupported(type);
}

/**
 * 获取所有可用的驱动类型
 */
export function getAvailableDrivers(): DatabaseType[] {
    return DatabaseDriverRegistry.getSupportedTypes();
}

/**
 * 创建数据库管理器（便捷函数）
 */
export async function createDatabaseManager(type: DatabaseType): Promise<IDatabaseManager> {
    return DatabaseDriverRegistry.create(type);
}

// ============================================================================
// 类型导出
// ============================================================================

export type {
    IDatabaseManager,
    IConnection,
    IConnectionPool,
    DatabaseConfig,
    QueryResult,
    TransactionOptions
} from "./database";

// ============================================================================
// 默认导出
// ============================================================================

export default {
    registerAllDrivers,
    registerSQLiteDriver,
    registerMySQLDriver,
    registerPostgreSQLDriver,
    isDriverAvailable,
    getAvailableDrivers,
    createDatabaseManager
};
