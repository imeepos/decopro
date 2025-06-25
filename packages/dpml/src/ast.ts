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
    location: string = ``
    @Input({})
    contents: ResourceElementContent[] = [];
    @Input({})
    inline: boolean = false;
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
