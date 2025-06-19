import { AppInit, inject, Injector, OnInit } from "@decopro/core";
import commander from 'commander'
import { ACTION_TOKEN, ARGUMENT_TOKEN, COMMANDER_TOKEN, OPTION_TOKEN } from "./decorator";

@AppInit({})
export class CommanderAppInit implements OnInit {
    constructor(@inject(Injector) private injector: Injector) { }
    async onInit(): Promise<void> {
        const injector = this.injector;
        const commands = injector.getAll(COMMANDER_TOKEN)
        commands.map(command => {
            const c = new commander.Command()
            const options = command.options
            if (options.name) c.name(options.name);
            if (options.alias) c.alias(options.alias)
            if (options.description) c.description(options.description)
            if (options.summary) c.summary(options.summary)
            const _arguments = injector.getAll(ARGUMENT_TOKEN).filter(it => it.target === command.target)
            _arguments.map(arg => {
                const options = arg.options
                const ins = new commander.Argument(options.name, options.description)
                if (options.defaultValue) ins.defaultValue = options.defaultValue
                c.addArgument(ins)
            })
            const _options = injector.getAll(OPTION_TOKEN).filter(it => it.target === command.target)
            _options.map(arg => {
                const options = arg.options
                const ins = new commander.Option(options.flags, options.description)
                if (options.zod) {
                    ins.argParser((value, previous) => {
                        return options.zod.parse(value)
                    })
                }
                c.addOption(ins)
            })
            c.action(async () => {
                const _actions = injector.getAll(ACTION_TOKEN).filter(it => it.target === command.target)
                const instance = injector.get(command.target)
                const actions = _actions.map(action => {
                    const method = Reflect.get(instance, action.property)
                    if (typeof method === 'function') {
                        return method.bind(instance)
                    }
                    throw new Error(`${command.target.name}.${action.property.toString()} is not found`)
                })
                await Promise.all(actions.map(action => action()))
            })
            commander.program.addCommand(c)
        })
        commander.program.parse()
    }

}
