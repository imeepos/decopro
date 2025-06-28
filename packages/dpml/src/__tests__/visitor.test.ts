import { parsePrompt } from "../index";
import {
    DpmlVisitor,
    PromptElement,
    RoleElement,
    PersonalityElement,
    PrincipleElement,
    KnowledgeElement,
    ExecutionElement,
    ProcessElement,
    GuidelineElement,
    RuleElement,
    ConstraintElement,
    CriteriaElement,
    ResourceElement,
    LocationElement,
    ParamsElement,
    RegistryElement,
    TerminologiesElement,
    TerminologyElement,
    ZhElement,
    EnElement,
    DefinitionElement,
    ExamplesElement,
    ExampleElement,
    ThoughtElement,
    ExplorationElement,
    ReasoningElement,
    PlanElement,
    ChallengeElement
} from "../ast";

// Example visitor that converts DPML to plain text
class TextExtractorVisitor implements DpmlVisitor<string, void> {
    async visitPromptElement(node: PromptElement, ctx: void): Promise<string> {
        const results = await Promise.all(
            node.children.map(child => child.visit(this, ctx))
        );
        return results.join('\n\n');
    }

    async visitRoleElement(node: RoleElement, ctx: void): Promise<string> {
        const results = await Promise.all(
            node.children.map(child => child.visit(this, ctx))
        );
        return `ROLE:\n${results.join('\n')}`;
    }

    async visitPersonalityElement(node: PersonalityElement, ctx: void): Promise<string> {
        const content = Array.isArray(node.children) 
            ? node.children.join(' ') 
            : node.children || '';
        return `Personality: ${content}`;
    }

    async visitPrincipleElement(node: PrincipleElement, ctx: void): Promise<string> {
        const content = Array.isArray(node.children) 
            ? node.children.join(' ') 
            : node.children || '';
        return `Principle: ${content}`;
    }

    async visitKnowledgeElement(node: KnowledgeElement, ctx: void): Promise<string> {
        return `Knowledge: ${node.content}`;
    }

    async visitExecutionElement(node: ExecutionElement, ctx: void): Promise<string> {
        const results = await Promise.all(
            node.children.map(child => {
                if (typeof child === 'string') {
                    return Promise.resolve(child);
                }
                return child.visit(this, ctx);
            })
        );
        return `EXECUTION:\n${results.join('\n')}`;
    }

    async visitProcessElement(node: ProcessElement, ctx: void): Promise<string> {
        return `Process: ${node.content}`;
    }

    async visitGuidelineElement(node: GuidelineElement, ctx: void): Promise<string> {
        return `Guideline: ${node.content}`;
    }

    async visitRuleElement(node: RuleElement, ctx: void): Promise<string> {
        return `Rule: ${node.content}`;
    }

    async visitConstraintElement(node: ConstraintElement, ctx: void): Promise<string> {
        return `Constraint: ${node.content}`;
    }

    async visitCriteriaElement(node: CriteriaElement, ctx: void): Promise<string> {
        return `Criteria: ${node.content}`;
    }

    async visitResourceElement(node: ResourceElement, ctx: void): Promise<string> {
        const model = node.model !== 'auto' ? `[${node.model}] ` : '';
        return `Resource: ${model}${node.protocol}:${node.location}`;
    }

    async visitLocationElement(node: LocationElement, ctx: void): Promise<string> {
        return `Location: ${node.content}`;
    }

    async visitParamsElement(node: ParamsElement, ctx: void): Promise<string> {
        return `Params: ${node.content}`;
    }

    async visitRegistryElement(node: RegistryElement, ctx: void): Promise<string> {
        return `Registry: ${node.content}`;
    }

    async visitTerminologiesElement(node: TerminologiesElement, ctx: void): Promise<string> {
        const results = await Promise.all(
            node.children.map(child => child.visit(this, ctx))
        );
        return `TERMINOLOGIES:\n${results.join('\n')}`;
    }

    async visitTerminologyElement(node: TerminologyElement, ctx: void): Promise<string> {
        const results = await Promise.all(
            node.children.map(child => {
                if (typeof child === 'string') {
                    return Promise.resolve(child);
                }
                return child.visit(this, ctx);
            })
        );
        return `Term: ${results.join(' ')}`;
    }

    async visitZhElement(node: ZhElement, ctx: void): Promise<string> {
        return `中文: ${node.content}`;
    }

    async visitEnElement(node: EnElement, ctx: void): Promise<string> {
        return `English: ${node.content}`;
    }

    async visitDefinitionElement(node: DefinitionElement, ctx: void): Promise<string> {
        return `Definition: ${node.content}`;
    }

    async visitExamplesElement(node: ExamplesElement, ctx: void): Promise<string> {
        const results = await Promise.all(
            node.children.map(child => child.visit(this, ctx))
        );
        return `Examples: ${results.join(', ')}`;
    }

    async visitExampleElement(node: ExampleElement, ctx: void): Promise<string> {
        return node.content;
    }

    async visitThoughtElement(node: ThoughtElement, ctx: void): Promise<string> {
        const results = await Promise.all(
            node.children.map(child => {
                if (typeof child === 'string') {
                    return Promise.resolve(child);
                }
                return child.visit(this, ctx);
            })
        );
        return `THOUGHT:\n${results.join('\n')}`;
    }

    async visitExplorationElement(node: ExplorationElement, ctx: void): Promise<string> {
        return `Exploration: ${node.content}`;
    }

    async visitReasoningElement(node: ReasoningElement, ctx: void): Promise<string> {
        return `Reasoning: ${node.content}`;
    }

    async visitPlanElement(node: PlanElement, ctx: void): Promise<string> {
        return `Plan: ${node.content}`;
    }

    async visitChallengeElement(node: ChallengeElement, ctx: void): Promise<string> {
        return `Challenge: ${node.content}`;
    }
}

// Example visitor that collects statistics
class StatisticsVisitor implements DpmlVisitor<void, { stats: Record<string, number> }> {
    async visitPromptElement(node: PromptElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.prompt = (ctx.stats.prompt || 0) + 1;
        for (const child of node.children) {
            await child.visit(this, ctx);
        }
    }

    async visitRoleElement(node: RoleElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.role = (ctx.stats.role || 0) + 1;
        for (const child of node.children) {
            await child.visit(this, ctx);
        }
    }

    async visitPersonalityElement(node: PersonalityElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.personality = (ctx.stats.personality || 0) + 1;
    }

    async visitPrincipleElement(node: PrincipleElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.principle = (ctx.stats.principle || 0) + 1;
    }

    async visitKnowledgeElement(node: KnowledgeElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.knowledge = (ctx.stats.knowledge || 0) + 1;
    }

    async visitExecutionElement(node: ExecutionElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.execution = (ctx.stats.execution || 0) + 1;
        for (const child of node.children) {
            if (typeof child !== 'string') {
                await child.visit(this, ctx);
            }
        }
    }

    async visitProcessElement(node: ProcessElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.process = (ctx.stats.process || 0) + 1;
    }

    async visitGuidelineElement(node: GuidelineElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.guideline = (ctx.stats.guideline || 0) + 1;
    }

    async visitRuleElement(node: RuleElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.rule = (ctx.stats.rule || 0) + 1;
    }

    async visitConstraintElement(node: ConstraintElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.constraint = (ctx.stats.constraint || 0) + 1;
    }

    async visitCriteriaElement(node: CriteriaElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.criteria = (ctx.stats.criteria || 0) + 1;
    }

    async visitResourceElement(node: ResourceElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.resource = (ctx.stats.resource || 0) + 1;
        ctx.stats[`resource_${node.model}`] = (ctx.stats[`resource_${node.model}`] || 0) + 1;
    }

    async visitLocationElement(node: LocationElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.location = (ctx.stats.location || 0) + 1;
    }

    async visitParamsElement(node: ParamsElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.params = (ctx.stats.params || 0) + 1;
    }

    async visitRegistryElement(node: RegistryElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.registry = (ctx.stats.registry || 0) + 1;
    }

    async visitTerminologiesElement(node: TerminologiesElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.terminologies = (ctx.stats.terminologies || 0) + 1;
        for (const child of node.children) {
            await child.visit(this, ctx);
        }
    }

    async visitTerminologyElement(node: TerminologyElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.terminology = (ctx.stats.terminology || 0) + 1;
        for (const child of node.children) {
            if (typeof child !== 'string') {
                await child.visit(this, ctx);
            }
        }
    }

    async visitZhElement(node: ZhElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.zh = (ctx.stats.zh || 0) + 1;
    }

    async visitEnElement(node: EnElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.en = (ctx.stats.en || 0) + 1;
    }

    async visitDefinitionElement(node: DefinitionElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.definition = (ctx.stats.definition || 0) + 1;
    }

    async visitExamplesElement(node: ExamplesElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.examples = (ctx.stats.examples || 0) + 1;
        for (const child of node.children) {
            await child.visit(this, ctx);
        }
    }

    async visitExampleElement(node: ExampleElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.example = (ctx.stats.example || 0) + 1;
    }

    async visitThoughtElement(node: ThoughtElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.thought = (ctx.stats.thought || 0) + 1;
        for (const child of node.children) {
            if (typeof child !== 'string') {
                await child.visit(this, ctx);
            }
        }
    }

    async visitExplorationElement(node: ExplorationElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.exploration = (ctx.stats.exploration || 0) + 1;
    }

    async visitReasoningElement(node: ReasoningElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.reasoning = (ctx.stats.reasoning || 0) + 1;
    }

    async visitPlanElement(node: PlanElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.plan = (ctx.stats.plan || 0) + 1;
    }

    async visitChallengeElement(node: ChallengeElement, ctx: { stats: Record<string, number> }): Promise<void> {
        ctx.stats.challenge = (ctx.stats.challenge || 0) + 1;
    }
}

describe("DPML Visitor Pattern", () => {
    describe("TextExtractorVisitor", () => {
        it("should extract text from simple DPML", async () => {
            const dpml = `
                <role>
                    <personality>AI Assistant</personality>
                    <principle>Be helpful</principle>
                </role>
            `;
            
            const ast = parsePrompt(dpml);
            const visitor = new TextExtractorVisitor();
            const result = await ast.visit(visitor, undefined);
            
            expect(result).toContain("ROLE:");
            expect(result).toContain("Personality: AI Assistant");
            expect(result).toContain("Principle: Be helpful");
        });

        it("should extract text from complex DPML with resources", async () => {
            const dpml = `
                <execution>
                    <process>Step 1: Research</process>
                    @aws-s3:documents/spec.pdf
                    @?github:repo/readme.md
                </execution>
            `;
            
            const ast = parsePrompt(dpml);
            const visitor = new TextExtractorVisitor();
            const result = await ast.visit(visitor, undefined);
            
            expect(result).toContain("EXECUTION:");
            expect(result).toContain("Process: Step 1: Research");
            expect(result).toContain("Resource: aws-s3:documents/spec.pdf");
            expect(result).toContain("Resource: [lazy] github:repo/readme.md");
        });
    });

    describe("StatisticsVisitor", () => {
        it("should collect statistics from DPML", async () => {
            const dpml = `
                <role>
                    <personality>AI Assistant</personality>
                    <principle>Be helpful</principle>
                    <knowledge>Expert knowledge</knowledge>
                </role>
                <execution>
                    <process>Step 1</process>
                    <guideline>Follow best practices</guideline>
                    @api:users/profile
                    @!database:schema
                </execution>
            `;
            
            const ast = parsePrompt(dpml);
            const visitor = new StatisticsVisitor();
            const ctx = { stats: {} };
            
            await ast.visit(visitor, ctx);
            
            expect(ctx.stats).toEqual({
                prompt: 1,
                role: 1,
                personality: 1,
                principle: 1,
                knowledge: 1,
                execution: 1,
                process: 1,
                guideline: 1,
                resource: 2,
                resource_auto: 1,
                resource_load: 1
            });
        });
    });
});
