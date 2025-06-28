import { Parser } from "../parser";
import { Tokenizer } from "../tokenizer";
import {
    PromptElement,
    RoleElement,
    PersonalityElement,
    PrincipleElement,
    KnowledgeElement,
    ExecutionElement,
    ProcessElement,
    ResourceElement,
    GuidelineElement,
    RuleElement,
    ConstraintElement,
    CriteriaElement,
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

describe("Parser", () => {
    function parsePrompt(input: string): PromptElement {
        const tokenizer = new Tokenizer();
        const tokens = tokenizer.tokenize(input);
        const parser = new Parser(tokens);
        return parser.parse();
    }

    describe("Simple Elements", () => {
        it("should parse simple process element", () => {
            const ast = parsePrompt("<process>Step 1: Analyze requirements</process>");
            
            expect(ast.children).toHaveLength(1);
            expect(ast.children[0]).toBeInstanceOf(ProcessElement);
            
            const process = ast.children[0] as ProcessElement;
            expect(process.content).toBe("Step 1: Analyze requirements");
            expect(process.attributes).toEqual([]);
        });

        it("should parse guideline element with attributes", () => {
            const ast = parsePrompt('<guideline priority="high">Follow SOLID principles</guideline>');
            
            expect(ast.children).toHaveLength(1);
            expect(ast.children[0]).toBeInstanceOf(GuidelineElement);
            
            const guideline = ast.children[0] as GuidelineElement;
            expect(guideline.content).toBe("Follow SOLID principles");
            expect(guideline.attributes).toEqual([
                { name: "priority", value: "high" }
            ]);
        });

        it("should parse rule element", () => {
            const ast = parsePrompt("<rule>Always validate input data</rule>");
            
            expect(ast.children).toHaveLength(1);
            expect(ast.children[0]).toBeInstanceOf(RuleElement);
            
            const rule = ast.children[0] as RuleElement;
            expect(rule.content).toBe("Always validate input data");
        });

        it("should parse constraint element", () => {
            const ast = parsePrompt("<constraint>Maximum 100 users per request</constraint>");
            
            expect(ast.children).toHaveLength(1);
            expect(ast.children[0]).toBeInstanceOf(ConstraintElement);
            
            const constraint = ast.children[0] as ConstraintElement;
            expect(constraint.content).toBe("Maximum 100 users per request");
        });

        it("should parse criteria element", () => {
            const ast = parsePrompt("<criteria>Response time < 200ms</criteria>");
            
            expect(ast.children).toHaveLength(1);
            expect(ast.children[0]).toBeInstanceOf(CriteriaElement);
            
            const criteria = ast.children[0] as CriteriaElement;
            expect(criteria.content).toBe("Response time < 200ms");
        });
    });

    describe("Role Element", () => {
        it("should parse complete role element", () => {
            const input = `
                <role>
                    <personality>You are a senior software architect</personality>
                    <principle>Follow SOLID design principles</principle>
                    <knowledge>Expert in microservices architecture</knowledge>
                </role>
            `;
            
            const ast = parsePrompt(input);
            expect(ast.children).toHaveLength(1);
            expect(ast.children[0]).toBeInstanceOf(RoleElement);
            
            const role = ast.children[0] as RoleElement;
            expect(role.children).toHaveLength(3);
            
            // Check personality
            const personality = role.children.find(child => child instanceof PersonalityElement) as PersonalityElement;
            expect(personality).toBeDefined();
            expect(personality.children[0]).toBe("You are a senior software architect");
            
            // Check principle
            const principle = role.children.find(child => child instanceof PrincipleElement) as PrincipleElement;
            expect(principle).toBeDefined();
            expect(principle.children[0]).toBe("Follow SOLID design principles");
            
            // Check knowledge
            const knowledge = role.children.find(child => child instanceof KnowledgeElement) as KnowledgeElement;
            expect(knowledge).toBeDefined();
            expect(knowledge.content).toBe("Expert in microservices architecture");
        });

        it("should parse role with attributes", () => {
            const input = '<role type="architect" level="senior"><personality>Expert developer</personality></role>';
            
            const ast = parsePrompt(input);
            const role = ast.children[0] as RoleElement;
            
            expect(role.attributes).toEqual([
                { name: "type", value: "architect" },
                { name: "level", value: "senior" }
            ]);
        });
    });

    describe("Execution Element", () => {
        it("should parse execution with mixed content", () => {
            const input = `
                <execution>
                    <process>1. Analyze requirements<br/>2. Design architecture</process>
                    <guideline>Use best practices</guideline>
                    <rule>Validate all inputs</rule>
                    <constraint>Complete within 2 weeks</constraint>
                    <criteria>High performance and scalability</criteria>
                </execution>
            `;
            
            const ast = parsePrompt(input);
            expect(ast.children).toHaveLength(1);
            expect(ast.children[0]).toBeInstanceOf(ExecutionElement);
            
            const execution = ast.children[0] as ExecutionElement;
            expect(execution.children).toHaveLength(5);
            
            expect(execution.children[0]).toBeInstanceOf(ProcessElement);
            expect(execution.children[1]).toBeInstanceOf(GuidelineElement);
            expect(execution.children[2]).toBeInstanceOf(RuleElement);
            expect(execution.children[3]).toBeInstanceOf(ConstraintElement);
            expect(execution.children[4]).toBeInstanceOf(CriteriaElement);
        });

        it("should parse execution with resource references", () => {
            const input = `
                <execution>
                    <process>Check @aws-s3:design-specs?version=latest</process>
                    @github:repo/guidelines.md
                </execution>
            `;
            
            const ast = parsePrompt(input);
            const execution = ast.children[0] as ExecutionElement;
            
            expect(execution.children).toHaveLength(2);
            expect(execution.children[0]).toBeInstanceOf(ProcessElement);
            expect(execution.children[1]).toBeInstanceOf(ResourceElement);
            
            const resource = execution.children[1] as ResourceElement;
            expect(resource.protocol).toBe("github");
            expect(resource.location).toBe("repo/guidelines.md");
            expect(resource.inline).toBe(true);
        });
    });

    describe("Resource Element", () => {
        it("should parse resource element with protocol attribute", () => {
            const input = `
                <resource protocol="aws-s3">
                    <location>bucket/design-specs</location>
                    <params>version=latest&format=json</params>
                </resource>
            `;
            
            const ast = parsePrompt(input);
            expect(ast.children).toHaveLength(1);
            expect(ast.children[0]).toBeInstanceOf(ResourceElement);
            
            const resource = ast.children[0] as ResourceElement;
            expect(resource.protocol).toBe("aws-s3");
            expect(resource.contents).toHaveLength(2);
        });

        it("should parse inline resource reference", () => {
            const ast = parsePrompt("Check @aws-s3:design-specs?version=latest for details");
            
            expect(ast.children).toHaveLength(3);
            expect(ast.children[1]).toBeInstanceOf(ResourceElement);
            
            const resource = ast.children[1] as ResourceElement;
            expect(resource.protocol).toBe("aws-s3");
            expect(resource.location).toBe("design-specs?version=latest");
            expect(resource.inline).toBe(true);
            expect(resource.model).toBe("auto");
        });

        it("should parse lazy resource reference", () => {
            const ast = parsePrompt("@?github:repo/file.md");
            
            const resource = ast.children[0] as ResourceElement;
            expect(resource.protocol).toBe("github");
            expect(resource.location).toBe("repo/file.md");
            expect(resource.model).toBe("lazy");
        });

        it("should parse load resource reference", () => {
            const ast = parsePrompt("@!database:users/schema");
            
            const resource = ast.children[0] as ResourceElement;
            expect(resource.protocol).toBe("database");
            expect(resource.location).toBe("users/schema");
            expect(resource.model).toBe("load");
        });
    });

    describe("Terminology Elements", () => {
        it("should parse terminologies with multiple terminology elements", () => {
            const input = `
                <terminologies>
                    <terminology>
                        <zh>微服务</zh>
                        <en>Microservices</en>
                        <definition>A software architecture pattern</definition>
                        <examples>
                            <example>Netflix architecture</example>
                            <example>Amazon services</example>
                        </examples>
                    </terminology>
                </terminologies>
            `;

            const ast = parsePrompt(input);
            expect(ast.children).toHaveLength(1);
            expect(ast.children[0]).toBeInstanceOf(TerminologiesElement);

            const terminologies = ast.children[0] as TerminologiesElement;
            expect(terminologies.children).toHaveLength(1);

            const terminology = terminologies.children[0] as TerminologyElement;
            expect(terminology.children).toHaveLength(4);

            const zh = terminology.children.find(child => child instanceof ZhElement) as ZhElement;
            expect(zh.content).toBe("微服务");

            const en = terminology.children.find(child => child instanceof EnElement) as EnElement;
            expect(en.content).toBe("Microservices");

            const definition = terminology.children.find(child => child instanceof DefinitionElement) as DefinitionElement;
            expect(definition.content).toBe("A software architecture pattern");

            const examples = terminology.children.find(child => child instanceof ExamplesElement) as ExamplesElement;
            expect(examples.children).toHaveLength(2);
        });
    });

    describe("Thought Elements", () => {
        it("should parse thought with mixed content", () => {
            const input = `
                <thought>
                    <exploration>What are the key challenges?</exploration>
                    <reasoning>Based on the requirements analysis</reasoning>
                    <plan>1. Research solutions 2. Prototype 3. Test</plan>
                    <challenge>Limited time and resources</challenge>
                </thought>
            `;

            const ast = parsePrompt(input);
            expect(ast.children).toHaveLength(1);
            expect(ast.children[0]).toBeInstanceOf(ThoughtElement);

            const thought = ast.children[0] as ThoughtElement;
            expect(thought.children).toHaveLength(4);

            expect(thought.children[0]).toBeInstanceOf(ExplorationElement);
            expect(thought.children[1]).toBeInstanceOf(ReasoningElement);
            expect(thought.children[2]).toBeInstanceOf(PlanElement);
            expect(thought.children[3]).toBeInstanceOf(ChallengeElement);
        });
    });

    describe("Complex Mixed Content", () => {
        it("should parse complete DPML prompt", () => {
            const input = `
                <role>
                    <personality>You are a senior software architect</personality>
                    <principle>Follow SOLID principles</principle>
                    <knowledge>Expert in microservices</knowledge>
                </role>

                <execution>
                    <process>
                        1. Analyze requirements<br/>
                        2. Design architecture<br/>
                        3. Write documentation
                    </process>
                    @aws-s3:design-specs?version=latest
                </execution>

                <thought>
                    <exploration>What patterns should we use?</exploration>
                    <reasoning>Consider scalability and maintainability</reasoning>
                </thought>
            `;

            const ast = parsePrompt(input);
            expect(ast.children).toHaveLength(3);

            expect(ast.children[0]).toBeInstanceOf(RoleElement);
            expect(ast.children[1]).toBeInstanceOf(ExecutionElement);
            expect(ast.children[2]).toBeInstanceOf(ThoughtElement);

            // Verify execution contains resource reference
            const execution = ast.children[1] as ExecutionElement;
            expect(execution.children).toHaveLength(2);
            expect(execution.children[1]).toBeInstanceOf(ResourceElement);
        });
    });

    describe("Error Handling", () => {
        it("should throw error for unknown element type", () => {
            expect(() => parsePrompt("<unknown>content</unknown>")).toThrow("Unknown element type: unknown");
        });

        it("should throw error for unclosed tag", () => {
            expect(() => parsePrompt("<role><personality>content")).toThrow();
        });

        it("should throw error for mismatched tags", () => {
            expect(() => parsePrompt("<role></personality>")).toThrow();
        });

        it("should throw error for unexpected token", () => {
            expect(() => parsePrompt("invalid content <role>")).toThrow();
        });
    });

    describe("Edge Cases", () => {
        it("should handle empty elements", () => {
            const ast = parsePrompt("<process></process>");

            const process = ast.children[0] as ProcessElement;
            expect(process.content).toBe("");
        });

        it("should handle self-closing tags in content", () => {
            const ast = parsePrompt("<process>Step 1<br/>Step 2</process>");

            const process = ast.children[0] as ProcessElement;
            expect(process.content).toBe("Step 1<br/>Step 2");
        });

        it("should handle whitespace preservation", () => {
            const ast = parsePrompt("<process>  Step 1  \n  Step 2  </process>");

            const process = ast.children[0] as ProcessElement;
            expect(process.content).toBe("  Step 1  \n  Step 2  ");
        });
    });
});
