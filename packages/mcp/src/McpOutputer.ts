import { injectable } from "@decopro/core";
import { CallToolResult } from '@modelcontextprotocol/sdk/types'

@injectable()
export class McpOutputer {
    toSuccess(text: unknown): CallToolResult {
        return this.convertToMCPFormat(text);
    }
    toError(message: unknown): CallToolResult {
        return this.handleError(message);
    }
    private handleError(error: unknown): CallToolResult {
        const errorMessage = error instanceof Error
            ? error.message
            : String(error);
        return {
            content: [
                {
                    type: 'text',
                    text: `❌ 执行失败: ${errorMessage}`
                }
            ],
            isError: true
        };
    }
    private convertToMCPFormat(input: unknown): CallToolResult {
        try {
            const text = this.toString(input);
            return {
                content: [
                    {
                        type: 'text',
                        text: text
                    }
                ]
            };
        } catch (error) {
            return this.handleError(error);
        }
    }
    private toString(input: unknown): string {
        // 处理null和undefined
        if (input === null) return 'null';
        if (input === undefined) return 'undefined';

        // 处理字符串
        if (typeof input === 'string') {
            return input;
        }

        // 处理有toString方法的对象（如PouchOutput）
        if (input && typeof input.toString === 'function' && input.toString !== Object.prototype.toString) {
            return input.toString();
        }

        // 处理数组和普通对象
        if (typeof input === 'object') {
            return JSON.stringify(input, null, 2);
        }

        // 其他类型直接转换
        return String(input);
    }
}