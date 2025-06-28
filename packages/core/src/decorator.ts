import { InjectionToken, container, injectable } from "tsyringe";
import { Type, hasToken } from "./types";
export type IPropertyDecorator = (target: any, propertyKey: any) => void;

/**
 * 类元数据接口
 */
export interface ClassMetadata<O = any> {
    target: Type<any>;
    options: O;
}

/**
 * 类装饰器选项的基础接口
 */
export interface BaseDecoratorOptions {
    token?: InjectionToken<any> | InjectionToken<any>[];
}

/**
 * 类装饰器工厂函数的重载类型
 */
export interface ClassDecoratorFactory<O> {
    (): ClassDecorator;
    (options: O): ClassDecorator;
}

export const CLASS_TOKEN = Symbol.for(`CLASS_TOKEN`) as InjectionToken<
    InjectionToken<ClassMetadata<any>>
>;

/**
 * 创建类装饰器，支持可选参数
 * @param token 注入令牌
 * @param defaultOptions 默认选项
 */
export function createClassDecorator<
    O extends BaseDecoratorOptions = BaseDecoratorOptions
>(
    token: InjectionToken<ClassMetadata<O>>,
    defaultOptions?: Partial<O>
): ClassDecoratorFactory<O> {
    container.register(CLASS_TOKEN, { useValue: token });

    function decorator(): ClassDecorator;
    function decorator(options: O): ClassDecorator;
    function decorator(options?: O): ClassDecorator {
        return (target) => {
            const type = target as unknown as Type<any>;
            const finalOptions = { ...defaultOptions, ...options } as O;

            container.register(token, {
                useValue: {
                    target: type,
                    options: finalOptions
                }
            });

            if (hasToken(finalOptions)) {
                return injectable({ token: finalOptions.token })(type);
            }
            return injectable()(type);
        };
    }

    return decorator;
}
/**
 * 属性元数据接口
 */
export interface PropertyMetadata<O = any> {
    target: Type<any>;
    property: string | symbol;
    options: O;
}

/**
 * 属性装饰器选项的基础接口
 */
export interface BasePropertyOptions {
    name?: string;
    required?: boolean;
    defaultValue?: any;
    validator?: (value: any) => boolean | string;
    transformer?: (value: any) => any;
}

/**
 * 属性装饰器工厂函数的重载类型
 */
export interface PropertyDecoratorFactory<O> {
    (): IPropertyDecorator;
    (options: O): IPropertyDecorator;
}

export const PROPERTY_TOKEN = Symbol.for(`PROPERTY_TOKEN`) as InjectionToken<
    InjectionToken<PropertyMetadata<any>>
>;

/**
 * 创建属性装饰器，支持可选参数
 * @param token 注入令牌
 * @param defaultOptions 默认选项
 */
export function createPropertyDecorator<
    O extends BasePropertyOptions = BasePropertyOptions
>(
    token: InjectionToken<PropertyMetadata<O>>,
    defaultOptions?: Partial<O>
): PropertyDecoratorFactory<O> {
    container.register(PROPERTY_TOKEN, { useValue: token });

    function decorator(): PropertyDecorator;
    function decorator(options: O): PropertyDecorator;
    function decorator(options?: O): PropertyDecorator {
        return (target, property) => {
            const finalOptions = { ...defaultOptions, ...options } as O;

            container.register(token, {
                useValue: {
                    target: target.constructor as Type<any>,
                    property,
                    options: finalOptions
                }
            });
        };
    }

    return decorator;
}

/**
 * 方法元数据接口
 */
export interface MethodMetadata<O = any> {
    target: Type<any>;
    property: string | symbol;
    descriptor: TypedPropertyDescriptor<any>;
    options: O;
}

/**
 * 方法装饰器选项的基础接口
 */
export interface BaseMethodOptions {
    async?: boolean;
    timeout?: number;
    retries?: number;
    cache?: boolean;
    middleware?: Array<
        (
            target: any,
            property: string | symbol,
            descriptor: PropertyDescriptor
        ) => void
    >;
}

/**
 * 方法装饰器工厂函数的重载类型
 */
export interface MethodDecoratorFactory<O> {
    (): MethodDecorator;
    (options: O): MethodDecorator;
}

export const METHOD_TOKEN = Symbol.for(`METHOD_TOKEN`) as InjectionToken<
    InjectionToken<MethodMetadata<any>>
>;

/**
 * 创建方法装饰器，支持可选参数
 * @param token 注入令牌
 * @param defaultOptions 默认选项
 */
export function createMethodDecorator<
    O extends BaseMethodOptions = BaseMethodOptions
>(
    token: InjectionToken<MethodMetadata<O>>,
    defaultOptions?: Partial<O>
): MethodDecoratorFactory<O> {
    container.register(METHOD_TOKEN, { useValue: token });

    function decorator(): MethodDecorator;
    function decorator(options: O): MethodDecorator;
    function decorator(options?: O): MethodDecorator {
        return (target, property, descriptor) => {
            const finalOptions = { ...defaultOptions, ...options } as O;

            container.register(token, {
                useValue: {
                    target: target.constructor as Type<any>,
                    property,
                    options: finalOptions,
                    descriptor
                }
            });
        };
    }

    return decorator;
}

/**
 * 参数元数据接口
 */
export interface ParameterMetadata<O = any> {
    target: Type<any>;
    property: string | symbol | undefined;
    parameterIndex: number;
    options: O;
}

/**
 * 参数装饰器选项的基础接口
 */
export interface BaseParameterOptions {
    name?: string;
    type?: Type<any>;
    optional?: boolean;
    defaultValue?: any;
    validator?: (value: any) => boolean;
    transformer?: (value: any) => any;
}

/**
 * 参数装饰器工厂函数的重载类型
 */
export interface ParameterDecoratorFactory<O> {
    (): ParameterDecorator;
    (options: O): ParameterDecorator;
}

export const PARAMETER_TOKEN = Symbol.for(`PARAMETER_TOKEN`) as InjectionToken<
    InjectionToken<ParameterMetadata<any>>
>;

/**
 * 创建参数装饰器，支持可选参数
 * @param token 注入令牌
 * @param defaultOptions 默认选项
 */
export function createParameterDecorator<
    O extends BaseParameterOptions = BaseParameterOptions
>(
    token: InjectionToken<ParameterMetadata<O>>,
    defaultOptions?: Partial<O>
): ParameterDecoratorFactory<O> {
    container.register(PARAMETER_TOKEN, { useValue: token });

    function decorator(): ParameterDecorator;
    function decorator(options: O): ParameterDecorator;
    function decorator(options?: O): ParameterDecorator {
        return (target, property, parameterIndex) => {
            const finalOptions = { ...defaultOptions, ...options } as O;

            container.register(token, {
                useValue: {
                    target: target.constructor as Type<any>,
                    property,
                    options: finalOptions,
                    parameterIndex
                }
            });
        };
    }

    return decorator;
}

// ============================================================================
// 高级装饰器工具函数
// ============================================================================

/**
 * 条件装饰器：根据条件决定是否应用装饰器
 */
export function conditional<T extends (...args: any[]) => any>(
    condition: boolean | (() => boolean),
    decorator: T
): T {
    return ((...args: any[]) => {
        const shouldApply =
            typeof condition === "function" ? condition() : condition;
        if (shouldApply) {
            return decorator(...args);
        }
        return (target: any) => target; // 返回无操作装饰器
    }) as T;
}

/**
 * 组合装饰器：将多个装饰器组合成一个
 */
export function compose(...decorators: Array<ClassDecorator>): ClassDecorator {
    return (target: any) => {
        return decorators.reduce((acc, decorator) => {
            return decorator(acc) || acc;
        }, target);
    };
}

/**
 * 异步装饰器：支持异步初始化的装饰器
 */
export function async<O>(
    asyncDecorator: (options?: O) => Promise<ClassDecorator>
): (options?: O) => ClassDecorator {
    return (options?: O) => {
        return (target) => {
            // 异步装饰器的处理逻辑
            asyncDecorator(options)
                .then((decorator) => {
                    decorator(target);
                })
                .catch((error) => {
                    console.error("Async decorator failed:", error);
                });
            return target;
        };
    };
}

/**
 * 缓存装饰器：缓存装饰器的结果
 */
const decoratorCache = new WeakMap<any, any>();

export function cached<T extends (...args: any[]) => any>(decorator: T): T {
    return ((...args: any[]) => {
        const key = JSON.stringify(args);
        if (
            decoratorCache.has(decorator) &&
            decoratorCache.get(decorator)[key]
        ) {
            return decoratorCache.get(decorator)[key];
        }

        const result = decorator(...args);

        if (!decoratorCache.has(decorator)) {
            decoratorCache.set(decorator, {});
        }
        decoratorCache.get(decorator)[key] = result;

        return result;
    }) as T;
}

/**
 * 验证装饰器选项
 */
export function validateOptions<O>(
    validator: (options: O) => boolean | string,
    errorMessage?: string
): (options: O) => O {
    return (options: O) => {
        const result = validator(options);
        if (result === false || typeof result === "string") {
            const message =
                typeof result === "string"
                    ? result
                    : errorMessage || "Invalid decorator options";
            throw new Error(message);
        }
        return options;
    };
}

/**
 * 类型安全的装饰器选项合并
 */
export function mergeOptions<T, U>(
    defaultOptions: T,
    userOptions?: Partial<U>
): T & Partial<U> {
    return { ...defaultOptions, ...userOptions };
}

/**
 * 装饰器选项的深度合并
 */
export function deepMergeOptions<T, U = Partial<T>>(
    defaultOptions: T,
    userOptions?: U
): T & U {
    if (!userOptions) return defaultOptions as T & U;

    const result = { ...defaultOptions } as any;

    for (const key in userOptions) {
        if (userOptions.hasOwnProperty(key)) {
            const userValue = userOptions[key];
            const defaultValue = (defaultOptions as any)[key];

            if (
                typeof userValue === "object" &&
                userValue !== null &&
                !Array.isArray(userValue) &&
                typeof defaultValue === "object" &&
                defaultValue !== null &&
                !Array.isArray(defaultValue)
            ) {
                result[key] = deepMergeOptions(defaultValue, userValue);
            } else {
                result[key] = userValue;
            }
        }
    }

    return result as T & U;
}
