import {
    createClassDecorator,
    createPropertyDecorator,
    createMethodDecorator,
    BaseDecoratorOptions,
    BasePropertyOptions,
    ClassMetadata,
    PropertyMetadata,
    MethodMetadata,
    InjectionToken
} from "@decopro/core";
import { ZodTypeAny } from "zod";

// ============================================================================
// Core Types and Interfaces - 核心类型和接口
// ============================================================================

/**
 * 数据库列类型枚举
 */
export enum ColumnType {
    // 数字类型
    INT = "int",
    BIGINT = "bigint",
    FLOAT = "float",
    DOUBLE = "double",
    DECIMAL = "decimal",

    // 字符串类型
    VARCHAR = "varchar",
    TEXT = "text",
    CHAR = "char",

    // 日期时间类型
    DATE = "date",
    TIME = "time",
    DATETIME = "datetime",
    TIMESTAMP = "timestamp",

    // 布尔类型
    BOOLEAN = "boolean",

    // JSON 类型
    JSON = "json",
    JSONB = "jsonb",

    // 二进制类型
    BLOB = "blob",
    BINARY = "binary"
}

/**
 * 关系类型枚举
 */
export enum RelationType {
    ONE_TO_ONE = "one-to-one",
    ONE_TO_MANY = "one-to-many",
    MANY_TO_ONE = "many-to-one",
    MANY_TO_MANY = "many-to-many"
}

/**
 * 索引类型枚举
 */
export enum IndexType {
    PRIMARY = "primary",
    UNIQUE = "unique",
    INDEX = "index",
    FULLTEXT = "fulltext",
    SPATIAL = "spatial"
}

/**
 * 级联操作类型
 */
export enum CascadeType {
    PERSIST = "persist",
    REMOVE = "remove",
    UPDATE = "update",
    REFRESH = "refresh",
    ALL = "all"
}

/**
 * 获取策略
 */
export enum FetchType {
    LAZY = "lazy",
    EAGER = "eager"
}

// ============================================================================
// Entity Decorator Options - 实体装饰器选项
// ============================================================================

/**
 * 实体装饰器选项
 */
export interface EntityOptions extends BaseDecoratorOptions {
    /** 表名，如果不指定则使用类名 */
    tableName?: string;
    /** 数据库模式名 */
    schema?: string;
    /** 是否为抽象实体（不创建表） */
    abstract?: boolean;
    /** 表注释 */
    comment?: string;
    /** 表引擎（MySQL） */
    engine?: string;
    /** 字符集 */
    charset?: string;
    /** 排序规则 */
    collation?: string;
}

/**
 * Entity 装饰器的注入令牌
 */
export const ENTITY_TOKEN = Symbol.for("ENTITY_TOKEN") as InjectionToken<
    ClassMetadata<EntityOptions>
>;

/**
 * Entity 装饰器 - 用于标记数据库实体类
 *
 * @example
 * ```typescript
 * @Entity()
 * export class User {
 *   @PrimaryGeneratedColumn()
 *   id: number;
 *
 *   @Column()
 *   name: string;
 * }
 *
 * @Entity({ tableName: "users", schema: "public" })
 * export class User {
 *   // ...
 * }
 * ```
 */
export const Entity = createClassDecorator(ENTITY_TOKEN);

// ============================================================================
// Column Decorator Options - 列装饰器选项
// ============================================================================

/**
 * 基础列选项
 */
export interface BaseColumnOptions {
    /** 列名，如果不指定则使用属性名 */
    name?: string;
    /** 列类型 */
    type?: ColumnType | string;
    /** 列长度 */
    length?: number;
    /** 精度（用于 decimal 类型） */
    precision?: number;
    /** 小数位数（用于 decimal 类型） */
    scale?: number;
    /** 是否可为空 */
    nullable?: boolean;
    /** 默认值 */
    default?: any;
    /** 列注释 */
    comment?: string;
    /** 字符集 */
    charset?: string;
    /** 排序规则 */
    collation?: string;
    /** 是否为无符号数（MySQL） */
    unsigned?: boolean;
    /** 是否自动填充零（MySQL） */
    zerofill?: boolean;
    /** 数据验证器 */
    validator?: (value: any) => boolean | string;
    /** Zod 验证模式 */
    zodValidator?: ZodTypeAny;
}

/**
 * 普通列选项
 */
export interface ColumnOptions extends BaseColumnOptions {
    /** 是否为主键 */
    primary?: boolean;
    /** 是否唯一 */
    unique?: boolean;
    /** 是否为生成列 */
    generated?: boolean | "increment" | "uuid" | "rowid";
    /** 生成策略 */
    generationStrategy?: "increment" | "uuid" | "rowid";
    /** 是否为选择列（查询时是否默认选择） */
    select?: boolean;
    /** 是否为插入列（插入时是否包含） */
    insert?: boolean;
    /** 是否为更新列（更新时是否包含） */
    update?: boolean;
    /** 枚举值（用于 enum 类型） */
    enum?: string[] | Record<string, string | number>;
    /** 数组类型（PostgreSQL） */
    array?: boolean;
}

/**
 * Column 装饰器的注入令牌
 */
export const COLUMN_TOKEN = Symbol.for("COLUMN_TOKEN") as InjectionToken<
    PropertyMetadata<ColumnOptions>
>;

/**
 * Column 装饰器 - 用于标记数据库列
 *
 * @example
 * ```typescript
 * export class User {
 *   @Column()
 *   name: string;
 *
 *   @Column({ type: ColumnType.VARCHAR, length: 100, nullable: false })
 *   email: string;
 *
 *   @Column({ type: ColumnType.INT, default: 0 })
 *   age: number;
 * }
 * ```
 */
export const Column = createPropertyDecorator(COLUMN_TOKEN);

/**
 * 主键列选项
 */
export interface PrimaryColumnOptions extends Omit<BaseColumnOptions, 'nullable'> {
    /** 生成策略 */
    generated?: boolean | "increment" | "uuid" | "rowid";
}

/**
 * PrimaryColumn 装饰器的注入令牌
 */
export const PRIMARY_COLUMN_TOKEN = Symbol.for("PRIMARY_COLUMN_TOKEN") as InjectionToken<
    PropertyMetadata<PrimaryColumnOptions>
>;

/**
 * PrimaryColumn 装饰器 - 用于标记主键列
 *
 * @example
 * ```typescript
 * export class User {
 *   @PrimaryColumn()
 *   id: number;
 *
 *   @PrimaryColumn({ type: ColumnType.VARCHAR, length: 36 })
 *   uuid: string;
 * }
 * ```
 */
export const PrimaryColumn = createPropertyDecorator(PRIMARY_COLUMN_TOKEN);

/**
 * 自增主键列选项
 */
export interface PrimaryGeneratedColumnOptions extends Omit<BaseColumnOptions, 'nullable' | 'default'> {
    /** 生成策略 */
    strategy?: "increment" | "uuid" | "rowid";
}

/**
 * PrimaryGeneratedColumn 装饰器的注入令牌
 */
export const PRIMARY_GENERATED_COLUMN_TOKEN = Symbol.for("PRIMARY_GENERATED_COLUMN_TOKEN") as InjectionToken<
    PropertyMetadata<PrimaryGeneratedColumnOptions>
>;

/**
 * PrimaryGeneratedColumn 装饰器 - 用于标记自增主键列
 *
 * @example
 * ```typescript
 * export class User {
 *   @PrimaryGeneratedColumn()
 *   id: number;
 *
 *   @PrimaryGeneratedColumn({ strategy: "uuid" })
 *   uuid: string;
 * }
 * ```
 */
export const PrimaryGeneratedColumn = createPropertyDecorator(PRIMARY_GENERATED_COLUMN_TOKEN);

// ============================================================================
// Relationship Decorator Options - 关系装饰器选项
// ============================================================================

/**
 * 基础关系选项
 */
export interface BaseRelationOptions extends BasePropertyOptions {
    /** 目标实体类型 */
    type?: () => Function;
    /** 获取策略 */
    eager?: boolean;
    /** 级联操作 */
    cascade?: CascadeType[] | boolean;
    /** 关系是否可为空 */
    nullable?: boolean;
    /** 当目标实体被删除时的行为 */
    onDelete?: "RESTRICT" | "CASCADE" | "SET NULL" | "NO ACTION" | "SET DEFAULT";
    /** 当目标实体被更新时的行为 */
    onUpdate?: "RESTRICT" | "CASCADE" | "SET NULL" | "NO ACTION" | "SET DEFAULT";
}

/**
 * 一对一关系选项
 */
export interface OneToOneOptions extends BaseRelationOptions {
    /** 外键列名 */
    joinColumn?: string;
    /** 是否为关系的拥有方 */
    owner?: boolean;
    /** 反向关系的属性名 */
    inverseSide?: string;
}

/**
 * OneToOne 装饰器的注入令牌
 */
export const ONE_TO_ONE_TOKEN = Symbol.for("ONE_TO_ONE_TOKEN") as InjectionToken<
    PropertyMetadata<OneToOneOptions>
>;

/**
 * OneToOne 装饰器 - 用于标记一对一关系
 *
 * @example
 * ```typescript
 * export class User {
 *   @OneToOne(() => Profile, { cascade: true })
 *   profile: Profile;
 * }
 *
 * export class Profile {
 *   @OneToOne(() => User, { inverseSide: "profile" })
 *   user: User;
 * }
 * ```
 */
export function OneToOne(): PropertyDecorator;
export function OneToOne(type: () => Function, options?: Omit<OneToOneOptions, 'type'>): PropertyDecorator;
export function OneToOne(options: OneToOneOptions): PropertyDecorator;
export function OneToOne(
    typeOrOptions?: (() => Function) | OneToOneOptions,
    options?: Omit<OneToOneOptions, 'type'>
): PropertyDecorator {
    const decorator = createPropertyDecorator(ONE_TO_ONE_TOKEN);

    if (typeof typeOrOptions === 'function') {
        // @OneToOne(() => Entity, { options })
        return decorator({ type: typeOrOptions, ...options });
    } else if (typeOrOptions) {
        // @OneToOne({ type: () => Entity, options })
        return decorator(typeOrOptions);
    } else {
        // @OneToOne()
        return decorator({});
    }
}

/**
 * 一对多关系选项
 */
export interface OneToManyOptions extends BaseRelationOptions {
    /** 反向关系的属性名 */
    mappedBy?: string;
}

/**
 * OneToMany 装饰器的注入令牌
 */
export const ONE_TO_MANY_TOKEN = Symbol.for("ONE_TO_MANY_TOKEN") as InjectionToken<
    PropertyMetadata<OneToManyOptions>
>;

/**
 * OneToMany 装饰器 - 用于标记一对多关系
 *
 * @example
 * ```typescript
 * export class User {
 *   @OneToMany(() => Post, { mappedBy: "author" })
 *   posts: Post[];
 * }
 * ```
 */
export function OneToMany(): PropertyDecorator;
export function OneToMany(type: () => Function, options?: Omit<OneToManyOptions, 'type'>): PropertyDecorator;
export function OneToMany(options: OneToManyOptions): PropertyDecorator;
export function OneToMany(
    typeOrOptions?: (() => Function) | OneToManyOptions,
    options?: Omit<OneToManyOptions, 'type'>
): PropertyDecorator {
    const decorator = createPropertyDecorator(ONE_TO_MANY_TOKEN);

    if (typeof typeOrOptions === 'function') {
        // @OneToMany(() => Entity, { options })
        return decorator({ type: typeOrOptions, ...options });
    } else if (typeOrOptions) {
        // @OneToMany({ type: () => Entity, options })
        return decorator(typeOrOptions);
    } else {
        // @OneToMany()
        return decorator({});
    }
}

/**
 * 多对一关系选项
 */
export interface ManyToOneOptions extends BaseRelationOptions {
    /** 外键列名 */
    joinColumn?: string;
}

/**
 * ManyToOne 装饰器的注入令牌
 */
export const MANY_TO_ONE_TOKEN = Symbol.for("MANY_TO_ONE_TOKEN") as InjectionToken<
    PropertyMetadata<ManyToOneOptions>
>;

/**
 * ManyToOne 装饰器 - 用于标记多对一关系
 *
 * @example
 * ```typescript
 * export class Post {
 *   @ManyToOne(() => User, { joinColumn: "author_id" })
 *   author: User;
 * }
 * ```
 */
export function ManyToOne(): PropertyDecorator;
export function ManyToOne(type: () => Function, options?: Omit<ManyToOneOptions, 'type'>): PropertyDecorator;
export function ManyToOne(options: ManyToOneOptions): PropertyDecorator;
export function ManyToOne(
    typeOrOptions?: (() => Function) | ManyToOneOptions,
    options?: Omit<ManyToOneOptions, 'type'>
): PropertyDecorator {
    const decorator = createPropertyDecorator(MANY_TO_ONE_TOKEN);

    if (typeof typeOrOptions === 'function') {
        // @ManyToOne(() => Entity, { options })
        return decorator({ type: typeOrOptions, ...options });
    } else if (typeOrOptions) {
        // @ManyToOne({ type: () => Entity, options })
        return decorator(typeOrOptions);
    } else {
        // @ManyToOne()
        return decorator({});
    }
}

/**
 * 多对多关系选项
 */
export interface ManyToManyOptions extends BaseRelationOptions {
    /** 中间表名 */
    joinTable?: string;
    /** 当前实体的外键列名 */
    joinColumn?: string;
    /** 目标实体的外键列名 */
    inverseJoinColumn?: string;
    /** 反向关系的属性名 */
    mappedBy?: string;
}

/**
 * ManyToMany 装饰器的注入令牌
 */
export const MANY_TO_MANY_TOKEN = Symbol.for("MANY_TO_MANY_TOKEN") as InjectionToken<
    PropertyMetadata<ManyToManyOptions>
>;

/**
 * ManyToMany 装饰器 - 用于标记多对多关系
 *
 * @example
 * ```typescript
 * export class User {
 *   @ManyToMany(() => Role, { joinTable: "user_roles" })
 *   roles: Role[];
 * }
 *
 * export class Role {
 *   @ManyToMany(() => User, { mappedBy: "roles" })
 *   users: User[];
 * }
 * ```
 */
export function ManyToMany(): PropertyDecorator;
export function ManyToMany(type: () => Function, options?: Omit<ManyToManyOptions, 'type'>): PropertyDecorator;
export function ManyToMany(options: ManyToManyOptions): PropertyDecorator;
export function ManyToMany(
    typeOrOptions?: (() => Function) | ManyToManyOptions,
    options?: Omit<ManyToManyOptions, 'type'>
): PropertyDecorator {
    const decorator = createPropertyDecorator(MANY_TO_MANY_TOKEN);

    if (typeof typeOrOptions === 'function') {
        // @ManyToMany(() => Entity, { options })
        return decorator({ type: typeOrOptions, ...options });
    } else if (typeOrOptions) {
        // @ManyToMany({ type: () => Entity, options })
        return decorator(typeOrOptions);
    } else {
        // @ManyToMany()
        return decorator({});
    }
}

// ============================================================================
// Index Decorator Options - 索引装饰器选项
// ============================================================================

/**
 * 索引选项
 */
export interface IndexOptions extends BasePropertyOptions {
    /** 索引名称 */
    name?: string;
    /** 索引类型 */
    type?: IndexType;
    /** 是否唯一索引 */
    unique?: boolean;
    /** 索引列（用于复合索引） */
    columns?: string[];
    /** 索引条件（部分索引） */
    where?: string;
    /** 索引方法（PostgreSQL） */
    using?: "btree" | "hash" | "gist" | "gin" | "spgist" | "brin";
}

/**
 * Index 装饰器的注入令牌
 */
export const INDEX_TOKEN = Symbol.for("INDEX_TOKEN") as InjectionToken<
    PropertyMetadata<IndexOptions>
>;

/**
 * Index 装饰器 - 用于标记索引
 *
 * @example
 * ```typescript
 * export class User {
 *   @Index()
 *   @Column()
 *   email: string;
 *
 *   @Index({ unique: true, name: "idx_user_username" })
 *   @Column()
 *   username: string;
 * }
 * ```
 */
export const Index = createPropertyDecorator(INDEX_TOKEN);

/**
 * 唯一索引选项
 */
export interface UniqueOptions extends BasePropertyOptions {
    /** 约束名称 */
    name?: string;
    /** 约束列（用于复合唯一约束） */
    columns?: string[];
}

/**
 * Unique 装饰器的注入令牌
 */
export const UNIQUE_TOKEN = Symbol.for("UNIQUE_TOKEN") as InjectionToken<
    PropertyMetadata<UniqueOptions>
>;

/**
 * Unique 装饰器 - 用于标记唯一约束
 *
 * @example
 * ```typescript
 * export class User {
 *   @Unique()
 *   @Column()
 *   email: string;
 *
 *   @Unique({ name: "uq_user_phone" })
 *   @Column()
 *   phone: string;
 * }
 * ```
 */
export const Unique = createPropertyDecorator(UNIQUE_TOKEN);

// ============================================================================
// Lifecycle Decorator Options - 生命周期装饰器选项
// ============================================================================

/**
 * 生命周期钩子选项
 */
export interface LifecycleOptions {
    /** 是否异步执行 */
    async?: boolean;
    /** 执行顺序 */
    order?: number;
}

/**
 * BeforeInsert 装饰器的注入令牌
 */
export const BEFORE_INSERT_TOKEN = Symbol.for("BEFORE_INSERT_TOKEN") as InjectionToken<
    MethodMetadata<LifecycleOptions>
>;

/**
 * BeforeInsert 装饰器 - 用于标记插入前钩子
 *
 * @example
 * ```typescript
 * export class User {
 *   @BeforeInsert()
 *   generateId() {
 *     if (!this.id) {
 *       this.id = Math.random().toString(36);
 *     }
 *   }
 * }
 * ```
 */
export const BeforeInsert = createMethodDecorator(BEFORE_INSERT_TOKEN);

/**
 * AfterInsert 装饰器的注入令牌
 */
export const AFTER_INSERT_TOKEN = Symbol.for("AFTER_INSERT_TOKEN") as InjectionToken<
    MethodMetadata<LifecycleOptions>
>;

/**
 * AfterInsert 装饰器 - 用于标记插入后钩子
 */
export const AfterInsert = createMethodDecorator(AFTER_INSERT_TOKEN);

/**
 * BeforeUpdate 装饰器的注入令牌
 */
export const BEFORE_UPDATE_TOKEN = Symbol.for("BEFORE_UPDATE_TOKEN") as InjectionToken<
    MethodMetadata<LifecycleOptions>
>;

/**
 * BeforeUpdate 装饰器 - 用于标记更新前钩子
 */
export const BeforeUpdate = createMethodDecorator(BEFORE_UPDATE_TOKEN);

/**
 * AfterUpdate 装饰器的注入令牌
 */
export const AFTER_UPDATE_TOKEN = Symbol.for("AFTER_UPDATE_TOKEN") as InjectionToken<
    MethodMetadata<LifecycleOptions>
>;

/**
 * AfterUpdate 装饰器 - 用于标记更新后钩子
 */
export const AfterUpdate = createMethodDecorator(AFTER_UPDATE_TOKEN);

/**
 * BeforeRemove 装饰器的注入令牌
 */
export const BEFORE_REMOVE_TOKEN = Symbol.for("BEFORE_REMOVE_TOKEN") as InjectionToken<
    MethodMetadata<LifecycleOptions>
>;

/**
 * BeforeRemove 装饰器 - 用于标记删除前钩子
 */
export const BeforeRemove = createMethodDecorator(BEFORE_REMOVE_TOKEN);

/**
 * AfterRemove 装饰器的注入令牌
 */
export const AFTER_REMOVE_TOKEN = Symbol.for("AFTER_REMOVE_TOKEN") as InjectionToken<
    MethodMetadata<LifecycleOptions>
>;

/**
 * AfterRemove 装饰器 - 用于标记删除后钩子
 */
export const AfterRemove = createMethodDecorator(AFTER_REMOVE_TOKEN);

/**
 * AfterLoad 装饰器的注入令牌
 */
export const AFTER_LOAD_TOKEN = Symbol.for("AFTER_LOAD_TOKEN") as InjectionToken<
    MethodMetadata<LifecycleOptions>
>;

/**
 * AfterLoad 装饰器 - 用于标记加载后钩子
 */
export const AfterLoad = createMethodDecorator(AFTER_LOAD_TOKEN);

// ============================================================================
// Re-exports - 重新导出
// ============================================================================

// 查询构建器
export * from "./query-builder";

// 仓储模式
export * from "./repository";

// 数据库管理
export * from "./database";

// ORM 管理器
export * from "./orm-manager";

// ============================================================================
// Utility Functions - 工具函数
// ============================================================================

/**
 * 检查给定的令牌是否为实体装饰器令牌
 */
export function isEntityToken(token: InjectionToken<any>): boolean {
    return token === ENTITY_TOKEN;
}

/**
 * 检查给定的令牌是否为列装饰器令牌
 */
export function isColumnToken(token: InjectionToken<any>): boolean {
    return [
        COLUMN_TOKEN,
        PRIMARY_COLUMN_TOKEN,
        PRIMARY_GENERATED_COLUMN_TOKEN
    ].includes(token as any);
}

/**
 * 检查给定的令牌是否为关系装饰器令牌
 */
export function isRelationToken(token: InjectionToken<any>): boolean {
    return [
        ONE_TO_ONE_TOKEN,
        ONE_TO_MANY_TOKEN,
        MANY_TO_ONE_TOKEN,
        MANY_TO_MANY_TOKEN
    ].includes(token as any);
}

/**
 * 检查给定的令牌是否为索引装饰器令牌
 */
export function isIndexToken(token: InjectionToken<any>): boolean {
    return [
        INDEX_TOKEN,
        UNIQUE_TOKEN
    ].includes(token as any);
}

/**
 * 检查给定的令牌是否为生命周期装饰器令牌
 */
export function isLifecycleToken(token: InjectionToken<any>): boolean {
    return [
        BEFORE_INSERT_TOKEN,
        AFTER_INSERT_TOKEN,
        BEFORE_UPDATE_TOKEN,
        AFTER_UPDATE_TOKEN,
        BEFORE_REMOVE_TOKEN,
        AFTER_REMOVE_TOKEN,
        AFTER_LOAD_TOKEN
    ].includes(token as any);
}

/**
 * 所有装饰器令牌的集合
 */
export const ORM_TOKENS = {
    // 实体
    ENTITY: ENTITY_TOKEN,

    // 列
    COLUMN: COLUMN_TOKEN,
    PRIMARY_COLUMN: PRIMARY_COLUMN_TOKEN,
    PRIMARY_GENERATED_COLUMN: PRIMARY_GENERATED_COLUMN_TOKEN,

    // 关系
    ONE_TO_ONE: ONE_TO_ONE_TOKEN,
    ONE_TO_MANY: ONE_TO_MANY_TOKEN,
    MANY_TO_ONE: MANY_TO_ONE_TOKEN,
    MANY_TO_MANY: MANY_TO_MANY_TOKEN,

    // 索引
    INDEX: INDEX_TOKEN,
    UNIQUE: UNIQUE_TOKEN,

    // 生命周期
    BEFORE_INSERT: BEFORE_INSERT_TOKEN,
    AFTER_INSERT: AFTER_INSERT_TOKEN,
    BEFORE_UPDATE: BEFORE_UPDATE_TOKEN,
    AFTER_UPDATE: AFTER_UPDATE_TOKEN,
    BEFORE_REMOVE: BEFORE_REMOVE_TOKEN,
    AFTER_REMOVE: AFTER_REMOVE_TOKEN,
    AFTER_LOAD: AFTER_LOAD_TOKEN
} as const;

/**
 * 创建实体类的工厂函数
 */
export function createEntity<T>(
    entityClass: new () => T,
    options?: EntityOptions
): new () => T {
    if (options) {
        Entity(options)(entityClass);
    } else {
        Entity()(entityClass);
    }
    return entityClass;
}

/**
 * 获取实体的表名
 */
export function getTableName<T>(entityClass: new () => T): string {
    // 这里需要从装饰器元数据中获取表名
    // 暂时返回类名的小写形式
    return entityClass.name.toLowerCase();
}

/**
 * 获取实体的列信息
 */
export function getEntityColumns<T>(entityClass: new () => T): Array<{
    propertyName: string;
    columnName: string;
    type: ColumnType | string;
    options: ColumnOptions;
}> {
    // 这里需要从装饰器元数据中获取列信息
    // 暂时返回空数组
    return [];
}

/**
 * 获取实体的关系信息
 */
export function getEntityRelations<T>(entityClass: new () => T): Array<{
    propertyName: string;
    type: RelationType;
    targetEntity: Function;
    options: BaseRelationOptions;
}> {
    // 这里需要从装饰器元数据中获取关系信息
    // 暂时返回空数组
    return [];
}

// ============================================================================
// Test Utilities - 测试工具（仅在测试环境中使用）
// ============================================================================

export {
    MockConnection,
    MockConnectionPool,
    MockDatabaseManager,
    registerMockDrivers,
    clearAllDrivers,
    createTestDatabaseConfig,
    isTestEnvironment,
    autoRegisterMockDriversInTest
} from "./test-utils";
