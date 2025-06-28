import { parsePrompt, validateDpml } from "../index";
import {
    PromptElement,
    RoleElement,
    ExecutionElement,
    ResourceElement,
    ProcessElement,
    PersonalityElement,
    PrincipleElement,
    KnowledgeElement
} from "../ast";

describe("DPML Integration Tests", () => {
    describe("parsePrompt", () => {
        it("should parse complete DPML example from documentation", () => {
            const promptString = `
                <role>
                    <personality>
                        你是一个严谨的软件架构师，擅长设计高可用系统
                    </personality>
                    <principle>
                        遵循 SOLID 设计原则
                    </principle>
                    <knowledge>
                        专精于微服务架构和云原生技术
                    </knowledge>
                </role>

                <execution>
                    <process>
                        1. 分析需求<br/>
                        2. 设计架构图<br/>
                        3. 编写文档
                    </process>
                    @aws-s3:design-specs?version=latest
                </execution>
            `;

            const ast = parsePrompt(promptString);
            
            expect(ast).toBeInstanceOf(PromptElement);
            expect(ast.children).toHaveLength(2);
            
            // Verify role element
            const role = ast.children[0] as RoleElement;
            expect(role).toBeInstanceOf(RoleElement);
            expect(role.children).toHaveLength(3);
            
            const personality = role.children.find(child => child instanceof PersonalityElement) as PersonalityElement;
            expect(personality.children[0]).toContain("严谨的软件架构师");
            
            const principle = role.children.find(child => child instanceof PrincipleElement) as PrincipleElement;
            expect(principle.children[0]).toContain("SOLID 设计原则");
            
            const knowledge = role.children.find(child => child instanceof KnowledgeElement) as KnowledgeElement;
            expect(knowledge.content).toContain("微服务架构");
            
            // Verify execution element
            const execution = ast.children[1] as ExecutionElement;
            expect(execution).toBeInstanceOf(ExecutionElement);
            expect(execution.children).toHaveLength(2);
            
            const process = execution.children[0] as ProcessElement;
            expect(process).toBeInstanceOf(ProcessElement);
            expect(process.content).toContain("分析需求");
            expect(process.content).toContain("<br/>");
            
            const resource = execution.children[1] as ResourceElement;
            expect(resource).toBeInstanceOf(ResourceElement);
            expect(resource.protocol).toBe("aws-s3");
            expect(resource.location).toBe("design-specs?version=latest");
            expect(resource.inline).toBe(true);
            expect(resource.model).toBe("auto");
        });

        it("should parse complex nested structure", () => {
            const promptString = `
                <role type="architect">
                    <personality>Expert in system design</personality>
                    <principle priority="high">Maintainable code</principle>
                </role>
                
                <execution mode="sequential">
                    <process>Research phase</process>
                    <guideline>Use established patterns</guideline>
                    <rule>All code must be tested</rule>
                    <constraint>Budget: $50k</constraint>
                    <criteria>Performance > 99.9%</criteria>
                    @github:templates/architecture
                    @!database:schema/latest
                    @?docs:guidelines.md
                </execution>
                
                <thought>
                    <exploration>What are the main challenges?</exploration>
                    <reasoning>Based on past experience</reasoning>
                    <plan>Phased implementation approach</plan>
                    <challenge>Limited timeline</challenge>
                </thought>
            `;

            const ast = parsePrompt(promptString);
            expect(ast.children).toHaveLength(3);
            
            // Verify role with attributes
            const role = ast.children[0] as RoleElement;
            expect(role.attributes).toEqual([{ name: "type", value: "architect" }]);
            
            // Verify execution with multiple elements and resource references
            const execution = ast.children[1] as ExecutionElement;
            expect(execution.attributes).toEqual([{ name: "mode", value: "sequential" }]);
            expect(execution.children).toHaveLength(8); // 5 elements + 3 resources
            
            // Check resource references with different models
            const resources = execution.children.filter(child => child instanceof ResourceElement) as ResourceElement[];
            expect(resources).toHaveLength(3);
            
            expect(resources[0].protocol).toBe("github");
            expect(resources[0].model).toBe("auto");
            
            expect(resources[1].protocol).toBe("database");
            expect(resources[1].model).toBe("load");
            
            expect(resources[2].protocol).toBe("docs");
            expect(resources[2].model).toBe("lazy");
        });

        it("should handle mixed text and elements", () => {
            const promptString = `
                Some introduction text
                <role>
                    <personality>AI Assistant</personality>
                </role>
                Middle text with @api:users/profile reference
                <execution>
                    <process>Handle request</process>
                </execution>
                Final text
            `;

            const ast = parsePrompt(promptString);
            expect(ast.children).toHaveLength(5);
            
            // Text nodes and elements should be preserved in order
            expect(ast.children[0]).toHaveProperty('content');
            expect(ast.children[1]).toBeInstanceOf(RoleElement);
            expect(ast.children[2]).toContain("Middle text");
            expect(ast.children[3]).toBeInstanceOf(ExecutionElement);
            expect(ast.children[4]).toHaveProperty('content');
        });
    });

    describe("validateDpml", () => {
        it("should validate correct DPML", () => {
            const validDpml = `
                <role>
                    <personality>AI Assistant</personality>
                </role>
            `;
            
            const result = validateDpml(validDpml);
            expect(result.valid).toBe(true);
            expect(result.errors).toEqual([]);
        });

        it("should detect syntax errors", () => {
            const invalidDpml = `
                <role>
                    <personality>AI Assistant
                </role>
            `;
            
            const result = validateDpml(invalidDpml);
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0]).toContain("Expected closing tag");
        });

        it("should detect unknown elements", () => {
            const invalidDpml = `
                <unknown>
                    <content>Some content</content>
                </unknown>
            `;
            
            const result = validateDpml(invalidDpml);
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0]).toContain("Unknown element type");
        });

        it("should detect unclosed tags", () => {
            const invalidDpml = `
                <role>
                    <personality>AI Assistant</personality>
            `;
            
            const result = validateDpml(invalidDpml);
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
        });
    });

    describe("Real-world Examples", () => {
        it("should parse software architecture prompt", () => {
            const architecturePrompt = `
                <role>
                    <personality>You are a senior software architect with 15+ years of experience</personality>
                    <principle>
                        - Follow SOLID principles
                        - Prefer composition over inheritance
                        - Design for testability
                    </principle>
                    <knowledge>
                        Expert in microservices, event-driven architecture, and cloud-native patterns.
                        Proficient in @tech-stack:modern-web-development
                    </knowledge>
                </role>

                <execution>
                    <process>
                        1. Analyze business requirements
                        2. Identify bounded contexts
                        3. Design service interfaces
                        4. Define data models
                        5. Create deployment strategy
                    </process>
                    <guideline>Use domain-driven design principles</guideline>
                    <rule>All services must be independently deployable</rule>
                    <constraint>Maximum 200ms response time for user-facing APIs</constraint>
                    <criteria>System must handle 10k concurrent users</criteria>
                    
                    @aws:reference-architectures/microservices
                    @github:company/architecture-templates
                </execution>

                <thought>
                    <exploration>
                        What are the key integration points between services?
                        How should we handle data consistency across boundaries?
                    </exploration>
                    <reasoning>
                        Based on the business domain complexity and scalability requirements,
                        a microservices architecture with event sourcing would be appropriate.
                    </reasoning>
                    <plan>
                        Phase 1: Core services (User, Product, Order)
                        Phase 2: Analytics and reporting
                        Phase 3: Advanced features and optimization
                    </plan>
                    <challenge>
                        Ensuring data consistency while maintaining service independence
                    </challenge>
                </thought>
            `;

            const ast = parsePrompt(architecturePrompt);
            expect(ast.children).toHaveLength(3);
            
            const role = ast.children[0] as RoleElement;
            const execution = ast.children[1] as ExecutionElement;
            const thought = ast.children[2];

            expect(role).toBeInstanceOf(RoleElement);
            expect(execution).toBeInstanceOf(ExecutionElement);
            expect(thought).toHaveProperty('children');
            
            // Verify resource references in knowledge and execution
            const knowledge = role.children.find(child => child instanceof KnowledgeElement) as KnowledgeElement;
            expect(knowledge.content).toContain("@tech-stack:modern-web-development");
            
            const resources = execution.children.filter(child => child instanceof ResourceElement);
            expect(resources).toHaveLength(2);
        });
    });
});
