# @decopro/cli

**Version**: 1.1.0

## Architecture Overview

This package contains the following components:

- **module**: 7 file(s)
- **interface**: 2 file(s)
- **class**: 3 file(s)

### Key Dependencies

- **@decopro/core**: used in 6 file(s)
- **@modelcontextprotocol/sdk/server/mcp.js**: used in 2 file(s)
- **@decopro/mcp**: used in 2 file(s)
- **commander**: used in 1 file(s)
- **@decopro/commander**: used in 1 file(s)
- **zod**: used in 1 file(s)
- **os**: used in 1 file(s)
- **dotenv**: used in 1 file(s)
- **path**: used in 1 file(s)
- **fs-extra**: used in 1 file(s)


## API Reference

## Module

### src/agents/index.ts

### src/index.ts

**Tags**: export

### src/mcpServerFactory.ts

**Tags**: async, function, export

### src/prompts/index.ts

**Tags**: export

### src/services/index.ts

**Tags**: export

### src/tools/index.ts

### tsup.config.ts

**Tags**: export

## Interface

### src/bin.ts

### Interface: `Decopro`
  - tests?: string[]

### Function: `main(): void`

**Tags**: async, interface, types, function, export

### src/cliAppInit.ts

### Interface: `CommandMetadata`

命令元数据接口


  - target: Type<any>
  - options: CommanderOptions

### Interface: `ArgumentMetadata`

参数元数据接口


  - target: Type<any>
  - property: string | symbol
  - options: ArgumentOptions

### Interface: `OptionMetadata`

选项元数据接口


  - target: Type<any>
  - property: string | symbol
  - options: OptionOptions

### Interface: `ActionMetadata`

动作元数据接口


  - target: Type<any>
  - property: string | symbol
  - options: ActionOptions

### Class: `CliAppInit`

CLI 应用初始化器
负责注册和配置所有命令行命令


  - Property: `commanders: Type<any>[]`
  - Constructor: `constructor(injector: Injector): void`
    - Parameter: `injector: Injector`
  - Method: `forRoot(types: Type<any>[]): typeof CliAppInit`
    
    添加额外的命令类型
    
  - Method: `onInit(): Promise<void>`
    
    初始化 CLI 应用
    
  - Method: `initializeEnvironment(): Promise<void>`
    
    初始化环境服务
    
  - Method: `registerCommands(): Promise<void>`
    
    注册所有命令
    
  - Method: `registerSingleCommand(command: CommandMetadata): Promise<void>`
    
    注册单个命令
    
  - Method: `createCommand(command: CommandMetadata): Command`
    
    创建命令实例
    
  - Method: `addArguments(cmd: Command, command: CommandMetadata): void`
    
    为命令添加参数
    
  - Method: `addOptions(cmd: Command, command: CommandMetadata): void`
    
    为命令添加选项
    
  - Method: `addAction(cmd: Command, command: CommandMetadata): void`
    
    为命令添加动作处理器
    
  - Method: `executeCommand(command: CommandMetadata, args: any[]): Promise<void>`
    
    执行命令
    
  - Method: `getArgumentsForCommand(target: Type<any>): ArgumentMetadata[]`
    
    获取命令的参数元数据
    
  - Method: `getOptionsForCommand(target: Type<any>): OptionMetadata[]`
    
    获取命令的选项元数据
    
  - Method: `getActionsForCommand(target: Type<any>): ActionMetadata[]`
    
    获取命令的动作元数据
    
  - Method: `createArgument(arg: ArgumentMetadata): any`
    
    创建参数实例
    
  - Method: `createOption(opt: OptionMetadata): any`
    
    创建选项实例
    
  - Method: `setOptionsToInstance(instance: any, target: Type<any>, options: any): void`
    
    设置选项值到命令实例
    
  - Method: `setArgumentsToInstance(instance: any, target: Type<any>, args: any[]): void`
    
    设置参数值到命令实例
    
  - Method: `executeActions(instance: any, actions: ActionMetadata[], args: any[]): Promise<void>`
    
    执行命令的所有动作
    
  - Method: `parseArguments(): void`
    
    解析命令行参数
    
  - Method: `handleInitializationError(error: unknown): void`
    
    处理初始化错误
    
  - Method: `handleCommandRegistrationError(command: CommandMetadata, error: unknown): void`
    
    处理命令注册错误
    
  - Method: `handleCommandExecutionError(command: CommandMetadata, error: unknown): void`
    
    处理命令执行错误
    


**Tags**: cli, command, async, interface, types, class, function, export

## Class

### src/mcpAppInit.ts

### Class: `McpAppInit`
  - Property: `tools: Type<any>[]`
  - Property: `prompts: Type<any>[]`
  - Constructor: `constructor(injector: Injector): void`
    - Parameter: `injector: Injector`
  - Method: `onInit(): Promise<void>`


**Tags**: async, class, export

### src/prompts/readPrompt.ts

### Class: `ReadPrompt`
  - Method: `read(): void`


**Tags**: async, class, export

### src/services/env.service.ts

### Class: `EnvService`
  - Property: `config: { token: string; refresh_token: string }`
  - Constructor: `constructor(): void`
  - Method: `onInit(): void`
  - Method: `get(key: string): string | undefined`


**Tags**: async, class, export

