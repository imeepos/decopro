import { QueryBuilder, SortDirection } from "./query-builder";
import { IDatabaseManager } from "./database";
import { getTableName, getEntityColumns, getEntityRelations } from "@decopro/orm";

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
    protected mockData: Map<ID, T> = new Map(); // 模拟数据存储
    protected databaseManager?: IDatabaseManager;

    constructor(entityClass: new () => T, databaseManager?: IDatabaseManager) {
        this.entityClass = entityClass;
        this.databaseManager = databaseManager;
        // 从实体装饰器元数据中获取表名
        this.tableName = this.getTableName();
    }

    /**
     * 获取实体类
     */
    get target(): new () => T {
        return this.entityClass;
    }

    /**
     * 获取表名（需要从装饰器元数据中获取）
     */
    protected getTableName(): string {
        // 使用 ORM 包中的工具函数获取表名
        return getTableName(this.entityClass);
    }

    /**
     * 创建查询构建器
     */
    createQueryBuilder(alias?: string): QueryBuilder<T> {
        const qb = new QueryBuilder<T>(this.entityClass, alias, this.databaseManager);
        if (alias) {
            qb.from(this.tableName, alias);
        } else {
            qb.from(this.tableName);
        }
        return qb;
    }

    /**
     * 保存实体
     */
    async save(entity: Partial<T>, options?: SaveOptions): Promise<T> {
        // 模拟保存逻辑
        const id = (entity as any).id || Math.floor(Math.random() * 1000) + 1;
        const savedEntity = {
            ...entity,
            id
        } as T;

        this.mockData.set(id, savedEntity);
        return savedEntity;
    }

    /**
     * 批量保存实体
     */
    async saveMany(entities: Partial<T>[], options?: SaveOptions): Promise<T[]> {
        // 模拟批量保存逻辑
        return Promise.all(entities.map(entity => this.save(entity, options)));
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

        // 从模拟数据中查找
        return this.mockData.get(id) || null;
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
        
        // 模拟查询结果
        return null;
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
        
        // 从模拟数据中查找
        let results = Array.from(this.mockData.values());

        // 简单的条件过滤
        if (options?.where && typeof options.where === "object") {
            results = results.filter(entity => {
                return Object.entries(options.where as any).every(([key, value]) => {
                    return (entity as any)[key] === value;
                });
            });
        }

        // 简单的排序
        if (options?.order) {
            const orderEntries = Object.entries(options.order);
            if (orderEntries.length > 0) {
                const orderEntry = orderEntries[0];
                if (orderEntry) {
                    const orderKey = orderEntry[0];
                    const orderDirection = orderEntry[1];
                    results.sort((a, b) => {
                        const aVal = (a as any)[orderKey];
                        const bVal = (b as any)[orderKey];
                        if (orderDirection === "ASC") {
                            return aVal > bVal ? 1 : -1;
                        } else {
                            return aVal < bVal ? 1 : -1;
                        }
                    });
                }
            }
        }

        // 分页
        if (options?.skip) {
            results = results.slice(options.skip);
        }
        if (options?.take) {
            results = results.slice(0, options.take);
        }

        return results;
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

        // 从模拟数据中统计
        let results = Array.from(this.mockData.values());

        // 简单的条件过滤
        if (options?.where && typeof options.where === "object") {
            results = results.filter(entity => {
                return Object.entries(options.where as any).every(([key, value]) => {
                    return (entity as any)[key] === value;
                });
            });
        }

        return results.length;
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
        // 模拟更新逻辑
        return {
            ...updateData,
            id
        } as T;
    }

    /**
     * 批量更新
     */
    async updateMany(where: Partial<T>, updateData: Partial<T>, options?: SaveOptions): Promise<number> {
        // 模拟批量更新逻辑
        return 0;
    }

    /**
     * 删除实体
     */
    async delete(id: ID, options?: DeleteOptions): Promise<boolean> {
        // 从模拟数据中删除
        const existed = this.mockData.has(id);
        if (existed) {
            this.mockData.delete(id);
            return true;
        }
        return false;
    }

    /**
     * 删除实体对象
     */
    async remove(entity: T): Promise<boolean> {
        const id = (entity as any).id;
        return this.delete(id);
    }

    /**
     * 批量删除
     */
    async deleteMany(where: Partial<T>, options?: DeleteOptions): Promise<number> {
        // 模拟批量删除逻辑
        return 0;
    }

    /**
     * 软删除
     */
    async softDelete(id: ID): Promise<boolean> {
        // 模拟软删除逻辑
        return true;
    }

    /**
     * 恢复软删除
     */
    async restore(id: ID): Promise<boolean> {
        // 模拟恢复逻辑
        return true;
    }

    /**
     * 执行原生查询
     */
    async query(sql: string, parameters?: any[]): Promise<any> {
        // 模拟原生查询逻辑
        return [];
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
        
        // 模拟聚合查询结果
        return {
            count: 0,
            sum: 0,
            avg: 0,
            min: 0,
            max: 0
        };
    }
}

/**
 * 创建仓储实例
 */
export function createRepository<T, ID = any>(
    entityClass: new () => T,
    databaseManager?: IDatabaseManager
): BaseRepository<T, ID> {
    return new (class extends BaseRepository<T, ID> {})(entityClass, databaseManager);
}
