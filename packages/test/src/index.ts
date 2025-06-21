import {
    ClassMetadata,
    InjectionToken,
    Injector,
    MethodMetadata,
    createClassDecorator,
    createMethodDecorator
} from "@decopro/core";

export interface TestOptions {
    description?: string;
}
export const TEST_TOKEN = `TEST_TOKEN` as InjectionToken<
    MethodMetadata<TestOptions>
>;
export const Test = createMethodDecorator(TEST_TOKEN);


export async function runTest(injector: Injector) {
    const testMethods = injector.getAll(TEST_TOKEN);
    const result = await Promise.all(
        testMethods.map(async (it) => {
            const instance = injector.get(it.target);
            const method = Reflect.get(instance, it.property);
            if (method && typeof method === "function") {
                const result = await method.bind(instance)();
                return { ...it, result: result };
            }
            return { ...it, result: null };
        })
    );
    return result;
}
