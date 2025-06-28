# @decopro/docs

Documentation generator for Decopro framework - optimized for AI/LLM consumption

**Version**: 1.1.0

## Main Exports

- `Knowledge`
- `PackageDocumentation`
- `ProjectDocumentation`
- `generateTSKnowledges`
- `generatePackageDocumentation`
- `generateProjectDocumentation`

## Architecture Overview

This package contains the following components:

- **interface**: 1 file(s)
- **entity**: 1 file(s)
- **module**: 1 file(s)

### Key Dependencies

- **fs**: used in 2 file(s)
- **path**: used in 2 file(s)
- **typescript**: used in 1 file(s)
- **crypto**: used in 1 file(s)
- **${corePackage.package_name}**: used in 1 file(s)
- **tsup**: used in 1 file(s)


## API Reference

## Interface

### src/cli.ts

### Interface: `CLIOptions`
  - output?: string
  - format?: "json" | "markdown" | "both"
  - package?: string
  - verbose?: boolean

### Function: `parseArgs(): CLIOptions`
### Function: `showHelp(): void`
### Function: `log(message: string, verbose: boolean): void`
### Function: `main(): void`
### Function: `generatePackageMarkdown(pkg: any): string`
### Function: `generateProjectMarkdown(project: any): string`

**Tags**: cli, command, async, interface, types, function, export

## Entity

### src/index.ts

### Interface: `Knowledge`
  - package_name: string
  - package_version: string
  - filename: string
  - docs: string
  - hash: string
  - category: string
  - tags: string[]
  - examples: string[]
  - dependencies: string[]

### Interface: `PackageDocumentation`
  - package_name: string
  - package_version: string
  - description: string
  - main_exports: string[]
  - api_reference: string
  - usage_examples: string[]
  - architecture_overview: string
  - dependencies: string[]
  - knowledges: Knowledge[]

### Interface: `ProjectDocumentation`
  - project_name: string
  - version: string
  - description: string
  - architecture: string
  - packages: PackageDocumentation[]
  - quick_start: string
  - api_overview: string
  - examples: string[]

### Function: `generateTSKnowledges(projectRoot: string): Knowledge[]`
### Function: `visitNode(node: ts.Node, output: string[], checker: ts.TypeChecker, sourceFile: ts.SourceFile, indentLevel: number): void`
### Function: `getFunctionSignature(node: ts.FunctionLikeDeclaration, sourceFile: ts.SourceFile): string`
### Function: `getDocumentation(symbol: ts.Symbol, checker: ts.TypeChecker): string`
### Function: `getAllTSFiles(dir: string): string[]`
### Function: `isTestFile(filePath: string): boolean`
### Function: `determineFileCategory(filePath: string, sourceFile: ts.SourceFile): string`
### Function: `extractFileTags(sourceFile: ts.SourceFile, filePath: string): string[]`
### Function: `extractCodeExamples(sourceFile: ts.SourceFile): string[]`
### Function: `extractFileDependencies(sourceFile: ts.SourceFile): string[]`
### Function: `generatePackageDocumentation(packageRoot: string): PackageDocumentation`
### Function: `extractMainExports(packageRoot: string): string[]`
### Function: `generateAPIReference(knowledges: Knowledge[]): string`
### Function: `extractUsageExamples(knowledges: Knowledge[]): string[]`
### Function: `generateArchitectureOverview(knowledges: Knowledge[]): string`
### Function: `generateProjectDocumentation(projectRoot: string): ProjectDocumentation`
### Function: `generateQuickStartGuide(packages: PackageDocumentation[]): string`
### Function: `generateProjectAPIOverview(packages: PackageDocumentation[]): string`
### Function: `generateProjectArchitecture(packages: PackageDocumentation[]): string`
### Function: `sortPackagesByDependency(packages: PackageDocumentation[]): PackageDocumentation[]`

**Tags**: entity, database, column, relationship, dependency-injection, service, controller, api, query-builder, repository, async, interface, types, class, function, export

## Module

### tsup.config.ts

**Tags**: export

