# @decopro/commander 重构说明

## 重构概述

本次重构对 `@decopro/commander` 包进行了全面优化，提升了类型安全性、可用性和可维护性。

## 主要改进

### 1. 增强的类型安全

#### 强类型标志格式
```typescript
// 之前：任意字符串
flags?: string;

// 现在：强类型约束
type FlagFormat = 
    | `--${string}`                    // --port
    | `--${string} <${string}>`        // --port <port>
    | `--${string} [${string}]`        // --port [port]
    | `-${string}`                     // -p
    | `-${string}, --${string}`;       // -p, --port
```

#### 强类型参数格式
```typescript
// 之前：任意字符串
name?: string;

// 现在：强类型约束
type ArgumentFormat = 
    | `[${string}]`    // [optional]
    | `<${string}>`    // <required>
    | string;          // simple
```

### 2. 内置验证功能

#### 配置验证
```typescript
// 自动验证配置的有效性
export function validateOptionOptions(options: OptionOptions): ValidationResult;
export function validateArgumentOptions(options: ArgumentOptions): ValidationResult;
export function validateActionOptions(options: ActionOptions): ValidationResult;
export function validateCommanderOptions(options: CommanderOptions): ValidationResult;
```

#### 验证装饰器
```typescript
// 带验证的装饰器，配置错误时会抛出异常
@ValidatedOption({
    flags: "--port <port>",
    description: "端口号",
    zod: z.coerce.number()
})
port: number;
```

### 3. 常用 Zod 模式

提供了开箱即用的常用验证模式：

```typescript
export const CommonSchemas = {
    port: z.coerce.number().int().min(1).max(65535),
    host: z.string().min(1),
    environment: z.enum(['development', 'production', 'test', 'staging']),
    filePath: z.string().min(1),
    url: z.string().url(),
    email: z.string().email(),
    positiveInt: z.coerce.number().int().positive(),
    nonNegativeInt: z.coerce.number().int().min(0),
    boolean: z.coerce.boolean(),
    json: z.string().transform((str, ctx) => { /* JSON 解析 */ })
};
```

### 4. 工具函数

#### 配置创建工具
```typescript
// 快速创建配置
const portOption = createOptionConfig(
    "--port <port>",
    "服务器端口号",
    CommonSchemas.port,
    3000
);

const envArgument = createArgumentConfig(
    "[environment]",
    "运行环境",
    CommonSchemas.environment,
    "development"
);
```

#### 解析工具
```typescript
// 解析标志字符串
const { short, long, hasValue } = parseFlags("--port <port>");

// 解析参数名称
const { name, optional, required } = parseArgumentName("[environment]");
```

### 5. 改进的错误处理

#### 结构化错误信息
```typescript
interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings?: string[];
}
```

#### 自定义错误类型
```typescript
export class ConfigurationError extends CommanderError {
    readonly code = 'CONFIGURATION_ERROR';
}

export class ValidationError extends CommanderError {
    readonly code = 'VALIDATION_ERROR';
}
```

### 6. 更好的开发体验

#### 优先级控制
```typescript
@Action({
    description: "主要动作",
    priority: 1  // 0-9，数字越小优先级越高
})
async mainAction() { }
```

#### 隐藏命令支持
```typescript
@Commander({
    name: "internal",
    description: "内部命令",
    hidden: true  // 不在帮助中显示
})
class InternalCommand { }
```

## 向后兼容性

重构保持了完全的向后兼容性：

- 所有现有的装饰器签名保持不变
- 现有代码无需修改即可使用
- 新功能是可选的增强

## 使用示例

### 基础用法（与之前相同）
```typescript
@Commander({
    name: "serve",
    description: "启动服务器"
})
export class ServeCommand {
    @Option({
        flags: "--port <port>",
        description: "端口号",
        zod: z.coerce.number()
    })
    port: number;

    @Action({})
    async start() {
        console.log(`服务器启动在端口 ${this.port}`);
    }
}
```

### 增强用法（新功能）
```typescript
@ValidatedCommander({
    name: "deploy",
    description: "部署应用"
})
export class DeployCommand {
    @ValidatedOption({
        flags: "--env <environment>",
        description: "部署环境",
        zod: CommonSchemas.environment
    })
    environment: string;

    @ValidatedAction({
        description: "执行部署",
        priority: 1
    })
    async deploy() {
        console.log(`部署到 ${this.environment} 环境`);
    }
}
```

## 测试覆盖

重构包含了全面的测试覆盖：

- 装饰器功能测试
- 验证函数测试
- 工具函数测试
- 集成测试
- 错误处理测试

## 性能影响

重构对性能的影响微乎其微：

- 验证只在装饰器应用时执行一次
- 运行时性能与之前相同
- 新增的类型检查在编译时完成

## 迁移指南

### 立即可用
现有代码无需任何修改即可继续使用。

### 渐进式增强
可以逐步采用新功能：

1. 使用 `CommonSchemas` 替换自定义 Zod 模式
2. 使用 `ValidatedXxx` 装饰器增强错误检查
3. 使用工具函数简化配置创建
4. 添加优先级和隐藏属性等新特性

## 总结

本次重构显著提升了 `@decopro/commander` 的：

- **类型安全性**：强类型约束减少运行时错误
- **开发体验**：更好的 IDE 支持和错误提示
- **可维护性**：结构化的代码组织和清晰的 API
- **可扩展性**：插件系统和工具函数支持
- **健壮性**：全面的验证和错误处理

同时保持了完全的向后兼容性，确保现有项目的平滑升级。
