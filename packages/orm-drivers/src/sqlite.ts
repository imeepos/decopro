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
// SQLite Connection Implementation
// ============================================================================

/**
 * SQLite 连接实现
 */
export class SQLiteConnection implements IConnection {
    public readonly id: string;
    public isConnected: boolean = false;
    public inTransaction: boolean = false;
    
    private db: any; // sqlite3.Database
    private startTime?: number;

    constructor(db: any) {
        this.id = `sqlite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.db = db;
        this.isConnected = true;
        
        console.log(`[SQLite] Connection ${this.id} acquired`);
    }

    /**
     * 执行查询
     */
    async query<T = any>(sql: string, parameters?: any[]): Promise<QueryResult<T>> {
        this.startTime = Date.now();
        console.log(`[SQLite] Executing query: ${sql}`, parameters);

        return new Promise((resolve, reject) => {
            if (sql.trim().toUpperCase().startsWith('SELECT')) {
                this.db.all(sql, parameters || [], (err: any, rows: any[]) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            rows: rows as T[],
                            rowCount: rows.length,
                            duration: Date.now() - (this.startTime || 0)
                        });
                    }
                });
            } else {
                this.db.run(sql, parameters || [], function(this: any, err: any) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            rows: [] as T[],
                            rowCount: this.changes || 0,
                            duration: Date.now() - (this.startTime || 0)
                        });
                    }
                });
            }
        });
    }

    /**
     * 开始事务
     */
    async beginTransaction(options?: TransactionOptions): Promise<void> {
        const sql = `BEGIN ${options?.isolationLevel || ''}`.trim();
        await this.query(sql);
        this.inTransaction = true;
        console.log(`[SQLite] Transaction started with options:`, options);
    }

    /**
     * 提交事务
     */
    async commit(): Promise<void> {
        if (!this.inTransaction) {
            throw new Error("No transaction to commit");
        }
        
        const startTime = Date.now();
        await this.query("COMMIT");
        this.inTransaction = false;
        console.log(`[SQLite] Transaction committed (duration: ${Date.now() - startTime}ms)`);
    }

    /**
     * 回滚事务
     */
    async rollback(): Promise<void> {
        if (!this.inTransaction) {
            throw new Error("No transaction to rollback");
        }
        
        const startTime = Date.now();
        await this.query("ROLLBACK");
        this.inTransaction = false;
        console.log(`[SQLite] Transaction rolled back (duration: ${Date.now() - startTime}ms)`);
    }

    /**
     * 释放连接
     */
    async release(): Promise<void> {
        console.log(`[SQLite] Connection ${this.id} released`);
        // SQLite 连接通常不需要释放到池中，因为它是文件数据库
    }

    /**
     * 关闭连接
     */
    async close(): Promise<void> {
        if (this.isConnected) {
            return new Promise((resolve, reject) => {
                this.db.close((err: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.isConnected = false;
                        console.log(`[SQLite] Connection ${this.id} closed`);
                        resolve();
                    }
                });
            });
        }
    }
}

// ============================================================================
// SQLite Connection Pool Implementation
// ============================================================================

/**
 * SQLite 连接池实现
 */
export class SQLiteConnectionPool implements IConnectionPool {
    public totalConnections: number = 0;
    public idleConnections: number = 0;
    public activeConnections: number = 0;

    private db: any; // sqlite3.Database
    private config: DatabaseConfig;
    private connections: SQLiteConnection[] = [];
    private maxConnections: number;

    constructor(db: any, config: DatabaseConfig) {
        this.db = db;
        this.config = config;
        this.maxConnections = config.pool?.max || 1; // SQLite 通常使用单连接
        this.totalConnections = 1;
        this.idleConnections = 1;
    }

    /**
     * 获取连接
     */
    async getConnection(): Promise<IConnection> {
        // SQLite 通常共享同一个数据库连接
        const connection = new SQLiteConnection(this.db);
        this.activeConnections++;
        this.idleConnections = Math.max(0, this.idleConnections - 1);
        return connection;
    }

    /**
     * 释放连接
     */
    async releaseConnection(connection: IConnection): Promise<void> {
        this.activeConnections = Math.max(0, this.activeConnections - 1);
        this.idleConnections++;
        // SQLite 连接不需要实际释放
    }

    /**
     * 关闭连接池
     */
    async close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.close((err: any) => {
                if (err) {
                    reject(err);
                } else {
                    this.totalConnections = 0;
                    this.activeConnections = 0;
                    this.idleConnections = 0;
                    console.log(`[SQLite] Database closed`);
                    resolve();
                }
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
            console.error("[SQLite] Health check failed:", error);
            return false;
        }
    }
}

// ============================================================================
// SQLite Database Manager Implementation
// ============================================================================

/**
 * SQLite 数据库管理器
 */
export class SQLiteDatabaseManager extends BaseDatabaseManager {
    private db?: any; // sqlite3.Database

    /**
     * 创建连接池
     */
    protected async createConnectionPool(config: DatabaseConfig): Promise<IConnectionPool> {
        // 动态导入 sqlite3
        let sqlite3: any;
        try {
            sqlite3 = require('sqlite3');
        } catch (error) {
            throw new Error('sqlite3 package is required for SQLite support. Please install it: npm install sqlite3');
        }

        return new Promise((resolve, reject) => {
            const dbPath = config.database;
            this.db = new sqlite3.Database(dbPath, (err: any) => {
                if (err) {
                    reject(new Error(`Failed to connect to SQLite database: ${err.message}`));
                } else {
                    console.log(`[SQLite] Database opened: ${dbPath}`);
                    const pool = new SQLiteConnectionPool(this.db, config);
                    resolve(pool);
                }
            });
        });
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
            const result = await connection.query("SELECT sqlite_version() as version");
            await connection.release();

            return {
                type: DatabaseType.SQLITE,
                version: result.rows[0]?.version || 'unknown',
                name: this.config.database
            };
        } catch (error) {
            return {
                type: DatabaseType.SQLITE,
                version: 'unknown',
                name: this.config.database
            };
        }
    }
}
