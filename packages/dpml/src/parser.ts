import {
    Attributes,
    BaseAst,
    ChallengeElement,
    ConstraintElement,
    CriteriaElement,
    DefinitionElement,
    EnElement,
    ExampleElement,
    ExamplesElement,
    ExecutionElement,
    ExplorationElement,
    GuidelineElement,
    KnowledgeElement,
    LocationElement,
    ParamsElement,
    PersonalityElement,
    PlanElement,
    PrincipleElement,
    ProcessElement,
    PromptElement,
    ReasoningElement,
    RegistryElement,
    ResourceElement,
    RoleElement,
    RuleElement,
    TerminologiesElement,
    TerminologyElement,
    ThoughtElement,
    ZhElement
} from "./ast";
import { Token } from "./tokenizer";

export class Parser {
    private tokens: Token[];
    private pos = 0;
    private currentToken: Token | null = null;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.advance();
    }
    private parseResourceRef(token: Token): ResourceElement {
        const element = new ResourceElement();
        element.inline = true; // 标记为内联资源

        // 解析协议和位置 (格式: @protocol:location/path)
        const [protocol, ...locationParts] = token.value.slice(1).split(":");
        if (protocol.startsWith(`?`)) {
            element.model = `lazy`;
            element.protocol = protocol.substring(1);
        } else if (protocol.startsWith("!")) {
            element.model = `load`;
            element.protocol = protocol.substring(1);
        } else {
            element.model = `auto`;
            element.protocol = protocol;
        }
        element.location = locationParts.join(":");

        return element;
    }
    parse(): PromptElement {
        const children: BaseAst[] = [];

        while (this.currentToken) {
            switch (this.currentToken.type) {
                case "OpenTag":
                    children.push(this.parseElement());
                    break;
                case "Text":
                    // 创建虚拟Markdown节点
                    const textNode = new BaseAst();
                    (textNode as any).content = this.currentToken.value;
                    children.push(textNode);
                    this.advance();
                    break;
                case "ResourceRef":
                    // 创建虚拟资源引用节点
                    const refNode = new BaseAst();
                    (refNode as any).type = "ResourceRef";
                    (refNode as any).value = this.currentToken.value;
                    children.push(refNode);
                    this.advance();
                    break;
                default:
                    throw new Error(
                        `Unexpected token: ${this.currentToken.type}`
                    );
            }
        }

        return new PromptElement(children);
    }
    private equal(a: string, b: string) {
        return a === b;
    }
    private parseElement(): BaseAst {
        if (this.currentToken?.type !== "OpenTag") {
            throw new Error("Expected opening tag");
        }
        const tagName = this.currentToken.value;
        this.advance();
        // 收集属性
        const attributes: Attributes[] = [];
        while (this.equal(this.currentToken?.type, "Attribute")) {
            attributes.push({
                name: this.currentToken.name!,
                value: this.currentToken.value
            });
            this.advance();
        }
        // 确认标签结束
        if (!this.equal(this.currentToken?.type, "TagEnd")) {
            throw new Error("Expected tag end");
        }
        this.advance();
        // 解析内容
        let element: BaseAst;
        let isSimpleElement = false; // 新增标志
        switch (tagName) {
            case "execution":
                element = this.parseExecutionElement(attributes);
                break;
            case "resource":
                element = this.parseResourceElement(attributes);
                break;
            case "role":
                element = this.parseRoleElement(attributes);
                break;
            case "terminologies":
                element = this.parseTerminologiesElement(attributes);
                break;
            case "thought":
                element = this.parseThoughtElement(attributes);
                break;
            // 添加简单元素的解析
            case "process":
                element = this.parseSimpleElement(
                    attributes,
                    "process",
                    ProcessElement
                );
                isSimpleElement = true;
                break;
            case "guideline":
                element = this.parseSimpleElement(
                    attributes,
                    "guideline",
                    GuidelineElement
                );
                isSimpleElement = true;

                break;
            case "rule":
                element = this.parseSimpleElement(
                    attributes,
                    "rule",
                    RuleElement
                );
                isSimpleElement = true;

                break;
            case "constraint":
                element = this.parseSimpleElement(
                    attributes,
                    "constraint",
                    ConstraintElement
                );
                isSimpleElement = true;

                break;
            case "criteria":
                element = this.parseSimpleElement(
                    attributes,
                    "criteria",
                    CriteriaElement
                );
                isSimpleElement = true;

                break;
            case "location":
                element = this.parseSimpleElement(
                    attributes,
                    "location",
                    LocationElement
                );
                isSimpleElement = true;

                break;
            case "params":
                element = this.parseSimpleElement(
                    attributes,
                    "params",
                    ParamsElement
                );
                isSimpleElement = true;

                break;
            case "registry":
                element = this.parseSimpleElement(
                    attributes,
                    "registry",
                    RegistryElement
                );
                isSimpleElement = true;

                break;
            case "exploration":
                element = this.parseSimpleElement(
                    attributes,
                    "exploration",
                    ExplorationElement
                );
                isSimpleElement = true;

                break;
            case "reasoning":
                element = this.parseSimpleElement(
                    attributes,
                    "reasoning",
                    ReasoningElement
                );
                isSimpleElement = true;

                break;
            case "plan":
                element = this.parseSimpleElement(
                    attributes,
                    "plan",
                    PlanElement
                );
                isSimpleElement = true;
                break;
            case "challenge":
                element = this.parseSimpleElement(
                    attributes,
                    "challenge",
                    ChallengeElement
                );
                isSimpleElement = true;
                break;
            case "terminology":
                element = this.parseTerminologyElement(attributes);
                isSimpleElement = true;
                break;
            case "personality":
                element = this.parseSimpleElement(
                    attributes,
                    "personality",
                    PersonalityElement
                );
                isSimpleElement = true;
                break;
            case "principle":
                element = this.parseSimpleElement(
                    attributes,
                    "principle",
                    PrincipleElement
                );
                isSimpleElement = true;
                break;
            case "knowledge":
                element = this.parseSimpleElement(
                    attributes,
                    "knowledge",
                    KnowledgeElement
                );
                isSimpleElement = true;
                break;
            default:
                throw new Error(`Unknown element type: ${tagName}`);
        }
        if (!isSimpleElement) {
            if (
                this.equal(this.currentToken?.type, "CloseTag") &&
                this.currentToken.value === tagName
            ) {
                this.advance();
            } else {
                throw new Error(`Expected closing tag for ${tagName}`);
            }
        }
        return element;
    }
    // 新增：通用简单元素解析方法
    private parseSimpleElement(
        attributes: Attributes[],
        tagName: string,
        ctor: new () => BaseAst
    ): BaseAst {
        const element = new ctor();

        // 设置属性（如果元素支持）
        if ("attributes" in element) {
            (element as any).attributes = attributes;
        }

        // 解析内容
        const content = this.parseTextUntilClose(tagName);
        if ("content" in element) {
            (element as any).content = content;
        }

        return element;
    }
    // 修复：正确处理混合内容中的资源引用
    private parseMixedContent(allowedTags: string[]): any[] {
        const contents: any[] = [];
        while (this.currentToken) {
            if (this.currentToken.type === "OpenTag") {
                if (allowedTags.includes(this.currentToken.value)) {
                    contents.push(this.parseElement());
                } else {
                    break;
                }
            } else if (this.currentToken.type === "ResourceRef") {
                // 将资源引用转换为 ResourceElement
                contents.push(this.parseResourceRef(this.currentToken));
                this.advance();
            } else if (this.currentToken.type === "Text") {
                // 将文本和资源引用都作为字符串处理
                contents.push(this.currentToken.value);
                this.advance();
            } else {
                break;
            }
        }
        return contents;
    }
    // 修复：正确处理文本内容中的资源引用
    private parseTextUntilClose(tagName: string): string {
        let content = "";
        while (this.currentToken) {
            // 遇到当前元素的闭合标签时停止
            if (
                this.currentToken.type === "CloseTag" &&
                this.currentToken.value === tagName
            ) {
                this.advance(); // 消耗闭合标签
                break;
            } else if (
                this.currentToken.type === "Text" ||
                this.currentToken.type === "ResourceRef"
            ) {
                content += this.currentToken.value;
                this.advance();
            } else if (this.currentToken.type === "OpenTag") {
                // 处理自闭合标签（如 <br/>）
                const openToken = this.currentToken;
                this.advance();

                // 收集属性
                let attributes = "";
                while (this.equal(this.currentToken?.type, "Attribute")) {
                    attributes += ` ${this.currentToken.name}="${this.currentToken.value}"`;
                    this.advance();
                }

                // 检查标签结束类型
                if (this.equal(this.currentToken?.type, "SelfCloseTagEnd")) {
                    // 自闭合标签
                    content += `<${openToken.value}${attributes}/>`;
                    this.advance();
                } else if (this.equal(this.currentToken?.type, "TagEnd")) {
                    // 普通开始标签（在简单元素中不允许）
                    throw new Error(
                        `Non-self-closing tags are not allowed in <${tagName}> element`
                    );
                } else {
                    throw new Error("Expected tag end after attributes");
                }
            } else {
                throw new Error(
                    `Unexpected token type ${this.currentToken.type} inside ${tagName}`
                );
            }
        }
        return content;
    }
    // 新增：术语元素解析
    private parseTerminologyElement(
        attributes: Attributes[]
    ): TerminologyElement {
        const element = new TerminologyElement();
        element.attributes = attributes
        element.children = [];

        // 跳过开标签后的内容
        this.advance(); // 跳过 '<terminology>'

        while (this.currentToken) {
            if (
                this.currentToken.type === "CloseTag" &&
                this.currentToken.value === "terminology"
            ) {
                // 找到结束标签
                this.advance();
                break;
            } else if (this.currentToken.type === "OpenTag") {
                const tagName = this.currentToken.value;
                if (tagName === "zh") {
                    element.children.push(
                        this.parseSimpleElement([], "zh", ZhElement)
                    );
                } else if (tagName === "en") {
                    element.children.push(
                        this.parseSimpleElement([], "en", EnElement)
                    );
                } else if (tagName === "definition") {
                    element.children.push(
                        this.parseSimpleElement(
                            [],
                            "definition",
                            DefinitionElement
                        )
                    );
                } else if (tagName === "examples") {
                    element.children.push(this.parseExamplesElement());
                } else {
                    // 遇到未知标签，作为文本处理
                    element.children.push(this.currentToken.value);
                    this.advance();
                }
            } else if (
                this.currentToken.type === "Text" ||
                this.currentToken.type === "ResourceRef"
            ) {
                // 直接文本内容
                element.children.push(this.currentToken.value);
                this.advance();
            } else {
                // 遇到意外 token 类型
                throw new Error(
                    `Unexpected token type ${this.currentToken.type} in terminology`
                );
            }
        }

        return element;
    }
    // 新增：示例元素解析
    private parseExamplesElement(): ExamplesElement {
        const element = new ExamplesElement();
        element.children = [];

        // 跳过开标签
        this.advance(); // 跳过 '<examples>'

        while (this.currentToken) {
            if (
                this.currentToken.type === "CloseTag" &&
                this.currentToken.value === "examples"
            ) {
                // 找到结束标签
                this.advance();
                break;
            } else if (
                this.currentToken.type === "OpenTag" &&
                this.currentToken.value === "example"
            ) {
                element.children.push(
                    this.parseSimpleElement([], "example", ExampleElement)
                );
            } else if (this.currentToken.type === "Text") {
                // 处理示例之间的文本
                this.advance();
            } else {
                // 遇到意外 token 类型
                throw new Error(
                    `Unexpected token type ${this.currentToken.type} in examples`
                );
            }
        }

        return element;
    }

    private parseExecutionElement(attributes: Attributes[]): ExecutionElement {
        const element = new ExecutionElement();
        element.attributes = attributes;
        element.children = this.parseMixedContent([
            "process",
            "guideline",
            "rule",
            "constraint",
            "criteria"
        ]);
        return element;
    }

    private parseResourceElement(attributes: Attributes[]): ResourceElement {
        const element = new ResourceElement();

        // 提取protocol属性
        const protocolAttr = attributes.find(
            (attr) => attr.name === "protocol"
        );
        if (protocolAttr) {
            element.protocol = protocolAttr.value;
        }

        element.contents = this.parseMixedContent([
            "location",
            "params",
            "registry"
        ]);

        return element;
    }

    private parseRoleElement(attributes: Attributes[]): RoleElement {
        const element = new RoleElement();
        element.attributes = attributes;
        while (this.currentToken) {
            if (this.currentToken.type === "OpenTag") {
                element.children.push(this.parseElement());
            } else if (this.currentToken.type === "Text") {
                if (this.currentToken.value.trim() === "") {
                    this.advance();
                } else {
                    throw new Error(
                        `Unexpected text content in role element: "${this.currentToken.value}"`
                    );
                }
            } else {
                break;
            }
        }
        return element;
    }

    private parseTerminologiesElement(
        attributes: Attributes[]
    ): TerminologiesElement {
        const element = new TerminologiesElement();
        element.attributes = attributes;
        element.children = [];
        while (
            this.currentToken?.type === "OpenTag" &&
            this.currentToken.value === "terminology"
        ) {
            element.children.push(this.parseTerminologyElement([]));
        }

        return element;
    }

    private parseThoughtElement(attributes: Attributes[]): ThoughtElement {
        const element = new ThoughtElement();
        element.attributes = attributes;
        element.children = this.parseMixedContent([
            "exploration",
            "reasoning",
            "plan",
            "challenge"
        ]);
        return element;
    }

    private advance() {
        this.currentToken =
            this.pos < this.tokens.length ? this.tokens[this.pos++] : null;
    }
}
