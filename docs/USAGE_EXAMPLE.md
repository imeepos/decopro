# Decopro Documentation Generator - Usage Examples

## 🤖 AI/LLM Integration Examples

### 1. RAG System Integration

```typescript
import { generateProjectDocumentation } from "@decopro/docs";
import fs from "fs";

// Generate comprehensive documentation
const projectDocs = generateProjectDocumentation("/path/to/decopro");

// Extract knowledge base for RAG
const knowledgeBase = projectDocs.packages.flatMap(pkg => pkg.knowledges);

// Filter by category for specific queries
const ormKnowledge = knowledgeBase.filter(k => k.tags.includes("orm"));
const apiKnowledge = knowledgeBase.filter(k => k.tags.includes("api"));

// Save for vector database ingestion
fs.writeFileSync("knowledge-base.json", JSON.stringify(knowledgeBase, null, 2));
```

### 2. Code Assistant Context

```typescript
// Query specific package documentation
const corePackage = projectDocs.packages.find(p => p.package_name === "@decopro/core");

// Get API reference for code completion
const apiReference = corePackage.api_reference;

// Get usage examples for code generation
const examples = corePackage.usage_examples;

// Get architecture overview for system understanding
const architecture = corePackage.architecture_overview;
```

### 3. Documentation Bot Integration

```typescript
// Generate markdown for documentation websites
const markdownDocs = projectDocs.packages.map(pkg => ({
  name: pkg.package_name,
  content: generatePackageMarkdown(pkg),
  categories: [...new Set(pkg.knowledges.map(k => k.category))],
  tags: [...new Set(pkg.knowledges.flatMap(k => k.tags))]
}));

// Create navigation structure
const navigation = markdownDocs.map(doc => ({
  title: doc.name,
  path: `/${doc.name.replace("@decopro/", "")}/`,
  categories: doc.categories
}));
```

## 📊 Knowledge Base Analysis

### Package Dependency Analysis

```typescript
// Analyze package dependencies
const dependencyGraph = projectDocs.packages.map(pkg => ({
  name: pkg.package_name,
  dependencies: pkg.dependencies,
  dependents: projectDocs.packages
    .filter(p => p.dependencies.includes(pkg.package_name))
    .map(p => p.package_name)
}));

// Find core packages (most depended upon)
const corePackages = dependencyGraph
  .sort((a, b) => b.dependents.length - a.dependents.length)
  .slice(0, 5);
```

### Code Pattern Analysis

```typescript
// Analyze decorator usage patterns
const decoratorUsage = knowledgeBase
  .filter(k => k.tags.includes("decorator"))
  .reduce((acc, k) => {
    const decorators = k.docs.match(/@\w+/g) || [];
    decorators.forEach(decorator => {
      acc[decorator] = (acc[decorator] || 0) + 1;
    });
    return acc;
  }, {});

// Find most common patterns
const commonPatterns = Object.entries(decoratorUsage)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10);
```

## 🔍 Search and Query Examples

### Semantic Search

```typescript
// Search by functionality
function searchByFunctionality(query: string) {
  return knowledgeBase.filter(k => 
    k.docs.toLowerCase().includes(query.toLowerCase()) ||
    k.tags.some(tag => tag.includes(query.toLowerCase()))
  );
}

// Examples
const ormResults = searchByFunctionality("database");
const apiResults = searchByFunctionality("rest");
const diResults = searchByFunctionality("injection");
```

### Category-based Queries

```typescript
// Get all entities
const entities = knowledgeBase.filter(k => k.category === "entity");

// Get all decorators
const decorators = knowledgeBase.filter(k => k.category === "decorator");

// Get all test files
const tests = knowledgeBase.filter(k => k.category === "test");
```

### Tag-based Filtering

```typescript
// Get async-related code
const asyncCode = knowledgeBase.filter(k => k.tags.includes("async"));

// Get ORM-related code
const ormCode = knowledgeBase.filter(k => k.tags.includes("orm"));

// Get API-related code
const apiCode = knowledgeBase.filter(k => k.tags.includes("api"));
```

## 📈 Metrics and Analytics

### Code Quality Metrics

```typescript
// Calculate documentation coverage
const totalFiles = knowledgeBase.length;
const documentedFiles = knowledgeBase.filter(k => k.docs.length > 0).length;
const coveragePercentage = (documentedFiles / totalFiles) * 100;

// Calculate example coverage
const filesWithExamples = knowledgeBase.filter(k => k.examples.length > 0).length;
const exampleCoverage = (filesWithExamples / totalFiles) * 100;

// Package complexity analysis
const packageComplexity = projectDocs.packages.map(pkg => ({
  name: pkg.package_name,
  fileCount: pkg.knowledges.length,
  categoryCount: [...new Set(pkg.knowledges.map(k => k.category))].length,
  dependencyCount: pkg.dependencies.length,
  exportCount: pkg.main_exports.length
}));
```

### Architecture Analysis

```typescript
// Analyze architectural patterns
const architecturalPatterns = {
  decoratorPattern: knowledgeBase.filter(k => k.tags.includes("decorator")).length,
  repositoryPattern: knowledgeBase.filter(k => k.tags.includes("repository")).length,
  dependencyInjection: knowledgeBase.filter(k => k.tags.includes("dependency-injection")).length,
  asyncPatterns: knowledgeBase.filter(k => k.tags.includes("async")).length
};

// Calculate pattern distribution
const totalPatterns = Object.values(architecturalPatterns).reduce((a, b) => a + b, 0);
const patternDistribution = Object.entries(architecturalPatterns).map(([pattern, count]) => ({
  pattern,
  count,
  percentage: (count / totalPatterns) * 100
}));
```

## 🚀 Advanced Use Cases

### 1. Code Generation Assistant

```typescript
// Generate boilerplate based on existing patterns
function generateEntityBoilerplate(entityName: string) {
  const entityExamples = knowledgeBase
    .filter(k => k.category === "entity")
    .flatMap(k => k.examples);
  
  // Use examples to generate new entity template
  return `@Entity('${entityName.toLowerCase()}s')
export class ${entityName} {
  @Column({ primary: true })
  id: number;
  
  // Add more properties based on patterns...
}`;
}
```

### 2. Migration Assistant

```typescript
// Analyze breaking changes between versions
function analyzeBreakingChanges(oldDocs: any, newDocs: any) {
  const oldExports = oldDocs.packages.flatMap(p => p.main_exports);
  const newExports = newDocs.packages.flatMap(p => p.main_exports);
  
  const removedExports = oldExports.filter(exp => !newExports.includes(exp));
  const addedExports = newExports.filter(exp => !oldExports.includes(exp));
  
  return { removedExports, addedExports };
}
```

### 3. Learning Path Generator

```typescript
// Generate learning path based on dependencies
function generateLearningPath() {
  const sortedPackages = projectDocs.packages.sort((a, b) => 
    a.dependencies.length - b.dependencies.length
  );
  
  return sortedPackages.map((pkg, index) => ({
    step: index + 1,
    package: pkg.package_name,
    description: pkg.description,
    prerequisites: pkg.dependencies,
    examples: pkg.usage_examples.slice(0, 3)
  }));
}
```

## 📝 Integration with Documentation Tools

### Docusaurus Integration

```typescript
// Generate Docusaurus sidebar
const sidebar = projectDocs.packages.map(pkg => ({
  type: 'category',
  label: pkg.package_name,
  items: [
    {
      type: 'doc',
      id: `${pkg.package_name}/overview`,
      label: 'Overview'
    },
    {
      type: 'doc',
      id: `${pkg.package_name}/api`,
      label: 'API Reference'
    },
    {
      type: 'doc',
      id: `${pkg.package_name}/examples`,
      label: 'Examples'
    }
  ]
}));
```

### GitBook Integration

```typescript
// Generate GitBook SUMMARY.md
const summary = projectDocs.packages.map(pkg => 
  `* [${pkg.package_name}](${pkg.package_name}/README.md)
  * [API Reference](${pkg.package_name}/api.md)
  * [Examples](${pkg.package_name}/examples.md)`
).join('\n');
```

This documentation generator provides a comprehensive foundation for AI-powered development tools, documentation systems, and code analysis platforms.
