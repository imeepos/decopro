import {InjectionToken} from "@decopro/core";

export async function runWorkflow<T>(token: InjectionToken<T>): Promise<T> {
  throw new Error(`method not found`);
}
