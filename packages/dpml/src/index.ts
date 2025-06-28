export * from "./ast";
export * from "./tokenizer";
export * from "./parser";

import { Tokenizer } from "./tokenizer";
import { Parser } from "./parser";
import { PromptElement } from "./ast";

/**
 * 解析 DPML 字符串为 AST
 * @param input DPML 字符串
 * @returns 解析后的 PromptElement AST
 */
export function parsePrompt(input: string): PromptElement {
    const tokenizer = new Tokenizer();
    const tokens = tokenizer.tokenize(input);

    const parser = new Parser(tokens);
    return parser.parse();
}

/**
 * 验证 DPML 语法是否正确
 * @param input DPML 字符串
 * @returns 验证结果
 */
export function validateDpml(input: string): { valid: boolean; errors: string[] } {
    try {
        parsePrompt(input);
        return { valid: true, errors: [] };
    } catch (error) {
        return {
            valid: false,
            errors: [error instanceof Error ? error.message : String(error)]
        };
    }
}
