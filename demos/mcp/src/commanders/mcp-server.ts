import { Action, Commander, Option } from "@decopro/commander";
import { inject, Injector } from "@decopro/core";
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import express from 'express'
import { z } from "zod";
@Commander({
    name: `startMcpServer`,
    description: `启动mcp server`
})
export class StartMcpServer {
    @Option({
        flags: `--port [port]`,
        description: `启动端口号`,
        zod: z.coerce.number()
    })
    port: number = 3000;

    transports: { [key: string]: StreamableHTTPServerTransport } = {}
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
        app.get(`/mcp`, async (req, res) => {
            const sessionId = req.headers['mcp-session-id'] as string;
            if (!sessionId || !this.transports[sessionId]) {
                res.status(400).json({
                    error: 'Invalid or missing session ID'
                });
                return;
            }
            const transport = this.transports[sessionId];
            await transport.handleRequest(req, res);
            return;
        });
        app.post('/mcp', async (req, res, next) => {
            const sessionId = req.headers['mcp-session-id'] as string;
            let transport: StreamableHTTPServerTransport;
            if (sessionId && this.transports[sessionId]) {
                transport = this.transports[sessionId]
            } else if (!sessionId && isInitializeRequest(req.body)) {
                transport = new StreamableHTTPServerTransport({
                    sessionIdGenerator: () => crypto.randomUUID(),
                    enableJsonResponse: true,
                    onsessioninitialized: (id) => {
                        this.transports[id] = transport;
                    }
                })
                transport.onclose = () => {
                    const sid = transport.sessionId;
                    if (sid && this.transports[sid]) {
                        delete this.transports[sid];
                    }
                };
                const mcpServer = this.injector.get(McpServer)
                await mcpServer.connect(transport)
                await transport.handleRequest(req, res, req.body);
                return;
            } else if (!sessionId && this.isStatelessRequest(req.body)) {
                transport = new StreamableHTTPServerTransport({
                    sessionIdGenerator: undefined, // 无状态模式
                    enableJsonResponse: true
                })
                const mcpServer = this.injector.get(McpServer)
                await mcpServer.connect(transport)
                await transport.handleRequest(req, res, req.body);
                return;
            } else {
                transport = new StreamableHTTPServerTransport({
                    sessionIdGenerator: undefined, // 无状态模式
                    enableJsonResponse: true
                })
                const mcpServer = this.injector.get(McpServer)
                await mcpServer.connect(transport)
                await transport.handleRequest(req, res, req.body);
                return;
            }
        });
        app.delete('/mcp', async (req, res, next) => {
            const sessionId = req.headers['mcp-session-id'] as string;
            if (!sessionId || !this.transports[sessionId]) {
                res.status(400).json({
                    error: 'Invalid or missing session ID'
                });
                return;
            }

            try {
                const transport = this.transports[sessionId];
                await transport.handleRequest(req, res);
            } catch (error) {
                if (!res.headersSent) {
                    res.status(500).json({
                        error: 'Error processing session termination'
                    });
                }
            }
        })
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
