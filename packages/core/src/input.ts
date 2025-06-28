import { InjectionToken } from "tsyringe";
import {
    ClassMetadata,
    PropertyMetadata,
    createClassDecorator,
    createPropertyDecorator,
    BasePropertyOptions,
    BaseDecoratorOptions
} from "./decorator";
import { Type } from "./types";

/**
 * Input 装饰器选项接口
 */
export interface InputOptions<T = any> extends BasePropertyOptions {
    /** 属性的序列化名称 */
    name?: string;
    /** 目标类型工厂函数 */
    target?: () => Type<T>;
    /** 属性描述 */
    description?: string;
    /** 是否必需 */
    required?: boolean;
    /** 默认值 */
    defaultValue?: T;
    /** 值验证器 */
    validator?: (value: T) => boolean | string;
    /** 值转换器 */
    transformer?: (value: any) => T;
    /** 是否只读 */
    readonly?: boolean;
    /** 最小值（用于数字类型） */
    min?: number;
    /** 最大值（用于数字类型） */
    max?: number;
    /** 最小长度（用于字符串/数组类型） */
    minLength?: number;
    /** 最大长度（用于字符串/数组类型） */
    maxLength?: number;
    /** 正则表达式验证（用于字符串类型） */
    pattern?: RegExp;
    /** 枚举值 */
    enum?: T[];
}

export const INPUT_TOKEN = Symbol.for(`INPUT_TOKEN`) as InjectionToken<
    PropertyMetadata<InputOptions>
>;

/**
 * 创建 Input 装饰器的默认选项
 */
const defaultInputOptions: Partial<InputOptions> = {
    required: false,
    readonly: false
};

/**
 * Input 装饰器 - 支持可选参数和高级验证
 */
export const Input = createPropertyDecorator(INPUT_TOKEN, defaultInputOptions);

/**
 * 创建带验证的 Input 装饰器
 */
export function ValidatedInput<T = any>(options: InputOptions<T>): PropertyDecorator {
    // 验证必需字段
    if (options.required && options.defaultValue === undefined) {
        throw new Error('Required field must have a default value or be explicitly handled');
    }

    // 验证数值范围
    if (typeof options.min === 'number' && typeof options.max === 'number' && options.min > options.max) {
        throw new Error('Minimum value cannot be greater than maximum value');
    }

    // 验证长度范围
    if (typeof options.minLength === 'number' && typeof options.maxLength === 'number' && options.minLength > options.maxLength) {
        throw new Error('Minimum length cannot be greater than maximum length');
    }

    return Input(options);
}

/**
 * 创建只读 Input 装饰器
 */
export function ReadonlyInput<T = any>(options?: Omit<InputOptions<T>, 'readonly'>): PropertyDecorator {
    const finalOptions: InputOptions<T> = { readonly: true, ...options };
    return Input(finalOptions);
}

/**
 * 创建必需 Input 装饰器
 */
export function RequiredInput<T = any>(options?: Omit<InputOptions<T>, 'required'>): PropertyDecorator {
    const finalOptions: InputOptions<T> = { required: true, ...options };
    return Input(finalOptions);
}

/**
 * Injectable 装饰器选项接口
 */
export interface InjectableOptions extends BaseDecoratorOptions {
    /** 注入令牌 */
    token?: InjectionToken<any> | InjectionToken<any>[];
    /** 是否为单例 */
    singleton?: boolean;
    /** 作用域 */
    scope?: 'transient' | 'singleton' | 'container';
    /** 工厂函数 */
    factory?: (...args: any[]) => any;
    /** 依赖项 */
    deps?: Array<InjectionToken<any>>;
}

export const INJECTABLE_TOKEN = Symbol.for(
    `INJECTABLE_TOKEN`
) as InjectionToken<ClassMetadata<InjectableOptions>>;

/**
 * 创建 Injectable 装饰器的默认选项
 */
const defaultInjectableOptions: Partial<InjectableOptions> = {
    singleton: false,
    scope: 'transient'
};

/**
 * Injectable 装饰器 - 支持可选参数和高级配置
 */
export const Injectable = createClassDecorator(INJECTABLE_TOKEN, defaultInjectableOptions);

/**
 * 创建单例 Injectable 装饰器
 */
export function Singleton(options?: Omit<InjectableOptions, 'singleton' | 'scope'>): ClassDecorator {
    const finalOptions: InjectableOptions = {
        singleton: true,
        scope: 'singleton' as const,
        ...options
    };
    return Injectable(finalOptions);
}

/**
 * 创建瞬态 Injectable 装饰器
 */
export function Transient(options?: Omit<InjectableOptions, 'scope'>): ClassDecorator {
    const finalOptions: InjectableOptions = {
        scope: 'transient' as const,
        ...options
    };
    return Injectable(finalOptions);
}
