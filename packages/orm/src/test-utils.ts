/**
 * 测试工具和模拟实现
 * 用于在没有真实数据库驱动的情况下进行测试
 */

import {
    DatabaseConfig,
    DatabaseType,
    IDatabaseManager,
    IConnection,
    IConnectionPool,
    QueryResult,
    TransactionOptions,
    BaseDatabaseManager,
    DatabaseDriverRegistry
} from "./database";

// ============================================================================
// Mock Connection Implementation
// ============================================================================

/**
 * 模拟数据库连接
 */
export class MockConnection implements IConnection {
    public readonly id: string;
    public isConnected: boolean = true;
    public inTransaction: boolean = false;

    constructor() {
        this.id = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async query<T = any>(sql: string, parameters?: any[]): Promise<QueryResult<T>> {
        // 模拟查询执行
        console.log(`[Mock] Executing query: ${sql}`, parameters);
        
        // 简单的模拟结果
        const mockRows: T[] = [];
        const rowCount = 0;
        
        return {
            rows: mockRows,
            rowCount,
            duration: Math.random() * 10 // 模拟执行时间
        };
    }

    async beginTransaction(options?: TransactionOptions): Promise<void> {
        console.log(`[Mock] Transaction started with options:`, options);
        this.inTransaction = true;
    }

    async commit(): Promise<void> {
        if (!this.inTransaction) {
            throw new Error("No transaction to commit");
        }
        console.log(`[Mock] Transaction committed`);
        this.inTransaction = false;
    }

    async rollback(): Promise<void> {
        if (!this.inTransaction) {
            throw new Error("No transaction to rollback");
        }
        console.log(`[Mock] Transaction rolled back`);
        this.inTransaction = false;
    }

    async release(): Promise<void> {
        console.log(`[Mock] Connection ${this.id} released`);
    }

    async close(): Promise<void> {
        this.isConnected = false;
        console.log(`[Mock] Connection ${this.id} closed`);
    }
}

// ============================================================================
// Mock Connection Pool Implementation
// ============================================================================

/**
 * 模拟连接池
 */
export class MockConnectionPool implements IConnectionPool {
    public totalConnections: number = 1;
    public idleConnections: number = 1;
    public activeConnections: number = 0;

    private config: DatabaseConfig;

    constructor(config: DatabaseConfig) {
        this.config = config;
    }

    async getConnection(): Promise<IConnection> {
        this.activeConnections++;
        this.idleConnections = Math.max(0, this.idleConnections - 1);
        return new MockConnection();
    }

    async releaseConnection(connection: IConnection): Promise<void> {
        this.activeConnections = Math.max(0, this.activeConnections - 1);
        this.idleConnections++;
    }

    async close(): Promise<void> {
        this.totalConnections = 0;
        this.activeConnections = 0;
        this.idleConnections = 0;
        console.log(`[Mock] Connection pool closed`);
    }

    async healthCheck(): Promise<boolean> {
        return true;
    }
}

// ============================================================================
// Mock Database Manager Implementation
// ============================================================================

/**
 * 模拟数据库管理器
 */
export class MockDatabaseManager extends BaseDatabaseManager {
    protected async createConnectionPool(config: DatabaseConfig): Promise<IConnectionPool> {
        console.log(`[Mock] Creating connection pool for ${config.type}:${config.database}`);
        return new MockConnectionPool(config);
    }

    async getDatabaseInfo(): Promise<{ type: DatabaseType; version: string; name: string }> {
        if (!this.config) {
            throw new Error("Database not initialized");
        }

        return {
            type: this.config.type,
            version: "mock-1.0.0",
            name: this.config.database
        };
    }
}

// ============================================================================
// Test Utilities
// ============================================================================

/**
 * 注册模拟驱动（用于测试）
 */
export function registerMockDrivers(): void {
    // 注册所有数据库类型的模拟驱动
    Object.values(DatabaseType).forEach(type => {
        DatabaseDriverRegistry.register(type, async () => {
            return new MockDatabaseManager();
        });
    });
    
    console.log("[Test Utils] Mock drivers registered for all database types");
}

/**
 * 清除所有注册的驱动（用于测试）
 */
export function clearAllDrivers(): void {
    DatabaseDriverRegistry.clear();
    console.log("[Test Utils] All drivers cleared");
}

/**
 * 创建测试数据库配置
 */
export function createTestDatabaseConfig(type: DatabaseType = DatabaseType.SQLITE): DatabaseConfig {
    switch (type) {
        case DatabaseType.SQLITE:
            return {
                type: DatabaseType.SQLITE,
                database: ":memory:",
                logging: false
            };
        
        case DatabaseType.MYSQL:
            return {
                type: DatabaseType.MYSQL,
                host: "localhost",
                port: 3306,
                username: "test",
                password: "test",
                database: "test_db",
                logging: false
            };
        
        case DatabaseType.POSTGRESQL:
            return {
                type: DatabaseType.POSTGRESQL,
                host: "localhost",
                port: 5432,
                username: "test",
                password: "test",
                database: "test_db",
                logging: false
            };
        
        default:
            return {
                type,
                database: "test_db",
                logging: false
            };
    }
}

/**
 * 检查是否在测试环境中
 */
export function isTestEnvironment(): boolean {
    return process.env.NODE_ENV === 'test' || 
           process.env.JEST_WORKER_ID !== undefined ||
           typeof global.it === 'function';
}

/**
 * 自动注册模拟驱动（仅在测试环境中）
 */
export function autoRegisterMockDriversInTest(): void {
    if (isTestEnvironment()) {
        registerMockDrivers();
        console.log("[Test Utils] Auto-registered mock drivers in test environment");
    }
}

// ============================================================================
// 注意：类已经在上面使用 export class 导出，这里不需要重复导出
// ============================================================================
