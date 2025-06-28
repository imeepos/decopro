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

// DPML Visitor 接口
export interface DpmlVisitor<O, C> extends Visitor<O, C> {
    visitCriteriaElement(node: CriteriaElement, ctx: C): Promise<O>;
    visitConstraintElement(node: ConstraintElement, ctx: C): Promise<O>;
    visitRuleElement(node: RuleElement, ctx: C): Promise<O>;
    visitGuidelineElement(node: GuidelineElement, ctx: C): Promise<O>;
    visitProcessElement(node: ProcessElement, ctx: C): Promise<O>;
    visitExecutionElement(node: ExecutionElement, ctx: C): Promise<O>;
    visitResourceElement(node: ResourceElement, ctx: C): Promise<O>;
    visitLocationElement(node: LocationElement, ctx: C): Promise<O>;
    visitParamsElement(node: ParamsElement, ctx: C): Promise<O>;
    visitRegistryElement(node: RegistryElement, ctx: C): Promise<O>;
    visitRoleElement(node: RoleElement, ctx: C): Promise<O>;
    visitPersonalityElement(node: PersonalityElement, ctx: C): Promise<O>;
    visitPrincipleElement(node: PrincipleElement, ctx: C): Promise<O>;
    visitKnowledgeElement(node: KnowledgeElement, ctx: C): Promise<O>;
    visitTerminologiesElement(node: TerminologiesElement, ctx: C): Promise<O>;
    visitTerminologyElement(node: TerminologyElement, ctx: C): Promise<O>;
    visitZhElement(node: ZhElement, ctx: C): Promise<O>;
    visitEnElement(node: EnElement, ctx: C): Promise<O>;
    visitDefinitionElement(node: DefinitionElement, ctx: C): Promise<O>;
    visitExamplesElement(node: ExamplesElement, ctx: C): Promise<O>;
    visitExampleElement(node: ExampleElement, ctx: C): Promise<O>;
    visitThoughtElement(node: ThoughtElement, ctx: C): Promise<O>;
    visitExplorationElement(node: ExplorationElement, ctx: C): Promise<O>;
    visitReasoningElement(node: ReasoningElement, ctx: C): Promise<O>;
    visitPlanElement(node: PlanElement, ctx: C): Promise<O>;
    visitChallengeElement(node: ChallengeElement, ctx: C): Promise<O>;
    visitPromptElement(node: PromptElement, ctx: C): Promise<O>;
}

@Ast({ description: `标准` })
export class CriteriaElement extends BaseAst {
    @Input({}) attributes: Attributes[] = [];
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitCriteriaElement(this, ctx);
    }
}

@Ast({ description: `约束` })
export class ConstraintElement extends BaseAst {
    @Input({}) attributes: Attributes[] = [];
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitConstraintElement(this, ctx);
    }
}

@Ast({ description: `规则` })
export class RuleElement extends BaseAst {
    @Input({}) attributes: Attributes[] = [];
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitRuleElement(this, ctx);
    }
}

@Ast({ description: `指导原则` })
export class GuidelineElement extends BaseAst {
    @Input({}) attributes: Attributes[] = [];
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitGuidelineElement(this, ctx);
    }
}

@Ast({ description: `流程步骤` })
export class ProcessElement extends BaseAst {
    @Input({}) attributes: Attributes[] = [];
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitProcessElement(this, ctx);
    }
}

export type ExecutionElementContent =
    | MarkdownContent
    | ProcessElement
    | GuidelineElement
    | RuleElement
    | ConstraintElement
    | CriteriaElement
    | ResourceElement;

@Ast({ description: `行为提示单元` })
export class ExecutionElement extends BaseAst {
    @Input({}) attributes: Attributes[] = [];
    @Input({}) children: ExecutionElementContent[] = [];

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitExecutionElement(this, ctx);
    }
}

@Ast({ description: `` })
export class RegistryElement extends BaseAst {
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitRegistryElement(this, ctx);
    }
}

@Ast({ description: `查询参数` })
export class ParamsElement extends BaseAst {
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitParamsElement(this, ctx);
    }
}

@Ast({ description: `位置` })
export class LocationElement extends BaseAst {
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitLocationElement(this, ctx);
    }
}

export type ResourceElementContent =
    | LocationElement
    | ParamsElement
    | RegistryElement
    | MarkdownContent;

@Ast({ description: `资源提示单元` })
export class ResourceElement extends BaseAst {
    @Input({}) protocol: string = ``;
    @Input({}) model: `auto` | `lazy` | `load` = `auto`;
    @Input({}) location: string = ``;
    @Input({}) contents: ResourceElementContent[] = [];
    @Input({}) inline: boolean = false;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitResourceElement(this, ctx);
    }
}

@Ast({ description: `思维模式` })
export class PersonalityElement extends BaseAst {
    @Input({}) attributes: Attributes[] = [];

    @Input({})
    children: (BaseAst | MarkdownContent)[] = [];
    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitPersonalityElement(this, ctx);
    }
}

@Ast({ description: `行为原则` })
export class PrincipleElement extends BaseAst {
    @Input({}) attributes: Attributes[] = [];
    @Input({}) children: BaseAst[] = [];

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitPrincipleElement(this, ctx);
    }
}

@Ast({ description: `专业知识` })
export class KnowledgeElement extends BaseAst {
    @Input({}) attributes: Attributes[] = [];
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitKnowledgeElement(this, ctx);
    }
}

@Ast({ description: `角色提示单元` })
export class RoleElement extends BaseAst {
    @Input({}) attributes: Attributes[] = [];

    @Input({})
    children: BaseAst[] = [];

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitRoleElement(this, ctx);
    }
}

@Ast({})
export class ZhElement extends BaseAst {
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitZhElement(this, ctx);
    }
}

@Ast({})
export class EnElement extends BaseAst {
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitEnElement(this, ctx);
    }
}

@Ast({})
export class DefinitionElement extends BaseAst {
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitDefinitionElement(this, ctx);
    }
}

@Ast({})
export class ExamplesElement extends BaseAst {
    @Input({}) children: BaseAst[] = [];

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitExamplesElement(this, ctx);
    }
}

@Ast({})
export class ExampleElement extends BaseAst {
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitExampleElement(this, ctx);
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
    @Input({}) attributes: Attributes[] = [];
    @Input({}) children: (BaseAst | MarkdownContent)[] = [];

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitTerminologyElement(this, ctx);
    }
}

@Ast({})
export class TerminologiesElement extends BaseAst {
    @Input({}) attributes: Attributes[] = [];
    @Input({}) children: TerminologyElement[] = [];

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitTerminologiesElement(this, ctx);
    }
}

@Ast({})
export class ChallengeElement extends BaseAst {
    @Input({}) attributes: Attributes[] = [];
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitChallengeElement(this, ctx);
    }
}

@Ast({})
export class PlanElement extends BaseAst {
    @Input({}) attributes: Attributes[] = [];
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitPlanElement(this, ctx);
    }
}

@Ast({})
export class ReasoningElement extends BaseAst {
    @Input({}) attributes: Attributes[] = [];
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitReasoningElement(this, ctx);
    }
}

@Ast({})
export class ExplorationElement extends BaseAst {
    @Input({}) attributes: Attributes[] = [];
    @Input({}) content: MarkdownContent = ``;

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitExplorationElement(this, ctx);
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
    @Input({}) attributes: Attributes[] = [];
    @Input({}) children: ThoughtElementContent[] = [];

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitThoughtElement(this, ctx);
    }
}

@Ast({ description: `提示词` })
export class PromptElement extends BaseAst {
    @Input({}) children: BaseAst[] = [];

    constructor(children: BaseAst[] = []) {
        super();
        this.children = children;
    }

    visit<O, C>(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitPromptElement(this, ctx);
    }
}

export interface DpmlVisitor<O = any, C = any> extends Visitor<O, C> {
    visitPromptElement(ast: PromptElement, ctx: C): Promise<O>;
    visitThoughtElement(ast: ThoughtElement, ctx: C): Promise<O>;
    visitExplorationElement(ast: ExplorationElement, ctx: C): Promise<O>;
    visitReasoningElement(ast: ReasoningElement, ctx: C): Promise<O>;
    visitPlanElement(ast: PlanElement, ctx: C): Promise<O>;
    visitChallengeElement(ast: ChallengeElement, ctx: C): Promise<O>;
    visitTerminologiesElement(ast: TerminologiesElement, ctx: C): Promise<O>;
    visitTerminologyElement(ast: TerminologyElement, ctx: C): Promise<O>;
    visitExampleElement(ast: ExampleElement, ctx: C): Promise<O>;
    visitExamplesElement(ast: ExamplesElement, ctx: C): Promise<O>;
    visitDefinitionElement(ast: DefinitionElement, ctx: C): Promise<O>;
    visitEnElement(ast: EnElement, ctx: C): Promise<O>;
    visitZhElement(ast: ZhElement, ctx: C): Promise<O>;
    visitRoleElement(ast: RoleElement, ctx: C): Promise<O>;
    visitKnowledgeElement(ast: KnowledgeElement, ctx: C): Promise<O>;
    visitPrincipleElement(ast: PrincipleElement, ctx: C): Promise<O>;
    visitPersonalityElement(ast: PersonalityElement, ctx: C): Promise<O>;
    visitResourceElement(ast: ResourceElement, ctx: C): Promise<O>;
    visitLocationElement(ast: LocationElement, ctx: C): Promise<O>;
    visitParamsElement(ast: ParamsElement, ctx: C): Promise<O>;
    visitRegistryElement(ast: RegistryElement, ctx: C): Promise<O>;
    visitExecutionElement(ast: ExecutionElement, ctx: C): Promise<O>;
    visitProcessElement(ast: ProcessElement, ctx: C): Promise<O>;
    visitGuidelineElement(ast: GuidelineElement, ctx: C): Promise<O>;
    visitRuleElement(ast: RuleElement, ctx: C): Promise<O>;
    visitConstraintElement(ast: ConstraintElement, ctx: C): Promise<O>;
    visitCriteriaElement(ast: CriteriaElement, ctx: C): Promise<O>;
}
