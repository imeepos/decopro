import { DatabaseType, DatabaseManagerFactory, BaseDatabaseManager } from "../database";
import { MySQLDatabaseManager } from "./mysql";
import { SQLiteDatabaseManager } from "./sqlite";

// ============================================================================
// Driver Registration - 驱动注册
// ============================================================================

/**
 * 注册所有内置数据库驱动
 */
export function registerBuiltinDrivers(): void {
    // 注册 MySQL 驱动
    DatabaseManagerFactory.register(DatabaseType.MYSQL, MySQLDatabaseManager);
    
    // 注册 SQLite 驱动
    DatabaseManagerFactory.register(DatabaseType.SQLITE, SQLiteDatabaseManager);
    
    console.log("[ORM] Built-in database drivers registered");
}

/**
 * 创建数据库管理器的便捷函数
 */
export function createDatabaseManager(type: DatabaseType): BaseDatabaseManager {
    // 确保内置驱动已注册
    registerBuiltinDrivers();
    
    return DatabaseManagerFactory.create(type);
}

// ============================================================================
// Driver Exports - 驱动导出
// ============================================================================

// MySQL 驱动
export {
    MySQLConnection,
    MySQLConnectionPool,
    MySQLDatabaseManager,
    MySQLMigrationManager
} from "./mysql";

// SQLite 驱动
export {
    SQLiteConnection,
    SQLiteConnectionPool,
    SQLiteDatabaseManager,
    SQLiteMigrationManager
} from "./sqlite";

// ============================================================================
// Driver Utilities - 驱动工具
// ============================================================================

/**
 * 获取支持的数据库类型
 */
export function getSupportedDatabaseTypes(): DatabaseType[] {
    registerBuiltinDrivers();
    return DatabaseManagerFactory.getSupportedTypes();
}

/**
 * 检查数据库类型是否支持
 */
export function isDatabaseTypeSupported(type: DatabaseType): boolean {
    const supportedTypes = getSupportedDatabaseTypes();
    return supportedTypes.includes(type);
}

/**
 * 数据库连接字符串解析器
 */
export interface ParsedConnectionString {
    type: DatabaseType;
    host?: string;
    port?: number;
    database: string;
    username?: string;
    password?: string;
    options?: Record<string, any>;
}

/**
 * 解析数据库连接字符串
 * 
 * @example
 * ```typescript
 * // MySQL
 * parseConnectionString("mysql://user:pass@localhost:3306/mydb")
 * 
 * // SQLite
 * parseConnectionString("sqlite:///path/to/database.db")
 * 
 * // PostgreSQL
 * parseConnectionString("postgresql://user:pass@localhost:5432/mydb")
 * ```
 */
export function parseConnectionString(connectionString: string): ParsedConnectionString {
    try {
        const url = new URL(connectionString);
        
        // 确定数据库类型
        let type: DatabaseType;
        switch (url.protocol.replace(':', '')) {
            case 'mysql':
                type = DatabaseType.MYSQL;
                break;
            case 'sqlite':
                type = DatabaseType.SQLITE;
                break;
            case 'postgresql':
            case 'postgres':
                type = DatabaseType.POSTGRESQL;
                break;
            case 'mssql':
            case 'sqlserver':
                type = DatabaseType.MSSQL;
                break;
            default:
                throw new Error(`Unsupported database type: ${url.protocol}`);
        }

        // 解析基本信息
        const result: ParsedConnectionString = {
            type,
            database: url.pathname.replace('/', '') || url.pathname
        };

        // 添加主机和端口（如果不是 SQLite）
        if (type !== DatabaseType.SQLITE) {
            result.host = url.hostname;
            result.port = url.port ? parseInt(url.port) : getDefaultPort(type);
            result.username = url.username || undefined;
            result.password = url.password || undefined;
        }

        // 解析查询参数作为选项
        if (url.search) {
            result.options = {};
            url.searchParams.forEach((value, key) => {
                result.options![key] = value;
            });
        }

        return result;
    } catch (error) {
        throw new Error(`Invalid connection string: ${connectionString}`);
    }
}

/**
 * 获取数据库类型的默认端口
 */
function getDefaultPort(type: DatabaseType): number {
    switch (type) {
        case DatabaseType.MYSQL:
            return 3306;
        case DatabaseType.POSTGRESQL:
            return 5432;
        case DatabaseType.MSSQL:
            return 1433;
        case DatabaseType.ORACLE:
            return 1521;
        case DatabaseType.MONGODB:
            return 27017;
        default:
            return 0;
    }
}

/**
 * 构建数据库连接字符串
 */
export function buildConnectionString(config: ParsedConnectionString): string {
    const { type, host, port, database, username, password, options } = config;

    if (type === DatabaseType.SQLITE) {
        return `sqlite:///${database}`;
    }

    let protocol: string;
    switch (type) {
        case DatabaseType.MYSQL:
            protocol = 'mysql';
            break;
        case DatabaseType.POSTGRESQL:
            protocol = 'postgresql';
            break;
        case DatabaseType.MSSQL:
            protocol = 'mssql';
            break;
        case DatabaseType.ORACLE:
            protocol = 'oracle';
            break;
        case DatabaseType.MONGODB:
            protocol = 'mongodb';
            break;
        default:
            throw new Error(`Unsupported database type: ${type}`);
    }

    let connectionString = `${protocol}://`;

    // 添加认证信息
    if (username) {
        connectionString += username;
        if (password) {
            connectionString += `:${password}`;
        }
        connectionString += '@';
    }

    // 添加主机和端口
    connectionString += host || 'localhost';
    if (port && port !== getDefaultPort(type)) {
        connectionString += `:${port}`;
    }

    // 添加数据库名
    connectionString += `/${database}`;

    // 添加选项
    if (options && Object.keys(options).length > 0) {
        const params = new URLSearchParams(options);
        connectionString += `?${params.toString()}`;
    }

    return connectionString;
}

/**
 * 数据库配置验证器
 */
export function validateDatabaseConfig(config: any): string[] {
    const errors: string[] = [];

    if (!config.type) {
        errors.push("Database type is required");
    } else if (!Object.values(DatabaseType).includes(config.type)) {
        errors.push(`Invalid database type: ${config.type}`);
    }

    if (!config.database) {
        errors.push("Database name is required");
    }

    // 非 SQLite 数据库需要主机信息
    if (config.type !== DatabaseType.SQLITE) {
        if (!config.host) {
            errors.push("Database host is required");
        }
    }

    // 验证连接池配置
    if (config.pool) {
        if (config.pool.min !== undefined && config.pool.min < 0) {
            errors.push("Pool min connections must be >= 0");
        }
        if (config.pool.max !== undefined && config.pool.max <= 0) {
            errors.push("Pool max connections must be > 0");
        }
        if (config.pool.min !== undefined && config.pool.max !== undefined && config.pool.min > config.pool.max) {
            errors.push("Pool min connections must be <= max connections");
        }
    }

    return errors;
}

/**
 * 创建默认数据库配置
 */
export function createDefaultDatabaseConfig(type: DatabaseType, database: string): any {
    const config: any = {
        type,
        database,
        pool: {
            min: 2,
            max: 10,
            acquireTimeoutMillis: 30000,
            idleTimeoutMillis: 30000
        },
        logging: false,
        synchronize: false,
        migrationsRun: false
    };

    if (type !== DatabaseType.SQLITE) {
        config.host = 'localhost';
        config.port = getDefaultPort(type);
        config.username = 'root';
        config.password = '';
    }

    return config;
}
