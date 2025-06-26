import { Ast } from "@decopro/ast";
import {
    ChallengeElement,
    ConstraintElement,
    CriteriaElement,
    DefinitionElement,
    DpmlVisitor,
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

export class RunVisitor implements DpmlVisitor {
    visitPromptElement(ast: PromptElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitThoughtElement(ast: ThoughtElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitExplorationElement(ast: ExplorationElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitReasoningElement(ast: ReasoningElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitPlanElement(ast: PlanElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitChallengeElement(ast: ChallengeElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitTerminologiesElement(
        ast: TerminologiesElement,
        ctx: any
    ): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitTerminologyElement(ast: TerminologyElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitExampleElement(ast: ExampleElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitExamplesElement(ast: ExamplesElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitDefinitionElement(ast: DefinitionElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitEnElement(ast: EnElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitZhElement(ast: ZhElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitRoleElement(ast: RoleElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitKnowledgeElement(ast: KnowledgeElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitPrincipleElement(ast: PrincipleElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitPersonalityElement(ast: PersonalityElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitResourceElement(ast: ResourceElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitLocationElement(ast: LocationElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitParamsElement(ast: ParamsElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitRegistryElement(ast: RegistryElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitExecutionElement(ast: ExecutionElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitProcessElement(ast: ProcessElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitGuidelineElement(ast: GuidelineElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitRuleElement(ast: RuleElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitConstraintElement(ast: ConstraintElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visitCriteriaElement(ast: CriteriaElement, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    visit(ast: Ast, ctx: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
