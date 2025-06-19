import {InjectionToken} from "@decopro/core";

export async function getResource<T>(token: InjectionToken<T>): Promise<T> {
  throw new Error(`method not implements`);
}
