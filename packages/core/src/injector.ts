import {DependencyContainer, InjectionToken} from "tsyringe";
import {CLASS_TOKEN} from "./decorator";
import {Type, isJsonWithTypeName} from "./types";
import {INPUT_TOKEN} from "./input";
import {
  ClassNameNotFoundError,
  DuplicateClassNameError,
  JsonWithTypeNameError
} from "./error";

export class Injector {
  constructor(public readonly injector: DependencyContainer) {}
  get<T>(token: InjectionToken<T>): T {
    return this.injector.resolve(token);
  }
  getAll<T>(token: InjectionToken<T>): T[] {
    try {
      return this.injector.resolveAll(token);
    } catch (e) {
      return [];
    }
  }
  create() {
    return new Injector(this.injector.createChildContainer());
  }

  toJson<T>(instance: T, type: Type<T>) {
    const inputs = this.getAll(INPUT_TOKEN).filter((it) => it.target === type);
    const obj = {__typeName: type.name};
    inputs.map((input) => {
      const val = Reflect.get(instance as object, input.property);
      const target = input.options.target;
      if (target) {
        const type = target();
        const typeValue = this.toJson(val, type);
        Reflect.set(obj, input.options.name || input.property, typeValue);
      } else {
        Reflect.set(obj, input.options.name || input.property, val);
      }
    });
    return obj;
  }
  fromJson(obj: any, type?: Type<any>) {
    if (!type) {
      if (!isJsonWithTypeName(obj)) throw new JsonWithTypeNameError();
      const types = this.filterTypeByName(obj.__typeName);
      if (types.length === 0) {
        throw new ClassNameNotFoundError(obj.__typeName);
      }
      if (types.length > 1) {
        throw new DuplicateClassNameError(obj.__typeName);
      }
      type = types[0].target;
    }
    const injector = this.create();
    const instance = injector.get(type!);
    const inputs = this.getAll(INPUT_TOKEN).filter((it) => it.target === type);
    inputs.map((input) => {
      const target = input.options.target;
      const val = Reflect.get(obj, input.options.name || input.property);
      if (target) {
        const type = target();
        const typeValue = this.fromJson(val, type);
        Reflect.set(instance, input.property, typeValue);
      } else {
        Reflect.set(instance, input.property, val);
      }
    });
    return instance;
  }

  private filterTypeByName(name: string) {
    return this.getAll(CLASS_TOKEN)
      .map((token) => this.getAll(token))
      .flat()
      .filter((it) => it.target.name === name);
  }
}
