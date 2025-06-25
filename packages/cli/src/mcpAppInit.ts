import {
    AppInit,
    inject,
    Injector,
    registry,
    Type,
    instanceCachingFactory
} from "@decopro/core";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { mcpServerFactory } from "./mcpServerFactory";

@registry([
    {
        token: McpServer,
        useFactory: instanceCachingFactory(mcpServerFactory)
    }
])
@AppInit({
    deps: []
})
export class McpAppInit implements AppInit {
    private readonly tools: Type<any>[] = [];
    private readonly prompts: Type<any>[] = [];
    constructor(@inject(Injector) private injector: Injector) {}
    async onInit(): Promise<void> {}
}
