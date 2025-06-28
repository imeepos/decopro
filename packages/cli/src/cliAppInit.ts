import { AppInit, inject, Injector, OnInit, Type } from "@decopro/core";
import { Command, program } from "commander";
import {
    ACTION_TOKEN,
    ARGUMENT_TOKEN,
    COMMANDER_TOKEN,
    OPTION_TOKEN,
    ActionOptions,
    ArgumentOptions,
    CommanderOptions,
    OptionOptions
} from "@decopro/commander";
import { TestCommand } from "./testCommand";
import { DocsCommand } from "./docsCommand";
import { McpServerCommand } from "./mcpServerCommand";
import { LoginCommand } from "./loginCommand";
import { EnvService } from "./services";
import { ConfigCommand } from "./configCommand";
import { OnlineCommand } from "./onlineCommand";

/**
 * 命令元数据接口
 */
interface CommandMetadata {
    target: Type<any>;
    options: CommanderOptions;
}

/**
 * 参数元数据接口
 */
interface ArgumentMetadata {
    target: Type<any>;
    property: string | symbol;
    options: ArgumentOptions;
}

/**
 * 选项元数据接口
 */
interface OptionMetadata {
    target: Type<any>;
    property: string | symbol;
    options: OptionOptions;
}

/**
 * 动作元数据接口
 */
interface ActionMetadata {
    target: Type<any>;
    property: string | symbol;
    options: ActionOptions;
}

/**
 * CLI 应用初始化器
 * 负责注册和配置所有命令行命令
 */
@AppInit({
    deps: []
})
export class CliAppInit implements OnInit {
    private static readonly commanders: Type<any>[] = [
        TestCommand,
        DocsCommand,
        McpServerCommand,
        LoginCommand,
        ConfigCommand,
        OnlineCommand
    ];

    constructor(@inject(Injector) private readonly injector: Injector) {}

    /**
     * 添加额外的命令类型
     * @param types 要添加的命令类型数组
     * @returns 返回类本身以支持链式调用
     */
    static forRoot(types: Type<any>[] = []): typeof CliAppInit {
        this.commanders.push(...types);
        return this;
    }

    /**
     * 初始化 CLI 应用
     */
    async onInit(): Promise<void> {
        try {
            await this.initializeEnvironment();
            await this.registerCommands();
            this.parseArguments();
        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    /**
     * 初始化环境服务
     */
    private async initializeEnvironment(): Promise<void> {
        const env = this.injector.get(EnvService);
        await env.onInit();
    }

    /**
     * 注册所有命令
     */
    private async registerCommands(): Promise<void> {
        const commands = this.injector.getAll(COMMANDER_TOKEN) as CommandMetadata[];

        for (const command of commands) {
            try {
                await this.registerSingleCommand(command);
            } catch (error) {
                this.handleCommandRegistrationError(command, error);
            }
        }
    }

    /**
     * 注册单个命令
     * @param command 命令元数据
     */
    private async registerSingleCommand(command: CommandMetadata): Promise<void> {
        const cmd = this.createCommand(command);
        this.addArguments(cmd, command);
        this.addOptions(cmd, command);
        this.addAction(cmd, command);
        program.addCommand(cmd);
    }

    /**
     * 创建命令实例
     * @param command 命令元数据
     * @returns Commander 命令实例
     */
    private createCommand(command: CommandMetadata): Command {
        const cmd = new Command();
        const { options } = command;

        if (options.name) cmd.name(options.name);
        if (options.alias) cmd.alias(options.alias);
        if (options.description) cmd.description(options.description);
        if (options.summary) cmd.summary(options.summary);

        return cmd;
    }

    /**
     * 为命令添加参数
     * @param cmd Commander 命令实例
     * @param command 命令元数据
     */
    private addArguments(cmd: Command, command: CommandMetadata): void {
        const commandArguments = this.getArgumentsForCommand(command.target);

        for (const arg of commandArguments) {
            const argument = this.createArgument(arg);
            cmd.addArgument(argument);
        }
    }

    /**
     * 为命令添加选项
     * @param cmd Commander 命令实例
     * @param command 命令元数据
     */
    private addOptions(cmd: Command, command: CommandMetadata): void {
        const options = this.getOptionsForCommand(command.target);

        for (const opt of options) {
            const option = this.createOption(opt);
            cmd.addOption(option);
        }
    }

    /**
     * 为命令添加动作处理器
     * @param cmd Commander 命令实例
     * @param command 命令元数据
     */
    private addAction(cmd: Command, command: CommandMetadata): void {
        cmd.action(async (...args: any[]) => {
            try {
                await this.executeCommand(command, args);
            } catch (error) {
                this.handleCommandExecutionError(command, error);
            }
        });
    }

    /**
     * 执行命令
     * @param command 命令元数据
     * @param args 命令参数
     */
    private async executeCommand(command: CommandMetadata, args: any[]): Promise<void> {
        // 解析参数：最后一个是 command 对象，倒数第二个是 options
        args.pop(); // 移除 command 对象
        const options = args.pop();
        const commandArgs = args;

        const instance = this.injector.get(command.target);
        const actions = this.getActionsForCommand(command.target);

        // 设置选项值到实例
        this.setOptionsToInstance(instance, command.target, options);

        // 设置参数值到实例
        this.setArgumentsToInstance(instance, command.target, commandArgs);

        // 执行所有动作
        await this.executeActions(instance, actions, commandArgs);
    }

    /**
     * 获取命令的参数元数据
     * @param target 命令类型
     * @returns 参数元数据数组
     */
    private getArgumentsForCommand(target: Type<any>): ArgumentMetadata[] {
        return this.injector
            .getAll(ARGUMENT_TOKEN)
            .filter((it: any) => it.target === target) as ArgumentMetadata[];
    }

    /**
     * 获取命令的选项元数据
     * @param target 命令类型
     * @returns 选项元数据数组
     */
    private getOptionsForCommand(target: Type<any>): OptionMetadata[] {
        return this.injector
            .getAll(OPTION_TOKEN)
            .filter((it: any) => it.target === target) as OptionMetadata[];
    }

    /**
     * 获取命令的动作元数据
     * @param target 命令类型
     * @returns 动作元数据数组
     */
    private getActionsForCommand(target: Type<any>): ActionMetadata[] {
        return this.injector
            .getAll(ACTION_TOKEN)
            .filter((it: any) => it.target === target) as ActionMetadata[];
    }

    /**
     * 创建参数实例
     * @param arg 参数元数据
     * @returns Commander 参数实例
     */
    private createArgument(arg: ArgumentMetadata): any {
        const { options, property } = arg;
        const argument = new (program as any).Argument(
            options.name || property.toString(),
            options.description
        );

        if (options.defaultValue !== undefined) {
            argument.defaultValue = options.defaultValue;
        }

        return argument;
    }

    /**
     * 创建选项实例
     * @param opt 选项元数据
     * @returns Commander 选项实例
     */
    private createOption(opt: OptionMetadata): any {
        const { options, property } = opt;
        const option = new (program as any).Option(
            options.flags || `--${property.toString()}`,
            options.description
        );

        if (options.zod) {
            option.argParser((value: any) => {
                try {
                    return options.zod!.parse(value);
                } catch (error) {
                    throw new Error(`Invalid value for ${property.toString()}: ${error}`);
                }
            });
        }

        return option;
    }

    /**
     * 设置选项值到命令实例
     * @param instance 命令实例
     * @param target 命令类型
     * @param options 选项值对象
     */
    private setOptionsToInstance(instance: any, target: Type<any>, options: any): void {
        const optionMetadata = this.getOptionsForCommand(target);

        for (const opt of optionMetadata) {
            const value = Reflect.get(options, opt.property);
            if (value !== undefined) {
                Reflect.set(instance, opt.property, value);
            }
        }
    }

    /**
     * 设置参数值到命令实例
     * @param instance 命令实例
     * @param target 命令类型
     * @param args 参数值数组
     */
    private setArgumentsToInstance(instance: any, target: Type<any>, args: any[]): void {
        const argumentMetadata = this.getArgumentsForCommand(target);

        for (let i = 0; i < argumentMetadata.length; i++) {
            const arg = argumentMetadata[i];
            const value = args[i];
            if (value !== undefined) {
                Reflect.set(instance, arg.property, value);
            }
        }
    }

    /**
     * 执行命令的所有动作
     * @param instance 命令实例
     * @param actions 动作元数据数组
     * @param args 参数数组
     */
    private async executeActions(instance: any, actions: ActionMetadata[], args: any[]): Promise<void> {
        const actionMethods = actions.map(action => {
            const method = Reflect.get(instance, action.property);
            if (typeof method !== "function") {
                throw new Error(
                    `${instance.constructor.name}.${action.property.toString()} is not a function`
                );
            }
            return method.bind(instance);
        });

        // 并行执行所有动作
        await Promise.all(actionMethods.map(method => method(...args)));
    }

    /**
     * 解析命令行参数
     */
    private parseArguments(): void {
        program.parse(process.argv);
    }

    /**
     * 处理初始化错误
     * @param error 错误对象
     */
    private handleInitializationError(error: unknown): void {
        console.error("CLI initialization failed:", error);
        process.exit(1);
    }

    /**
     * 处理命令注册错误
     * @param command 命令元数据
     * @param error 错误对象
     */
    private handleCommandRegistrationError(command: CommandMetadata, error: unknown): void {
        console.error(`Failed to register command ${command.options.name || 'unknown'}:`, error);
        // 不退出进程，继续注册其他命令
    }

    /**
     * 处理命令执行错误
     * @param command 命令元数据
     * @param error 错误对象
     */
    private handleCommandExecutionError(command: CommandMetadata, error: unknown): void {
        console.error(`Command ${command.options.name || 'unknown'} execution failed:`, error);
        process.exit(1);
    }
}
