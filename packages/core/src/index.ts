import { container, registry } from "tsyringe";
import { Injector } from "./injector";
import { APP_INIT, CORE_MODULE, isAppInit } from "./tokens";
import { Type } from "./types";
import { CircularDependencyError } from "./error";

/**
 * 核心模块，提供基础的依赖注入功能
 */
@registry([{ token: Injector, useFactory: (d) => new Injector(d) }])
export class CoreModule {}

/**
 * 引导配置选项
 */
export interface BootstrapOptions {
    /** 是否启用调试模式 */
    debug?: boolean;
    /** 初始化超时时间（毫秒） */
    timeout?: number;
    /** 错误处理策略 */
    errorStrategy?: "throw" | "warn" | "ignore";
}

/**
 * 引导应用程序
 * @param modules 要注册的模块数组
 * @param options 引导选项
 * @returns Promise<Injector> 配置好的注入器实例
 */
export async function bootstrap(
    modules: Type<any>[],
    options: BootstrapOptions = {}
): Promise<Injector> {
    const { debug = false, timeout = 30000, errorStrategy = "throw" } = options;

    if (debug) {
        console.log(`[Bootstrap] Starting with ${modules.length} modules`);
    }

    try {
        // 注册核心模块
        container.register(CORE_MODULE, { useValue: CoreModule });

        // 注册用户模块
        modules.forEach((module) => {
            container.register(CORE_MODULE, { useValue: module });
            if (debug) {
                console.log(`[Bootstrap] Registered module: ${module.name}`);
            }
        });

        const injector = container.resolve(Injector);
        const appInits = injector.getAll(APP_INIT);

        if (debug) {
            console.log(
                `[Bootstrap] Found ${appInits.length} app initializers`
            );
        }

        // 首先注册所有模块到容器中，确保依赖注入能够正常工作
        for (const init of appInits) {
            // 注册模块本身
            if (!container.isRegistered(init.target)) {
                container.register(init.target, { useClass: init.target });
            }

            // 注册模块的依赖项
            const deps = init.options.deps || [];
            for (const dep of deps) {
                if (!container.isRegistered(dep)) {
                    container.register(dep, { useClass: dep });
                }
            }
        }

        // 创建映射：target -> 初始化任务信息
        const initMap = new Map<any, { instance: any; deps: any[] }>();

        // 初始化映射表
        for (const init of appInits) {
            try {
                const instance = injector.get(init.target);
                if (isAppInit(instance)) {
                    initMap.set(init.target, {
                        instance,
                        deps: init.options.deps || []
                    });
                    if (debug) {
                        console.log(
                            `[Bootstrap] Prepared initializer: ${init.target.name}`
                        );
                    }
                }
            } catch (error) {
                const message = `Failed to create instance for ${init.target.name}`;
                if (errorStrategy === "throw") {
                    throw new Error(
                        message +
                            ": " +
                            (error instanceof Error
                                ? error.message
                                : String(error))
                    );
                } else if (errorStrategy === "warn") {
                    console.warn(message, error);
                }
            }
        }

        // 拓扑排序辅助函数
        function topologicalSort(
            target: any,
            visited: Set<any> = new Set(),
            path: Set<any> = new Set(),
            result: any[] = []
        ): any[] {
            if (visited.has(target)) return result;

            // 循环依赖检测
            if (path.has(target)) {
                const pathArray = Array.from(path).map(
                    (t) => t.name || t.toString()
                );
                throw new CircularDependencyError([
                    ...pathArray,
                    target.name || target.toString()
                ]);
            }
            path.add(target);

            const initInfo = initMap.get(target);
            if (initInfo) {
                // 递归处理依赖
                for (const dep of initInfo.deps) {
                    topologicalSort(dep, visited, new Set(path), result);
                }

                // 所有依赖处理完成后添加当前节点
                if (!visited.has(target)) {
                    visited.add(target);
                    result.push(target);
                }
            }
            return result;
        }

        // 执行所有初始化任务
        const visited = new Set<any>();
        const initPromises: Promise<void>[] = [];

        for (const [target] of initMap) {
            const order = topologicalSort(target, visited);
            for (const targetToInit of order) {
                const initInfo = initMap.get(targetToInit);
                if (initInfo) {
                    const initPromise = Promise.race([
                        initInfo.instance.onInit(),
                        new Promise<never>((_, reject) =>
                            setTimeout(
                                () =>
                                    reject(
                                        new Error(
                                            `Initialization timeout for ${targetToInit.name}`
                                        )
                                    ),
                                timeout
                            )
                        )
                    ]);

                    initPromises.push(initPromise);

                    if (debug) {
                        console.log(
                            `[Bootstrap] Initialized: ${targetToInit.name}`
                        );
                    }
                }
            }
        }

        // 等待所有初始化完成
        await Promise.all(initPromises);

        if (debug) {
            console.log("[Bootstrap] All modules initialized successfully");
        }

        return injector;
    } catch (error) {
        const message = "Bootstrap failed";
        if (errorStrategy === "throw") {
            throw error;
        } else if (errorStrategy === "warn") {
            console.warn(message, error);
            return container.resolve(Injector) as Injector;
        } else {
            return container.resolve(Injector) as Injector;
        }
    }
}

// 重新导出tsyringe的核心功能，但排除与我们自定义Injector冲突的部分
export {
    container,
    registry,
    injectable,
    inject,
    singleton,
    scoped,
    Lifecycle,
    instanceCachingFactory,
    instancePerContainerCachingFactory,
    InjectionToken
} from "tsyringe";

// 导出我们自己的模块
export { Injector } from "./injector";
export * from "./types";
export * from "./decorator";
export * from "./tokens";
export * from "./input";
export * from "./error";
export * from "./LinkedList";
export * from "./DirectedGraph";
export * from "./UndirectedGraph";
