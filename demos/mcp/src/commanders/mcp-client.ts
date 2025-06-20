import { Action, Commander, Option } from "@decopro/commander";
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
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
    @Action({})
    async action() {
        const transport = new StreamableHTTPClientTransport(new URL(this.url))
        const client = new Client({
            name: `mcp-server`,
            version: `1.0`
        })
        client.connect(transport)
        const res = await client.callTool({ name: `runJsCode`, arguments: { code: `console.log('hello world')` } })
        console.log(res)
    }
}