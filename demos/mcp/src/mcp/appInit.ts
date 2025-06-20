import { AppInit, inject, Injector, registry, Type, instanceCachingFactory } from "@decopro/core";
import { isMcpArgOptions, MCP_ARG_TOKEN, McpOutputer, PROMPT_TOKEN, RESOURCE_TOKEN, TOOL_TOKEN } from "@decopro/mcp";
import { McpServer, ReadResourceCallback, ReadResourceTemplateCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js"

import { ZodRawShape } from "zod";
import { RunJsCodeTool } from "./tools/RunJsCodeTool";
import { EnvResource } from "./resources";
import { NowaPrompt } from "./prompts";
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
            // resource
            const resources = injector.getAll(RESOURCE_TOKEN)
            resources.map(res => {
                const options = res.options;
                if (typeof options.uriOrTemplate === 'string') {
                    const cb: ReadResourceCallback = async (uri, extra) => {
                        return { contents: [] }
                    }
                    mcpServer.registerResource(options.name, options.uriOrTemplate, options.config, cb)
                } else {
                    const cb: ReadResourceTemplateCallback = async (uri, variables, extra) => {
                        return { contents: [] }
                    }
                    mcpServer.registerResource(options.name, options.uriOrTemplate, options.config, cb)
                }
            })
            // prompt
            const prompts = injector.getAll(PROMPT_TOKEN)
            prompts.map(prompt => {
                const options = prompt.options
                const rules = injector.getAll(MCP_ARG_TOKEN).filter(it => it.target === prompt.target)
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
                mcpServer.registerPrompt(options.name, {
                    title: options.title,
                    description: options.description,
                    argsSchema: argsRule
                }, async (args) => {
                    const _argumetns = params.map(param => {
                        const options = param.options
                        if (isMcpArgOptions(options)) {
                            return Reflect.get(args, options.name)
                        } else {
                            return args;
                        }
                    })
                    const instance = injector.get(prompt.target)
                    const _method = Reflect.get(instance, prompt.property)
                    if (_method && typeof _method === 'function') {
                        const result = await _method(..._argumetns)
                        if (Array.isArray(result)) {
                            return {
                                messages: result
                            }
                        }
                    }
                    return {
                        messages: [],
                    }
                })
            })
            mcpServer.sendPromptListChanged()
            return mcpServer
        })
    }
])
@AppInit({})
export class McpAppInit implements AppInit {
    private readonly tools: Type<any>[] = [
        RunJsCodeTool,
        EnvResource,
        NowaPrompt
    ]
    constructor(@inject(Injector) private injector: Injector) { }
    async onInit(): Promise<void> {
        console.log(`mcp app init success`)
    }
}