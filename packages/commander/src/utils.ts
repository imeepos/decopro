import { ZodTypeAny, z } from "zod";
import {
    ValidationResult,
    FlagFormat,
    ArgumentFormat
} from "./types";

// 从主文件导入接口定义
import type {
    OptionOptions,
    ArgumentOptions,
    ActionOptions,
    CommanderOptions
} from "./index";

// ============================================================================
// Validation Utilities - 验证工具
// ============================================================================

/**
 * 验证标志格式
 * @param flags 标志字符串
 * @returns 是否有效
 */
export function isValidFlagFormat(flags: string): flags is FlagFormat {
    const patterns = [
        /^--[a-zA-Z][a-zA-Z0-9-]*$/,                           // --port
        /^--[a-zA-Z][a-zA-Z0-9-]*\s+<[^>]+>$/,                // --port <port>
        /^--[a-zA-Z][a-zA-Z0-9-]*\s+\[[^\]]+\]$/,             // --port [port]
        /^-[a-zA-Z]$/,                                         // -p
        /^-[a-zA-Z],\s*--[a-zA-Z][a-zA-Z0-9-]*$/,             // -p, --port
        /^-[a-zA-Z],\s*--[a-zA-Z][a-zA-Z0-9-]*\s+<[^>]+>$/,  // -p, --port <port>
        /^-[a-zA-Z],\s*--[a-zA-Z][a-zA-Z0-9-]*\s+\[[^\]]+\]$/ // -p, --port [port]
    ];
    
    return patterns.some(pattern => pattern.test(flags));
}

/**
 * 验证参数格式
 * @param name 参数名称
 * @returns 是否有效
 */
export function isValidArgumentFormat(name: string): name is ArgumentFormat {
    const patterns = [
        /^\[[^\]]+\]$/,    // [optional]
        /^<[^>]+>$/,       // <required>
        /^\w+$/            // simple
    ];
    
    return patterns.some(pattern => pattern.test(name));
}

/**
 * 增强的选项验证
 * @param options 选项配置
 * @returns 验证结果
 */
export function validateOptionOptions(options: OptionOptions): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // 验证标志格式
    if (options.flags && !isValidFlagFormat(options.flags)) {
        errors.push('Invalid flags format. Should match patterns like --port, -p, --port <port>, etc.');
    }
    
    // 验证描述
    if (options.description && options.description.length > 200) {
        warnings.push('Description is quite long. Consider keeping it under 200 characters.');
    }
    
    // 验证 Zod 和默认值的一致性
    if (options.zod && options.defaultValue !== undefined) {
        try {
            options.zod.parse(options.defaultValue);
        } catch {
            errors.push('Default value does not match Zod schema');
        }
    }
    
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * 增强的参数验证
 * @param options 参数配置
 * @returns 验证结果
 */
export function validateArgumentOptions(options: ArgumentOptions): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // 验证参数名称格式
    if (options.name && !isValidArgumentFormat(options.name)) {
        errors.push('Invalid argument name format. Should be [optional], <required>, or simple name');
    }
    
    // 验证描述
    if (options.description && options.description.length > 200) {
        warnings.push('Description is quite long. Consider keeping it under 200 characters.');
    }
    
    // 验证 Zod 和默认值的一致性
    if (options.zod && options.defaultValue !== undefined) {
        try {
            options.zod.parse(options.defaultValue);
        } catch {
            errors.push('Default value does not match Zod schema');
        }
    }
    
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * 验证动作配置
 * @param options 动作配置
 * @returns 验证结果
 */
export function validateActionOptions(options: ActionOptions): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // 验证优先级
    if (options.priority !== undefined && (options.priority < 0 || options.priority > 9)) {
        errors.push('Priority should be between 0 and 9');
    }
    
    // 验证描述
    if (options.description && options.description.length > 200) {
        warnings.push('Description is quite long. Consider keeping it under 200 characters.');
    }
    
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * 验证命令配置
 * @param options 命令配置
 * @returns 验证结果
 */
export function validateCommanderOptions(options: CommanderOptions): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // 验证命令名称
    if (options.name && !/^[a-zA-Z][a-zA-Z0-9-]*$/.test(options.name)) {
        errors.push('Command name should start with a letter and contain only letters, numbers, and hyphens');
    }
    
    // 验证别名
    if (options.alias && !/^[a-zA-Z]$/.test(options.alias)) {
        errors.push('Command alias should be a single letter');
    }
    
    // 验证描述长度
    if (options.description && options.description.length > 500) {
        warnings.push('Description is quite long. Consider keeping it under 500 characters.');
    }
    
    if (options.summary && options.summary.length > 100) {
        warnings.push('Summary is quite long. Consider keeping it under 100 characters.');
    }
    
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

// ============================================================================
// Parsing Utilities - 解析工具
// ============================================================================

/**
 * 解析标志字符串，提取短标志和长标志
 * @param flags 标志字符串
 * @returns 解析结果
 */
export function parseFlags(flags: string): { short?: string; long?: string; hasValue: boolean } {
    const result: { short?: string; long?: string; hasValue: boolean } = { hasValue: false };
    
    // 检查是否有值
    result.hasValue = /<[^>]+>|\[[^\]]+\]/.test(flags);
    
    // 移除值部分进行解析
    const cleanFlags = flags.replace(/\s+(<[^>]+>|\[[^\]]+\])$/, '');
    
    // 解析短标志和长标志
    const parts = cleanFlags.split(',').map(part => part.trim());
    
    for (const part of parts) {
        if (part.startsWith('--')) {
            result.long = part;
        } else if (part.startsWith('-')) {
            result.short = part;
        }
    }
    
    return result;
}

/**
 * 解析参数名称，判断是否为可选参数
 * @param name 参数名称
 * @returns 解析结果
 */
export function parseArgumentName(name: string): { name: string; optional: boolean; required: boolean } {
    if (name.startsWith('[') && name.endsWith(']')) {
        return {
            name: name.slice(1, -1),
            optional: true,
            required: false
        };
    }
    
    if (name.startsWith('<') && name.endsWith('>')) {
        return {
            name: name.slice(1, -1),
            optional: false,
            required: true
        };
    }
    
    return {
        name,
        optional: false,
        required: false
    };
}

// ============================================================================
// Common Zod Schemas - 常用 Zod 模式
// ============================================================================

/**
 * 常用的 Zod 验证模式
 */
export const CommonSchemas = {
    /** 端口号 */
    port: z.coerce.number().int().min(1).max(65535),
    
    /** 主机地址 */
    host: z.string().min(1),
    
    /** 环境名称 */
    environment: z.enum(['development', 'production', 'test', 'staging']),
    
    /** 文件路径 */
    filePath: z.string().min(1),
    
    /** URL */
    url: z.string().url(),
    
    /** 邮箱 */
    email: z.string().email(),
    
    /** 正整数 */
    positiveInt: z.coerce.number().int().positive(),
    
    /** 非负整数 */
    nonNegativeInt: z.coerce.number().int().min(0),
    
    /** 布尔值 */
    boolean: z.coerce.boolean(),
    
    /** JSON 字符串 */
    json: z.string().transform((str, ctx) => {
        try {
            return JSON.parse(str);
        } catch {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid JSON' });
            return z.NEVER;
        }
    })
};

// ============================================================================
// Helper Functions - 辅助函数
// ============================================================================

/**
 * 创建带有常用验证的选项配置
 * @param flags 标志
 * @param description 描述
 * @param schema Zod 模式
 * @param defaultValue 默认值
 * @returns 选项配置
 */
export function createOptionConfig(
    flags: FlagFormat,
    description: string,
    schema?: ZodTypeAny,
    defaultValue?: unknown
): OptionOptions {
    return {
        flags,
        description,
        zod: schema,
        defaultValue
    };
}

/**
 * 创建带有常用验证的参数配置
 * @param name 参数名称
 * @param description 描述
 * @param schema Zod 模式
 * @param defaultValue 默认值
 * @returns 参数配置
 */
export function createArgumentConfig(
    name: ArgumentFormat,
    description: string,
    schema?: ZodTypeAny,
    defaultValue?: unknown
): ArgumentOptions {
    return {
        name,
        description,
        zod: schema,
        defaultValue
    };
}

/**
 * 合并多个验证结果
 * @param results 验证结果数组
 * @returns 合并后的验证结果
 */
export function mergeValidationResults(...results: ValidationResult[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    for (const result of results) {
        errors.push(...result.errors);
        if (result.warnings) {
            warnings.push(...result.warnings);
        }
    }
    
    return {
        valid: errors.length === 0,
        errors,
        warnings: warnings.length > 0 ? warnings : undefined
    };
}

/**
 * 格式化验证错误信息
 * @param result 验证结果
 * @returns 格式化的错误信息
 */
export function formatValidationErrors(result: ValidationResult): string {
    if (result.valid) {
        return '';
    }
    
    let message = 'Validation failed:\n';
    
    if (result.errors.length > 0) {
        message += 'Errors:\n';
        message += result.errors.map(error => `  - ${error}`).join('\n');
    }
    
    if (result.warnings && result.warnings.length > 0) {
        message += '\nWarnings:\n';
        message += result.warnings.map(warning => `  - ${warning}`).join('\n');
    }
    
    return message;
}
