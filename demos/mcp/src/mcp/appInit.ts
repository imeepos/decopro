import {
    AppInit,
    inject,
    Injector,
    registry,
    Type,
    instanceCachingFactory
} from "@decopro/core";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { RunJsCodeTool } from "./tools/RunJsCodeTool";
import { EnvResource } from "./resources";
import { NowaPrompt } from "./prompts";
import { mcpServerFactory } from "./mcpServerFactory";
import { DemoAgent } from "./agents";

@registry([
    {
        token: McpServer,
        useFactory: instanceCachingFactory(mcpServerFactory)
    }
])
@AppInit({})
export class McpAppInit implements AppInit {
    private readonly tools: Type<any>[] = [
        RunJsCodeTool,
        EnvResource,
        NowaPrompt,
        DemoAgent
    ];
    constructor(@inject(Injector) private injector: Injector) {}
    async onInit(): Promise<void> {
        console.log(`mcp app init success`);
    }
}
