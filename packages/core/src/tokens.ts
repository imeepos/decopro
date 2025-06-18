import {InjectionToken} from "tsyringe";
import {Type} from "./types";
import {ClassMetadata, createClassDecorator} from "./decorator";

export const CORE_MODULE = Symbol.for(`CORE_MODULE`) as InjectionToken<
  Type<any>
>;

export interface AppInitOptions {
  deps?: Type<any>[];
}
export interface AppInit {
  onInit(): Promise<void>;
}
export function isAppInit(val: any): val is AppInit {
  return val && val.onInit && typeof val.onInit === "function";
}
export const APP_INIT = Symbol.for(`APP_INIT`) as InjectionToken<
  ClassMetadata<AppInitOptions>
>;
export const AppInit = createClassDecorator(APP_INIT);
