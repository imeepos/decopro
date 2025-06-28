# @decopro/dpml

A TypeScript parser and AST for the DPML (Decopro Prompt Markup Language) protocol - a structured markup language for defining AI prompts with roles, execution instructions, resources, and thought processes.

## Features

- 🔍 **Complete DPML Parser**: Tokenizer and parser for full DPML syntax
- 🌳 **Rich AST**: Strongly-typed Abstract Syntax Tree with visitor pattern support
- 📝 **Role Definition**: Define AI personalities, principles, and knowledge
- ⚡ **Execution Instructions**: Structured processes, guidelines, rules, and constraints
- 🔗 **Resource References**: Link to external resources with different loading strategies
- 🧠 **Thought Elements**: Capture exploration, reasoning, planning, and challenges
- 📚 **Terminology Support**: Multi-language terminology definitions with examples
- ✅ **Validation**: Built-in DPML syntax validation
- 🎯 **Visitor Pattern**: Extensible AST traversal and transformation

## Installation

```bash
npm install @decopro/dpml
```

## Quick Start

```typescript
import { parsePrompt, validateDpml } from '@decopro/dpml';

// Parse DPML string to AST
const dpml = `
  <role>
    <personality>You are a senior software architect</personality>
    <principle>Follow SOLID design principles</principle>
    <knowledge>Expert in microservices and cloud architecture</knowledge>
  </role>
  
  <execution>
    <process>
      1. Analyze requirements
      2. Design architecture
      3. Create documentation
    </process>
    <guideline>Use established patterns</guideline>
    <rule>All services must be independently deployable</rule>
    <constraint>Complete within 2 weeks</constraint>
    <criteria>99.9% uptime required</criteria>
    @aws:reference-architectures/microservices
  </execution>
`;

const ast = parsePrompt(dpml);
console.log(ast); // PromptElement with structured children

// Validate DPML syntax
const validation = validateDpml(dpml);
if (validation.valid) {
  console.log('Valid DPML!');
} else {
  console.error('Errors:', validation.errors);
}
```

## DPML Syntax

### Role Elements

Define AI personality, principles, and knowledge:

```xml
<role type="architect" level="senior">
  <personality>You are an experienced software architect</personality>
  <principle>Follow SOLID principles and best practices</principle>
  <knowledge>Expert in distributed systems and microservices</knowledge>
</role>
```

### Execution Elements

Structure execution instructions:

```xml
<execution mode="sequential">
  <process>Step-by-step process description</process>
  <guideline>General guidelines to follow</guideline>
  <rule>Strict rules that must be followed</rule>
  <constraint>Limitations and constraints</constraint>
  <criteria>Success criteria and requirements</criteria>
</execution>
```

### Resource References

Link to external resources with different loading strategies:

```xml
<!-- Auto-load (default) -->
@protocol:path/to/resource

<!-- Lazy load -->
@?protocol:path/to/resource

<!-- Force load -->
@!protocol:path/to/resource

<!-- With query parameters -->
@api:users/profile?id=123&format=json
```

### Thought Elements

Capture reasoning and planning:

```xml
<thought>
  <exploration>What are the key challenges?</exploration>
  <reasoning>Based on the analysis...</reasoning>
  <plan>Implementation strategy</plan>
  <challenge>Potential difficulties</challenge>
</thought>
```

### Terminology

Define multi-language terminology:

```xml
<terminologies>
  <terminology>
    <zh>微服务</zh>
    <en>Microservices</en>
    <definition>Architectural pattern for building distributed systems</definition>
    <examples>
      <example>Netflix architecture</example>
      <example>Amazon services</example>
    </examples>
  </terminology>
</terminologies>
```

## API Reference

### Core Functions

#### `parsePrompt(input: string): PromptElement`

Parses a DPML string into an AST.

```typescript
const ast = parsePrompt('<role><personality>AI Assistant</personality></role>');
```

#### `validateDpml(input: string): { valid: boolean; errors: string[] }`

Validates DPML syntax and returns validation result.

```typescript
const result = validateDpml('<role><personality>AI Assistant</personality></role>');
console.log(result.valid); // true
console.log(result.errors); // []
```

### AST Elements

All AST elements extend `BaseAst` and support the visitor pattern:

- `PromptElement` - Root element containing all children
- `RoleElement` - Role definition with personality, principle, knowledge
- `ExecutionElement` - Execution instructions with processes, guidelines, etc.
- `ResourceElement` - Resource references with protocol and location
- `ThoughtElement` - Thought processes with exploration, reasoning, etc.
- `TerminologiesElement` - Terminology definitions
- And many more...

### Visitor Pattern

Implement custom AST traversal and transformation:

```typescript
import { DpmlVisitor } from '@decopro/dpml';

class MyVisitor implements DpmlVisitor<string, void> {
  async visitRoleElement(node: RoleElement, ctx: void): Promise<string> {
    // Custom processing logic
    return 'processed role';
  }
  
  // Implement other visit methods...
}

const visitor = new MyVisitor();
const result = await ast.visit(visitor, undefined);
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Examples

See the `src/__tests__/` directory for comprehensive examples including:

- Basic element parsing
- Complex nested structures
- Resource reference handling
- Visitor pattern implementations
- Error handling and validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC License - see LICENSE file for details.
