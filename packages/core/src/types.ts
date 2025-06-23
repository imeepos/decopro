import { InjectionToken, isNormalToken } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";

export type Type<T> = constructor<T>;

export function isType<T>(val: any): val is Type<T> {
    return typeof val === "function";
}

export interface HasToken<T> {
    token: InjectionToken<T> | InjectionToken<T>[];
}
export function hasToken<T>(val: any): val is HasToken<T> {
    if (!val) return false;
    if (typeof val === "object") {
        const token = Reflect.get(val, "token");
        if (isNormalToken(token)) return true;
        if (isType(token)) return true;
        return false;
    }
    return false;
}

export interface OnInit {
    onInit(): Promise<void>;
}
export function isOnInit(val: any): val is OnInit {
    return val && val.onInit && typeof val.onInit === "function";
}
export interface OnDestory {
    onDestory(): Promise<void>;
}

export function isOnDestory(val: any): val is OnDestory {
    return val && val.onDestory && typeof val.onDestory === "function";
}

export interface JsonWithTypeName {
    __typeName: string;
}
export function isJsonWithTypeName(val: any): val is JsonWithTypeName {
    return val && val.__typeName && typeof val.__typeName === "string";
}
