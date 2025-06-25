
# ast定义
```ts
import { Ast, Visitor } from "@decopro/ast";
import { Input } from "@decopro/core";
export class BaseAst {
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
export interface Attributes {
    name: string;
    value: string;
}
export type MarkdownContent = string;
@Ast({
    description: `标准`
})
export class CriteriaElement extends BaseAst {
    @Input({})
    attributes: Attributes[] = [];
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({
    description: `约束`
})
export class ConstraintElement extends BaseAst {
    @Input({})
    attributes: Attributes[] = [];
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({
    description: `规则`
})
export class RuleElement extends BaseAst {
    @Input({})
    attributes: Attributes[] = [];
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({
    description: `指导原则`
})
export class GuidelineElement extends BaseAst {
    @Input({})
    attributes: Attributes[] = [];
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({
    description: `流程步骤`
})
export class ProcessElement extends BaseAst {
    @Input({})
    attributes: Attributes[] = [];
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
export type ExecutionElementContent =
    | MarkdownContent
    | ProcessElement
    | GuidelineElement
    | RuleElement
    | ConstraintElement
    | CriteriaElement;
@Ast({
    description: `行为提示单元`
})
export class ExecutionElement extends BaseAst {
    @Input({})
    attributes: Attributes[] = [];
    @Input({})
    contents: ExecutionElementContent[] = [];
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}

@Ast({
    description: ``
})
export class RegistryElement extends BaseAst {
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({
    description: `查询参数`
})
export class ParamsElement extends BaseAst {
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({
    description: `位置`
})
export class LocationElement extends BaseAst {
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
export type ResourceElementContent =
    | LocationElement
    | ParamsElement
    | RegistryElement
    | MarkdownContent;
@Ast({
    description: `资源提示单元`
})
export class ResourceElement extends BaseAst {
    @Input({})
    protocol: string = ``;
    @Input({})
    contents: ResourceElementContent[] = [];
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}

@Ast({
    description: `思维模式`
})
export class PersonalityElement extends BaseAst {
    @Input({})
    attributes: Attributes[] = [];
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({
    description: `行为原则`
})
export class PrincipleElement extends BaseAst {
    @Input({})
    attributes: Attributes[] = [];
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({
    description: `专业知识`
})
export class KnowledgeElement extends BaseAst {
    @Input({})
    attributes: Attributes[] = [];
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({
    description: `角色提示单元`
})
export class RoleElement extends BaseAst {
    @Input({})
    attributes: Attributes[] = [];
    @Input({})
    knowledge: KnowledgeElement = new KnowledgeElement();
    @Input({})
    principle: PrincipleElement = new PrincipleElement();
    @Input({})
    personality: PersonalityElement = new PersonalityElement();
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}

@Ast({})
export class ZhElement extends BaseAst {
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({})
export class EnElement extends BaseAst {
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({})
export class DefinitionElement extends BaseAst {
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({})
export class ExamplesElement extends BaseAst {
    @Input({})
    children: BaseAst[] = [];
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({})
export class ExampleElement extends BaseAst {
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}

export type TerminologyElementContent =
    | ExamplesElement
    | DefinitionElement
    | EnElement
    | ZhElement
    | MarkdownContent;
@Ast({})
export class TerminologyElement extends BaseAst {
    @Input({})
    children: (BaseAst | MarkdownContent)[] = [];
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({})
export class TerminologiesElement extends BaseAst {
    @Input({})
    children: TerminologyElement[] = [];
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}

@Ast({})
export class ChallengeElement extends BaseAst {
    @Input({})
    attributes: Attributes[] = [];
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({})
export class PlanElement extends BaseAst {
    @Input({})
    attributes: Attributes[] = [];
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({})
export class ReasoningElement extends BaseAst {
    @Input({})
    attributes: Attributes[] = [];
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
@Ast({})
export class ExplorationElement extends BaseAst {
    @Input({})
    attributes: Attributes[] = [];
    @Input({})
    content: MarkdownContent = ``;
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}

export type ThoughtElementContent =
    | MarkdownContent
    | ExplorationElement
    | ReasoningElement
    | PlanElement
    | ChallengeElement;
@Ast({})
export class ThoughtElement extends BaseAst {
    @Input({})
    attributes: Attributes[] = [];
    @Input({})
    children: ThoughtElementContent[] = [];
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}

@Ast({
    description: `提示词`
})
export class PromptElement extends BaseAst {
    @Input({})
    children: BaseAst[] = [];

    constructor(children: BaseAst[] = []) {
        super();
        this.children = children;
    }
}
```

# 语法

```ebnf
(* EBNF形式化定义 *)
execution_element ::= '<execution' attributes? '>' content '</execution>'
attributes ::= (' ' attribute)+ | ''
attribute ::= name '="' value '"'
name ::= [a-zA-Z][a-zA-Z0-9_-]*
value ::= [^"]*
content ::= (markdown_content | process_element | guideline_element | rule_element | constraint_element | criteria_element)+

process_element ::= '<process' attributes? '>' markdown_content '</process>'
guideline_element ::= '<guideline' attributes? '>' markdown_content '</guideline>'
rule_element ::= '<rule' attributes? '>' markdown_content '</rule>'
constraint_element ::= '<constraint' attributes? '>' markdown_content '</constraint>'
criteria_element ::= '<criteria' attributes? '>' markdown_content '</criteria>'

markdown_content ::= (* 任何有效的Markdown文本，可包含特定语法元素 *)
```

```ebnf
(* EBNF形式化定义 *)
resource_element ::= '<resource' ' protocol="' protocol_name '"' '>' content '</resource>'
protocol_name ::= [a-zA-Z][a-zA-Z0-9_-]*
content ::= (markdown_content | location_element | params_element | registry_element)+

location_element ::= '<location>' markdown_content '</location>'
params_element ::= '<params>' markdown_content '</params>'
registry_element ::= '<registry>' markdown_content '</registry>'

markdown_content ::= (* 任何有效的Markdown文本，包括代码块、表格等 *)
```


```ebnf
resource_reference ::= ('[@]' | '@!' | '@?') protocol_name ':' resource_location [query_params]
resource_location ::= uri | nested_reference
uri ::= protocol_name '://' path
nested_reference ::= ['[@]' | '@!' | '@?'] protocol_name ':' resource_location
path ::= path_segment {'/' path_segment}
query_params ::= '?' param_name '=' param_value {'&' param_name '=' param_value}
```


```ebnf
(* EBNF形式化定义 *)
role_element ::= '<role' attributes? '>' role_content '</role>'
role_content ::= personality_element principle_element knowledge_element

(* 三大核心组件 *)
personality_element ::= '<personality' attributes? '>' personality_content '</personality>'
principle_element ::= '<principle' attributes? '>' principle_content '</principle>'
knowledge_element ::= '<knowledge' attributes? '>' knowledge_content '</knowledge>'

(* 内容定义 *)
personality_content ::= markdown_content
principle_content ::= markdown_content
knowledge_content ::= markdown_content

attributes ::= (' ' attribute)+ | ''
attribute ::= name '="' value '"'
name ::= [a-zA-Z][a-zA-Z0-9_-]*
value ::= [^"]*

markdown_content ::= (* 符合Markdown语法的内容 *)
```


```ebnf
(* EBNF形式化定义 *)
terminologies_element ::= '<terminologies>' terminology+ '</terminologies>'
terminology_element ::= '<terminology>' terminology_content '</terminology>'
terminology_content ::= zh_element en_element definition_element examples_element
zh_element ::= '<zh>' text '</zh>'
en_element ::= '<en>' text '</en>'
definition_element ::= '<definition>' markdown_content '</definition>'
examples_element ::= '<examples>' example+ '</examples>'
example_element ::= '<example>' markdown_content '</example>'

text ::= (* 任何文本内容 *)
markdown_content ::= (* 任何有效的Markdown文本 *)
```


```ebnf
(* EBNF形式化定义 *)
thought_element ::= '<thought' attributes? '>' content '</thought>'
attributes ::= (' ' attribute)+ | ''
attribute ::= name '="' value '"'
name ::= [a-zA-Z][a-zA-Z0-9_-]*
value ::= [^"]*
content ::= (markdown_content | exploration_element | reasoning_element | plan_element | challenge_element)+
markdown_content ::= (* 任何有效的Markdown文本，包括Mermaid图表 *)

exploration_element ::= '<exploration' attributes? '>' markdown_content '</exploration>'
reasoning_element ::= '<reasoning' attributes? '>' markdown_content '</reasoning>'
plan_element ::= '<plan' attributes? '>' markdown_content '</plan>'
challenge_element ::= '<challenge' attributes? '>' markdown_content '</challenge>'
```

```ts
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
        const isSelfClosing = input[endIndex - 1] === '/';
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
        // 匹配资源引用格式: [@]protocol:location[?params]
        const refRegex =
            /^(@!|@\?|@|\[\@\])([a-zA-Z][a-zA-Z0-9_-]*):([^\s]+)(\?[^\s]+)?/;
        const match = refRegex.exec(input.substring(this.pos));

        if (!match) {
            this.handleText(input);
            return;
        }

        const [fullMatch, refType, protocol, location, params] = match;
        this.tokens.push({
            type: "ResourceRef",
            value: `${refType}${protocol}:${location}${params || ""}`
        });

        this.pos += fullMatch.length;
    }

    private handleText(input: string) {
        let text = "";
        while (this.pos < input.length) {
            const char = input[this.pos];

            if (char === "<" || char === "@") break;

            text += char;
            this.pos++;
        }

        if (text) {
            this.tokens.push({ type: "Text", value: text });
        }
    }
}

```

```ts
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
            } else if (
                this.currentToken.type === "Text" ||
                this.currentToken.type === "ResourceRef"
            ) {
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
    // 修复：添加属性处理
    private parsePersonalityElement(): PersonalityElement {
        this.advance(); // 跳过OpenTag

        // 解析属性
        const attributes: Attributes[] = [];
        while (this.currentToken?.type === "Attribute") {
            attributes.push({
                name: this.currentToken.name!,
                value: this.currentToken.value
            });
            this.advance();
        }
        // 确认标签结束
        if (this.currentToken?.type !== "TagEnd") {
            throw new Error("Expected tag end after attributes");
        }
        this.advance();
        const element = new PersonalityElement();
        element.attributes = attributes;
        element.content = this.parseTextUntilClose("personality");
        return element;
    }
    // 新增：术语元素解析
    private parseTerminologyElement(
        attributes: Attributes[]
    ): TerminologyElement {
        const element = new TerminologyElement();
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
        element.contents = this.parseMixedContent([
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
                const tagName = this.currentToken.value;
                if (tagName === "personality") {
                    element.personality =
                        this.parseElement() as PersonalityElement;
                } else if (tagName === "principle") {
                    element.principle = this.parseElement() as PrincipleElement;
                } else if (tagName === "knowledge") {
                    element.knowledge = this.parseElement() as KnowledgeElement;
                } else {
                    // 遇到非角色子元素，停止解析
                    break;
                }
            } else if (this.currentToken.type === "Text") {
                // 新增：处理空白文本节点
                if (this.currentToken.value.trim() === "") {
                    // 纯空白内容，安全跳过
                    this.advance();
                } else {
                    // 非空白文本，抛出错误或根据需求处理
                    throw new Error(
                        `Unexpected text content in role element: "${this.currentToken.value}"`
                    );
                }
            } else {
                // 遇到非开始标签，停止解析
                break;
            }
        }
        return element;
    }

    private parseTerminologiesElement(
        attributes: Attributes[]
    ): TerminologiesElement {
        const element = new TerminologiesElement();
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

```


```
```