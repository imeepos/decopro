# 🎨 DecoPro 装饰器高级用法示例

## 📋 目录

- [基础装饰器](#基础装饰器)
- [可选参数支持](#可选参数支持)
- [高级 Input 装饰器](#高级-input-装饰器)
- [Injectable 装饰器变体](#injectable-装饰器变体)
- [装饰器工具函数](#装饰器工具函数)
- [复杂应用场景](#复杂应用场景)

## 基础装饰器

### 传统用法（仍然支持）

```typescript
import { Input, Injectable } from "@decopro/core";

@Injectable({ singleton: true })
class UserService {
    @Input({ name: "userName", required: true })
    name: string = "";
}
```

## 可选参数支持

### 新的灵活用法

```typescript
import { Input, Injectable } from "@decopro/core";

@Injectable() // 🎉 无参数调用
class UserService {
    @Input() // 🎉 无参数调用，使用默认配置
    name: string = "";

    @Input({ name: "userEmail" }) // 🎉 部分参数
    email: string = "";
}
```

## 高级 Input 装饰器

### 1. 验证装饰器

```typescript
import { ValidatedInput } from "@decopro/core";

class UserModel {
    @ValidatedInput({
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        validator: (value: string) => value.trim().length > 0,
        defaultValue: ""
    })
    name: string = "";

    @ValidatedInput({
        required: true,
        min: 0,
        max: 150,
        validator: (value: number) => Number.isInteger(value),
        defaultValue: 0
    })
    age: number = 0;

    @ValidatedInput({
        enum: ['admin', 'user', 'guest'],
        defaultValue: 'user'
    })
    role: string = 'user';
}
```

### 2. 只读装饰器

```typescript
import { ReadonlyInput } from "@decopro/core";

class ConfigModel {
    @ReadonlyInput({ name: "appVersion" })
    version: string = "1.0.0";

    @ReadonlyInput({
        defaultValue: "production",
        description: "Application environment"
    })
    environment: string = "";
}
```

### 3. 必需装饰器

```typescript
import { RequiredInput } from "@decopro/core";

class DatabaseConfig {
    @RequiredInput({
        defaultValue: "localhost",
        validator: (value: string) => value.length > 0
    })
    host: string = "";

    @RequiredInput({
        defaultValue: 5432,
        min: 1,
        max: 65535
    })
    port: number = 0;
}
```

## Injectable 装饰器变体

### 1. 单例装饰器

```typescript
import { Singleton } from "@decopro/core";

@Singleton() // 🎉 自动配置为单例
class DatabaseService {
    private connections: Map<string, any> = new Map();
}

@Singleton({
    deps: [ConfigService],
    factory: (config: ConfigService) => new CacheService(config.cacheConfig)
})
class CacheService {
    constructor(private config: any) {}
}
```

### 2. 瞬态装饰器

```typescript
import { Transient } from "@decopro/core";

@Transient() // 🎉 每次都创建新实例
class RequestHandler {
    private requestId: string = Math.random().toString(36);
}
```

## 装饰器工具函数

### 1. 条件装饰器

```typescript
import { conditional, Injectable } from "@decopro/core";

const isDevelopment = process.env.NODE_ENV === 'development';

@conditional(isDevelopment, Injectable({ singleton: true }))
class DebugService {
    log(message: string) {
        console.log(`[DEBUG] ${message}`);
    }
}
```

### 2. 装饰器组合

```typescript
import { compose, Injectable, Input } from "@decopro/core";

const serviceDecorator = compose(
    Injectable({ singleton: true }),
    (target: any) => {
        target.prototype.createdAt = new Date();
        return target;
    }
);

@serviceDecorator
class TimestampedService {
    @Input()
    name: string = "";
}
```

### 3. 异步装饰器

```typescript
import { async, Injectable } from "@decopro/core";

@async(async (options) => {
    // 异步初始化逻辑
    const config = await loadConfig();
    return Injectable({ ...options, deps: [config] });
})()
class AsyncService {}
```

### 4. 缓存装饰器

```typescript
import { cached, createPropertyDecorator } from "@decopro/core";

const CachedInput = cached(createPropertyDecorator(INPUT_TOKEN));

class OptimizedModel {
    @CachedInput({ name: "cachedProperty" })
    data: string = "";
}
```

## 复杂应用场景

### 1. 用户管理系统

```typescript
import { 
    ValidatedInput, 
    RequiredInput, 
    ReadonlyInput,
    Singleton,
    Injectable 
} from "@decopro/core";

// 用户模型
class User {
    @ReadonlyInput({ name: "userId" })
    id: string = "";

    @ValidatedInput({
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        defaultValue: ""
    })
    name: string = "";

    @ValidatedInput({
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        defaultValue: ""
    })
    email: string = "";

    @ValidatedInput({
        enum: ['admin', 'user', 'guest'],
        defaultValue: 'user'
    })
    role: string = 'user';

    @ValidatedInput({
        min: 13,
        max: 120,
        validator: (age: number) => Number.isInteger(age) && age > 0,
        defaultValue: 18
    })
    age: number = 18;
}

// 用户服务
@Singleton()
class UserService {
    @RequiredInput({
        defaultValue: new Map(),
        description: "User storage"
    })
    private users: Map<string, User> = new Map();

    @ValidatedInput({
        min: 1,
        max: 1000,
        defaultValue: 100
    })
    maxUsers: number = 100;

    createUser(userData: Partial<User>): User {
        const user = new User();
        Object.assign(user, userData);
        this.users.set(user.id, user);
        return user;
    }
}
```

### 2. 配置管理系统

```typescript
import { 
    ReadonlyInput, 
    ValidatedInput,
    conditional,
    deepMergeOptions 
} from "@decopro/core";

// 数据库配置
class DatabaseConfig {
    @ValidatedInput({
        required: true,
        defaultValue: "localhost",
        validator: (host: string) => host.length > 0
    })
    host: string = "";

    @ValidatedInput({
        required: true,
        min: 1,
        max: 65535,
        defaultValue: 5432
    })
    port: number = 5432;

    @RequiredInput({
        defaultValue: "myapp",
        minLength: 1
    })
    database: string = "";

    @ValidatedInput({
        min: 1,
        max: 100,
        defaultValue: 10
    })
    maxConnections: number = 10;
}

// 应用配置
@conditional(
    process.env.NODE_ENV === 'production',
    Singleton()
)
class AppConfig {
    @ReadonlyInput({ name: "appName" })
    name: string = "DecoPro App";

    @ReadonlyInput({ name: "version" })
    version: string = "1.0.0";

    @ValidatedInput({
        enum: ['development', 'staging', 'production'],
        defaultValue: 'development'
    })
    environment: string = 'development';

    @ValidatedInput({
        target: () => DatabaseConfig,
        defaultValue: new DatabaseConfig()
    })
    database: DatabaseConfig = new DatabaseConfig();

    @ValidatedInput({
        min: 1000,
        max: 65535,
        defaultValue: 3000
    })
    port: number = 3000;
}
```

## 🎯 最佳实践

1. **使用类型安全的选项**: 利用 TypeScript 的类型检查确保装饰器选项正确
2. **合理使用默认值**: 为可选参数提供合理的默认值
3. **组合装饰器**: 使用 `compose` 函数组合多个装饰器以提高复用性
4. **条件装饰器**: 使用 `conditional` 根据环境或条件应用不同的装饰器
5. **验证输入**: 使用 `ValidatedInput` 确保数据的完整性和正确性
6. **缓存优化**: 对于复杂的装饰器，使用 `cached` 提高性能

## 🚀 性能优化

- 装饰器缓存减少重复计算
- 条件装饰器避免不必要的处理
- 深度合并选项提供灵活的配置
- 类型安全确保运行时错误最小化
