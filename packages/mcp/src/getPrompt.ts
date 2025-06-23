import { InjectionToken } from "@decopro/core";

export async function getPrompt<T>(token: InjectionToken<T>): Promise<T> {
    throw new Error(`method not implements`);
}
