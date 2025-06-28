# @decopro/dpml

**Version**: 1.1.0

## Architecture Overview

This package contains the following components:

- **interface**: 2 file(s)
- **module**: 4 file(s)
- **class**: 2 file(s)

### Key Dependencies

- **@decopro/ast**: used in 2 file(s)
- **@decopro/core**: used in 2 file(s)
- **tsup**: used in 1 file(s)


## API Reference

## Interface

### src/ast.ts

### Class: `BaseAst`
  - Method: `visit(visitor: Visitor<O, C>, ctx: C): Promise<O>`

### Interface: `Attributes`
  - name: string
  - value: string

### Type Alias: `MarkdownContent = string`
### Class: `CriteriaElement`
  - Property: `attributes: Attributes[]`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `ConstraintElement`
  - Property: `attributes: Attributes[]`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `RuleElement`
  - Property: `attributes: Attributes[]`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `GuidelineElement`
  - Property: `attributes: Attributes[]`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `ProcessElement`
  - Property: `attributes: Attributes[]`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Type Alias: `ExecutionElementContent = | MarkdownContent
    | ProcessElement
    | GuidelineElement
    | RuleElement
    | ConstraintElement
    | CriteriaElement`
### Class: `ExecutionElement`
  - Property: `attributes: Attributes[]`
  - Property: `children: ExecutionElementContent[]`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `RegistryElement`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `ParamsElement`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `LocationElement`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Type Alias: `ResourceElementContent = | LocationElement
    | ParamsElement
    | RegistryElement
    | MarkdownContent`
### Class: `ResourceElement`
  - Property: `protocol: string`
  - Property: `model: `auto` | `lazy` | `load``
  - Property: `location: string`
  - Property: `contents: ResourceElementContent[]`
  - Property: `inline: boolean`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `PersonalityElement`
  - Property: `attributes: Attributes[]`
  - Property: `children: (BaseAst | MarkdownContent)[]`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `PrincipleElement`
  - Property: `attributes: Attributes[]`
  - Property: `children: BaseAst[]`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `KnowledgeElement`
  - Property: `attributes: Attributes[]`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `RoleElement`
  - Property: `attributes: Attributes[]`
  - Property: `children: BaseAst[]`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `ZhElement`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `EnElement`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `DefinitionElement`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `ExamplesElement`
  - Property: `children: BaseAst[]`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `ExampleElement`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Type Alias: `TerminologyElementContent = | ExamplesElement
    | DefinitionElement
    | EnElement
    | ZhElement
    | MarkdownContent`
### Class: `TerminologyElement`
  - Property: `attributes: Attributes[]`
  - Property: `children: (BaseAst | MarkdownContent)[]`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `TerminologiesElement`
  - Property: `attributes: Attributes[]`
  - Property: `children: TerminologyElement[]`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `ChallengeElement`
  - Property: `attributes: Attributes[]`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `PlanElement`
  - Property: `attributes: Attributes[]`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `ReasoningElement`
  - Property: `attributes: Attributes[]`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `ExplorationElement`
  - Property: `attributes: Attributes[]`
  - Property: `content: MarkdownContent`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Type Alias: `ThoughtElementContent = | MarkdownContent
    | ExplorationElement
    | ReasoningElement
    | PlanElement
    | ChallengeElement`
### Class: `ThoughtElement`
  - Property: `attributes: Attributes[]`
  - Property: `children: ThoughtElementContent[]`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Class: `PromptElement`
  - Property: `children: BaseAst[]`
  - Constructor: `constructor(children: BaseAst[]): void`
    - Parameter: `children: BaseAst[]`
  - Method: `visit(visitor: DpmlVisitor<O, C>, ctx: C): Promise<O>`

### Interface: `DpmlVisitor`


**Tags**: async, interface, types, class, export

### src/tokenizer.ts

### Interface: `Token`
  - type: | "OpenTag"
        | "CloseTag"
        | "Text"
        | "Attribute"
        | "TagEnd"
        | "ResourceRef"
        | "SelfCloseTagEnd"
  - value: string
  - name?: string

### Class: `Tokenizer`
  - Property: `pos: any`
  - Property: `tokens: Token[]`
  - Method: `tokenize(input: string): Token[]`
  - Method: `handleTag(input: string): void`
  - Method: `handleResourceReference(input: string): void`
  - Method: `handleText(input: string): void`


**Tags**: interface, types, class, export

## Module

### src/index.ts

**Tags**: export

### src/main.ts

### src/parsePrompt.ts

### Function: `parsePrompt(input: string): PromptElement`

将提示词字符串解析为 AST



**Tags**: function, export

### tsup.config.ts

**Tags**: export

## Class

### src/parser.ts

### Class: `Parser`
  - Property: `tokens: Token[]`
  - Property: `pos: any`
  - Property: `currentToken: Token | null`
  - Constructor: `constructor(tokens: Token[]): void`
    - Parameter: `tokens: Token[]`
  - Method: `parseResourceRef(token: Token): ResourceElement`
  - Method: `parse(): PromptElement`
  - Method: `equal(a: string, b: string): void`
  - Method: `parseElement(): BaseAst`
  - Method: `parseSimpleElement(attributes: Attributes[], tagName: string, ctor: new () => BaseAst): BaseAst`
  - Method: `parseMixedContent(allowedTags: string[]): any[]`
  - Method: `parseTextUntilClose(tagName: string): string`
  - Method: `parseTerminologyElement(attributes: Attributes[]): TerminologyElement`
  - Method: `parseExamplesElement(): ExamplesElement`
  - Method: `parseExecutionElement(attributes: Attributes[]): ExecutionElement`
  - Method: `parseResourceElement(attributes: Attributes[]): ResourceElement`
  - Method: `parseRoleElement(attributes: Attributes[]): RoleElement`
  - Method: `parseTerminologiesElement(attributes: Attributes[]): TerminologiesElement`
  - Method: `parseThoughtElement(attributes: Attributes[]): ThoughtElement`
  - Method: `advance(): void`


**Tags**: class, export

### src/run.ts

### Class: `RunVisitor`
  - Method: `visitPromptElement(ast: PromptElement, ctx: any): Promise<any>`
  - Method: `visitThoughtElement(ast: ThoughtElement, ctx: any): Promise<any>`
  - Method: `visitExplorationElement(ast: ExplorationElement, ctx: any): Promise<any>`
  - Method: `visitReasoningElement(ast: ReasoningElement, ctx: any): Promise<any>`
  - Method: `visitPlanElement(ast: PlanElement, ctx: any): Promise<any>`
  - Method: `visitChallengeElement(ast: ChallengeElement, ctx: any): Promise<any>`
  - Method: `visitTerminologiesElement(ast: TerminologiesElement, ctx: any): Promise<any>`
  - Method: `visitTerminologyElement(ast: TerminologyElement, ctx: any): Promise<any>`
  - Method: `visitExampleElement(ast: ExampleElement, ctx: any): Promise<any>`
  - Method: `visitExamplesElement(ast: ExamplesElement, ctx: any): Promise<any>`
  - Method: `visitDefinitionElement(ast: DefinitionElement, ctx: any): Promise<any>`
  - Method: `visitEnElement(ast: EnElement, ctx: any): Promise<any>`
  - Method: `visitZhElement(ast: ZhElement, ctx: any): Promise<any>`
  - Method: `visitRoleElement(ast: RoleElement, ctx: any): Promise<any>`
  - Method: `visitKnowledgeElement(ast: KnowledgeElement, ctx: any): Promise<any>`
  - Method: `visitPrincipleElement(ast: PrincipleElement, ctx: any): Promise<any>`
  - Method: `visitPersonalityElement(ast: PersonalityElement, ctx: any): Promise<any>`
  - Method: `visitResourceElement(ast: ResourceElement, ctx: any): Promise<any>`
  - Method: `visitLocationElement(ast: LocationElement, ctx: any): Promise<any>`
  - Method: `visitParamsElement(ast: ParamsElement, ctx: any): Promise<any>`
  - Method: `visitRegistryElement(ast: RegistryElement, ctx: any): Promise<any>`
  - Method: `visitExecutionElement(ast: ExecutionElement, ctx: any): Promise<any>`
  - Method: `visitProcessElement(ast: ProcessElement, ctx: any): Promise<any>`
  - Method: `visitGuidelineElement(ast: GuidelineElement, ctx: any): Promise<any>`
  - Method: `visitRuleElement(ast: RuleElement, ctx: any): Promise<any>`
  - Method: `visitConstraintElement(ast: ConstraintElement, ctx: any): Promise<any>`
  - Method: `visitCriteriaElement(ast: CriteriaElement, ctx: any): Promise<any>`
  - Method: `visit(ast: Ast, ctx: any): Promise<any>`


**Tags**: async, class, export

