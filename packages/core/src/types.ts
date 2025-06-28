import { InjectionToken, isNormalToken } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";

/**
 * 表示一个可构造的类型
 */
export type Type<T = any> = constructor<T>;

/**
 * 类型守卫：检查值是否为构造函数类型
 */
export function isType<T>(val: unknown): val is Type<T> {
    return typeof val === "function" && val.prototype !== undefined;
}

/**
 * 表示具有注入令牌的对象
 */
export interface HasToken<T = any> {
    token: InjectionToken<T> | InjectionToken<T>[];
}

/**
 * 类型守卫：检查对象是否具有有效的注入令牌
 */
export function hasToken<T>(val: unknown): val is HasToken<T> {
    if (!val || typeof val !== "object") return false;

    const token = Reflect.get(val, "token");
    return isNormalToken(token) || isType(token) || Array.isArray(token);
}

/**
 * 生命周期接口：初始化
 */
export interface OnInit {
    onInit(): Promise<void>;
}

/**
 * 类型守卫：检查对象是否实现了OnInit接口
 */
export function isOnInit(val: unknown): val is OnInit {
    return (
        val !== null &&
        typeof val === "object" &&
        "onInit" in val &&
        typeof (val as any).onInit === "function"
    );
}

/**
 * 生命周期接口：销毁（修正拼写错误）
 */
export interface OnDestroy {
    onDestroy(): Promise<void>;
}

/**
 * 类型守卫：检查对象是否实现了OnDestroy接口
 */
export function isOnDestroy(val: unknown): val is OnDestroy {
    return (
        val !== null &&
        typeof val === "object" &&
        "onDestroy" in val &&
        typeof (val as any).onDestroy === "function"
    );
}

/**
 * 带有类型名称的JSON对象接口
 */
export interface JsonWithTypeName {
    readonly __typeName: string;
}

/**
 * 类型守卫：检查对象是否为带类型名称的JSON
 */
export function isJsonWithTypeName(val: unknown): val is JsonWithTypeName {
    return (
        val !== null &&
        typeof val === "object" &&
        "__typeName" in val &&
        typeof (val as any).__typeName === "string"
    );
}
