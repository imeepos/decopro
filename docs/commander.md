# @decopro/commander

**Version**: 1.1.0

## Main Exports

- `OptionOptions`
- `OPTION_TOKEN`
- `Option`
- `ActionOptions`
- `ACTION_TOKEN`
- `Action`
- `ArgumentOptions`
- `ARGUMENT_TOKEN`
- `Argument`
- `CommanderOptions`
- `COMMANDER_TOKEN`
- `Commander`

## Architecture Overview

This package contains the following components:

- **interface**: 1 file(s)
- **module**: 1 file(s)

### Key Dependencies

- **@decopro/core**: used in 1 file(s)
- **zod**: used in 1 file(s)
- **tsup**: used in 1 file(s)


## API Reference

## Interface

### src/index.ts

### Interface: `OptionOptions`
  - flags?: string
  - description?: string
  - zod?: ZodTypeAny

### Function: `Option(): PropertyDecorator`

Option 装饰器 - 支持可选参数


### Function: `Option(options: OptionOptions): PropertyDecorator`

Option 装饰器 - 支持可选参数


### Function: `Option(options?: OptionOptions): PropertyDecorator`

Option 装饰器 - 支持可选参数


### Interface: `ActionOptions`
  - description?: string

### Function: `Action(): MethodDecorator`

Action 装饰器 - 支持可选参数


### Function: `Action(options: ActionOptions): MethodDecorator`

Action 装饰器 - 支持可选参数


### Function: `Action(options?: ActionOptions): MethodDecorator`

Action 装饰器 - 支持可选参数


### Interface: `ArgumentOptions`
  - name?: string
  - description?: string
  - defaultValue?: unknown

### Function: `Argument(): PropertyDecorator`

Argument 装饰器 - 支持可选参数


### Function: `Argument(options: ArgumentOptions): PropertyDecorator`

Argument 装饰器 - 支持可选参数


### Function: `Argument(options?: ArgumentOptions): PropertyDecorator`

Argument 装饰器 - 支持可选参数


### Interface: `CommanderOptions`
  - name?: string
  - alias?: string
  - summary?: string
  - description?: string

### Function: `Commander(): ClassDecorator`

Commander 装饰器 - 支持可选参数


### Function: `Commander(options: CommanderOptions): ClassDecorator`

Commander 装饰器 - 支持可选参数


### Function: `Commander(options?: CommanderOptions): ClassDecorator`

Commander 装饰器 - 支持可选参数



**Tags**: interface, types, function, export

## Module

### tsup.config.ts

**Tags**: export

