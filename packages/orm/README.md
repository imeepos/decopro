# @decopro/orm

[![npm version](https://badge.fury.io/js/%40decopro%2Form.svg)](https://badge.fury.io/js/%40decopro%2Form)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

DecoPro 框架的对象关系映射（ORM）模块，提供类型安全的数据库操作和实体管理功能。

## 🚀 特性

- 🏗️ **装饰器驱动**: 使用装饰器定义实体、列和关系
- 🔧 **类型安全**: 完整的 TypeScript 支持和类型推断
- 📦 **查询构建器**: 流畅的链式查询 API
- 🛡️ **仓储模式**: 标准化的数据访问层
- 🔄 **关系映射**: 支持一对一、一对多、多对一、多对多关系
- ⚡ **高性能**: 优化的查询生成和执行
- 🎯 **生命周期钩子**: 实体生命周期事件处理
- 📊 **数据验证**: 集成 Zod 验证支持
- 🔍 **索引支持**: 自动索引和唯一约束管理

## 📦 安装

```bash
npm install @decopro/orm @decopro/core reflect-metadata zod
# 或
pnpm add @decopro/orm @decopro/core reflect-metadata zod
# 或
yarn add @decopro/orm @decopro/core reflect-metadata zod
```

> **注意**: `reflect-metadata` 是必需的依赖，用于装饰器元数据支持。

## 🎯 快速开始

### 定义实体

```typescript
import "reflect-metadata";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    Index,
    Unique,
    ColumnType,
    BeforeInsert
} from "@decopro/orm";

@Entity({ tableName: "users", comment: "用户表" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: ColumnType.VARCHAR, length: 100, nullable: false })
    @Unique()
    @Index()
    username: string;

    @Column({ type: ColumnType.VARCHAR, length: 255, nullable: false })
    email: string;

    @Column({ type: ColumnType.INT, default: 18 })
    age: number;

    @Column({ type: ColumnType.BOOLEAN, default: true })
    isActive: boolean;

    @Column({ type: ColumnType.DATETIME, default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @OneToMany(() => Post, { mappedBy: "author" })
    posts: Post[];

    @BeforeInsert()
    generateTimestamps() {
        this.createdAt = new Date();
    }
}

@Entity({ tableName: "posts" })
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: ColumnType.VARCHAR, length: 255, nullable: false })
    title: string;

    @Column({ type: ColumnType.TEXT })
    content: string;

    @ManyToOne(() => User, { joinColumn: "author_id" })
    author: User;
}
```

### 使用查询构建器

```typescript
import { createQueryBuilder, QueryOperator } from "@decopro/orm";

// 基础查询
const users = createQueryBuilder(User)
    .select("id", "username", "email")
    .whereEqual("isActive", true)
    .orderByDesc("createdAt")
    .limit(10)
    .toSQL();

// 复杂查询
const posts = createQueryBuilder(Post)
    .selectAll()
    .leftJoin("users", "user.id = post.author_id", "author")
    .whereEqual("post.status", "published")
    .whereLike("post.title", "%技术%")
    .whereNotNull("post.publishedAt")
    .orderByDesc("post.publishedAt")
    .paginate(1, 20)
    .toSQL();

// 聚合查询
const stats = createQueryBuilder(User)
    .select("COUNT(*) as total", "department_id")
    .whereEqual("isActive", true)
    .groupBy("department_id")
    .having("COUNT(*)", QueryOperator.GREATER_THAN, 5)
    .orderByDesc("total")
    .toSQL();
```

### 使用仓储模式

```typescript
import { createRepository } from "@decopro/orm";

class UserRepository extends createRepository(User) {
    async findByUsername(username: string): Promise<User | null> {
        return this.findOne({
            where: { username },
            relations: ["posts"]
        });
    }

    async findActiveUsers(): Promise<User[]> {
        return this.find({
            where: { isActive: true },
            order: { createdAt: "DESC" }
        });
    }

    async findUsersWithPagination(page: number, pageSize: number) {
        return this.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { createdAt: "DESC" }
        });
    }

    async getUserStats() {
        return this.aggregate({
            count: true,
            avg: "age",
            where: { isActive: true }
        });
    }
}

// 使用仓储
const userRepo = new UserRepository();
const user = await userRepo.findByUsername("john_doe");
const activeUsers = await userRepo.findActiveUsers();
const paginatedUsers = await userRepo.findUsersWithPagination(1, 20);
```

## 📚 API 参考

### 装饰器

#### 实体装饰器

- `@Entity(options?)` - 标记实体类
- `@Column(options?)` - 标记普通列
- `@PrimaryColumn(options?)` - 标记主键列
- `@PrimaryGeneratedColumn(options?)` - 标记自增主键列

#### 关系装饰器

- `@OneToOne(target, options?)` - 一对一关系
- `@OneToMany(target, options?)` - 一对多关系
- `@ManyToOne(target, options?)` - 多对一关系
- `@ManyToMany(target, options?)` - 多对多关系

#### 索引装饰器

- `@Index(options?)` - 创建索引
- `@Unique(options?)` - 创建唯一约束

#### 生命周期装饰器

- `@BeforeInsert()` - 插入前钩子
- `@AfterInsert()` - 插入后钩子
- `@BeforeUpdate()` - 更新前钩子
- `@AfterUpdate()` - 更新后钩子
- `@BeforeRemove()` - 删除前钩子
- `@AfterRemove()` - 删除后钩子
- `@AfterLoad()` - 加载后钩子

### 查询构建器

```typescript
const qb = createQueryBuilder(Entity)
    .select(...fields)           // 选择字段
    .from(table, alias?)         // 设置表名
    .where(field, op, value)     // WHERE 条件
    .whereEqual(field, value)    // WHERE 等于
    .whereLike(field, pattern)   // WHERE LIKE
    .whereIn(field, values)      // WHERE IN
    .whereNull(field)            // WHERE IS NULL
    .whereBetween(field, min, max) // WHERE BETWEEN
    .join(table, on, type?, alias?) // JOIN
    .leftJoin(table, on, alias?) // LEFT JOIN
    .orderBy(field, direction?)  // ORDER BY
    .groupBy(...fields)          // GROUP BY
    .having(field, op, value)    // HAVING
    .limit(count)                // LIMIT
    .offset(count)               // OFFSET
    .paginate(page, pageSize)    // 分页
    .distinct()                  // DISTINCT
    .toSQL()                     // 生成 SQL
    .clone()                     // 克隆查询构建器
```

### 仓储接口

```typescript
interface IRepository<T, ID> {
    save(entity: Partial<T>, options?: SaveOptions): Promise<T>;
    saveMany(entities: Partial<T>[], options?: SaveOptions): Promise<T[]>;
    findById(id: ID, options?: FindOneOptions<T>): Promise<T | null>;
    findOne(options?: FindOneOptions<T>): Promise<T | null>;
    find(options?: FindOptions<T>): Promise<T[]>;
    findAndCount(options?: FindOptions<T>): Promise<PaginationResult<T>>;
    count(options?: FindOptions<T>): Promise<number>;
    exists(options?: FindOneOptions<T>): Promise<boolean>;
    update(id: ID, updateData: Partial<T>, options?: SaveOptions): Promise<T | null>;
    updateMany(where: Partial<T>, updateData: Partial<T>, options?: SaveOptions): Promise<number>;
    delete(id: ID, options?: DeleteOptions): Promise<boolean>;
    deleteMany(where: Partial<T>, options?: DeleteOptions): Promise<number>;
    softDelete(id: ID): Promise<boolean>;
    restore(id: ID): Promise<boolean>;
    createQueryBuilder(alias?: string): QueryBuilder<T>;
    query(sql: string, parameters?: any[]): Promise<any>;
    aggregate(options: AggregateOptions): Promise<AggregateResult>;
}
```

## 🔧 配置

### 数据库配置

```typescript
import { DatabaseConfig, DatabaseType } from "@decopro/orm";

const config: DatabaseConfig = {
    type: DatabaseType.MYSQL,
    host: "localhost",
    port: 3306,
    database: "myapp",
    username: "user",
    password: "password",
    pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 30000,
        idleTimeoutMillis: 30000
    },
    logging: true,
    synchronize: false,
    migrationsRun: true,
    migrations: ["src/migrations/*.ts"],
    entities: [User, Post]
};
```

## 🧪 测试

```bash
# 运行测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch
```

## 📈 性能优化

### 查询优化

- 使用索引优化查询性能
- 合理使用 JOIN 和子查询
- 避免 N+1 查询问题
- 使用分页减少数据传输

### 连接池配置

- 根据应用负载调整连接池大小
- 设置合适的超时时间
- 监控连接池使用情况

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

ISC License
