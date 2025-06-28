# @decopro/orm-drivers

Database drivers for @decopro/orm

**Version**: 1.1.0

## Main Exports

- `registerAllDrivers`
- `registerSQLiteDriver`
- `registerMySQLDriver`
- `registerPostgreSQLDriver`
- `SQLiteDatabaseManager`
- `MySQLDatabaseManager`
- `isDriverAvailable`
- `getAvailableDrivers`

## Architecture Overview

This package contains the following components:

- **test**: 1 file(s)
- **orm**: 2 file(s)
- **module**: 2 file(s)
- **class**: 2 file(s)
- **interface**: 2 file(s)
- **utility**: 1 file(s)

### Key Dependencies

- **@decopro/core**: used in 2 file(s)
- **mysql2**: used in 1 file(s)
- **@decopro/orm**: used in 1 file(s)
- **sqlite3**: used in 1 file(s)
- **tsup**: used in 1 file(s)


## API Reference

## Test

### src/__tests__/setup.ts

**Tags**: test

## Orm

### src/database.ts

### Enum: `DatabaseType`

数据库类型枚举


  - Member: `MYSQL`
  - Member: `POSTGRESQL`
  - Member: `SQLITE`
  - Member: `MSSQL`
  - Member: `ORACLE`
  - Member: `MONGODB`
### Interface: `DatabaseConfig`

数据库连接配置


  - type: DatabaseType
    
    数据库类型
    
  - host: string | undefined
    
    主机地址
    
  - port: number | undefined
    
    端口号
    
  - database: string
    
    数据库名
    
  - username: string | undefined
    
    用户名
    
  - password?: string | undefined
    
    密码
    
  - pool?: {
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
    }
    
    连接池配置
    
  - ssl?: boolean | {
        ca?: string;
        cert?: string;
        key?: string;
        rejectUnauthorized?: boolean;
    }
    
    SSL 配置
    
  - extra?: Record<string, any>
    
    额外选项
    
  - logging?: boolean | string[]
    
    是否启用日志
    
  - synchronize?: boolean
    
    是否同步数据库结构
    
  - migrationsRun?: boolean
    
    是否自动运行迁移
    
  - migrations?: string[]
    
    迁移文件路径
    
  - entities?: string[] | Function[]
    
    实体文件路径
    

### Interface: `QueryResult`

查询结果接口


  - rows: T[]
    
    查询结果数据
    
  - rowCount: number
    
    影响的行数
    
  - fields?: Array<{
        name: string;
        type: string;
    }>
    
    查询字段信息
    
  - duration?: number
    
    执行时间（毫秒）
    

### Enum: `IsolationLevel`

事务隔离级别


  - Member: `READ_UNCOMMITTED`
  - Member: `READ_COMMITTED`
  - Member: `REPEATABLE_READ`
  - Member: `SERIALIZABLE`
### Interface: `TransactionOptions`

事务选项


  - isolationLevel?: IsolationLevel
    
    隔离级别
    
  - timeout?: number
    
    超时时间（毫秒）
    
  - readOnly?: boolean
    
    是否只读
    

### Interface: `IConnection`

数据库连接接口


  - id: string
    
    连接 ID
    
  - isConnected: boolean
    
    是否已连接
    
  - inTransaction: boolean
    
    是否在事务中
    

### Interface: `IConnectionPool`

连接池接口


  - totalConnections: number
    
    池中连接总数
    
  - idleConnections: number
    
    空闲连接数
    
  - activeConnections: number
    
    活跃连接数
    

### Interface: `IDatabaseManager`

数据库管理器接口



### Class: `DatabaseDriverRegistry`

数据库驱动注册器


  - Property: `drivers: any`
  - Method: `register(type: DatabaseType, driverFactory: () => Promise<IDatabaseManager>): void`
    
    注册数据库驱动
    
  - Method: `create(type: DatabaseType): Promise<IDatabaseManager>`
    
    创建数据库管理器
    
  - Method: `isSupported(type: DatabaseType): boolean`
    
    检查是否支持指定的数据库类型
    
  - Method: `getSupportedTypes(): DatabaseType[]`
    
    获取支持的数据库类型
    
  - Method: `clear(): void`
    
    清除所有注册的驱动（主要用于测试）
    

### Class: `BaseDatabaseManager`

基础数据库管理器实现
这是一个抽象类，具体的数据库驱动需要继承并实现抽象方法


  - Property: `config: DatabaseConfig | undefined`
  - Property: `connectionPool: IConnectionPool | undefined`
  - Property: `isInitialized: any`
  - Method: `initialize(config: DatabaseConfig): Promise<void>`
    
    初始化数据库连接
    
  - Method: `createConnectionPool(config: DatabaseConfig): Promise<IConnectionPool>`
    
    创建连接池（需要子类实现）
    
  - Method: `getConnection(): Promise<IConnection>`
    
    获取连接
    
  - Method: `query(sql: string, parameters?: any[]): Promise<QueryResult<T>>`
    
    执行查询
    
  - Method: `transaction(callback: (connection: IConnection) => Promise<T>, options?: TransactionOptions): Promise<T>`
    
    执行事务
    
  - Method: `close(): Promise<void>`
    
    关闭数据库连接
    
  - Method: `isConnected(): boolean`
    
    检查数据库连接状态
    
  - Method: `getDatabaseInfo(): Promise<{
        type: DatabaseType;
        version: string;
        name: string;
    }>`
    
    获取数据库信息（需要子类实现）
    

### Interface: `IMigration`

迁移接口


  - name: string
    
    迁移名称
    
  - timestamp: number
    
    迁移时间戳
    

### Interface: `IMigrationManager`

迁移管理器接口



### Class: `BaseMigrationManager`

基础迁移管理器实现


  - Property: `databaseManager: IDatabaseManager`
  - Property: `migrations: IMigration[]`
  - Constructor: `constructor(databaseManager: IDatabaseManager): void`
    - Parameter: `databaseManager: IDatabaseManager`
  - Method: `addMigration(migration: IMigration): void`
    
    添加迁移
    
  - Method: `runMigrations(): Promise<void>`
    
    运行所有待执行的迁移
    
  - Method: `revertMigrations(count: number): Promise<void>`
    
    回滚指定数量的迁移
    
  - Method: `getPendingMigrations(): Promise<IMigration[]>`
    
    获取待执行的迁移列表
    
  - Method: `recordMigration(connection: IConnection, migrationName: string): Promise<void>`
    
    记录已执行的迁移（需要子类实现）
    
  - Method: `removeMigrationRecord(connection: IConnection, migrationName: string): Promise<void>`
    
    删除迁移记录（需要子类实现）
    
  - Method: `createMigrationsTable(): Promise<void>`
    
    创建迁移表（需要子类实现）
    
  - Method: `getExecutedMigrations(): Promise<string[]>`
    
    获取已执行的迁移列表（需要子类实现）
    

### Class: `DatabaseManagerFactory`

数据库管理器工厂
提供创建和管理数据库连接的统一接口


  - Method: `create(config: DatabaseConfig): Promise<IDatabaseManager>`
    
    创建数据库管理器
    
  - Method: `createAndInitialize(config: DatabaseConfig): Promise<IDatabaseManager>`
    
    创建并初始化数据库管理器
    
  - Method: `getSupportedTypes(): DatabaseType[]`
    
    获取支持的数据库类型
    
  - Method: `isSupported(type: DatabaseType): boolean`
    
    检查是否支持指定的数据库类型
    

### Interface: `ORMConfig`

ORM 配置接口


  - database: DatabaseConfig | string
    
    数据库配置
    
  - entities: Function[]
    
    实体类列表
    
  - synchronize?: boolean
    
    是否同步数据库结构
    
  - logging?: boolean | string[]
    
    是否启用日志
    
  - migrations?: string[]
    
    迁移文件路径
    
  - migrationsRun?: boolean
    
    是否自动运行迁移
    

### Function: `parseDatabaseConfig(config: DatabaseConfig | string): DatabaseConfig`

解析数据库配置



**Tags**: async, interface, types, class, function, export

### src/orm-manager.ts

### Interface: `ORMManagerConfig`

ORM 管理器配置选项


  - database: DatabaseConfig | string
    
    数据库配置
    
  - entities?: Function[]
    
    实体类列表
    
  - synchronize?: boolean
    
    是否自动同步数据库结构
    
  - migrationsRun?: boolean
    
    是否自动运行迁移
    
  - migrations?: string[]
    
    迁移文件路径
    
  - logging?: boolean
    
    是否启用日志
    
  - logLevel?: 'error' | 'warn' | 'info' | 'debug'
    
    日志级别
    

### Class: `ORMManager`

ORM 管理器
负责管理数据库连接、实体注册、仓储创建等


  - Property: `databaseManager: IDatabaseManager`
  - Property: `migrationManager: IMigrationManager`
  - Property: `config: ORMManagerConfig`
  - Property: `repositories: any`
  - Property: `entities: any`
  - Property: `isInitialized: any`
  - Method: `initialize(config: ORMManagerConfig): Promise<void>`
    
    初始化 ORM
    
  - Method: `registerEntity(entityClass: Function): void`
    
    注册实体
    
  - Method: `hasEntity(entityClass: Function): boolean`
    
    检查是否已注册实体
    
  - Method: `getEntityClasses(): Function[]`
    
    获取所有已注册的实体类
    
  - Method: `getRepository(entityClass: new () => T): BaseRepository<T, ID>`
    
    获取仓储
    
  - Method: `getDatabaseManager(): IDatabaseManager`
    
    获取数据库管理器
    
  - Method: `getMigrationManager(): IMigrationManager | undefined`
    
    获取迁移管理器
    
  - Method: `transaction(callback: (manager: ORMManager) => Promise<T>): Promise<T>`
    
    执行事务
    
  - Method: `synchronize(): Promise<void>`
    
    同步数据库结构
    
  - Method: `close(): Promise<void>`
    
    关闭 ORM
    
  - Method: `getDatabaseInfo(): void`
    
    获取数据库信息
    
  - Method: `isConnected(): boolean`
    
    检查连接状态
    
  - Method: `getRegisteredEntities(): Function[]`
    
    获取已注册的实体列表
    
  - Method: `getRepositories(): Map<Function, BaseRepository<any, any>>`
    
    获取已创建的仓储列表
    

### Function: `createORM(config: ORMManagerConfig): Promise<ORMManager>`

创建 ORM 实例


### Function: `createTestORM(entities?: Function[]): Promise<ORMManager>`

创建测试 ORM（使用模拟驱动）


### Function: `InjectRepository(entityClass: new () => T): void`

自动注入仓储的装饰器


### Function: `Transactional(): void`

事务装饰器


### Function: `setGlobalORM(orm: ORMManager): void`

设置全局 ORM 实例


### Function: `getGlobalORM(): ORMManager`

获取全局 ORM 实例


### Function: `getRepository(entityClass: new () => T): BaseRepository<T, ID>`

获取全局仓储



**Tags**: orm, repository, database, async, interface, types, class, function, export

## Module

### src/index.ts

### Function: `registerAllDrivers(): void`

注册所有内置驱动


### Function: `registerSQLiteDriver(): void`

注册 SQLite 驱动


### Function: `registerMySQLDriver(): void`

注册 MySQL 驱动


### Function: `registerPostgreSQLDriver(): void`

注册 PostgreSQL 驱动（占位符）


### Function: `isDriverAvailable(type: DatabaseType): boolean`

检查驱动是否可用


### Function: `getAvailableDrivers(): DatabaseType[]`

获取所有可用的驱动类型


### Function: `createDatabaseManager(type: DatabaseType): Promise<IDatabaseManager>`

创建数据库管理器（便捷函数）



**Tags**: async, function, export

### tsup.config.ts

**Tags**: export

## Class

### src/mysql.ts

### Class: `MySQLConnection`

MySQL 连接实现


  - Property: `id: string`
    
    连接 ID
    
  - Property: `isConnected: boolean`
    
    是否已连接
    
  - Property: `inTransaction: boolean`
    
    是否在事务中
    
  - Property: `connection: any`
  - Property: `startTime: number`
  - Constructor: `constructor(connection: any): void`
    - Parameter: `connection: any`
  - Method: `query(sql: string, parameters?: any[]): Promise<QueryResult<T>>`
    
    执行查询
    
  - Method: `beginTransaction(options?: TransactionOptions): Promise<void>`
    
    开始事务
    
  - Method: `commit(): Promise<void>`
    
    提交事务
    
  - Method: `rollback(): Promise<void>`
    
    回滚事务
    
  - Method: `release(): Promise<void>`
    
    释放连接
    
  - Method: `close(): Promise<void>`
    
    关闭连接
    

### Class: `MySQLConnectionPool`

MySQL 连接池实现


  - Property: `totalConnections: number`
    
    池中连接总数
    
  - Property: `idleConnections: number`
    
    空闲连接数
    
  - Property: `activeConnections: number`
    
    活跃连接数
    
  - Property: `pool: any`
  - Property: `config: DatabaseConfig`
  - Constructor: `constructor(pool: any, config: DatabaseConfig): void`
    - Parameter: `pool: any`
    - Parameter: `config: DatabaseConfig`
  - Method: `getConnection(): Promise<IConnection>`
    
    获取连接
    
  - Method: `releaseConnection(connection: IConnection): Promise<void>`
    
    释放连接
    
  - Method: `close(): Promise<void>`
    
    关闭连接池
    
  - Method: `healthCheck(): Promise<boolean>`
    
    健康检查
    

### Class: `MySQLDatabaseManager`

MySQL 数据库管理器


  - Property: `pool: any`
  - Method: `createConnectionPool(config: DatabaseConfig): Promise<IConnectionPool>`
    
    创建连接池
    
  - Method: `getDatabaseInfo(): Promise<{ type: DatabaseType; version: string; name: string }>`
    
    获取数据库信息
    


**Tags**: async, class, export

### src/sqlite.ts

### Class: `SQLiteConnection`

SQLite 连接实现


  - Property: `id: string`
    
    连接 ID
    
  - Property: `isConnected: boolean`
    
    是否已连接
    
  - Property: `inTransaction: boolean`
    
    是否在事务中
    
  - Property: `db: any`
  - Property: `startTime: number`
  - Constructor: `constructor(db: any): void`
    - Parameter: `db: any`
  - Method: `query(sql: string, parameters?: any[]): Promise<QueryResult<T>>`
    
    执行查询
    
  - Method: `beginTransaction(options?: TransactionOptions): Promise<void>`
    
    开始事务
    
  - Method: `commit(): Promise<void>`
    
    提交事务
    
  - Method: `rollback(): Promise<void>`
    
    回滚事务
    
  - Method: `release(): Promise<void>`
    
    释放连接
    
  - Method: `close(): Promise<void>`
    
    关闭连接
    

### Class: `SQLiteConnectionPool`

SQLite 连接池实现


  - Property: `totalConnections: number`
    
    池中连接总数
    
  - Property: `idleConnections: number`
    
    空闲连接数
    
  - Property: `activeConnections: number`
    
    活跃连接数
    
  - Property: `db: any`
  - Property: `config: DatabaseConfig`
  - Property: `connections: SQLiteConnection[]`
  - Property: `maxConnections: number`
  - Constructor: `constructor(db: any, config: DatabaseConfig): void`
    - Parameter: `db: any`
    - Parameter: `config: DatabaseConfig`
  - Method: `getConnection(): Promise<IConnection>`
    
    获取连接
    
  - Method: `releaseConnection(connection: IConnection): Promise<void>`
    
    释放连接
    
  - Method: `close(): Promise<void>`
    
    关闭连接池
    
  - Method: `healthCheck(): Promise<boolean>`
    
    健康检查
    

### Class: `SQLiteDatabaseManager`

SQLite 数据库管理器


  - Property: `db: any`
  - Method: `createConnectionPool(config: DatabaseConfig): Promise<IConnectionPool>`
    
    创建连接池
    
  - Method: `getDatabaseInfo(): Promise<{ type: DatabaseType; version: string; name: string }>`
    
    获取数据库信息
    


**Tags**: async, class, function, export

## Interface

### src/query-builder.ts

### Enum: `QueryOperator`

查询操作符


  - Member: `EQUAL`
  - Member: `NOT_EQUAL`
  - Member: `GREATER_THAN`
  - Member: `GREATER_THAN_OR_EQUAL`
  - Member: `LESS_THAN`
  - Member: `LESS_THAN_OR_EQUAL`
  - Member: `LIKE`
  - Member: `ILIKE`
  - Member: `IN`
  - Member: `NOT_IN`
  - Member: `IS_NULL`
  - Member: `IS_NOT_NULL`
  - Member: `BETWEEN`
  - Member: `NOT_BETWEEN`
### Enum: `SortDirection`

排序方向


  - Member: `ASC`
  - Member: `DESC`
### Enum: `JoinType`

连接类型


  - Member: `INNER`
  - Member: `LEFT`
  - Member: `RIGHT`
  - Member: `FULL`
### Enum: `AggregateFunction`

聚合函数类型


  - Member: `COUNT`
  - Member: `SUM`
  - Member: `AVG`
  - Member: `MIN`
  - Member: `MAX`
### Interface: `WhereCondition`

查询条件接口


  - field: string
  - operator: QueryOperator
  - value?: any
  - values?: any[]

### Interface: `OrderByCondition`

排序条件接口


  - field: string
  - direction: SortDirection

### Interface: `JoinCondition`

连接条件接口


  - type: JoinType
  - table: string
  - alias?: string
  - on: string

### Interface: `GroupByCondition`

分组条件接口


  - field: string

### Interface: `HavingCondition`

Having 条件接口


  - field: string
  - operator: QueryOperator
  - value: any

### Interface: `QueryOptions`

查询选项接口


  - select?: string[]
    
    查询字段
    
  - from?: string
    
    表名
    
  - alias?: string
    
    表别名
    
  - where?: WhereCondition[]
    
    WHERE 条件
    
  - joins?: JoinCondition[]
    
    JOIN 条件
    
  - orderBy?: OrderByCondition[]
    
    ORDER BY 条件
    
  - groupBy?: GroupByCondition[]
    
    GROUP BY 条件
    
  - having?: HavingCondition[]
    
    HAVING 条件
    
  - limit?: number
    
    限制条数
    
  - offset?: number
    
    偏移量
    
  - distinct?: boolean
    
    是否去重
    

### Class: `QueryBuilder`

类型安全的查询构建器


  - Property: `options: QueryOptions`
  - Property: `entityClass: new () => T`
  - Property: `databaseManager: IDatabaseManager`
  - Constructor: `constructor(entityClass?: new () => T, alias?: string, databaseManager?: IDatabaseManager): void`
    - Parameter: `entityClass: new () => T`
    - Parameter: `alias: string`
    - Parameter: `databaseManager: IDatabaseManager`
  - Method: `select(fields: (keyof T | string)[]): this`
    
    选择字段
    
  - Method: `selectAll(): this`
    
    选择所有字段
    
  - Method: `from(table: string, alias?: string): this`
    
    设置表名
    
  - Method: `where(field: keyof T | string, operator: QueryOperator, value?: any): this`
    
    添加 WHERE 条件
    
  - Method: `whereEqual(field: keyof T | string, value: any): this`
    
    添加 WHERE 等于条件
    
  - Method: `whereNotEqual(field: keyof T | string, value: any): this`
    
    添加 WHERE 不等于条件
    
  - Method: `whereLike(field: keyof T | string, pattern: string): this`
    
    添加 WHERE LIKE 条件
    
  - Method: `whereIn(field: keyof T | string, values: any[]): this`
    
    添加 WHERE IN 条件
    
  - Method: `whereNull(field: keyof T | string): this`
    
    添加 WHERE IS NULL 条件
    
  - Method: `whereNotNull(field: keyof T | string): this`
    
    添加 WHERE IS NOT NULL 条件
    
  - Method: `whereBetween(field: keyof T | string, min: any, max: any): this`
    
    添加 WHERE BETWEEN 条件
    
  - Method: `join(table: string, on: string, type: JoinType, alias?: string): this`
    
    添加 JOIN 条件
    
  - Method: `innerJoin(table: string, on: string, alias?: string): this`
    
    添加 INNER JOIN
    
  - Method: `leftJoin(table: string, on: string, alias?: string): this`
    
    添加 LEFT JOIN
    
  - Method: `rightJoin(table: string, on: string, alias?: string): this`
    
    添加 RIGHT JOIN
    
  - Method: `orderBy(field: keyof T | string, direction: SortDirection): this`
    
    添加 ORDER BY 条件
    
  - Method: `orderByAsc(field: keyof T | string): this`
    
    添加升序排序
    
  - Method: `orderByDesc(field: keyof T | string): this`
    
    添加降序排序
    
  - Method: `groupBy(fields: (keyof T | string)[]): this`
    
    添加 GROUP BY 条件
    
  - Method: `having(field: string, operator: QueryOperator, value: any): this`
    
    添加 HAVING 条件
    
  - Method: `limit(count: number): this`
    
    设置限制条数
    
  - Method: `offset(count: number): this`
    
    设置偏移量
    
  - Method: `paginate(page: number, pageSize: number): this`
    
    设置分页
    
  - Method: `distinct(): this`
    
    设置去重
    
  - Method: `getOptions(): QueryOptions`
    
    获取查询选项
    
  - Method: `toSQL(): string`
    
    构建 SQL 查询语句（基础实现）
    
  - Method: `toParameterizedSQL(): { sql: string; parameters: any[] }`
    
    构建参数化 SQL 查询语句
    
  - Method: `clone(): QueryBuilder<T>`
    
    克隆查询构建器
    
  - Method: `setDatabaseManager(databaseManager: IDatabaseManager): this`
    
    设置数据库管理器
    
  - Method: `getOne(): Promise<T | null>`
    
    执行查询并获取单个结果
    
  - Method: `getCount(): Promise<number>`
    
    执行查询并获取结果数量
    
  - Method: `getMany(): Promise<T[]>`
    
    执行查询并获取多个结果
    

### Function: `createQueryBuilder(entityClass?: new () => T, alias?: string, databaseManager?: IDatabaseManager): QueryBuilder<T>`

创建查询构建器



**Tags**: query-builder, database, async, interface, types, class, function, export

### src/repository.ts

### Interface: `FindOptions`

查找选项


  - where?: Partial<T> | ((qb: QueryBuilder<T>) => QueryBuilder<T>)
    
    查询条件
    
  - select?: (keyof T)[]
    
    选择字段
    
  - relations?: string[]
    
    关联查询
    
  - order?: { [P in keyof T]?: "ASC" | "DESC" }
    
    排序
    
  - skip?: number
    
    跳过条数
    
  - take?: number
    
    限制条数
    
  - cache?: boolean | number
    
    缓存
    

### Interface: `FindOneOptions`

查找一个选项



### Interface: `SaveOptions`

保存选项


  - validate?: boolean
    
    数据验证
    
  - reload?: boolean
    
    重新加载保存后的实体
    
  - transaction?: any
    
    事务
    

### Interface: `DeleteOptions`

删除选项


  - soft?: boolean
    
    软删除
    
  - transaction?: any
    
    事务
    

### Interface: `PaginationResult`

分页结果


  - data: T[]
    
    数据列表
    
  - total: number
    
    总数
    
  - page: number
    
    当前页
    
  - pageSize: number
    
    每页条数
    
  - totalPages: number
    
    总页数
    
  - hasNext: boolean
    
    是否有下一页
    
  - hasPrev: boolean
    
    是否有上一页
    

### Interface: `AggregateResult`

聚合结果


  - count?: number
  - sum?: number
  - avg?: number
  - min?: number
  - max?: number

### Interface: `IRepository`

基础仓储接口



### Class: `BaseRepository`

基础仓储实现


  - Property: `entityClass: new () => T`
  - Property: `tableName: string`
  - Property: `mockData: Map<ID, T>`
  - Property: `databaseManager: IDatabaseManager`
  - Constructor: `constructor(entityClass: new () => T, databaseManager?: IDatabaseManager): void`
    - Parameter: `entityClass: new () => T`
    - Parameter: `databaseManager: IDatabaseManager`
  - Method: `getTableName(): string`
    
    获取表名（需要从装饰器元数据中获取）
    
  - Method: `createQueryBuilder(alias?: string): QueryBuilder<T>`
    
    创建查询构建器
    
  - Method: `save(entity: Partial<T>, options?: SaveOptions): Promise<T>`
    
    保存实体
    
  - Method: `saveMany(entities: Partial<T>[], options?: SaveOptions): Promise<T[]>`
    
    批量保存实体
    
  - Method: `findById(id: ID, options?: FindOneOptions<T>): Promise<T | null>`
    
    根据 ID 查找实体
    
  - Method: `findOne(options?: FindOneOptions<T>): Promise<T | null>`
    
    查找一个实体
    
  - Method: `find(options?: FindOptions<T>): Promise<T[]>`
    
    查找多个实体
    
  - Method: `findAll(options?: FindOptions<T>): Promise<T[]>`
    
    查找所有实体
    
  - Method: `findAndCount(options?: FindOptions<T>): Promise<PaginationResult<T>>`
    
    分页查找
    
  - Method: `count(options?: FindOptions<T>): Promise<number>`
    
    统计数量
    
  - Method: `exists(options?: FindOneOptions<T>): Promise<boolean>`
    
    检查是否存在
    
  - Method: `update(id: ID, updateData: Partial<T>, options?: SaveOptions): Promise<T | null>`
    
    更新实体
    
  - Method: `updateMany(where: Partial<T>, updateData: Partial<T>, options?: SaveOptions): Promise<number>`
    
    批量更新
    
  - Method: `delete(id: ID, options?: DeleteOptions): Promise<boolean>`
    
    删除实体
    
  - Method: `remove(entity: T): Promise<boolean>`
    
    删除实体对象
    
  - Method: `deleteMany(where: Partial<T>, options?: DeleteOptions): Promise<number>`
    
    批量删除
    
  - Method: `softDelete(id: ID): Promise<boolean>`
    
    软删除
    
  - Method: `restore(id: ID): Promise<boolean>`
    
    恢复软删除
    
  - Method: `query(sql: string, parameters?: any[]): Promise<any>`
    
    执行原生查询
    
  - Method: `aggregate(options: {
        count?: boolean;
        sum?: keyof T;
        avg?: keyof T;
        min?: keyof T;
        max?: keyof T;
        where?: Partial<T>;
    }): Promise<AggregateResult>`
    
    聚合查询
    

### Function: `createRepository(entityClass: new () => T, databaseManager?: IDatabaseManager): BaseRepository<T, ID>`

创建仓储实例



**Tags**: query-builder, database, repository, async, interface, types, class, function, export

## Utility

### src/test-utils.ts

### Class: `MockConnection`

模拟数据库连接


  - Property: `id: string`
    
    连接 ID
    
  - Property: `isConnected: boolean`
    
    是否已连接
    
  - Property: `inTransaction: boolean`
    
    是否在事务中
    
  - Constructor: `constructor(): void`
  - Method: `query(sql: string, parameters?: any[]): Promise<QueryResult<T>>`
    
    执行查询
    
  - Method: `beginTransaction(options?: TransactionOptions): Promise<void>`
    
    开始事务
    
  - Method: `commit(): Promise<void>`
    
    提交事务
    
  - Method: `rollback(): Promise<void>`
    
    回滚事务
    
  - Method: `release(): Promise<void>`
    
    释放连接
    
  - Method: `close(): Promise<void>`
    
    关闭连接
    

### Class: `MockConnectionPool`

模拟连接池


  - Property: `totalConnections: number`
    
    池中连接总数
    
  - Property: `idleConnections: number`
    
    空闲连接数
    
  - Property: `activeConnections: number`
    
    活跃连接数
    
  - Property: `config: DatabaseConfig`
  - Constructor: `constructor(config: DatabaseConfig): void`
    - Parameter: `config: DatabaseConfig`
  - Method: `getConnection(): Promise<IConnection>`
    
    获取连接
    
  - Method: `releaseConnection(connection: IConnection): Promise<void>`
    
    释放连接
    
  - Method: `close(): Promise<void>`
    
    关闭连接池
    
  - Method: `healthCheck(): Promise<boolean>`
    
    检查连接池健康状态
    

### Class: `MockDatabaseManager`

模拟数据库管理器


  - Method: `createConnectionPool(config: DatabaseConfig): Promise<IConnectionPool>`
    
    创建连接池（需要子类实现）
    
  - Method: `getDatabaseInfo(): Promise<{ type: DatabaseType; version: string; name: string }>`
    
    获取数据库信息（需要子类实现）
    

### Function: `registerMockDrivers(): void`

注册模拟驱动（用于测试）


### Function: `clearAllDrivers(): void`

清除所有注册的驱动（用于测试）


### Function: `createTestDatabaseConfig(type: DatabaseType): DatabaseConfig`

创建测试数据库配置


### Function: `isTestEnvironment(): boolean`

检查是否在测试环境中


### Function: `autoRegisterMockDriversInTest(): void`

自动注册模拟驱动（仅在测试环境中）



**Tags**: test, async, class, function, export


## Usage Examples

```typescript
// Test: should setup test environment
expect(process.env.NODE_ENV).toBe('test');
```
