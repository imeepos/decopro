import {
    ClassMetadata,
    createClassDecorator,
    createMethodDecorator,
    createPropertyDecorator,
    InjectionToken,
    MethodMetadata,
    PropertyMetadata,
    BasePropertyOptions,
    BaseMethodOptions,
    BaseDecoratorOptions
} from "@decopro/core";
import { ZodTypeAny } from "zod";

// ============================================================================
// Type Definitions - 类型定义
// ============================================================================

/**
 * 命令行选项配置接口
 * 用于定义命令行选项的行为和验证规则
 */
export interface OptionOptions extends BasePropertyOptions {
    /** 选项标志，如 '--port <port>' 或 '-p, --port <port>' */
    flags?: string;
    /** 选项描述，用于帮助信息显示 */
    description?: string;
    /** Zod 验证模式，用于参数类型验证和转换 */
    zod?: ZodTypeAny;
    /** 默认值 */
    defaultValue?: unknown;
}

/**
 * 命令行参数配置接口
 * 用于定义位置参数的行为
 */
export interface ArgumentOptions extends BasePropertyOptions {
    /** 参数名称，如 '[type]' 或 '<name>' */
    name?: string;
    /** 参数描述，用于帮助信息显示 */
    description?: string;
    /** 默认值 */
    defaultValue?: unknown;
    /** Zod 验证模式，用于参数类型验证和转换 */
    zod?: ZodTypeAny;
}

/**
 * 命令动作配置接口
 * 用于定义命令执行的行为
 */
export interface ActionOptions extends BaseMethodOptions {
    /** 动作描述 */
    description?: string;
    /** 动作优先级，数字越小优先级越高 */
    priority?: number;
}

/**
 * 命令配置接口
 * 用于定义命令的基本信息
 */
export interface CommanderOptions extends BaseDecoratorOptions {
    /** 命令名称 */
    name?: string;
    /** 命令别名 */
    alias?: string;
    /** 命令简要描述 */
    summary?: string;
    /** 命令详细描述 */
    description?: string;
    /** 是否隐藏命令（不在帮助中显示） */
    hidden?: boolean;
}

// ============================================================================
// Injection Tokens - 注入令牌
// ============================================================================

export const OPTION_TOKEN = Symbol.for(`OPTION_TOKEN`) as InjectionToken<
    PropertyMetadata<OptionOptions>
>;

export const ARGUMENT_TOKEN = Symbol.for(`ARGUMENT_TOKEN`) as InjectionToken<
    PropertyMetadata<ArgumentOptions>
>;

export const ACTION_TOKEN = Symbol.for(`ACTION_TOKEN`) as InjectionToken<
    MethodMetadata<ActionOptions>
>;

export const COMMANDER_TOKEN = Symbol.for(`COMMANDER_TOKEN`) as InjectionToken<
    ClassMetadata<CommanderOptions>
>;

// ============================================================================
// Default Options - 默认选项
// ============================================================================

const defaultOptionOptions: Partial<OptionOptions> = {
    flags: "",
    description: "",
    defaultValue: undefined
};

const defaultArgumentOptions: Partial<ArgumentOptions> = {
    name: "",
    description: "",
    defaultValue: undefined
};

const defaultActionOptions: Partial<ActionOptions> = {
    description: "",
    priority: 0
};

const defaultCommanderOptions: Partial<CommanderOptions> = {
    name: "",
    description: "",
    hidden: false
};

// ============================================================================
// Decorator Factory Functions - 装饰器工厂函数
// ============================================================================

/**
 * 创建装饰器的通用工厂函数
 * @param createDecorator 装饰器创建函数
 * @param token 注入令牌
 * @param defaultOptions 默认选项
 * @returns 装饰器工厂函数
 */
function createDecoratorFactory<T extends Record<string, any>>(
    createDecorator: (token: any, defaultOptions: any) => (options: T) => any,
    token: any,
    defaultOptions: Partial<T>
) {
    return (options?: T) => {
        const finalOptions = {
            ...defaultOptions,
            ...options
        } as T;
        const decorator = createDecorator(token, defaultOptions);
        return decorator(finalOptions);
    };
}

// ============================================================================
// Option Decorator - 选项装饰器
// ============================================================================

/**
 * Option 装饰器 - 用于标记命令行选项属性
 * 支持类型验证、默认值和自定义标志
 *
 * @example
 * ```typescript
 * @Option({
 *   flags: '--port <port>',
 *   description: '端口号',
 *   zod: z.coerce.number().default(3000)
 * })
 * port: number;
 * ```
 */
export function Option(): PropertyDecorator;
export function Option(options: OptionOptions): PropertyDecorator;
export function Option(options?: OptionOptions): PropertyDecorator {
    return createDecoratorFactory(
        createPropertyDecorator,
        OPTION_TOKEN,
        defaultOptionOptions
    )(options);
}

// ============================================================================
// Argument Decorator - 参数装饰器
// ============================================================================

/**
 * Argument 装饰器 - 用于标记命令行位置参数属性
 * 支持类型验证、默认值和自定义名称
 *
 * @example
 * ```typescript
 * @Argument({
 *   name: '[environment]',
 *   description: '运行环境',
 *   defaultValue: 'development'
 * })
 * environment: string;
 * ```
 */
export function Argument(): PropertyDecorator;
export function Argument(options: ArgumentOptions): PropertyDecorator;
export function Argument(options?: ArgumentOptions): PropertyDecorator {
    return createDecoratorFactory(
        createPropertyDecorator,
        ARGUMENT_TOKEN,
        defaultArgumentOptions
    )(options);
}

// ============================================================================
// Action Decorator - 动作装饰器
// ============================================================================

/**
 * Action 装饰器 - 用于标记命令执行方法
 * 支持优先级控制和描述信息
 *
 * @example
 * ```typescript
 * @Action({
 *   description: '启动服务器',
 *   priority: 1
 * })
 * async start() {
 *   // 执行逻辑
 * }
 * ```
 */
export function Action(): MethodDecorator;
export function Action(options: ActionOptions): MethodDecorator;
export function Action(options?: ActionOptions): MethodDecorator {
    return createDecoratorFactory(
        createMethodDecorator,
        ACTION_TOKEN,
        defaultActionOptions
    )(options);
}

// ============================================================================
// Commander Decorator - 命令装饰器
// ============================================================================

/**
 * Commander 装饰器 - 用于标记命令类
 * 支持命令名称、别名、描述等配置
 *
 * @example
 * ```typescript
 * @Commander({
 *   name: 'serve',
 *   alias: 's',
 *   description: '启动开发服务器',
 *   summary: '启动服务器'
 * })
 * export class ServeCommand {
 *   // 命令实现
 * }
 * ```
 */
export function Commander(): ClassDecorator;
export function Commander(options: CommanderOptions): ClassDecorator;
export function Commander(options?: CommanderOptions): ClassDecorator {
    return createDecoratorFactory(
        createClassDecorator,
        COMMANDER_TOKEN,
        defaultCommanderOptions
    )(options);
}

// ============================================================================
// Re-exports - 重新导出
// ============================================================================

// 导出类型定义
export * from "./types";

// 导出工具函数
export {
    validateOptionOptions,
    validateArgumentOptions,
    validateActionOptions,
    validateCommanderOptions,
    isValidFlagFormat,
    isValidArgumentFormat,
    parseFlags,
    parseArgumentName,
    CommonSchemas,
    createOptionConfig,
    createArgumentConfig,
    mergeValidationResults,
    formatValidationErrors
} from "./utils";

// 导入验证函数用于内部使用
import {
    validateOptionOptions,
    validateArgumentOptions,
    validateActionOptions,
    validateCommanderOptions
} from "./utils";

// ============================================================================
// Validated Decorators - 验证装饰器
// ============================================================================

/**
 * 创建带有验证的选项装饰器
 * @param options 选项配置
 * @returns 装饰器函数
 */
export function ValidatedOption(options: OptionOptions): PropertyDecorator {
    const validation = validateOptionOptions(options);
    if (!validation.valid) {
        throw new Error(`Invalid option configuration: ${validation.errors.join(', ')}`);
    }
    return Option(options);
}

/**
 * 创建带有验证的参数装饰器
 * @param options 参数配置
 * @returns 装饰器函数
 */
export function ValidatedArgument(options: ArgumentOptions): PropertyDecorator {
    const validation = validateArgumentOptions(options);
    if (!validation.valid) {
        throw new Error(`Invalid argument configuration: ${validation.errors.join(', ')}`);
    }
    return Argument(options);
}

/**
 * 创建带有验证的动作装饰器
 * @param options 动作配置
 * @returns 装饰器函数
 */
export function ValidatedAction(options: ActionOptions): MethodDecorator {
    const validation = validateActionOptions(options);
    if (!validation.valid) {
        throw new Error(`Invalid action configuration: ${validation.errors.join(', ')}`);
    }
    return Action(options);
}

/**
 * 创建带有验证的命令装饰器
 * @param options 命令配置
 * @returns 装饰器函数
 */
export function ValidatedCommander(options: CommanderOptions): ClassDecorator {
    const validation = validateCommanderOptions(options);
    if (!validation.valid) {
        throw new Error(`Invalid commander configuration: ${validation.errors.join(', ')}`);
    }
    return Commander(options);
}
