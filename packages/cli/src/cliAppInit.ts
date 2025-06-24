import { AppInit, inject, Injector, OnInit, Type } from "@decopro/core";
import commander from "commander";
import {
    ACTION_TOKEN,
    ARGUMENT_TOKEN,
    COMMANDER_TOKEN,
    OPTION_TOKEN
} from "@decopro/commander";
import { TestCommand } from "./testCommand";
import { DocsCommand } from "./docsCommand";
import { McpServerCommand } from "./mcpServerCommand";
import { LoginCommand } from "./loginCommand";
import { EnvService } from "./services";
import { ConfigCommand } from "./configCommand";
import { OnlineCommand } from "./onlineCommand";

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
    constructor(@inject(Injector) private injector: Injector) {}
    static forRoot(types: Type<any>[] = []) {
        this.commanders.push(...types);
        return this;
    }
    async onInit(): Promise<void> {
        const env = this.injector.get(EnvService);
        await env.onInit();
        const injector = this.injector;
        const commands = injector.getAll(COMMANDER_TOKEN);
        commands.map((command) => {
            try {
                const c = new commander.Command();
                const options = command.options;
                if (options.name) c.name(options.name);
                if (options.alias) c.alias(options.alias);
                if (options.description) c.description(options.description);
                if (options.summary) c.summary(options.summary);
                const _arguments = injector
                    .getAll(ARGUMENT_TOKEN)
                    .filter((it) => it.target === command.target);
                _arguments.map((arg) => {
                    const options = arg.options;
                    const ins = new commander.Argument(
                        options.name,
                        options.description
                    );
                    if (options.defaultValue)
                        ins.defaultValue = options.defaultValue;
                    c.addArgument(ins);
                });
                const _options = injector
                    .getAll(OPTION_TOKEN)
                    .filter((it) => it.target === command.target);
                _options.map((arg) => {
                    const options = arg.options;
                    const ins = new commander.Option(
                        options.flags,
                        options.description
                    );
                    if (options.zod) {
                        ins.argParser((value, previous) => {
                            return options.zod.parse(value);
                        });
                    }
                    c.addOption(ins);
                });
                c.action(async (...args: any[]) => {
                    // 最后一个是command对象
                    args.pop();
                    // 倒数第二个是options
                    const options = args.pop();
                    // 其余的是argument
                    const _actions = injector
                        .getAll(ACTION_TOKEN)
                        .filter((it) => it.target === command.target);
                    const instance = injector.get(command.target);
                    const actions = _actions.map((action) => {
                        const method = Reflect.get(instance, action.property);
                        if (typeof method === "function") {
                            return method.bind(instance);
                        }
                        throw new Error(
                            `${
                                command.target.name
                            }.${action.property.toString()} is not found`
                        );
                    });
                    _options.map((option) => {
                        const value = Reflect.get(options, option.property);
                        Reflect.set(instance, option.property, value);
                    });
                    _arguments.map((arg, idx) => {
                        const value = Reflect.get(args, idx);
                        Reflect.set(instance, arg.property, value);
                    });
                    await Promise.all(actions.map((action) => action(...args)));
                });
                commander.program.addCommand(c);
            } catch (e) {}
        });
        commander.program.parse(process.argv);
    }
}
