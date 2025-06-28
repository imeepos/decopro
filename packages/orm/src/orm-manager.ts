import { injectable, singleton } from "@decopro/core";
import {
    DatabaseConfig,
    DatabaseType,
    IDatabaseManager,
    IMigrationManager
} from "./database";
import {
    createDatabaseManager,
    registerBuiltinDrivers,
    parseConnectionString,
    validateDatabaseConfig
} from "./drivers";
import { BaseRepository, createRepository } from "./repository";

// ============================================================================
// ORM Manager - ORM 管理器
// ============================================================================

/**
 * ORM 配置选项
 */
export interface ORMConfig {
    /** 数据库配置 */
    database: DatabaseConfig | string;
    /** 实体类列表 */
    entities?: Function[];
    /** 是否自动同步数据库结构 */
    synchronize?: boolean;
    /** 是否自动运行迁移 */
    migrationsRun?: boolean;
    /** 迁移文件路径 */
    migrations?: string[];
    /** 是否启用日志 */
    logging?: boolean;
    /** 日志级别 */
    logLevel?: 'error' | 'warn' | 'info' | 'debug';
}

/**
 * ORM 管理器
 * 负责管理数据库连接、实体注册、仓储创建等
 */
@injectable()
@singleton()
export class ORMManager {
    private databaseManager?: IDatabaseManager;
    private migrationManager?: IMigrationManager;
    private config?: ORMConfig;
    private repositories = new Map<Function, BaseRepository<any, any>>();
    private entities = new Set<Function>();
    private isInitialized = false;

    /**
     * 初始化 ORM
     */
    async initialize(config: ORMConfig): Promise<void> {
        if (this.isInitialized) {
            throw new Error("ORM is already initialized");
        }

        this.config = config;

        // 注册内置驱动
        registerBuiltinDrivers();

        // 解析数据库配置
        const databaseConfig = this.parseDatabaseConfig(config.database);

        // 验证配置
        const errors = validateDatabaseConfig(databaseConfig);
        if (errors.length > 0) {
            throw new Error(`Invalid database configuration: ${errors.join(', ')}`);
        }

        // 创建数据库管理器
        this.databaseManager = createDatabaseManager(databaseConfig.type);
        await this.databaseManager.initialize(databaseConfig);

        // 注册实体
        if (config.entities) {
            config.entities.forEach(entity => this.registerEntity(entity));
        }

        // 运行迁移
        if (config.migrationsRun && this.migrationManager) {
            await this.migrationManager.runMigrations();
        }

        this.isInitialized = true;

        if (config.logging) {
            console.log(`[ORM] Initialized with ${databaseConfig.type} database`);
            console.log(`[ORM] Registered ${this.entities.size} entities`);
        }
    }

    /**
     * 解析数据库配置
     */
    private parseDatabaseConfig(config: DatabaseConfig | string): DatabaseConfig {
        if (typeof config === 'string') {
            const parsed = parseConnectionString(config);
            return {
                type: parsed.type,
                host: parsed.host,
                port: parsed.port,
                database: parsed.database,
                username: parsed.username,
                password: parsed.password,
                ...parsed.options
            };
        }
        return config;
    }

    /**
     * 注册实体
     */
    registerEntity(entityClass: Function): void {
        this.entities.add(entityClass);
        
        if (this.config?.logging) {
            console.log(`[ORM] Registered entity: ${entityClass.name}`);
        }
    }

    /**
     * 获取仓储
     */
    getRepository<T, ID = any>(entityClass: new () => T): BaseRepository<T, ID> {
        if (!this.isInitialized) {
            throw new Error("ORM is not initialized. Call initialize() first.");
        }

        // 检查是否已创建仓储
        if (this.repositories.has(entityClass)) {
            return this.repositories.get(entityClass)!;
        }

        // 创建新仓储
        const repository = createRepository(entityClass);
        this.repositories.set(entityClass, repository);

        if (this.config?.logging) {
            console.log(`[ORM] Created repository for: ${entityClass.name}`);
        }

        return repository;
    }

    /**
     * 获取数据库管理器
     */
    getDatabaseManager(): IDatabaseManager {
        if (!this.databaseManager) {
            throw new Error("Database manager is not available. Initialize ORM first.");
        }
        return this.databaseManager;
    }

    /**
     * 获取迁移管理器
     */
    getMigrationManager(): IMigrationManager | undefined {
        return this.migrationManager;
    }

    /**
     * 执行事务
     */
    async transaction<T>(
        callback: (manager: ORMManager) => Promise<T>
    ): Promise<T> {
        if (!this.databaseManager) {
            throw new Error("Database manager is not available");
        }

        return this.databaseManager.transaction(async (connection) => {
            // 创建事务范围的 ORM 管理器
            const transactionManager = new ORMManager();
            transactionManager.databaseManager = this.databaseManager;
            transactionManager.config = this.config;
            transactionManager.entities = this.entities;
            transactionManager.isInitialized = true;

            return callback(transactionManager);
        });
    }

    /**
     * 同步数据库结构
     */
    async synchronize(): Promise<void> {
        if (!this.isInitialized) {
            throw new Error("ORM is not initialized");
        }

        // 这里应该实现数据库结构同步逻辑
        // 包括创建表、索引、外键等
        console.log("[ORM] Database synchronization not implemented yet");
    }

    /**
     * 关闭 ORM
     */
    async close(): Promise<void> {
        if (this.databaseManager) {
            await this.databaseManager.close();
            this.databaseManager = undefined;
        }

        this.repositories.clear();
        this.entities.clear();
        this.isInitialized = false;

        if (this.config?.logging) {
            console.log("[ORM] Closed");
        }
    }

    /**
     * 获取数据库信息
     */
    async getDatabaseInfo() {
        if (!this.databaseManager) {
            throw new Error("Database manager is not available");
        }
        return this.databaseManager.getDatabaseInfo();
    }

    /**
     * 检查连接状态
     */
    isConnected(): boolean {
        return this.databaseManager?.isConnected() || false;
    }

    /**
     * 获取已注册的实体列表
     */
    getRegisteredEntities(): Function[] {
        return Array.from(this.entities);
    }

    /**
     * 获取已创建的仓储列表
     */
    getRepositories(): Map<Function, BaseRepository<any, any>> {
        return new Map(this.repositories);
    }
}

// ============================================================================
// ORM Factory - ORM 工厂
// ============================================================================

/**
 * 创建 ORM 实例
 */
export async function createORM(config: ORMConfig): Promise<ORMManager> {
    const orm = new ORMManager();
    await orm.initialize(config);
    return orm;
}

/**
 * 创建内存 SQLite ORM（用于测试）
 */
export async function createTestORM(entities?: Function[]): Promise<ORMManager> {
    const config: ORMConfig = {
        database: {
            type: DatabaseType.SQLITE,
            database: ':memory:'
        },
        entities: entities || [],
        synchronize: true,
        logging: false
    };

    return createORM(config);
}

// ============================================================================
// Decorators for ORM Integration - ORM 集成装饰器
// ============================================================================

/**
 * 自动注入仓储的装饰器
 */
export function InjectRepository<T>(entityClass: new () => T) {
    return function (target: any, propertyKey: string | symbol) {
        // 这里应该实现依赖注入逻辑
        // 在运行时注入对应的仓储实例
        console.log(`[ORM] Repository injection registered for ${entityClass.name} -> ${String(propertyKey)}`);
    };
}

/**
 * 事务装饰器
 */
export function Transactional() {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            // 这里应该实现事务包装逻辑
            console.log(`[ORM] Transactional method called: ${target.constructor.name}.${propertyName}`);
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

// ============================================================================
// Global ORM Instance - 全局 ORM 实例
// ============================================================================

let globalORM: ORMManager | undefined;

/**
 * 设置全局 ORM 实例
 */
export function setGlobalORM(orm: ORMManager): void {
    globalORM = orm;
}

/**
 * 获取全局 ORM 实例
 */
export function getGlobalORM(): ORMManager {
    if (!globalORM) {
        throw new Error("Global ORM instance is not set. Call setGlobalORM() first.");
    }
    return globalORM;
}

/**
 * 获取全局仓储
 */
export function getRepository<T, ID = any>(entityClass: new () => T): BaseRepository<T, ID> {
    return getGlobalORM().getRepository(entityClass);
}
