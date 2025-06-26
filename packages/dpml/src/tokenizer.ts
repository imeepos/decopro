export interface Token {
    type:
        | "OpenTag"
        | "CloseTag"
        | "Text"
        | "Attribute"
        | "TagEnd"
        | "ResourceRef"
        | "SelfCloseTagEnd";
    value: string;
    name?: string; // 仅用于Attribute类型
}

export class Tokenizer {
    private pos = 0;
    private tokens: Token[] = [];

    tokenize(input: string): Token[] {
        this.pos = 0;
        this.tokens = [];

        while (this.pos < input.length) {
            const char = input[this.pos];

            if (char === "<") {
                this.handleTag(input);
            } else if (char === "@") {
                this.handleResourceReference(input);
            } else {
                this.handleText(input);
            }
        }

        return this.tokens;
    }

    private handleTag(input: string) {
        // 处理结束标签 </
        if (input[this.pos + 1] === "/") {
            const endIndex = input.indexOf(">", this.pos);
            if (endIndex === -1) throw new Error("Unclosed close tag");

            const tagContent = input.substring(this.pos + 2, endIndex).trim();
            this.tokens.push({ type: "CloseTag", value: tagContent });
            this.pos = endIndex + 1;
            return;
        }

        // 处理开始标签 <
        const endIndex = input.indexOf(">", this.pos);
        if (endIndex === -1) throw new Error("Unclosed open tag");
        // 检查是否为自闭合标签
        const isSelfClosing = input[endIndex - 1] === "/";
        const tagEndIndex = isSelfClosing ? endIndex - 1 : endIndex;
        const tagContent = input.substring(this.pos + 1, tagEndIndex).trim();

        this.pos = endIndex + 1;

        // 分离标签名和属性
        const [tagName, ...attrParts] = tagContent.split(/\s+/);
        this.tokens.push({ type: "OpenTag", value: tagName });

        // 处理属性
        for (const part of attrParts) {
            if (!part) continue;

            const eqIndex = part.indexOf("=");
            if (eqIndex === -1) {
                this.tokens.push({
                    type: "Attribute",
                    name: part,
                    value: "true"
                });
            } else {
                const name = part.substring(0, eqIndex);
                let value = part.substring(eqIndex + 1);

                // 移除引号
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length - 1);
                }

                this.tokens.push({ type: "Attribute", name, value });
            }
        }
        if (isSelfClosing) {
            this.tokens.push({ type: "SelfCloseTagEnd", value: "/>" });
        } else {
            this.tokens.push({ type: "TagEnd", value: ">" });
        }
    }

    private handleResourceReference(input: string) {
        const refRegex = /^(@[!?]?)([a-zA-Z][a-zA-Z0-9_-]*):(\/\/[^\s]+)/;
        const match = refRegex.exec(input.substring(this.pos));

        if (match) {
            const [fullMatch, refType, protocol, location] = match;
            this.tokens.push({
                type: "ResourceRef",
                value: `${refType}${protocol}:${location}`
            });
            this.pos += fullMatch.length;
        } else {
            this.handleText(input);
        }
    }

    private handleText(input: string) {
        let text = "";
        while (this.pos < input.length) {
            const char = input[this.pos];

            if (char === "<" || char === "@") break;

            // 检查是否为非空白字符
            if (char.trim() !== "") {
                text += char;
            }
            this.pos++;
        }
        if (text) {
            this.tokens.push({ type: "Text", value: text });
        }
    }
}
