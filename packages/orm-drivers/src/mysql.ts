import {
    DatabaseConfig,
    DatabaseType,
    IDatabaseManager,
    IConnection,
    IConnectionPool,
    QueryResult,
    TransactionOptions,
    BaseDatabaseManager
} from "./database";

// ============================================================================
// MySQL Connection Implementation
// ============================================================================

/**
 * MySQL 连接实现
 */
export class MySQLConnection implements IConnection {
    public readonly id: string;
    public isConnected: boolean = false;
    public inTransaction: boolean = false;
    
    private connection: any; // mysql2.Connection
    private startTime?: number;

    constructor(connection: any) {
        this.id = `mysql_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.connection = connection;
        this.isConnected = true;
        
        console.log(`[MySQL] Connection ${this.id} acquired`);
    }

    /**
     * 执行查询
     */
    async query<T = any>(sql: string, parameters?: any[]): Promise<QueryResult<T>> {
        this.startTime = Date.now();
        console.log(`[MySQL] Executing query: ${sql}`, parameters);

        return new Promise((resolve, reject) => {
            this.connection.execute(sql, parameters || [], (err: any, results: any, fields: any) => {
                if (err) {
                    reject(err);
                } else {
                    const rows = Array.isArray(results) ? results : [];
                    const rowCount = results.affectedRows || rows.length;
                    
                    resolve({
                        rows: rows as T[],
                        rowCount,
                        fields: fields?.map((field: any) => ({
                            name: field.name,
                            type: field.type
                        })),
                        duration: Date.now() - (this.startTime || 0)
                    });
                }
            });
        });
    }

    /**
     * 开始事务
     */
    async beginTransaction(options?: TransactionOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction((err: any) => {
                if (err) {
                    reject(err);
                } else {
                    this.inTransaction = true;
                    console.log(`[MySQL] Transaction started with options:`, options);
                    resolve();
                }
            });
        });
    }

    /**
     * 提交事务
     */
    async commit(): Promise<void> {
        if (!this.inTransaction) {
            throw new Error("No transaction to commit");
        }
        
        const startTime = Date.now();
        return new Promise((resolve, reject) => {
            this.connection.commit((err: any) => {
                if (err) {
                    reject(err);
                } else {
                    this.inTransaction = false;
                    console.log(`[MySQL] Transaction committed (duration: ${Date.now() - startTime}ms)`);
                    resolve();
                }
            });
        });
    }

    /**
     * 回滚事务
     */
    async rollback(): Promise<void> {
        if (!this.inTransaction) {
            throw new Error("No transaction to rollback");
        }
        
        const startTime = Date.now();
        return new Promise((resolve, reject) => {
            this.connection.rollback((err: any) => {
                if (err) {
                    reject(err);
                } else {
                    this.inTransaction = false;
                    console.log(`[MySQL] Transaction rolled back (duration: ${Date.now() - startTime}ms)`);
                    resolve();
                }
            });
        });
    }

    /**
     * 释放连接
     */
    async release(): Promise<void> {
        console.log(`[MySQL] Connection ${this.id} released`);
        // 连接会被连接池管理
    }

    /**
     * 关闭连接
     */
    async close(): Promise<void> {
        if (this.isConnected) {
            return new Promise((resolve) => {
                this.connection.end(() => {
                    this.isConnected = false;
                    console.log(`[MySQL] Connection ${this.id} closed`);
                    resolve();
                });
            });
        }
    }
}

// ============================================================================
// MySQL Connection Pool Implementation
// ============================================================================

/**
 * MySQL 连接池实现
 */
export class MySQLConnectionPool implements IConnectionPool {
    public totalConnections: number = 0;
    public idleConnections: number = 0;
    public activeConnections: number = 0;

    private pool: any; // mysql2.Pool
    private config: DatabaseConfig;

    constructor(pool: any, config: DatabaseConfig) {
        this.pool = pool;
        this.config = config;
        this.totalConnections = config.pool?.max || 10;
        this.idleConnections = config.pool?.min || 2;
    }

    /**
     * 获取连接
     */
    async getConnection(): Promise<IConnection> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err: any, connection: any) => {
                if (err) {
                    reject(err);
                } else {
                    this.activeConnections++;
                    this.idleConnections = Math.max(0, this.idleConnections - 1);
                    resolve(new MySQLConnection(connection));
                }
            });
        });
    }

    /**
     * 释放连接
     */
    async releaseConnection(connection: IConnection): Promise<void> {
        if (connection instanceof MySQLConnection) {
            (connection as any).connection.release();
            this.activeConnections = Math.max(0, this.activeConnections - 1);
            this.idleConnections++;
        }
    }

    /**
     * 关闭连接池
     */
    async close(): Promise<void> {
        return new Promise((resolve) => {
            this.pool.end(() => {
                this.totalConnections = 0;
                this.activeConnections = 0;
                this.idleConnections = 0;
                console.log(`[MySQL] Connection pool closed`);
                resolve();
            });
        });
    }

    /**
     * 健康检查
     */
    async healthCheck(): Promise<boolean> {
        try {
            const connection = await this.getConnection();
            await connection.query("SELECT 1");
            await this.releaseConnection(connection);
            return true;
        } catch (error) {
            console.error("[MySQL] Health check failed:", error);
            return false;
        }
    }
}

// ============================================================================
// MySQL Database Manager Implementation
// ============================================================================

/**
 * MySQL 数据库管理器
 */
export class MySQLDatabaseManager extends BaseDatabaseManager {
    private pool?: any; // mysql2.Pool

    /**
     * 创建连接池
     */
    protected async createConnectionPool(config: DatabaseConfig): Promise<IConnectionPool> {
        // 动态导入 mysql2
        let mysql: any;
        try {
            mysql = require('mysql2');
        } catch (error) {
            throw new Error('mysql2 package is required for MySQL support. Please install it: npm install mysql2');
        }

        const poolConfig = {
            host: config.host || 'localhost',
            port: config.port || 3306,
            user: config.username,
            password: config.password,
            database: config.database,
            connectionLimit: config.pool?.max || 10,
            acquireTimeout: config.pool?.acquireTimeoutMillis || 60000,
            timeout: config.pool?.idleTimeoutMillis || 60000,
            ssl: config.ssl,
            ...config.extra
        };

        this.pool = mysql.createPool(poolConfig);
        console.log(`[MySQL] Connection pool created for ${config.host}:${config.port}/${config.database}`);
        
        return new MySQLConnectionPool(this.pool, config);
    }

    /**
     * 获取数据库信息
     */
    async getDatabaseInfo(): Promise<{ type: DatabaseType; version: string; name: string }> {
        if (!this.config) {
            throw new Error("Database not initialized");
        }

        try {
            const connection = await this.getConnection();
            const result = await connection.query("SELECT VERSION() as version");
            await connection.release();

            return {
                type: DatabaseType.MYSQL,
                version: result.rows[0]?.version || 'unknown',
                name: this.config.database
            };
        } catch (error) {
            return {
                type: DatabaseType.MYSQL,
                version: 'unknown',
                name: this.config.database
            };
        }
    }
}
