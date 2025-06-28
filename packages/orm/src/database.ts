// ============================================================================
// Database Types - 数据库类型
// ============================================================================

/**
 * 数据库类型枚举
 */
export enum DatabaseType {
    MYSQL = "mysql",
    POSTGRESQL = "postgresql",
    SQLITE = "sqlite",
    MSSQL = "mssql",
    ORACLE = "oracle",
    MONGODB = "mongodb"
}

/**
 * 数据库连接配置
 */
export interface DatabaseConfig {
    /** 数据库类型 */
    type: DatabaseType;
    /** 主机地址 */
    host?: string;
    /** 端口号 */
    port?: number;
    /** 数据库名 */
    database: string;
    /** 用户名 */
    username?: string;
    /** 密码 */
    password?: string;
    /** 连接池配置 */
    pool?: {
        /** 最小连接数 */
        min?: number;
        /** 最大连接数 */
        max?: number;
        /** 连接超时时间（毫秒） */
        acquireTimeoutMillis?: number;
        /** 空闲超时时间（毫秒） */
        idleTimeoutMillis?: number;
        /** 连接创建超时时间（毫秒） */
        createTimeoutMillis?: number;
        /** 连接销毁超时时间（毫秒） */
        destroyTimeoutMillis?: number;
        /** 连接重用次数 */
        reapIntervalMillis?: number;
        /** 创建重试次数 */
        createRetryIntervalMillis?: number;
    };
    /** SSL 配置 */
    ssl?: boolean | {
        ca?: string;
        cert?: string;
        key?: string;
        rejectUnauthorized?: boolean;
    };
    /** 额外选项 */
    extra?: Record<string, any>;
    /** 是否启用日志 */
    logging?: boolean | string[];
    /** 是否同步数据库结构 */
    synchronize?: boolean;
    /** 是否自动运行迁移 */
    migrationsRun?: boolean;
    /** 迁移文件路径 */
    migrations?: string[];
    /** 实体文件路径 */
    entities?: string[] | Function[];
}

/**
 * 查询结果接口
 */
export interface QueryResult<T = any> {
    /** 查询结果数据 */
    rows: T[];
    /** 影响的行数 */
    rowCount: number;
    /** 查询字段信息 */
    fields?: Array<{
        name: string;
        type: string;
    }>;
    /** 执行时间（毫秒） */
    duration?: number;
}

/**
 * 事务隔离级别
 */
export enum IsolationLevel {
    READ_UNCOMMITTED = "READ UNCOMMITTED",
    READ_COMMITTED = "READ COMMITTED",
    REPEATABLE_READ = "REPEATABLE READ",
    SERIALIZABLE = "SERIALIZABLE"
}

/**
 * 事务选项
 */
export interface TransactionOptions {
    /** 隔离级别 */
    isolationLevel?: IsolationLevel;
    /** 超时时间（毫秒） */
    timeout?: number;
    /** 是否只读 */
    readOnly?: boolean;
}

// ============================================================================
// Connection Interface - 连接接口
// ============================================================================

/**
 * 数据库连接接口
 */
export interface IConnection {
    /** 连接 ID */
    id: string;
    /** 是否已连接 */
    isConnected: boolean;
    /** 是否在事务中 */
    inTransaction: boolean;
    
    /**
     * 执行查询
     */
    query<T = any>(sql: string, parameters?: any[]): Promise<QueryResult<T>>;
    
    /**
     * 开始事务
     */
    beginTransaction(options?: TransactionOptions): Promise<void>;
    
    /**
     * 提交事务
     */
    commit(): Promise<void>;
    
    /**
     * 回滚事务
     */
    rollback(): Promise<void>;
    
    /**
     * 释放连接
     */
    release(): Promise<void>;
    
    /**
     * 关闭连接
     */
    close(): Promise<void>;
}

/**
 * 连接池接口
 */
export interface IConnectionPool {
    /** 池中连接总数 */
    totalConnections: number;
    /** 空闲连接数 */
    idleConnections: number;
    /** 活跃连接数 */
    activeConnections: number;
    
    /**
     * 获取连接
     */
    getConnection(): Promise<IConnection>;
    
    /**
     * 释放连接
     */
    releaseConnection(connection: IConnection): Promise<void>;
    
    /**
     * 关闭连接池
     */
    close(): Promise<void>;
    
    /**
     * 检查连接池健康状态
     */
    healthCheck(): Promise<boolean>;
}

// ============================================================================
// Database Manager - 数据库管理器
// ============================================================================

/**
 * 数据库管理器接口
 */
export interface IDatabaseManager {
    /**
     * 初始化数据库连接
     */
    initialize(config: DatabaseConfig): Promise<void>;
    
    /**
     * 获取连接
     */
    getConnection(): Promise<IConnection>;
    
    /**
     * 执行查询
     */
    query<T = any>(sql: string, parameters?: any[]): Promise<QueryResult<T>>;
    
    /**
     * 执行事务
     */
    transaction<T>(
        callback: (connection: IConnection) => Promise<T>,
        options?: TransactionOptions
    ): Promise<T>;
    
    /**
     * 关闭数据库连接
     */
    close(): Promise<void>;
    
    /**
     * 检查数据库连接状态
     */
    isConnected(): boolean;
    
    /**
     * 获取数据库信息
     */
    getDatabaseInfo(): Promise<{
        type: DatabaseType;
        version: string;
        name: string;
    }>;
}

/**
 * 数据库驱动注册器
 */
export class DatabaseDriverRegistry {
    private static drivers = new Map<DatabaseType, () => Promise<IDatabaseManager>>();

    /**
     * 注册数据库驱动
     */
    static register(type: DatabaseType, driverFactory: () => Promise<IDatabaseManager>): void {
        this.drivers.set(type, driverFactory);
    }

    /**
     * 创建数据库管理器
     */
    static async create(type: DatabaseType): Promise<IDatabaseManager> {
        const driverFactory = this.drivers.get(type);
        if (!driverFactory) {
            throw new Error(`No driver registered for database type: ${type}. Please install and register the appropriate driver package.`);
        }
        return driverFactory();
    }

    /**
     * 检查是否支持指定的数据库类型
     */
    static isSupported(type: DatabaseType): boolean {
        return this.drivers.has(type);
    }

    /**
     * 获取支持的数据库类型
     */
    static getSupportedTypes(): DatabaseType[] {
        return Array.from(this.drivers.keys());
    }

    /**
     * 清除所有注册的驱动（主要用于测试）
     */
    static clear(): void {
        this.drivers.clear();
    }
}

/**
 * 基础数据库管理器实现
 * 这是一个抽象类，具体的数据库驱动需要继承并实现抽象方法
 */
export abstract class BaseDatabaseManager implements IDatabaseManager {
    protected config?: DatabaseConfig;
    protected connectionPool?: IConnectionPool;
    protected isInitialized = false;

    /**
     * 初始化数据库连接
     */
    async initialize(config: DatabaseConfig): Promise<void> {
        this.config = config;
        this.connectionPool = await this.createConnectionPool(config);
        this.isInitialized = true;

        if (config.logging) {
            console.log(`[Database] Initialized: ${config.type}://${config.host || 'localhost'}:${config.port || 'default'}/${config.database}`);
        }
    }

    /**
     * 创建连接池（需要子类实现）
     */
    protected abstract createConnectionPool(config: DatabaseConfig): Promise<IConnectionPool>;

    /**
     * 获取连接
     */
    async getConnection(): Promise<IConnection> {
        if (!this.connectionPool) {
            throw new Error("Database not initialized. Call initialize() first.");
        }
        return this.connectionPool.getConnection();
    }

    /**
     * 执行查询
     */
    async query<T = any>(sql: string, parameters?: any[]): Promise<QueryResult<T>> {
        const connection = await this.getConnection();
        try {
            return await connection.query<T>(sql, parameters);
        } finally {
            await connection.release();
        }
    }

    /**
     * 执行事务
     */
    async transaction<T>(
        callback: (connection: IConnection) => Promise<T>,
        options?: TransactionOptions
    ): Promise<T> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction(options);
            const result = await callback(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            await connection.release();
        }
    }

    /**
     * 关闭数据库连接
     */
    async close(): Promise<void> {
        if (this.connectionPool) {
            await this.connectionPool.close();
            this.connectionPool = undefined;
        }
        this.isInitialized = false;

        if (this.config?.logging) {
            console.log(`[Database] Closed: ${this.config.type}`);
        }
    }

    /**
     * 检查数据库连接状态
     */
    isConnected(): boolean {
        return this.isInitialized && !!this.connectionPool;
    }

    /**
     * 获取数据库信息（需要子类实现）
     */
    abstract getDatabaseInfo(): Promise<{
        type: DatabaseType;
        version: string;
        name: string;
    }>;
}

// ============================================================================
// Migration System - 迁移系统
// ============================================================================

/**
 * 迁移接口
 */
export interface IMigration {
    /** 迁移名称 */
    name: string;
    /** 迁移时间戳 */
    timestamp: number;
    
    /**
     * 执行迁移
     */
    up(connection: IConnection): Promise<void>;
    
    /**
     * 回滚迁移
     */
    down(connection: IConnection): Promise<void>;
}

/**
 * 迁移管理器接口
 */
export interface IMigrationManager {
    /**
     * 运行所有待执行的迁移
     */
    runMigrations(): Promise<void>;
    
    /**
     * 回滚指定数量的迁移
     */
    revertMigrations(count?: number): Promise<void>;
    
    /**
     * 获取已执行的迁移列表
     */
    getExecutedMigrations(): Promise<string[]>;
    
    /**
     * 获取待执行的迁移列表
     */
    getPendingMigrations(): Promise<IMigration[]>;
    
    /**
     * 创建迁移表
     */
    createMigrationsTable(): Promise<void>;
}

/**
 * 基础迁移管理器实现
 */
export abstract class BaseMigrationManager implements IMigrationManager {
    protected databaseManager: IDatabaseManager;
    protected migrations: IMigration[] = [];

    constructor(databaseManager: IDatabaseManager) {
        this.databaseManager = databaseManager;
    }

    /**
     * 添加迁移
     */
    addMigration(migration: IMigration): void {
        this.migrations.push(migration);
        // 按时间戳排序
        this.migrations.sort((a, b) => a.timestamp - b.timestamp);
    }

    /**
     * 运行所有待执行的迁移
     */
    async runMigrations(): Promise<void> {
        await this.createMigrationsTable();
        const executedMigrations = await this.getExecutedMigrations();
        const pendingMigrations = this.migrations.filter(
            migration => !executedMigrations.includes(migration.name)
        );

        for (const migration of pendingMigrations) {
            await this.databaseManager.transaction(async (connection) => {
                await migration.up(connection);
                await this.recordMigration(connection, migration.name);
                console.log(`Migration executed: ${migration.name}`);
            });
        }
    }

    /**
     * 回滚指定数量的迁移
     */
    async revertMigrations(count: number = 1): Promise<void> {
        const executedMigrations = await this.getExecutedMigrations();
        const migrationsToRevert = executedMigrations.slice(-count).reverse();

        for (const migrationName of migrationsToRevert) {
            const migration = this.migrations.find(m => m.name === migrationName);
            if (migration) {
                await this.databaseManager.transaction(async (connection) => {
                    await migration.down(connection);
                    await this.removeMigrationRecord(connection, migration.name);
                    console.log(`Migration reverted: ${migration.name}`);
                });
            }
        }
    }

    /**
     * 获取待执行的迁移列表
     */
    async getPendingMigrations(): Promise<IMigration[]> {
        const executedMigrations = await this.getExecutedMigrations();
        return this.migrations.filter(
            migration => !executedMigrations.includes(migration.name)
        );
    }

    /**
     * 记录已执行的迁移（需要子类实现）
     */
    protected abstract recordMigration(connection: IConnection, migrationName: string): Promise<void>;

    /**
     * 删除迁移记录（需要子类实现）
     */
    protected abstract removeMigrationRecord(connection: IConnection, migrationName: string): Promise<void>;

    /**
     * 创建迁移表（需要子类实现）
     */
    abstract createMigrationsTable(): Promise<void>;

    /**
     * 获取已执行的迁移列表（需要子类实现）
     */
    abstract getExecutedMigrations(): Promise<string[]>;
}

// ============================================================================
// Database Factory - 数据库工厂
// ============================================================================

/**
 * 数据库管理器工厂
 * 提供创建和管理数据库连接的统一接口
 */
export class DatabaseManagerFactory {
    /**
     * 创建数据库管理器
     */
    static async create(config: DatabaseConfig): Promise<IDatabaseManager> {
        return DatabaseDriverRegistry.create(config.type);
    }

    /**
     * 创建并初始化数据库管理器
     */
    static async createAndInitialize(config: DatabaseConfig): Promise<IDatabaseManager> {
        const manager = await this.create(config);
        await manager.initialize(config);
        return manager;
    }

    /**
     * 获取支持的数据库类型
     */
    static getSupportedTypes(): DatabaseType[] {
        return DatabaseDriverRegistry.getSupportedTypes();
    }

    /**
     * 检查是否支持指定的数据库类型
     */
    static isSupported(type: DatabaseType): boolean {
        return DatabaseDriverRegistry.isSupported(type);
    }
}

// ============================================================================
// ORM Configuration - ORM 配置
// ============================================================================

/**
 * ORM 配置接口
 */
export interface ORMConfig {
    /** 数据库配置 */
    database: DatabaseConfig | string;
    /** 实体类列表 */
    entities: Function[];
    /** 是否同步数据库结构 */
    synchronize?: boolean;
    /** 是否启用日志 */
    logging?: boolean | string[];
    /** 迁移文件路径 */
    migrations?: string[];
    /** 是否自动运行迁移 */
    migrationsRun?: boolean;
}

/**
 * 解析数据库配置
 */
export function parseDatabaseConfig(config: DatabaseConfig | string): DatabaseConfig {
    if (typeof config === 'string') {
        // 解析连接字符串，例如: "sqlite://./database.db" 或 "mysql://user:pass@host:port/db"
        const url = new URL(config);
        const type = url.protocol.slice(0, -1) as DatabaseType;

        return {
            type,
            host: url.hostname || undefined,
            port: url.port ? parseInt(url.port) : undefined,
            database: url.pathname.slice(1) || url.pathname,
            username: url.username || undefined,
            password: url.password || undefined,
        };
    }

    return config;
}
