import { Tokenizer } from "./tokenizer"; // 假设 Tokenizer 在单独文件中
import { Parser } from "./parser"; // 假设 Parser 在单独文件中
import { PromptElement } from "./ast"; // 导入 AST 定义

/**
 * 将提示词字符串解析为 AST
 * @param input 要解析的提示词字符串
 * @returns 解析后的 PromptElement AST 根节点
 */
export function parsePrompt(input: string): PromptElement {
    // 1. 词法分析：将字符串拆分为 Token 序列
    const tokenizer = new Tokenizer();
    const tokens = tokenizer.tokenize(input);
    console.log(JSON.stringify(tokens, null, 2))
    // 2. 语法分析：将 Token 序列解析为 AST
    const parser = new Parser(tokens);
    return parser.parse();
}
