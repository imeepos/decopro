import { DependencyContainer, InjectionToken } from "tsyringe";
import { CLASS_TOKEN } from "./decorator";
import { Type, isJsonWithTypeName } from "./types";
import { INPUT_TOKEN } from "./input";
import {
    ClassNameNotFoundError,
    DuplicateClassNameError,
    JsonWithTypeNameError,
    InjectionError
} from "./error";

/**
 * 增强的依赖注入器，提供类型安全的依赖解析和序列化功能
 */
export class Injector {
    constructor(public readonly injector: DependencyContainer) {}

    /**
     * 解析单个依赖
     * @param token 注入令牌
     * @returns 解析的实例
     * @throws InjectionError 当解析失败时
     */
    get<T>(token: InjectionToken<T>): T {
        try {
            return this.injector.resolve(token);
        } catch (error) {
            const tokenStr =
                typeof token === "symbol" ? token.toString() : String(token);
            throw new InjectionError(
                tokenStr,
                error instanceof Error ? error.message : String(error)
            );
        }
    }

    /**
     * 解析所有匹配的依赖
     * @param token 注入令牌
     * @returns 解析的实例数组
     */
    getAll<T>(token: InjectionToken<T>): T[] {
        try {
            return this.injector.resolveAll(token);
        } catch (error) {
            // 如果没有找到任何实例，返回空数组而不是抛出错误
            return [];
        }
    }

    /**
     * 创建子容器
     * @returns 新的Injector实例
     */
    create(): Injector {
        return new Injector(this.injector.createChildContainer());
    }

    /**
     * 检查是否可以解析指定的令牌
     * @param token 注入令牌
     * @returns 是否可以解析
     */
    canResolve<T>(token: InjectionToken<T>): boolean {
        try {
            this.injector.resolve(token);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 将实例序列化为JSON对象
     * @param instance 要序列化的实例
     * @param _type 可选的类型信息
     * @returns 序列化后的JSON对象
     */
    toJson<T>(instance: T, _type?: Type<T>): any {
        // 处理null、undefined和基本类型
        if (instance === null || instance === undefined) {
            return instance;
        }

        if (typeof instance !== "object") {
            return instance;
        }

        // 处理数组
        if (Array.isArray(instance)) {
            return instance.map((item) => this.toJson(item));
        }

        // 处理Date等内置对象
        if (instance instanceof Date) {
            return instance.toISOString();
        }

        const type = _type || (instance.constructor as Type<T>);
        if (!type || !type.name) {
            return instance;
        }

        const inputs = this.getAll(INPUT_TOKEN).filter(
            (it) => it.target === type
        );

        const obj: any = { __typeName: type.name };

        for (const input of inputs) {
            try {
                const val = Reflect.get(instance as object, input.property);
                const propertyName = input.options.name || input.property;

                if (Array.isArray(val)) {
                    obj[propertyName] = val.map((v) => {
                        if (v && typeof v === "object" && v.constructor) {
                            return this.toJson(v, v.constructor);
                        }
                        return this.toJson(v);
                    });
                } else if (val !== null && val !== undefined) {
                    let target = val.constructor;
                    if (input.options?.target) {
                        target = input.options.target();
                    }

                    if (target && typeof val === "object") {
                        obj[propertyName] = this.toJson(val, target);
                    } else {
                        obj[propertyName] = val;
                    }
                } else {
                    obj[propertyName] = val;
                }
            } catch (error) {
                // 记录序列化错误但继续处理其他属性
                console.warn(
                    `Failed to serialize property ${String(input.property)}:`,
                    error
                );
                obj[input.options.name || input.property] = null;
            }
        }

        return obj;
    }
    /**
     * 从JSON对象反序列化为实例
     * @param obj JSON对象
     * @param type 可选的目标类型
     * @returns 反序列化的实例
     * @throws JsonWithTypeNameError 当JSON对象缺少类型信息时
     * @throws ClassNameNotFoundError 当找不到对应的类时
     * @throws DuplicateClassNameError 当存在重复的类名时
     */
    fromJson<T = any>(obj: any, type?: Type<T>): T {
        // 处理null、undefined和基本类型
        if (obj === null || obj === undefined || typeof obj !== "object") {
            return obj;
        }

        // 处理数组
        if (Array.isArray(obj)) {
            return obj.map((item) => this.fromJson(item)) as any;
        }

        // 如果没有提供类型，尝试从对象中获取
        if (!type) {
            if (!isJsonWithTypeName(obj)) {
                throw new JsonWithTypeNameError(
                    "Object missing __typeName property"
                );
            }

            const types = this.filterTypeByName(obj.__typeName);
            if (types.length === 0) {
                throw new ClassNameNotFoundError(obj.__typeName);
            }
            if (types.length > 1) {
                throw new DuplicateClassNameError(obj.__typeName);
            }
            type = types[0].target;
        }

        // 创建子注入器以避免污染父容器
        const childInjector = this.create();
        const instance = childInjector.get(type);

        const inputs = this.getAll(INPUT_TOKEN).filter(
            (it) => it.target === type
        );

        for (const input of inputs) {
            try {
                const propertyName = input.options.name || input.property;
                const val = Reflect.get(obj, propertyName);

                if (val === null || val === undefined) {
                    Reflect.set(instance as object, input.property, val);
                    continue;
                }

                if (input.options.target) {
                    const targetType = input.options.target();

                    if (Array.isArray(val)) {
                        const deserializedArray = val.map((item) =>
                            this.fromJson(item, targetType)
                        );
                        Reflect.set(
                            instance as object,
                            input.property,
                            deserializedArray
                        );
                    } else {
                        const deserializedValue = this.fromJson(
                            val,
                            targetType
                        );
                        Reflect.set(
                            instance as object,
                            input.property,
                            deserializedValue
                        );
                    }
                } else {
                    // 对于没有目标类型的属性，直接设置值
                    if (Array.isArray(val)) {
                        const deserializedArray = val.map((item) =>
                            this.fromJson(item)
                        );
                        Reflect.set(
                            instance as object,
                            input.property,
                            deserializedArray
                        );
                    } else if (
                        typeof val === "object" &&
                        isJsonWithTypeName(val)
                    ) {
                        const deserializedValue = this.fromJson(val);
                        Reflect.set(
                            instance as object,
                            input.property,
                            deserializedValue
                        );
                    } else {
                        Reflect.set(instance as object, input.property, val);
                    }
                }
            } catch (error) {
                // 记录反序列化错误但继续处理其他属性
                console.warn(
                    `Failed to deserialize property ${String(input.property)}:`,
                    error
                );
            }
        }

        return instance;
    }

    /**
     * 根据类名过滤类型
     * @param name 类名
     * @returns 匹配的类型元数据数组
     */
    private filterTypeByName(name: string) {
        return this.getAll(CLASS_TOKEN)
            .map((token) => this.getAll(token))
            .flat()
            .filter((it) => it.target.name === name);
    }

    /**
     * 获取所有已注册的类型名称
     * @returns 类型名称数组
     */
    getRegisteredTypeNames(): string[] {
        return this.getAll(CLASS_TOKEN)
            .map((token) => this.getAll(token))
            .flat()
            .map((it) => it.target.name)
            .filter((name, index, array) => array.indexOf(name) === index); // 去重
    }

    /**
     * 检查指定类型是否已注册
     * @param type 要检查的类型
     * @returns 是否已注册
     */
    isTypeRegistered<T>(type: Type<T>): boolean {
        return this.getRegisteredTypeNames().includes(type.name);
    }

    /**
     * 清理资源（如果实例实现了OnDestroy接口）
     * @param instance 要清理的实例
     */
    async cleanup(instance: any): Promise<void> {
        if (
            instance &&
            typeof instance === "object" &&
            "onDestroy" in instance
        ) {
            if (typeof instance.onDestroy === "function") {
                try {
                    await instance.onDestroy();
                } catch (error) {
                    console.warn("Error during cleanup:", error);
                }
            }
        }
    }
}
