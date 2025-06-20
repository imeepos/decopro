import { Action, Commander, Option } from "@decopro/commander";
import { inject, Injector } from "@decopro/core";
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import express from 'express'
import { z } from "zod";
@Commander({
    name: `startMcpHttpServer`,
    description: `启动mcp http server`
})
export class StartMcpHttpServer {
    @Option({
        flags: `--port [port]`,
        description: `启动端口号`,
        zod: z.coerce.number()
    })
    port: number = 3000;

    transports: { [key: string]: StreamableHTTPServerTransport | SSEServerTransport } = {}
    name: string = `mcp-server`
    version: string = `1.0`
    constructor(@inject(Injector) private injector: Injector) { }

    @Action({})
    async action() {
        const app = express()
        app.use(express.json())
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, mcp-session-id');

            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
                return;
            }
            next();
        });
        app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                name: this.name,
                version: this.version,
                transport: 'http'
            });
        });
        app.post('/mcp', async (req, res, next) => {
            const sessionId = req.headers['mcp-session-id'] as string;
            let transport: StreamableHTTPServerTransport | undefined = undefined;
            if (!sessionId) {
                transport = this.transports[sessionId] as StreamableHTTPServerTransport
            }
            if (!transport) {
                if (isInitializeRequest(req.body)) {
                    transport = new StreamableHTTPServerTransport({
                        sessionIdGenerator: () => crypto.randomUUID(),
                        enableJsonResponse: true,
                        onsessioninitialized: (sessionId) => {
                            this.transports[sessionId] = transport!;
                        }
                    })
                    // 设置关闭处理程序
                    transport.onclose = () => {
                        const sid = transport!.sessionId;
                        if (sid && this.transports[sid]) {
                            delete this.transports[sid];
                        }
                    };
                } else {
                    transport = new StreamableHTTPServerTransport({
                        sessionIdGenerator: undefined, // 无状态模式
                        enableJsonResponse: true
                    })
                }
                const mcpServer = this.injector.get(McpServer)
                await mcpServer.connect(transport)
            }
            await transport.handleRequest(req, res, req.body);
        });
        app.listen(this.port, () => {
            console.log(`start mcp server success ${this.port}`)
        })
    }

    isStatelessRequest(requestBody: any) {
        if (!requestBody || !requestBody.method) {
            return false;
        }
        const statelessMethods = [
            'tools/list',
            'prompts/list',
            'resources/list'
        ];
        return statelessMethods.includes(requestBody.method);
    }
}
