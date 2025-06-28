import { AppInit, inject, Injector, OnInit } from "@decopro/core";
import { Command, program, Argument, Option } from "commander";
import {
    ACTION_TOKEN,
    ARGUMENT_TOKEN,
    COMMANDER_TOKEN,
    OPTION_TOKEN
} from "@decopro/commander";

@AppInit({})
export class CommanderAppInit implements OnInit {
    constructor(@inject(Injector) private injector: Injector) { }
    async onInit(): Promise<void> {
        const injector = this.injector;
        const commands = injector.getAll(COMMANDER_TOKEN);
        commands.map((command) => {
            const c = new Command();
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
                const ins = new Argument(
                    options.name!,
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
                const ins = new Option(
                    options.flags!,
                    options.description
                );
                if (options.zod) {
                    ins.argParser((value, previous) => {
                        if(options.zod) return options.zod.parse(value);
                        return value;
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
                        `${command.target.name}.${action.property.toString()} is not found`
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
            program.addCommand(c);
        });
        if (process.argv.length === 2) {
            return program.help();
        }
        program.parse();
    }
}
