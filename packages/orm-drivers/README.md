# @decopro/orm-drivers

数据库驱动包，为 [@decopro/orm](../orm) 提供具体的数据库实现。

## 特性

- 🗄️ **多数据库支持**: SQLite、MySQL、PostgreSQL 等
- 🔌 **插件化架构**: 按需加载数据库驱动
- 🏊 **连接池管理**: 高效的数据库连接管理
- 🔄 **事务支持**: 完整的事务管理和回滚机制
- 🧪 **测试友好**: 内置测试工具和模拟支持
- ⚡ **高性能**: 优化的查询执行和连接复用

## 安装

```bash
npm install @decopro/orm-drivers
# 或
yarn add @decopro/orm-drivers
# 或
pnpm add @decopro/orm-drivers
```

### 数据库依赖

根据您使用的数据库类型，还需要安装相应的驱动：

```bash
# SQLite
npm install sqlite3

# MySQL
npm install mysql2

# PostgreSQL
npm install pg @types/pg
```

## 快速开始

### 1. 注册驱动

```typescript
import { registerAllDrivers } from "@decopro/orm-drivers";
import { createORM, DatabaseType } from "@decopro/orm";

// 注册所有可用的驱动
registerAllDrivers();

// 或者只注册需要的驱动
import { registerSQLiteDriver, registerMySQLDriver } from "@decopro/orm-drivers";
registerSQLiteDriver();
registerMySQLDriver();
```

### 2. 使用 SQLite

```typescript
import { createORM, DatabaseType } from "@decopro/orm";
import { registerSQLiteDriver } from "@decopro/orm-drivers";

// 注册 SQLite 驱动
registerSQLiteDriver();

// 创建 ORM 实例
const orm = await createORM({
    database: {
        type: DatabaseType.SQLITE,
        database: "./app.db"
    },
    entities: [User, Post],
    synchronize: true,
    logging: true
});
```

### 3. 使用 MySQL

```typescript
import { createORM, DatabaseType } from "@decopro/orm";
import { registerMySQLDriver } from "@decopro/orm-drivers";

// 注册 MySQL 驱动
registerMySQLDriver();

// 创建 ORM 实例
const orm = await createORM({
    database: {
        type: DatabaseType.MYSQL,
        host: "localhost",
        port: 3306,
        username: "root",
        password: "password",
        database: "myapp",
        pool: {
            min: 2,
            max: 10
        }
    },
    entities: [User, Post],
    synchronize: true,
    logging: true
});
```

### 4. 使用连接字符串

```typescript
import { createORM } from "@decopro/orm";
import { registerAllDrivers } from "@decopro/orm-drivers";

registerAllDrivers();

// SQLite
const sqliteORM = await createORM({
    database: "sqlite://./app.db",
    entities: [User, Post]
});

// MySQL
const mysqlORM = await createORM({
    database: "mysql://user:password@localhost:3306/myapp",
    entities: [User, Post]
});
```

## API 参考

### 驱动注册函数

#### `registerAllDrivers()`
注册所有可用的数据库驱动。

#### `registerSQLiteDriver()`
注册 SQLite 驱动。

#### `registerMySQLDriver()`
注册 MySQL 驱动。

#### `registerPostgreSQLDriver()`
注册 PostgreSQL 驱动（占位符）。

### 工具函数

#### `isDriverAvailable(type: DatabaseType): boolean`
检查指定的数据库驱动是否可用。

```typescript
import { isDriverAvailable, DatabaseType } from "@decopro/orm-drivers";

if (isDriverAvailable(DatabaseType.SQLITE)) {
    console.log("SQLite driver is available");
}
```

#### `getAvailableDrivers(): DatabaseType[]`
获取所有可用的数据库驱动类型。

```typescript
import { getAvailableDrivers } from "@decopro/orm-drivers";

const drivers = getAvailableDrivers();
console.log("Available drivers:", drivers);
```

#### `createDatabaseManager(type: DatabaseType): Promise<IDatabaseManager>`
创建指定类型的数据库管理器。

```typescript
import { createDatabaseManager, DatabaseType } from "@decopro/orm-drivers";

const manager = await createDatabaseManager(DatabaseType.SQLITE);
await manager.initialize({
    type: DatabaseType.SQLITE,
    database: "./test.db"
});
```

## 配置选项

### SQLite 配置

```typescript
{
    type: DatabaseType.SQLITE,
    database: "./app.db",  // 数据库文件路径
    logging: true,
    pool: {
        max: 1  // SQLite 通常使用单连接
    }
}
```

### MySQL 配置

```typescript
{
    type: DatabaseType.MYSQL,
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "myapp",
    logging: true,
    pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 60000,
        idleTimeoutMillis: 60000
    },
    ssl: {
        // SSL 配置
    }
}
```

## 错误处理

```typescript
import { registerSQLiteDriver, isDriverAvailable } from "@decopro/orm-drivers";

try {
    registerSQLiteDriver();
    
    if (!isDriverAvailable(DatabaseType.SQLITE)) {
        throw new Error("SQLite driver not available");
    }
    
    const orm = await createORM({
        database: "sqlite://./app.db",
        entities: [User]
    });
    
} catch (error) {
    if (error.message.includes("sqlite3 package is required")) {
        console.error("Please install sqlite3: npm install sqlite3");
    } else {
        console.error("Database error:", error);
    }
}
```

## 测试

```typescript
import { registerAllDrivers } from "@decopro/orm-drivers";
import { createTestORM } from "@decopro/orm";

describe("Database Tests", () => {
    beforeAll(() => {
        registerAllDrivers();
    });

    it("should work with SQLite", async () => {
        const orm = await createTestORM([User]);
        // 测试代码...
        await orm.close();
    });
});
```

## 开发自定义驱动

```typescript
import { 
    BaseDatabaseManager, 
    DatabaseDriverRegistry,
    DatabaseType 
} from "@decopro/orm";

class CustomDatabaseManager extends BaseDatabaseManager {
    protected async createConnectionPool(config: DatabaseConfig) {
        // 实现连接池创建逻辑
    }

    async getDatabaseInfo() {
        // 实现数据库信息获取逻辑
    }
}

// 注册自定义驱动
DatabaseDriverRegistry.register("custom" as DatabaseType, async () => {
    return new CustomDatabaseManager();
});
```

## 许可证

MIT License
