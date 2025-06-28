import { Type } from "@decopro/core";
import { IDatabaseManager, QueryResult } from "./database";

// ============================================================================
// Query Builder Types - 查询构建器类型
// ============================================================================

/**
 * 查询操作符
 */
export enum QueryOperator {
    EQUAL = "=",
    NOT_EQUAL = "!=",
    GREATER_THAN = ">",
    GREATER_THAN_OR_EQUAL = ">=",
    LESS_THAN = "<",
    LESS_THAN_OR_EQUAL = "<=",
    LIKE = "LIKE",
    ILIKE = "ILIKE",
    IN = "IN",
    NOT_IN = "NOT IN",
    IS_NULL = "IS NULL",
    IS_NOT_NULL = "IS NOT NULL",
    BETWEEN = "BETWEEN",
    NOT_BETWEEN = "NOT BETWEEN"
}

/**
 * 排序方向
 */
export enum SortDirection {
    ASC = "ASC",
    DESC = "DESC"
}

/**
 * 连接类型
 */
export enum JoinType {
    INNER = "INNER JOIN",
    LEFT = "LEFT JOIN",
    RIGHT = "RIGHT JOIN",
    FULL = "FULL JOIN"
}

/**
 * 聚合函数类型
 */
export enum AggregateFunction {
    COUNT = "COUNT",
    SUM = "SUM",
    AVG = "AVG",
    MIN = "MIN",
    MAX = "MAX"
}

/**
 * 查询条件接口
 */
export interface WhereCondition {
    field: string;
    operator: QueryOperator;
    value?: any;
    values?: any[];
}

/**
 * 排序条件接口
 */
export interface OrderByCondition {
    field: string;
    direction: SortDirection;
}

/**
 * 连接条件接口
 */
export interface JoinCondition {
    type: JoinType;
    table: string;
    alias?: string;
    on: string;
}

/**
 * 分组条件接口
 */
export interface GroupByCondition {
    field: string;
}

/**
 * Having 条件接口
 */
export interface HavingCondition {
    field: string;
    operator: QueryOperator;
    value: any;
}

/**
 * 查询选项接口
 */
export interface QueryOptions {
    /** 查询字段 */
    select?: string[];
    /** 表名 */
    from?: string;
    /** 表别名 */
    alias?: string;
    /** WHERE 条件 */
    where?: WhereCondition[];
    /** JOIN 条件 */
    joins?: JoinCondition[];
    /** ORDER BY 条件 */
    orderBy?: OrderByCondition[];
    /** GROUP BY 条件 */
    groupBy?: GroupByCondition[];
    /** HAVING 条件 */
    having?: HavingCondition[];
    /** 限制条数 */
    limit?: number;
    /** 偏移量 */
    offset?: number;
    /** 是否去重 */
    distinct?: boolean;
}

// ============================================================================
// Query Builder Class - 查询构建器类
// ============================================================================

/**
 * 类型安全的查询构建器
 */
export class QueryBuilder<T = any> {
    private options: QueryOptions = {};
    private entityClass?: new () => T;
    private databaseManager?: IDatabaseManager;

    constructor(entityClass?: new () => T, alias?: string, databaseManager?: IDatabaseManager) {
        this.entityClass = entityClass || undefined;
        this.databaseManager = databaseManager;
        if (entityClass) {
            // 从实体类获取表名（保持原始大小写）
            this.options.from = entityClass.name;
            if (alias) {
                this.options.alias = alias;
            }
        }
    }

    /**
     * 选择字段
     */
    select(...fields: (keyof T | string)[]): this {
        this.options.select = fields as string[];
        return this;
    }

    /**
     * 选择所有字段
     */
    selectAll(): this {
        this.options.select = ["*"];
        return this;
    }

    /**
     * 设置表名
     */
    from(table: string, alias?: string): this {
        this.options.from = table;
        if (alias) {
            this.options.alias = alias;
        }
        return this;
    }

    /**
     * 添加 WHERE 条件
     */
    where(field: keyof T | string, operator: QueryOperator, value?: any): this {
        if (!this.options.where) {
            this.options.where = [];
        }
        this.options.where.push({
            field: field as string,
            operator,
            value
        });
        return this;
    }

    /**
     * 添加 WHERE 等于条件
     */
    whereEqual(field: keyof T | string, value: any): this {
        return this.where(field, QueryOperator.EQUAL, value);
    }

    /**
     * 添加 WHERE 不等于条件
     */
    whereNotEqual(field: keyof T | string, value: any): this {
        return this.where(field, QueryOperator.NOT_EQUAL, value);
    }

    /**
     * 添加 WHERE LIKE 条件
     */
    whereLike(field: keyof T | string, pattern: string): this {
        return this.where(field, QueryOperator.LIKE, pattern);
    }

    /**
     * 添加 WHERE IN 条件
     */
    whereIn(field: keyof T | string, values: any[]): this {
        if (!this.options.where) {
            this.options.where = [];
        }
        this.options.where.push({
            field: field as string,
            operator: QueryOperator.IN,
            values
        });
        return this;
    }

    /**
     * 添加 WHERE IS NULL 条件
     */
    whereNull(field: keyof T | string): this {
        return this.where(field, QueryOperator.IS_NULL);
    }

    /**
     * 添加 WHERE IS NOT NULL 条件
     */
    whereNotNull(field: keyof T | string): this {
        return this.where(field, QueryOperator.IS_NOT_NULL);
    }

    /**
     * 添加 WHERE BETWEEN 条件
     */
    whereBetween(field: keyof T | string, min: any, max: any): this {
        if (!this.options.where) {
            this.options.where = [];
        }
        this.options.where.push({
            field: field as string,
            operator: QueryOperator.BETWEEN,
            values: [min, max]
        });
        return this;
    }

    /**
     * 添加 JOIN 条件
     */
    join(table: string, on: string, type: JoinType = JoinType.INNER, alias?: string): this {
        if (!this.options.joins) {
            this.options.joins = [];
        }
        const joinCondition: any = {
            type,
            table,
            on
        };
        if (alias) {
            joinCondition.alias = alias;
        }
        this.options.joins.push(joinCondition);
        return this;
    }

    /**
     * 添加 INNER JOIN
     */
    innerJoin(table: string, on: string, alias?: string): this {
        return this.join(table, on, JoinType.INNER, alias);
    }

    /**
     * 添加 LEFT JOIN
     */
    leftJoin(table: string, on: string, alias?: string): this {
        return this.join(table, on, JoinType.LEFT, alias);
    }

    /**
     * 添加 RIGHT JOIN
     */
    rightJoin(table: string, on: string, alias?: string): this {
        return this.join(table, on, JoinType.RIGHT, alias);
    }

    /**
     * 添加 ORDER BY 条件
     */
    orderBy(field: keyof T | string, direction: SortDirection = SortDirection.ASC): this {
        if (!this.options.orderBy) {
            this.options.orderBy = [];
        }
        this.options.orderBy.push({
            field: field as string,
            direction
        });
        return this;
    }

    /**
     * 添加升序排序
     */
    orderByAsc(field: keyof T | string): this {
        return this.orderBy(field, SortDirection.ASC);
    }

    /**
     * 添加降序排序
     */
    orderByDesc(field: keyof T | string): this {
        return this.orderBy(field, SortDirection.DESC);
    }

    /**
     * 添加 GROUP BY 条件
     */
    groupBy(...fields: (keyof T | string)[]): this {
        this.options.groupBy = fields.map(field => ({
            field: field as string
        }));
        return this;
    }

    /**
     * 添加 HAVING 条件
     */
    having(field: string, operator: QueryOperator, value: any): this {
        if (!this.options.having) {
            this.options.having = [];
        }
        this.options.having.push({
            field,
            operator,
            value
        });
        return this;
    }

    /**
     * 设置限制条数
     */
    limit(count: number): this {
        this.options.limit = count;
        return this;
    }

    /**
     * 设置偏移量
     */
    offset(count: number): this {
        this.options.offset = count;
        return this;
    }

    /**
     * 设置分页
     */
    paginate(page: number, pageSize: number): this {
        this.options.limit = pageSize;
        this.options.offset = (page - 1) * pageSize;
        return this;
    }

    /**
     * 设置去重
     */
    distinct(): this {
        this.options.distinct = true;
        return this;
    }

    /**
     * 获取查询选项
     */
    getOptions(): QueryOptions {
        return { ...this.options };
    }

    /**
     * 构建 SQL 查询语句（基础实现）
     */
    toSQL(): string {
        const parts: string[] = [];

        // SELECT 子句
        const selectFields = this.options.select?.join(", ") || "*";
        const distinctKeyword = this.options.distinct ? "DISTINCT " : "";
        parts.push(`SELECT ${distinctKeyword}${selectFields}`);

        // FROM 子句
        if (this.options.from) {
            const fromClause = this.options.alias
                ? `${this.options.from} ${this.options.alias}`
                : this.options.from;
            parts.push(`FROM ${fromClause}`);
        }

        // JOIN 子句
        if (this.options.joins?.length) {
            this.options.joins.forEach(join => {
                const joinClause = join.alias
                    ? `${join.type} ${join.table} AS ${join.alias} ON ${join.on}`
                    : `${join.type} ${join.table} ON ${join.on}`;
                parts.push(joinClause);
            });
        }

        // WHERE 子句
        if (this.options.where?.length) {
            const whereConditions = this.options.where.map(condition => {
                if (condition.operator === QueryOperator.IN || condition.operator === QueryOperator.NOT_IN) {
                    const values = condition.values?.map(v => typeof v === "string" ? `'${v}'` : v).join(", ");
                    return `${condition.field} ${condition.operator} (${values})`;
                } else if (condition.operator === QueryOperator.BETWEEN || condition.operator === QueryOperator.NOT_BETWEEN) {
                    const [min, max] = condition.values || [];
                    return `${condition.field} ${condition.operator} ${min} AND ${max}`;
                } else if (condition.operator === QueryOperator.IS_NULL || condition.operator === QueryOperator.IS_NOT_NULL) {
                    return `${condition.field} ${condition.operator}`;
                } else {
                    const value = typeof condition.value === "string" ? `'${condition.value}'` : condition.value;
                    return `${condition.field} ${condition.operator} ${value}`;
                }
            });
            parts.push(`WHERE ${whereConditions.join(" AND ")}`);
        }

        // GROUP BY 子句
        if (this.options.groupBy?.length) {
            const groupFields = this.options.groupBy.map(g => g.field).join(", ");
            parts.push(`GROUP BY ${groupFields}`);
        }

        // HAVING 子句
        if (this.options.having?.length) {
            const havingConditions = this.options.having.map(condition => {
                const value = typeof condition.value === "string" ? `'${condition.value}'` : condition.value;
                return `${condition.field} ${condition.operator} ${value}`;
            });
            parts.push(`HAVING ${havingConditions.join(" AND ")}`);
        }

        // ORDER BY 子句
        if (this.options.orderBy?.length) {
            const orderFields = this.options.orderBy.map(order => `${order.field} ${order.direction}`).join(", ");
            parts.push(`ORDER BY ${orderFields}`);
        }

        // LIMIT 子句
        if (this.options.limit !== undefined) {
            parts.push(`LIMIT ${this.options.limit}`);
        }

        // OFFSET 子句
        if (this.options.offset !== undefined) {
            parts.push(`OFFSET ${this.options.offset}`);
        }

        return parts.join(" ");
    }

    /**
     * 构建参数化 SQL 查询语句
     */
    toParameterizedSQL(): { sql: string; parameters: any[] } {
        const parts: string[] = [];
        const parameters: any[] = [];

        // SELECT 子句
        const selectFields = this.options.select?.join(", ") || "*";
        const distinctKeyword = this.options.distinct ? "DISTINCT " : "";
        parts.push(`SELECT ${distinctKeyword}${selectFields}`);

        // FROM 子句
        if (this.options.from) {
            const fromClause = this.options.alias
                ? `${this.options.from} ${this.options.alias}`
                : this.options.from;
            parts.push(`FROM ${fromClause}`);
        }

        // JOIN 子句
        if (this.options.joins?.length) {
            this.options.joins.forEach(join => {
                const joinClause = join.alias
                    ? `${join.type} ${join.table} AS ${join.alias} ON ${join.on}`
                    : `${join.type} ${join.table} ON ${join.on}`;
                parts.push(joinClause);
            });
        }

        // WHERE 子句
        if (this.options.where?.length) {
            const whereConditions = this.options.where.map(condition => {
                if (condition.operator === QueryOperator.IN || condition.operator === QueryOperator.NOT_IN) {
                    const placeholders = condition.values?.map(() => "?").join(", ");
                    condition.values?.forEach(v => parameters.push(v));
                    return `${condition.field} ${condition.operator} (${placeholders})`;
                } else if (condition.operator === QueryOperator.BETWEEN || condition.operator === QueryOperator.NOT_BETWEEN) {
                    const [min, max] = condition.values || [];
                    parameters.push(min, max);
                    return `${condition.field} ${condition.operator} ? AND ?`;
                } else if (condition.operator === QueryOperator.IS_NULL || condition.operator === QueryOperator.IS_NOT_NULL) {
                    return `${condition.field} ${condition.operator}`;
                } else {
                    parameters.push(condition.value);
                    return `${condition.field} ${condition.operator} ?`;
                }
            });
            parts.push(`WHERE ${whereConditions.join(" AND ")}`);
        }

        // GROUP BY 子句
        if (this.options.groupBy?.length) {
            const groupFields = this.options.groupBy.map(g => g.field).join(", ");
            parts.push(`GROUP BY ${groupFields}`);
        }

        // HAVING 子句
        if (this.options.having?.length) {
            const havingConditions = this.options.having.map(condition => {
                parameters.push(condition.value);
                return `${condition.field} ${condition.operator} ?`;
            });
            parts.push(`HAVING ${havingConditions.join(" AND ")}`);
        }

        // ORDER BY 子句
        if (this.options.orderBy?.length) {
            const orderFields = this.options.orderBy.map(order => `${order.field} ${order.direction}`).join(", ");
            parts.push(`ORDER BY ${orderFields}`);
        }

        // LIMIT 子句
        if (this.options.limit !== undefined) {
            parts.push(`LIMIT ${this.options.limit}`);
        }

        // OFFSET 子句
        if (this.options.offset !== undefined) {
            parts.push(`OFFSET ${this.options.offset}`);
        }

        return {
            sql: parts.join(" "),
            parameters
        };
    }

    /**
     * 克隆查询构建器
     */
    clone(): QueryBuilder<T> {
        const cloned = new QueryBuilder<T>(this.entityClass, undefined, this.databaseManager);
        cloned.options = JSON.parse(JSON.stringify(this.options));
        return cloned;
    }

    /**
     * 设置数据库管理器
     */
    setDatabaseManager(databaseManager: IDatabaseManager): this {
        this.databaseManager = databaseManager;
        return this;
    }

    /**
     * 执行查询并获取单个结果
     */
    async getOne(): Promise<T | null> {
        if (!this.databaseManager) {
            throw new Error("Database manager is not set. Use setDatabaseManager() or provide it in constructor.");
        }

        // 设置 LIMIT 1 确保只返回一个结果
        const queryBuilder = this.clone().limit(1);
        const { sql, parameters } = queryBuilder.toParameterizedSQL();

        const result = await this.databaseManager.query<T>(sql, parameters);
        return result.rows.length > 0 ? (result.rows[0] || null) : null;
    }

    /**
     * 执行查询并获取结果数量
     */
    async getCount(): Promise<number> {
        if (!this.databaseManager) {
            throw new Error("Database manager is not set. Use setDatabaseManager() or provide it in constructor.");
        }

        // 创建 COUNT 查询
        const countBuilder = this.clone();
        countBuilder.options.select = ["COUNT(*) as count"];
        // 移除 ORDER BY、LIMIT、OFFSET，因为 COUNT 查询不需要这些
        delete countBuilder.options.orderBy;
        delete countBuilder.options.limit;
        delete countBuilder.options.offset;

        const { sql, parameters } = countBuilder.toParameterizedSQL();

        const result = await this.databaseManager.query<{ count: number }>(sql, parameters);
        return result.rows.length > 0 ? Number(result.rows[0]?.count || 0) : 0;
    }

    /**
     * 执行查询并获取多个结果
     */
    async getMany(): Promise<T[]> {
        if (!this.databaseManager) {
            throw new Error("Database manager is not set. Use setDatabaseManager() or provide it in constructor.");
        }

        const { sql, parameters } = this.toParameterizedSQL();

        const result = await this.databaseManager.query<T>(sql, parameters);
        return result.rows;
    }
}

/**
 * 创建查询构建器
 */
export function createQueryBuilder<T>(
    entityClass?: new () => T,
    alias?: string,
    databaseManager?: IDatabaseManager
): QueryBuilder<T> {
    return new QueryBuilder<T>(entityClass, alias, databaseManager);
}
