# @decopro/ast

**Version**: 1.1.0

## Main Exports

- `AstOptions`
- `AST_TOKEN`
- `Ast`
- `Visitor`

## Architecture Overview

This package contains the following components:

- **interface**: 1 file(s)
- **module**: 1 file(s)

### Key Dependencies

- **@decopro/core**: used in 1 file(s)
- **tsup**: used in 1 file(s)


## API Reference

## Interface

### src/index.ts

### Interface: `AstOptions`
  - description?: string

### Interface: `Ast`

### Interface: `Visitor`

### Function: `runAst(ast: Ast, visitor: Visitor<T, C>, ctx: C): Promise<T>`
### Function: `runAstJson(json: unknown, visitor: Visitor<T, C>, ctx: C): Promise<T>`

**Tags**: async, interface, types, function, export

## Module

### tsup.config.ts

**Tags**: export

