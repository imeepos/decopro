import { ZodTypeAny } from "zod";

// ============================================================================
// Core Types - 核心类型
// ============================================================================

/**
 * 命令行标志格式类型
 */
export type FlagFormat = 
    | `--${string}`                    // 长标志: --port
    | `--${string} <${string}>`        // 长标志带必需参数: --port <port>
    | `--${string} [${string}]`        // 长标志带可选参数: --port [port]
    | `-${string}`                     // 短标志: -p
    | `-${string}, --${string}`        // 短长标志组合: -p, --port
    | `-${string}, --${string} <${string}>`  // 短长标志带必需参数: -p, --port <port>
    | `-${string}, --${string} [${string}]`; // 短长标志带可选参数: -p, --port [port]

/**
 * 参数名称格式类型
 */
export type ArgumentFormat = 
    | `[${string}]`    // 可选参数: [environment]
    | `<${string}>`    // 必需参数: <name>
    | string;          // 简单名称: environment

/**
 * 优先级类型
 */
export type Priority = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// ============================================================================
// Configuration Interfaces - 配置接口
// ============================================================================

/**
 * 基础配置接口
 */
export interface BaseConfig {
    /** 描述信息 */
    description?: string;
}

/**
 * 带验证的配置接口
 */
export interface ValidatedConfig extends BaseConfig {
    /** Zod 验证模式 */
    zod?: ZodTypeAny;
    /** 默认值 */
    defaultValue?: unknown;
}

/**
 * 选项配置接口（强类型版本）
 */
export interface TypedOptionConfig extends ValidatedConfig {
    /** 选项标志 */
    flags?: FlagFormat;
}

/**
 * 参数配置接口（强类型版本）
 */
export interface TypedArgumentConfig extends ValidatedConfig {
    /** 参数名称 */
    name?: ArgumentFormat;
}

/**
 * 动作配置接口（强类型版本）
 */
export interface TypedActionConfig extends BaseConfig {
    /** 优先级 */
    priority?: Priority;
}

/**
 * 命令配置接口（强类型版本）
 */
export interface TypedCommanderConfig extends BaseConfig {
    /** 命令名称 */
    name?: string;
    /** 命令别名 */
    alias?: string;
    /** 简要描述 */
    summary?: string;
    /** 是否隐藏 */
    hidden?: boolean;
}

// ============================================================================
// Utility Types - 工具类型
// ============================================================================

/**
 * 提取 Zod 类型的 TypeScript 类型
 */
export type InferZodType<T extends ZodTypeAny> = T extends ZodTypeAny ? T['_output'] : unknown;

/**
 * 选项值类型推断
 */
export type OptionValue<T extends TypedOptionConfig> = 
    T['zod'] extends ZodTypeAny 
        ? InferZodType<T['zod']>
        : T['defaultValue'] extends infer U 
            ? U 
            : unknown;

/**
 * 参数值类型推断
 */
export type ArgumentValue<T extends TypedArgumentConfig> = 
    T['zod'] extends ZodTypeAny 
        ? InferZodType<T['zod']>
        : T['defaultValue'] extends infer U 
            ? U 
            : unknown;

// ============================================================================
// Validation Types - 验证类型
// ============================================================================

/**
 * 验证结果接口
 */
export interface ValidationResult {
    /** 是否有效 */
    valid: boolean;
    /** 错误信息列表 */
    errors: string[];
    /** 警告信息列表 */
    warnings?: string[];
}

/**
 * 配置验证器接口
 */
export interface ConfigValidator<T> {
    /** 验证配置 */
    validate(config: T): ValidationResult;
    /** 获取建议 */
    getSuggestions?(config: T): string[];
}

// ============================================================================
// Command Metadata Types - 命令元数据类型
// ============================================================================

/**
 * 命令元数据接口
 */
export interface CommandMetadata {
    /** 命令名称 */
    name: string;
    /** 命令别名 */
    alias?: string;
    /** 描述 */
    description?: string;
    /** 简要描述 */
    summary?: string;
    /** 是否隐藏 */
    hidden?: boolean;
    /** 选项列表 */
    options: OptionMetadata[];
    /** 参数列表 */
    arguments: ArgumentMetadata[];
    /** 动作列表 */
    actions: ActionMetadata[];
}

/**
 * 选项元数据接口
 */
export interface OptionMetadata {
    /** 属性名 */
    property: string | symbol;
    /** 标志 */
    flags?: string;
    /** 描述 */
    description?: string;
    /** 默认值 */
    defaultValue?: unknown;
    /** 验证器 */
    validator?: ZodTypeAny;
}

/**
 * 参数元数据接口
 */
export interface ArgumentMetadata {
    /** 属性名 */
    property: string | symbol;
    /** 参数名 */
    name?: string;
    /** 描述 */
    description?: string;
    /** 默认值 */
    defaultValue?: unknown;
    /** 验证器 */
    validator?: ZodTypeAny;
    /** 位置索引 */
    index: number;
}

/**
 * 动作元数据接口
 */
export interface ActionMetadata {
    /** 方法名 */
    property: string | symbol;
    /** 描述 */
    description?: string;
    /** 优先级 */
    priority: number;
}

// ============================================================================
// Error Types - 错误类型
// ============================================================================

/**
 * 命令行错误基类
 */
export abstract class CommanderError extends Error {
    abstract readonly code: string;
    
    constructor(message: string, public readonly context?: Record<string, any>) {
        super(message);
        this.name = this.constructor.name;
    }
}

/**
 * 配置错误
 */
export class ConfigurationError extends CommanderError {
    readonly code = 'CONFIGURATION_ERROR';
}

/**
 * 验证错误
 */
export class ValidationError extends CommanderError {
    readonly code = 'VALIDATION_ERROR';
}

/**
 * 执行错误
 */
export class ExecutionError extends CommanderError {
    readonly code = 'EXECUTION_ERROR';
}

// ============================================================================
// Builder Pattern Types - 构建器模式类型
// ============================================================================

/**
 * 命令构建器接口
 */
export interface CommandBuilder {
    /** 设置名称 */
    name(name: string): this;
    /** 设置别名 */
    alias(alias: string): this;
    /** 设置描述 */
    description(description: string): this;
    /** 设置简要描述 */
    summary(summary: string): this;
    /** 设置隐藏状态 */
    hidden(hidden: boolean): this;
    /** 添加选项 */
    option(config: TypedOptionConfig): this;
    /** 添加参数 */
    argument(config: TypedArgumentConfig): this;
    /** 添加动作 */
    action(config: TypedActionConfig): this;
    /** 构建命令 */
    build(): CommandMetadata;
}

// ============================================================================
// Plugin Types - 插件类型
// ============================================================================

/**
 * 插件接口
 */
export interface CommanderPlugin {
    /** 插件名称 */
    name: string;
    /** 插件版本 */
    version: string;
    /** 初始化插件 */
    initialize?(context: PluginContext): Promise<void> | void;
    /** 处理命令 */
    processCommand?(metadata: CommandMetadata): CommandMetadata;
    /** 清理资源 */
    cleanup?(): Promise<void> | void;
}

/**
 * 插件上下文接口
 */
export interface PluginContext {
    /** 获取配置 */
    getConfig<T = any>(key: string): T | undefined;
    /** 设置配置 */
    setConfig<T = any>(key: string, value: T): void;
    /** 日志记录器 */
    logger: Logger;
}

/**
 * 日志记录器接口
 */
export interface Logger {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
}
