import { Action, Commander, Option } from "@decopro/commander";
import { inject, Injector } from "@decopro/core";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

import express, { Request, Response } from "express";
import { z } from "zod";
@Commander({
    name: `startMcpSseServer`,
    description: `启动mcp sse server`
})
export class StartMcpSseServer {
    @Option({
        flags: `--port [port]`,
        description: `启动端口号`,
        zod: z.coerce.number()
    })
    port: number = 3000;

    transports: { [key: string]: SSEServerTransport } = {};
    name: string = `mcp-sse-server`;
    version: string = `1.0`;
    constructor(@inject(Injector) private injector: Injector) {}

    @Action({})
    async action() {
        const app = express();
        app.use(express.json());
        app.get("/health", (req, res) => {
            res.json({
                status: "ok",
                name: this.name,
                version: this.version,
                transport: "sse"
            });
        });
        app.get("/mcp", async (req, res) => {
            await this.handleSSEConnection(req, res);
        });
        app.post("/messages", async (req, res) => {
            await this.handleSSEMessage(req, res);
        });
        app.listen(this.port, () => {
            console.log(`start mcp sse server success ${this.port}`);
        });
    }
    /**
     * 处理 SSE 连接建立
     */
    private async handleSSEConnection(req: Request, res: Response) {
        try {
            // 创建 SSE 传输
            const transport = new SSEServerTransport("/messages", res);
            const sessionId = transport.sessionId;
            // 存储传输
            this.transports[sessionId] = transport;
            // 设置关闭处理程序
            transport.onclose = () => {
                delete this.transports[sessionId];
            };
            // 连接到 MCP 服务器
            const server = this.setupMCPServer();
            await server.connect(transport);
        } catch (error) {
            if (!res.headersSent) {
                res.status(500).send("Error establishing SSE connection");
            }
        }
    }
    /**
     * 处理 SSE 消息
     */
    private async handleSSEMessage(req: Request, res: Response) {
        try {
            // 从查询参数获取会话ID
            const sessionId = req.query.sessionId as string;

            if (!sessionId) {
                res.status(400).send("Missing sessionId parameter");
                return;
            }

            const transport = this.transports[sessionId];
            if (!transport) {
                res.status(404).send("Session not found");
                return;
            }

            // 处理消息
            await transport.handlePostMessage(req, res, req.body);
        } catch (error) {
            if (!res.headersSent) {
                res.status(500).send("Error handling request");
            }
        }
    }
    private setupMCPServer() {
        return this.injector.get(McpServer);
    }
}
