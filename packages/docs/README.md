# @decopro/docs

AI/LLM-optimized documentation generator for the Decopro framework.

## Features

- 🤖 **AI-Friendly**: Generates structured documentation optimized for large language models
- 📚 **Comprehensive**: Extracts TypeScript types, interfaces, classes, and functions
- 🏗️ **Architecture Aware**: Analyzes project structure and dependencies
- 📝 **Multiple Formats**: Outputs JSON and Markdown formats
- 🔍 **Smart Categorization**: Automatically categorizes code by purpose and type
- 💡 **Example Extraction**: Pulls code examples from JSDoc comments and tests
- 🏷️ **Intelligent Tagging**: Auto-tags code with relevant keywords

## Installation

```bash
npm install @decopro/docs
```

## Usage

### CLI Usage

```bash
# Generate docs for entire project
npx decopro-docs

# Generate docs for specific package
npx decopro-docs --package @decopro/core

# Output to custom directory
npx decopro-docs --output ./documentation

# Generate only JSON format
npx decopro-docs --format json

# Verbose output
npx decopro-docs --verbose
```

### Programmatic Usage

```typescript
import {
  generateProjectDocumentation,
  generatePackageDocumentation
} from "@decopro/docs";

// Generate documentation for entire project
const projectDocs = generateProjectDocumentation("/path/to/project");

// Generate documentation for specific package
const packageDocs = generatePackageDocumentation("/path/to/package");

// Access structured data
console.log(projectDocs.packages.length); // Number of packages
console.log(packageDocs.knowledges.length); // Number of knowledge items
```

## Output Structure

### Project Documentation

```typescript
interface ProjectDocumentation {
  project_name: string;
  version: string;
  description: string;
  architecture: string;           // Mermaid diagram + description
  packages: PackageDocumentation[];
  quick_start: string;           // Generated quick start guide
  api_overview: string;          // High-level API overview
  examples: string[];            // Collected usage examples
}
```

### Package Documentation

```typescript
interface PackageDocumentation {
  package_name: string;
  package_version: string;
  description: string;
  main_exports: string[];        // Main exported symbols
  api_reference: string;         // Detailed API docs
  usage_examples: string[];      // Code examples
  architecture_overview: string; // Package architecture
  dependencies: string[];        // External dependencies
  knowledges: Knowledge[];       // Detailed knowledge items
}
```

### Knowledge Items

```typescript
interface Knowledge {
  package_name: string;
  package_version: string;
  filename: string;
  docs: string;                  // Generated documentation
  hash: string;                  // Content hash for caching
  category: string;              // Auto-detected category
  tags: string[];               // Relevant tags
  examples: string[];           // Code examples
  dependencies: string[];       // File dependencies
}
```

## Categories

The documentation generator automatically categorizes code into:

- **core**: Core framework functionality
- **orm**: Database and ORM related code
- **api**: REST API and controllers
- **service**: Business logic services
- **entity**: Database entities
- **decorator**: Decorators and metadata
- **utility**: Helper functions and utilities
- **test**: Test files
- **example**: Example code
- **types**: Type definitions
- **interface**: Interface definitions
- **class**: Class definitions
- **module**: General modules

## Tags

Automatic tagging includes:

- **Technology tags**: `orm`, `rest`, `api`, `database`, `async`
- **Pattern tags**: `decorator`, `dependency-injection`, `repository`
- **Type tags**: `interface`, `class`, `function`, `types`
- **Feature tags**: `query-builder`, `entity`, `relationship`

## AI/LLM Optimization

The generated documentation is specifically optimized for AI consumption:

1. **Structured Data**: All information is available in JSON format
2. **Semantic Categorization**: Code is categorized by purpose and functionality
3. **Rich Metadata**: Includes tags, dependencies, and relationships
4. **Example-Rich**: Extracts and includes relevant code examples
5. **Context-Aware**: Provides architectural context and relationships
6. **Searchable**: Knowledge items can be easily filtered and searched

## Example Output

### Knowledge Base JSON

```json
[
  {
    "package_name": "@decopro/orm",
    "package_version": "1.0.0",
    "filename": "src/decorators/entity.ts",
    "docs": "### Class: `Entity`\nDecorator for marking classes as database entities...",
    "hash": "abc123...",
    "category": "decorator",
    "tags": ["decorator", "entity", "database", "orm"],
    "examples": [
      "@Entity('users')\nclass User {\n  @Column()\n  name: string;\n}"
    ],
    "dependencies": ["reflect-metadata"]
  }
]
```

### Generated Markdown

```markdown
# @decopro/orm

Database ORM package for the Decopro framework.

## Main Exports

- `Entity`
- `Column`
- `Repository`
- `QueryBuilder`

## Architecture Overview

This package contains the following components:

- **decorator**: 5 file(s)
- **entity**: 3 file(s)
- **repository**: 2 file(s)

### Key Dependencies

- **reflect-metadata**: used in 8 file(s)
- **typescript**: used in 5 file(s)
```

## Integration with AI Tools

The generated documentation can be easily integrated with:

- **RAG Systems**: Use the knowledge base JSON for retrieval-augmented generation
- **Code Assistants**: Feed the structured data to AI coding assistants
- **Documentation Bots**: Use the markdown output for automated documentation
- **Search Systems**: Index the categorized and tagged content

## License

ISC
