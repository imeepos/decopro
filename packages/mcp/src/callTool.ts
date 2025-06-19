import {InjectionToken} from "@decopro/core";

export async function toolCall<R>(
  name: InjectionToken<R>,
  args: any
): Promise<R> {
  throw new Error(`not implements`);
}
