import { ClassMetadata, createClassDecorator, createMethodDecorator, createPropertyDecorator, InjectionToken, MethodMetadata, PropertyMetadata } from "@decopro/core";
import { ZodTypeAny } from 'zod'

// option
export interface OptionOptions {
    flags: string;
    description: string;
    zod: ZodTypeAny;
}
export const OPTION_TOKEN = Symbol.for(`OPTION_TOKEN`) as InjectionToken<PropertyMetadata<OptionOptions>>;
export const Option = createPropertyDecorator(OPTION_TOKEN)

// action
export interface ActionOptions { }
export const ACTION_TOKEN = Symbol.for(`ACTION_TOKEN`) as InjectionToken<MethodMetadata<ActionOptions>>
export const Action = createMethodDecorator(ACTION_TOKEN)

// argument
export interface ArgumentOptions {
    name: string;
    description?: string;
    defaultValue?: unknown;
}
export const ARGUMENT_TOKEN = Symbol.for(`ARGUMENT_TOKEN`) as InjectionToken<PropertyMetadata<ArgumentOptions>>;
export const Argument = createPropertyDecorator(ARGUMENT_TOKEN)

// commander
export interface CommanderOptions {
    name: string;
    alias?: string;
    summary?: string;
    description: string;
}
export const COMMANDER_TOKEN = Symbol.for(`COMMANDER_TOKEN`) as InjectionToken<ClassMetadata<CommanderOptions>>
export const Commander = createClassDecorator(COMMANDER_TOKEN)
