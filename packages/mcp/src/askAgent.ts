import {InjectionToken} from "@decopro/core";

export async function askAgent<R>(
  name: InjectionToken<R>,
  message: string
): Promise<R> {
  throw new Error(`not implements`);
}
