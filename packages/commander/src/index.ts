import {
    ClassMetadata,
    createClassDecorator,
    createMethodDecorator,
    createPropertyDecorator,
    InjectionToken,
    MethodMetadata,
    PropertyMetadata,
    BasePropertyOptions,
    BaseMethodOptions,
    BaseDecoratorOptions
} from "@decopro/core";
import { ZodTypeAny } from "zod";

// option
export interface OptionOptions extends BasePropertyOptions {
    flags?: string;
    description?: string;
    zod?: ZodTypeAny;
}

export const OPTION_TOKEN = Symbol.for(`OPTION_TOKEN`) as InjectionToken<
    PropertyMetadata<OptionOptions>
>;

/**
 * 创建 Option 装饰器的默认选项
 */
const defaultOptionOptions: Partial<OptionOptions> = {
    flags: "",
    description: ""
};

/**
 * Option 装饰器 - 支持可选参数
 */
export function Option(): PropertyDecorator;
export function Option(options: OptionOptions): PropertyDecorator;
export function Option(options?: OptionOptions): PropertyDecorator {
    const finalOptions = {
        ...defaultOptionOptions,
        ...options
    } as OptionOptions;
    const decorator = createPropertyDecorator(
        OPTION_TOKEN,
        defaultOptionOptions
    );
    return decorator(finalOptions);
}

// action
export interface ActionOptions extends BaseMethodOptions {
    description?: string;
}

export const ACTION_TOKEN = Symbol.for(`ACTION_TOKEN`) as InjectionToken<
    MethodMetadata<ActionOptions>
>;

/**
 * 创建 Action 装饰器的默认选项
 */
const defaultActionOptions: Partial<ActionOptions> = {
    description: ""
};

/**
 * Action 装饰器 - 支持可选参数
 */
export function Action(): MethodDecorator;
export function Action(options: ActionOptions): MethodDecorator;
export function Action(options?: ActionOptions): MethodDecorator {
    const finalOptions = {
        ...defaultActionOptions,
        ...options
    } as ActionOptions;
    const decorator = createMethodDecorator(ACTION_TOKEN, defaultActionOptions);
    return decorator(finalOptions);
}

// argument
export interface ArgumentOptions extends BasePropertyOptions {
    name?: string;
    description?: string;
    defaultValue?: unknown;
}

export const ARGUMENT_TOKEN = Symbol.for(`ARGUMENT_TOKEN`) as InjectionToken<
    PropertyMetadata<ArgumentOptions>
>;

/**
 * 创建 Argument 装饰器的默认选项
 */
const defaultArgumentOptions: Partial<ArgumentOptions> = {
    name: "",
    description: ""
};

/**
 * Argument 装饰器 - 支持可选参数
 */
export function Argument(): PropertyDecorator;
export function Argument(options: ArgumentOptions): PropertyDecorator;
export function Argument(options?: ArgumentOptions): PropertyDecorator {
    const finalOptions = {
        ...defaultArgumentOptions,
        ...options
    } as ArgumentOptions;
    const decorator = createPropertyDecorator(
        ARGUMENT_TOKEN,
        defaultArgumentOptions
    );
    return decorator(finalOptions);
}

// commander
export interface CommanderOptions extends BaseDecoratorOptions {
    name?: string;
    alias?: string;
    summary?: string;
    description?: string;
}

export const COMMANDER_TOKEN = Symbol.for(`COMMANDER_TOKEN`) as InjectionToken<
    ClassMetadata<CommanderOptions>
>;

/**
 * 创建 Commander 装饰器的默认选项
 */
const defaultCommanderOptions: Partial<CommanderOptions> = {
    name: "",
    description: ""
};

/**
 * Commander 装饰器 - 支持可选参数
 */
export function Commander(): ClassDecorator;
export function Commander(options: CommanderOptions): ClassDecorator;
export function Commander(options?: CommanderOptions): ClassDecorator {
    const finalOptions = {
        ...defaultCommanderOptions,
        ...options
    } as CommanderOptions;
    const decorator = createClassDecorator(
        COMMANDER_TOKEN,
        defaultCommanderOptions
    );
    return decorator(finalOptions);
}
