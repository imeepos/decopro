import { QueryBuilder, QueryOptions, SortDirection } from "./query-builder";
import { ZodTypeAny } from "zod";

// ============================================================================
// Repository Types - 仓储类型
// ============================================================================

/**
 * 查找选项
 */
export interface FindOptions<T = any> {
    /** 查询条件 */
    where?: Partial<T> | ((qb: QueryBuilder<T>) => QueryBuilder<T>);
    /** 选择字段 */
    select?: (keyof T)[];
    /** 关联查询 */
    relations?: string[];
    /** 排序 */
    order?: { [P in keyof T]?: "ASC" | "DESC" };
    /** 跳过条数 */
    skip?: number;
    /** 限制条数 */
    take?: number;
    /** 缓存 */
    cache?: boolean | number;
}

/**
 * 查找一个选项
 */
export interface FindOneOptions<T = any> extends Omit<FindOptions<T>, "skip" | "take"> {}

/**
 * 保存选项
 */
export interface SaveOptions {
    /** 数据验证 */
    validate?: boolean;
    /** 重新加载保存后的实体 */
    reload?: boolean;
    /** 事务 */
    transaction?: any;
}

/**
 * 删除选项
 */
export interface DeleteOptions {
    /** 软删除 */
    soft?: boolean;
    /** 事务 */
    transaction?: any;
}

/**
 * 分页结果
 */
export interface PaginationResult<T> {
    /** 数据列表 */
    data: T[];
    /** 总数 */
    total: number;
    /** 当前页 */
    page: number;
    /** 每页条数 */
    pageSize: number;
    /** 总页数 */
    totalPages: number;
    /** 是否有下一页 */
    hasNext: boolean;
    /** 是否有上一页 */
    hasPrev: boolean;
}

/**
 * 聚合结果
 */
export interface AggregateResult {
    count?: number;
    sum?: number;
    avg?: number;
    min?: number;
    max?: number;
}

// ============================================================================
// Repository Interface - 仓储接口
// ============================================================================

/**
 * 基础仓储接口
 */
export interface IRepository<T, ID = any> {
    /**
     * 保存实体
     */
    save(entity: Partial<T>, options?: SaveOptions): Promise<T>;

    /**
     * 批量保存实体
     */
    saveMany(entities: Partial<T>[], options?: SaveOptions): Promise<T[]>;

    /**
     * 根据 ID 查找实体
     */
    findById(id: ID, options?: FindOneOptions<T>): Promise<T | null>;

    /**
     * 查找一个实体
     */
    findOne(options?: FindOneOptions<T>): Promise<T | null>;

    /**
     * 查找多个实体
     */
    find(options?: FindOptions<T>): Promise<T[]>;

    /**
     * 查找所有实体
     */
    findAll(options?: FindOptions<T>): Promise<T[]>;

    /**
     * 分页查找
     */
    findAndCount(options?: FindOptions<T>): Promise<PaginationResult<T>>;

    /**
     * 统计数量
     */
    count(options?: FindOptions<T>): Promise<number>;

    /**
     * 检查是否存在
     */
    exists(options?: FindOneOptions<T>): Promise<boolean>;

    /**
     * 更新实体
     */
    update(id: ID, updateData: Partial<T>, options?: SaveOptions): Promise<T | null>;

    /**
     * 批量更新
     */
    updateMany(where: Partial<T>, updateData: Partial<T>, options?: SaveOptions): Promise<number>;

    /**
     * 删除实体
     */
    delete(id: ID, options?: DeleteOptions): Promise<boolean>;

    /**
     * 批量删除
     */
    deleteMany(where: Partial<T>, options?: DeleteOptions): Promise<number>;

    /**
     * 软删除
     */
    softDelete(id: ID): Promise<boolean>;

    /**
     * 恢复软删除
     */
    restore(id: ID): Promise<boolean>;

    /**
     * 创建查询构建器
     */
    createQueryBuilder(alias?: string): QueryBuilder<T>;

    /**
     * 执行原生查询
     */
    query(sql: string, parameters?: any[]): Promise<any>;

    /**
     * 聚合查询
     */
    aggregate(options: {
        count?: boolean;
        sum?: keyof T;
        avg?: keyof T;
        min?: keyof T;
        max?: keyof T;
        where?: Partial<T>;
    }): Promise<AggregateResult>;
}

// ============================================================================
// Base Repository Implementation - 基础仓储实现
// ============================================================================

/**
 * 基础仓储实现
 */
export abstract class BaseRepository<T, ID = any> implements IRepository<T, ID> {
    protected entityClass: new () => T;
    protected tableName: string;

    constructor(entityClass: new () => T) {
        this.entityClass = entityClass;
        // 从实体装饰器元数据中获取表名
        this.tableName = this.getTableName();
    }

    /**
     * 获取表名（需要从装饰器元数据中获取）
     */
    protected getTableName(): string {
        // 这里应该从 Entity 装饰器的元数据中获取表名
        // 暂时使用类名的小写形式
        return this.entityClass.name.toLowerCase();
    }

    /**
     * 创建查询构建器
     */
    createQueryBuilder(alias?: string): QueryBuilder<T> {
        const qb = new QueryBuilder<T>(this.entityClass);
        if (alias) {
            qb.from(this.tableName, alias);
        }
        return qb;
    }

    /**
     * 保存实体
     */
    async save(entity: Partial<T>, options?: SaveOptions): Promise<T> {
        // 这里需要实现具体的保存逻辑
        // 包括数据验证、SQL 生成、执行等
        throw new Error("Method not implemented. This should be implemented by concrete repository.");
    }

    /**
     * 批量保存实体
     */
    async saveMany(entities: Partial<T>[], options?: SaveOptions): Promise<T[]> {
        const results: T[] = [];
        for (const entity of entities) {
            results.push(await this.save(entity, options));
        }
        return results;
    }

    /**
     * 根据 ID 查找实体
     */
    async findById(id: ID, options?: FindOneOptions<T>): Promise<T | null> {
        const qb = this.createQueryBuilder();
        qb.whereEqual("id", id);
        
        if (options?.select) {
            qb.select(...(options.select as string[]));
        }
        
        // 这里需要执行查询并返回结果
        throw new Error("Method not implemented. This should be implemented by concrete repository.");
    }

    /**
     * 查找一个实体
     */
    async findOne(options?: FindOneOptions<T>): Promise<T | null> {
        const qb = this.createQueryBuilder();
        
        if (options?.where) {
            if (typeof options.where === "function") {
                options.where(qb);
            } else {
                // 处理简单的 where 条件
                Object.entries(options.where).forEach(([key, value]) => {
                    qb.whereEqual(key, value);
                });
            }
        }
        
        if (options?.select) {
            qb.select(...(options.select as string[]));
        }
        
        if (options?.order) {
            Object.entries(options.order).forEach(([key, direction]) => {
                qb.orderBy(key, direction === "ASC" ? SortDirection.ASC : SortDirection.DESC);
            });
        }
        
        qb.limit(1);
        
        // 这里需要执行查询并返回结果
        throw new Error("Method not implemented. This should be implemented by concrete repository.");
    }

    /**
     * 查找多个实体
     */
    async find(options?: FindOptions<T>): Promise<T[]> {
        const qb = this.createQueryBuilder();
        
        if (options?.where) {
            if (typeof options.where === "function") {
                options.where(qb);
            } else {
                Object.entries(options.where).forEach(([key, value]) => {
                    qb.whereEqual(key, value);
                });
            }
        }
        
        if (options?.select) {
            qb.select(...(options.select as string[]));
        }
        
        if (options?.order) {
            Object.entries(options.order).forEach(([key, direction]) => {
                qb.orderBy(key, direction === "ASC" ? SortDirection.ASC : SortDirection.DESC);
            });
        }
        
        if (options?.skip) {
            qb.offset(options.skip);
        }
        
        if (options?.take) {
            qb.limit(options.take);
        }
        
        // 这里需要执行查询并返回结果
        throw new Error("Method not implemented. This should be implemented by concrete repository.");
    }

    /**
     * 查找所有实体
     */
    async findAll(options?: FindOptions<T>): Promise<T[]> {
        return this.find(options);
    }

    /**
     * 分页查找
     */
    async findAndCount(options?: FindOptions<T>): Promise<PaginationResult<T>> {
        const page = options?.skip ? Math.floor(options.skip / (options.take || 10)) + 1 : 1;
        const pageSize = options?.take || 10;
        
        // 获取总数
        const total = await this.count(options);
        
        // 获取数据
        const data = await this.find(options);
        
        const totalPages = Math.ceil(total / pageSize);
        
        return {
            data,
            total,
            page,
            pageSize,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        };
    }

    /**
     * 统计数量
     */
    async count(options?: FindOptions<T>): Promise<number> {
        const qb = this.createQueryBuilder();
        qb.select("COUNT(*) as count");
        
        if (options?.where) {
            if (typeof options.where === "function") {
                options.where(qb);
            } else {
                Object.entries(options.where).forEach(([key, value]) => {
                    qb.whereEqual(key, value);
                });
            }
        }
        
        // 这里需要执行查询并返回结果
        throw new Error("Method not implemented. This should be implemented by concrete repository.");
    }

    /**
     * 检查是否存在
     */
    async exists(options?: FindOneOptions<T>): Promise<boolean> {
        const count = await this.count(options as FindOptions<T>);
        return count > 0;
    }

    /**
     * 更新实体
     */
    async update(id: ID, updateData: Partial<T>, options?: SaveOptions): Promise<T | null> {
        // 这里需要实现具体的更新逻辑
        throw new Error("Method not implemented. This should be implemented by concrete repository.");
    }

    /**
     * 批量更新
     */
    async updateMany(where: Partial<T>, updateData: Partial<T>, options?: SaveOptions): Promise<number> {
        // 这里需要实现具体的批量更新逻辑
        throw new Error("Method not implemented. This should be implemented by concrete repository.");
    }

    /**
     * 删除实体
     */
    async delete(id: ID, options?: DeleteOptions): Promise<boolean> {
        // 这里需要实现具体的删除逻辑
        throw new Error("Method not implemented. This should be implemented by concrete repository.");
    }

    /**
     * 批量删除
     */
    async deleteMany(where: Partial<T>, options?: DeleteOptions): Promise<number> {
        // 这里需要实现具体的批量删除逻辑
        throw new Error("Method not implemented. This should be implemented by concrete repository.");
    }

    /**
     * 软删除
     */
    async softDelete(id: ID): Promise<boolean> {
        // 这里需要实现软删除逻辑
        throw new Error("Method not implemented. This should be implemented by concrete repository.");
    }

    /**
     * 恢复软删除
     */
    async restore(id: ID): Promise<boolean> {
        // 这里需要实现恢复逻辑
        throw new Error("Method not implemented. This should be implemented by concrete repository.");
    }

    /**
     * 执行原生查询
     */
    async query(sql: string, parameters?: any[]): Promise<any> {
        // 这里需要实现原生查询逻辑
        throw new Error("Method not implemented. This should be implemented by concrete repository.");
    }

    /**
     * 聚合查询
     */
    async aggregate(options: {
        count?: boolean;
        sum?: keyof T;
        avg?: keyof T;
        min?: keyof T;
        max?: keyof T;
        where?: Partial<T>;
    }): Promise<AggregateResult> {
        const qb = this.createQueryBuilder();
        const selectFields: string[] = [];
        
        if (options.count) {
            selectFields.push("COUNT(*) as count");
        }
        if (options.sum) {
            selectFields.push(`SUM(${String(options.sum)}) as sum`);
        }
        if (options.avg) {
            selectFields.push(`AVG(${String(options.avg)}) as avg`);
        }
        if (options.min) {
            selectFields.push(`MIN(${String(options.min)}) as min`);
        }
        if (options.max) {
            selectFields.push(`MAX(${String(options.max)}) as max`);
        }
        
        qb.select(...selectFields);
        
        if (options.where) {
            Object.entries(options.where).forEach(([key, value]) => {
                qb.whereEqual(key, value);
            });
        }
        
        // 这里需要执行查询并返回结果
        throw new Error("Method not implemented. This should be implemented by concrete repository.");
    }
}

/**
 * 创建仓储实例
 */
export function createRepository<T, ID = any>(entityClass: new () => T): BaseRepository<T, ID> {
    return new (class extends BaseRepository<T, ID> {})(entityClass);
}
