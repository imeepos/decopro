import { AppInit, inject, Injector, registry, Type, instanceCachingFactory } from "@decopro/core";
import { isMcpArgOptions, MCP_ARG_TOKEN, McpOutputer, TOOL_TOKEN } from "@decopro/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ZodRawShape } from "zod";
import { RunJsCodeTool } from "./tools/RunJsCodeTool";
export const SERVER_OPTION = {
    name: `mcp-server`,
    version: `1.0`
}
@registry([
    {
        token: McpServer,
        useFactory: instanceCachingFactory((d) => {
            const mcpServer = new McpServer(SERVER_OPTION, {
                capabilities: {
                    tools: {},
                    logging: {}
                }
            })
            const injector = d.resolve(Injector)
            // output
            const outputer = injector.get(McpOutputer)
            // tools
            const tools = injector.getAll(TOOL_TOKEN)
            tools.map(tool => {
                const options = tool.options
                const rules = injector.getAll(MCP_ARG_TOKEN).filter(it => it.target === tool.target)
                let argsRule: ZodRawShape = {}
                const params = rules.sort((a, b) => a.parameterIndex - b.parameterIndex).map(rule => {
                    const options = rule.options
                    if (isMcpArgOptions(options)) {
                        Reflect.set(argsRule, options.name, options.zod)
                    } else {
                        argsRule = options;
                    }
                    return rule;
                })
                mcpServer.registerTool(options.token.toString(), {
                    title: options.title,
                    description: options.description,
                    inputSchema: argsRule,
                }, async (args, extra) => {
                    try {
                        const _argumetns = params.map(param => {
                            const options = param.options
                            if (isMcpArgOptions(options)) {
                                return Reflect.get(args, options.name)
                            } else {
                                return args;
                            }
                        })
                        const instance = injector.get(tool.target)
                        const _method = Reflect.get(instance, tool.property)
                        if (_method && typeof _method === 'function') {
                            const result = await _method(..._argumetns)
                            return outputer.toSuccess(result)
                        }
                        throw new Error(`method ${tool.property.toString()} not found`)
                    } catch (e) {
                        return outputer.toError(e)
                    }
                })
            })
            console.log(`create mcp server`)
            return mcpServer
        })
    }
])
@AppInit({})
export class McpAppInit implements AppInit {
    private readonly tools: Type<any>[] = [
        RunJsCodeTool
    ]
    constructor(@inject(Injector) private injector: Injector) { }
    async onInit(): Promise<void> {
        console.log(`mcp app init success`)
    }
}