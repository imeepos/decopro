import {InjectionToken, container, injectable} from "tsyringe";
import {Type, hasToken} from "./types";
export interface ClassMetadata<O> {
  target: Type<any>;
  options: O;
}
export const CLASS_TOKEN = `CLASS_TOKEN` as InjectionToken<
  InjectionToken<ClassMetadata<any>>
>;
export function createClassDecorator<O>(
  token: InjectionToken<ClassMetadata<O>>
) {
  container.register(CLASS_TOKEN, {useValue: token});
  return (options: O): ClassDecorator => {
    return (target) => {
      const type = target as unknown as Type<any>;
      container.register(token, {
        useValue: {
          target: type,
          options: options
        }
      });
      if (hasToken(options)) {
        return injectable({token: options.token})(type);
      }
      return injectable()(type);
    };
  };
}
export const PROPERTY_TOKEN = `PROPERTY_TOKEN` as InjectionToken<
  InjectionToken<PropertyMetadata<any>>
>;
export interface PropertyMetadata<O> {
  target: Type<any>;
  property: string | symbol;
  options: O;
}
export function createPropertyDecorator<O>(
  token: InjectionToken<PropertyMetadata<O>>
) {
  container.register(PROPERTY_TOKEN, {useValue: token});
  return (options: O): PropertyDecorator => {
    return (target, property) => {
      container.register(token, {
        useValue: {
          target: target.constructor as Type<any>,
          property,
          options
        }
      });
    };
  };
}

export const METHOD_TOKEN = `METHOD_TOKEN` as InjectionToken<
  InjectionToken<MethodMetadata<any>>
>;
export interface MethodMetadata<O> {
  target: Type<any>;
  property: string | symbol;
  descriptor: TypedPropertyDescriptor<any>;
  options: O;
}
export function createMethodDecorator<O>(
  token: InjectionToken<MethodMetadata<O>>
) {
  container.register(METHOD_TOKEN, {useValue: token});
  return (options: O): MethodDecorator => {
    return (target, property, descriptor) => {
      container.register(token, {
        useValue: {
          target: target.constructor as Type<any>,
          property,
          options,
          descriptor
        }
      });
    };
  };
}

export const PARAMETER_TOKEN = `PARAMETER_TOKEN` as InjectionToken<
  InjectionToken<ParameterMetadata<any>>
>;
export interface ParameterMetadata<O> {
  target: Type<any>;
  property: string | symbol | undefined;
  parameterIndex: number;
  options: O;
}
export function createParameterDecorator<O>(
  token: InjectionToken<ParameterMetadata<O>>
) {
  container.register(PARAMETER_TOKEN, {useValue: token});
  return (options: O): ParameterDecorator => {
    return (target, property, parameterIndex) => {
      container.register(token, {
        useValue: {
          target: target.constructor as Type<any>,
          property,
          options,
          parameterIndex
        }
      });
    };
  };
}
