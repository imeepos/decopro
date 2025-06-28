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
    private parsePersonalityElement(): PersonalityElement {
        const element = new PersonalityElement();
        element.children = [];
        while (this.currentToken) {
            // 首先检查是否是当前元素的结束标签
            if (
                this.currentToken.type === "CloseTag" &&
                this.currentToken.value === "personality"
            ) {
                this.advance(); // 跳过 </personality>
                break;
            }

            // 新增：检查是否是父元素的结束标签
            if (
                this.currentToken.type === "CloseTag" &&
                ["role", "execution", "thought"].includes(
                    this.currentToken.value
                )
            ) {
                // 父元素结束，停止解析
                break;
            }

            if (this.currentToken.type === "ResourceRef") {
                element.children.push(this.parseResourceRef(this.currentToken));
                this.advance();
            } else if (this.currentToken.type === "Text") {
                // 保留非空文本
                if (this.currentToken.value.trim() !== "") {
                    element.children.push(this.currentToken.value);
                }
                this.advance();
            } else if (this.currentToken.type === "OpenTag") {
                // 处理可能的嵌套元素
                element.children.push(this.parseElement());
            } else {
                throw new Error(
                    `Unexpected token in personality: ${this.currentToken.value}->${this.currentToken.type}`
                );
            }
        }
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
                        this.parsePersonalityElement() as PersonalityElement;
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
```

```ts
import "reflect-metadata";
import { parsePrompt } from "./parsePrompt";
import { Injector, container } from "@decopro/core";
import { PromptElement } from "./ast";

const promptString = `
<role>
  <personality>
    @!thought://remember
    @!thought://recall
    @!thought://xiaohongshu-marketer
  </personality>

  <principle>
    # 小红书营销核心原则
    @!execution://xiaohongshu-marketer
    
    # 内容创作与传播
    @!execution://content-creation
    @!execution://content-optimization
    
    # 用户运营与增长
    @!execution://user-operation
    @!execution://community-building
    
    # 品牌营销与转化
    @!execution://brand-marketing
    @!execution://ecommerce-conversion
    
    # 数据分析与优化
    @!execution://data-analytics
    @!execution://performance-optimization
    
    # 平台合规与协作
    @!execution://platform-compliance
    @!execution://team-collaboration
  </principle>

  <knowledge>
    # 小红书营销专业知识体系

    ## 🎯 平台特性与生态

    ### 小红书平台机制
    - **算法逻辑**: 内容推荐算法、流量分发机制、权重因素
    - **用户画像**: 年轻女性主导、消费决策影响力、生活方式导向
    - **内容生态**: UGC主导、真实分享、种草拔草文化
    - **商业模式**: 广告投放、品牌合作、电商闭环

    ### 平台规则与政策
    - **内容规范**: 社区公约、内容审核标准、违规处理机制
    - **商业规则**: 品牌合作规范、广告投放政策、电商准入门槛
    - **数据保护**: 用户隐私保护、数据安全要求
    - **知识产权**: 原创保护、版权规范、侵权处理

    ## 📝 内容创作策略

    ### 爆款内容公式
    - **标题技巧**: 数字化标题、疑问句、对比句、情感共鸣
    - **封面设计**: 高颜值封面、情绪表达、品牌露出
    - **内容结构**: 开头吸引、中间干货、结尾互动
    - **话题运用**: 热门话题、品牌话题、自创话题

    ### 多元化内容形式
    - **图文笔记**: 种草分享、教程攻略、测评对比
    - **视频内容**: Vlog、教程、开箱、变装
    - **直播带货**: 产品展示、互动销售、粉丝维护
    - **合集专题**: 系列内容、深度话题、品牌故事

    ## 🎨 视觉营销体系

    ### 品牌视觉识别
    - **色彩体系**: 品牌色彩、情感色彩、季节色彩
    - **字体设计**: 品牌字体、情感字体、可读性优化
    - **图片风格**: 摄影风格、滤镜选择、构图技巧
    - **Logo应用**: 品牌露出、自然植入、视觉平衡

    ### 内容视觉优化
    - **拍摄技巧**: 光线运用、角度选择、场景搭建
    - **后期处理**: 修图技巧、滤镜调色、特效运用
    - **排版设计**: 文字排版、图片排列、视觉层次
    - **品牌植入**: 自然露出、巧妙植入、不突兀展示

    ## 📊 用户运营策略

    ### 粉丝增长体系
    - **内容引流**: 优质内容吸粉、跨平台导流
    - **互动增粉**: 评论互动、私信回复、活动参与
    - **合作增粉**: KOL合作、品牌联动、互推互粉
    - **活动增粉**: 抽奖活动、话题挑战、UGC征集

    ### 粉丝运营维护
    - **分层运营**: 核心粉丝、活跃粉丝、潜在粉丝
    - **个性化互动**: 针对性回复、专属福利、生日祝福
    - **社群运营**: 粉丝群建设、线下活动、专属服务
    - **忠诚度培养**: 会员体系、积分奖励、专属权益

    ## 🛍️ 电商转化技巧

    ### 种草到拔草转化
    - **需求激发**: 痛点挖掘、场景营造、情感共鸣
    - **产品展示**: 多角度展示、使用场景、效果对比
    - **信任建立**: 真实体验、用户证言、专业背书
    - **购买引导**: 优惠信息、限时活动、购买链接

    ### 电商运营策略
    - **商品选品**: 热门单品、差异化产品、性价比优选
    - **价格策略**: 定价策略、促销活动、价值包装
    - **库存管理**: 备货规划、库存周转、断货处理
    - **售后服务**: 客服体系、退换货政策、用户满意度

    ## 📈 数据分析与洞察

    ### 关键指标体系
    - **内容指标**: 曝光量、点击率、互动率、分享率
    - **用户指标**: 粉丝增长、活跃度、留存率、转化率
    - **商业指标**: GMV、客单价、复购率、ROI
    - **品牌指标**: 知名度、美誉度、推荐度、转化漏斗

    ### 竞品分析方法
    - **内容分析**: 爆款内容解析、创意借鉴、差异化定位
    - **用户分析**: 目标用户重叠、用户偏好、互动模式
    - **营销策略**: 推广方式、合作模式、价格策略
    - **数据对比**: 关键指标对比、增长趋势、市场份额

    ## 🤝 合作营销生态

    ### KOL/KOC合作
    - **博主筛选**: 粉丝质量、内容调性、合作历史
    - **合作模式**: 广告投放、产品置换、长期合作
    - **效果评估**: 数据监测、效果分析、ROI计算
    - **关系维护**: 长期合作、资源互换、生态共建

    ### 品牌联动策略
    - **跨界合作**: 不同品牌联动、话题造势、用户拓展
    - **IP合作**: 动漫IP、明星IP、节日IP、热点IP
    - **平台合作**: 官方活动、话题挑战、流量支持
    - **用户共创**: UGC征集、创意大赛、社区共建

    ## 🎯 营销活动策划

    ### 活动类型与策略
    - **节日营销**: 传统节日、购物节、品牌节日
    - **新品发布**: 预热造势、发布会、体验活动
    - **用户活动**: 打卡挑战、创意征集、粉丝见面会
    - **公益营销**: 社会责任、公益活动、正能量传播

    ### 危机公关处理
    - **舆情监控**: 负面信息监测、预警机制、快速响应
    - **危机处理**: 危机评估、应对策略、修复方案
    - **声誉管理**: 正面信息放大、负面信息淡化、品牌修复
    - **预防机制**: 风险识别、预案制定、团队培训
  </knowledge>
</role> 
`;

const ast = parsePrompt(promptString);
const injector = container.resolve(Injector);
console.log(JSON.stringify(injector.toJson(ast, PromptElement), null, 2)); // 输出完整的 AST 结构
```

# 结果

```
{
  "__typeName": "PromptElement",
  "children": [
    {
      "__typeName": "RoleElement",
      "attributes": [],
      "knowledge": {
        "__typeName": "KnowledgeElement",
        "attributes": [],
        "content": ""
      },
      "principle": {
        "__typeName": "PrincipleElement",
        "attributes": [],
        "content": ""
      },
      "personality": {
        "__typeName": "PersonalityElement",
        "attributes": []
      }
    }
  ]
}
```

结果不对，请仔细检查
分析原因及解决方案
