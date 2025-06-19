import {InjectionToken} from "tsyringe";
import {
  ClassMetadata,
  PropertyMetadata,
  createClassDecorator,
  createPropertyDecorator
} from "./decorator";
import {Type} from "./types";

export interface InputOptions<T = any> {
  name?: string;
  target?: () => Type<T>;
}
export const INPUT_TOKEN = Symbol.for(`INPUT_TOKEN`) as InjectionToken<
  PropertyMetadata<InputOptions>
>;
export const Input = createPropertyDecorator(INPUT_TOKEN);

export interface InjectableOptions {
  token?: InjectionToken<any> | InjectionToken<any>[];
}
export const INJECTABLE_TOKEN = Symbol.for(`INJECTABLE_TOKEN`) as InjectionToken<
  ClassMetadata<InjectableOptions>
>;
export const Injectable = createClassDecorator(INJECTABLE_TOKEN);
