# @decopro/mcp

**Version**: 1.1.0

## Architecture Overview

This package contains the following components:

- **class**: 1 file(s)
- **module**: 7 file(s)
- **interface**: 1 file(s)

### Key Dependencies

- **@decopro/core**: used in 7 file(s)
- **@modelcontextprotocol/sdk/types**: used in 2 file(s)
- **zod**: used in 1 file(s)
- **@modelcontextprotocol/sdk/server/mcp.js**: used in 1 file(s)
- **tsup**: used in 1 file(s)


## API Reference

## Class

### src/McpOutputer.ts

### Class: `McpOutputer`
  - Method: `toSuccess(text: unknown): CallToolResult`
  - Method: `toError(message: unknown): CallToolResult`
  - Method: `handleError(error: unknown): CallToolResult`
  - Method: `convertToMCPFormat(input: unknown): CallToolResult`
  - Method: `toString(input: unknown): string`


**Tags**: class, function, export

## Module

### src/askAgent.ts

### Function: `askAgent(name: InjectionToken<R>, message: string): Promise<R>`

**Tags**: async, function, export

### src/callTool.ts

### Function: `toolCall(name: InjectionToken<R>, args: any): Promise<R>`

**Tags**: async, function, export

### src/getPrompt.ts

### Function: `getPrompt(token: InjectionToken<T>): Promise<T>`

**Tags**: async, function, export

### src/getResource.ts

### Function: `getResource(token: InjectionToken<T>): Promise<T>`

**Tags**: async, function, export

### src/index.ts

**Tags**: export

### src/runWorkflow.ts

### Function: `runWorkflow(token: InjectionToken<T>): Promise<T>`

**Tags**: async, function, export

### tsup.config.ts

**Tags**: export

## Interface

### src/decorator.ts

### Interface: `McpArgOptions`
  - name: string
  - zod: ZodTypeAny

### Function: `isMcpArgOptions(val: any): val is McpArgOptions`
### Interface: `ToolOptions`

tool


  - token: InjectionToken<R>
  - title?: string
  - description?: string
  - annotations?: ToolAnnotations

### Type Alias: `ResourceMetadata = Omit<McpResource, "uri" | "name">`
### Interface: `ResourceOptions`
  - name: string
  - uriOrTemplate: string | ResourceTemplate
  - config: ResourceMetadata

### Interface: `PromptOptions`

prompt


  - name: string
  - title?: string
  - description?: string

### Interface: `AgentOptions`

agent


  - token: string
  - description: string
  - tools?: Type<any>[]
  - prompts?: Type<any>[]
  - resources?: Type<any>[]
  - children?: Type<any>[]

### Interface: `WorkflowOptions`


**Tags**: interface, types, function, export

