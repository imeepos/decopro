import {container, registry} from "tsyringe";
import {Injector} from "./injector";
import {APP_INIT, CORE_MODULE, isAppInit} from "./tokens";
import {Type} from "./types";

@registry([{token: Injector, useFactory: (d) => new Injector(d)}])
export class CoreModule {}

export async function bootstrap(modules: Type<any>[]) {
  container.register(CORE_MODULE, {useValue: CoreModule});
  modules.map((module) => container.register(CORE_MODULE, {useValue: module}));
  const injector = container.resolve(Injector);
  const appInits = injector.getAll(APP_INIT);

  // 创建映射：target -> 初始化任务信息
  const initMap = new Map<any, {instance: any; deps: any[]}>();

  // 初始化映射表
  for (const init of appInits) {
    const instance = injector.get(init.target);
    if (isAppInit(instance)) {
      initMap.set(init.target, {
        instance,
        deps: init.options.deps || [] // 确保deps存在
      });
    }
  }

  // 拓扑排序辅助函数
  function topologicalSort(
    target: any,
    visited: Set<any> = new Set(),
    path: Set<any> = new Set(),
    result: any[] = []
  ) {
    if (visited.has(target)) return result;

    // 循环依赖检测
    if (path.has(target)) {
      throw new Error(`Cyclic dependency detected in APP_INIT: ${target}`);
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
  for (const [target] of initMap) {
    const order = topologicalSort(target, visited);
    for (const target of order) {
      const {instance} = initMap.get(target)!;
      await instance.onInit(); // 按拓扑顺序执行初始化
    }
  }
}

export * from "tsyringe";
export {Injector};
export * from "./types";
export * from "./decorator";
export * from "./tokens";
export * from "./input";
