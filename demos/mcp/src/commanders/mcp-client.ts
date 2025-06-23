import { Action, Commander, Option } from "@decopro/commander";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { z } from "zod";

@Commander({
    name: `startMcpClient`,
    description: `启动mcp client`
})
export class StartMcpClient {
    @Option({
        flags: `--url [url]`,
        description: `mcp 地址`,
        zod: z.coerce.string()
    })
    url: string;

    @Option({
        flags: `--type [type]`,
        description: `transport类型`,
        zod: z.coerce.string()
    })
    type: "sse" | "http" = "http";
    @Action({})
    async action() {
        const url = new URL(this.url);
        let transport: StreamableHTTPClientTransport | SSEClientTransport =
            new StreamableHTTPClientTransport(url);
        if (this.type === "sse") {
            transport = new SSEClientTransport(url);
        }
        const client = new Client({
            name: `mcp-server`,
            version: `1.0`
        });
        await client.connect(transport);
        const listPrompts = await client.listPrompts();
        const listResourceTemplates = await client.listResourceTemplates();
        const listResources = await client.listResources();
        console.log({ listResources, listPrompts, listResourceTemplates });
        const listTools = await client.listTools();
        console.log({ listTools });
        client.fallbackNotificationHandler;
        client.fallbackRequestHandler;
        const res = await client.callTool({
            name: `runJsCode`,
            arguments: { code: `console.log('hello world')` }
        });
        console.log(res);
    }
}
