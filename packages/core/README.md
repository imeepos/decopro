# @decopro/core

[![npm version](https://badge.fury.io/js/%40decopro%2Fcore.svg)](https://badge.fury.io/js/%40decopro%2Fcore)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

DecoPro 框架的核心模块，提供依赖注入、模块系统和序列化功能。

## 🚀 特性

- 🏗️ **强大的依赖注入**: 基于 tsyringe 的类型安全 DI 容器
- 🔧 **模块化系统**: 支持模块依赖和生命周期管理
- 📦 **序列化支持**: 内置 JSON 序列化和反序列化
- 🛡️ **类型安全**: 完整的 TypeScript 支持
- 🔄 **生命周期管理**: 支持初始化和销毁钩子
- ⚡ **高性能**: 优化的依赖解析和缓存机制

## 📦 安装

```bash
npm install @decopro/core reflect-metadata
# 或
pnpm add @decopro/core reflect-metadata
# 或
yarn add @decopro/core reflect-metadata
```

> **注意**: `reflect-metadata` 是必需的依赖，用于装饰器元数据支持。

## 🎯 快速开始

### 基础依赖注入

```typescript
import "reflect-metadata";
import { injectable, inject, container } from "@decopro/core";

// 定义服务
@injectable()
export class DatabaseService {
    connect(): string {
        return "Connected to database";
    }
}

@injectable()
export class UserService {
    constructor(@inject(DatabaseService) private db: DatabaseService) {}

    getUsers(): string[] {
        console.log(this.db.connect());
        return ["Alice", "Bob", "Charlie"];
    }
}

// 使用服务
const userService = container.resolve(UserService);
console.log(userService.getUsers());
```

### 应用模块

```typescript
import "reflect-metadata";
import { AppInit, OnInit, bootstrap, inject, Injector } from "@decopro/core";

@AppInit({
    deps: [] // 依赖的其他模块
})
export class DatabaseModule implements OnInit {
    constructor(@inject(Injector) private injector: Injector) {}

    async onInit(): Promise<void> {
        console.log("数据库模块初始化完成");
        // 执行数据库连接等初始化逻辑
    }
}

@AppInit({
    deps: [DatabaseModule] // 依赖数据库模块
})
export class UserModule implements OnInit {
    async onInit(): Promise<void> {
        console.log("用户模块初始化完成");
    }
}

// 启动应用
async function main() {
    await bootstrap([DatabaseModule, UserModule]);
    console.log("应用启动完成");
}

main();
```

### 序列化和反序列化

```typescript
import "reflect-metadata";
import { Input, Injector, container } from "@decopro/core";

export class User {
    @Input({})
    name: string;

    @Input({})
    age: number;

    @Input({})
    email: string;

    constructor() {
        this.name = "";
        this.age = 0;
        this.email = "";
    }
}

export class Profile {
    @Input({ target: () => User })
    user: User;

    @Input({})
    bio: string;

    constructor() {
        this.user = new User();
        this.bio = "";
    }
}

// 使用示例
const injector = container.resolve(Injector);

// 创建对象
const profile = new Profile();
profile.user.name = "张三";
profile.user.age = 25;
profile.user.email = "zhangsan@example.com";
profile.bio = "软件工程师";

// 序列化
const json = injector.toJson(profile, Profile);
console.log(JSON.stringify(json, null, 2));
/*
{
  "__typeName": "Profile",
  "user": {
    "__typeName": "User",
    "name": "张三",
    "age": 25,
    "email": "zhangsan@example.com"
  },
  "bio": "软件工程师"
}
*/

// 反序列化
const restored = injector.fromJson(json) as Profile;
console.log(restored instanceof Profile); // true
console.log(restored.user instanceof User); // true
console.log(restored.user.name); // "张三"
```

## 📚 API 参考

### 核心装饰器

#### `@injectable()`

将类标记为可注入的服务：

```typescript
@injectable()
export class MyService {
    doSomething(): void {
        console.log("Doing something...");
    }
}
```

#### `@inject(token)`

注入依赖：

```typescript
@injectable()
export class UserController {
    constructor(
        @inject(UserService) private userService: UserService,
        @inject("CONFIG") private config: Config
    ) {}
}
```

#### `@AppInit(options)`

定义应用模块：

```typescript
@AppInit({
    deps: [DatabaseModule, CacheModule] // 可选的依赖模块
})
export class UserModule implements OnInit {
    async onInit(): Promise<void> {
        // 初始化逻辑
    }
}
```

#### `@Input(options)`

标记可序列化的属性：

```typescript
export class User {
    @Input({ name: "userName" }) // 自定义序列化名称
    name: string;

    @Input({ target: () => Address }) // 指定类型
    address: Address;
}
```

### 核心类

#### `Injector`

增强的依赖注入器：

```typescript
const injector = container.resolve(Injector);

// 解析依赖
const service = injector.get(MyService);

// 解析所有实例
const services = injector.getAll(SERVICE_TOKEN);

// 检查是否可以解析
const canResolve = injector.canResolve(MyService);

// 创建子容器
const childInjector = injector.create();

// 序列化
const json = injector.toJson(instance, Type);

// 反序列化
const instance = injector.fromJson(json, Type);

// 清理资源
await injector.cleanup(instance);
```

### 工具函数

#### `bootstrap(modules, options?)`

启动应用：

```typescript
await bootstrap([Module1, Module2], {
    debug: true, // 启用调试模式
    timeout: 30000, // 初始化超时时间
    errorStrategy: "throw" // 错误处理策略
});
```

#### 类型守卫

```typescript
import {
    isType,
    isOnInit,
    isOnDestroy,
    isJsonWithTypeName
} from "@decopro/core";

// 检查是否为构造函数
if (isType(value)) {
    // value 是构造函数
}

// 检查是否实现了 OnInit
if (isOnInit(instance)) {
    await instance.onInit();
}

// 检查是否实现了 OnDestroy
if (isOnDestroy(instance)) {
    await instance.onDestroy();
}

// 检查是否为带类型名称的 JSON
if (isJsonWithTypeName(obj)) {
    console.log(obj.__typeName);
}
```

## 🔧 高级用法

### 自定义令牌

```typescript
import { InjectionToken } from "@decopro/core";

// 定义令牌
export const DATABASE_CONFIG = Symbol(
    "DATABASE_CONFIG"
) as InjectionToken<DatabaseConfig>;

// 注册值
container.register(DATABASE_CONFIG, {
    useValue: {
        host: "localhost",
        port: 5432,
        database: "myapp"
    }
});

// 注入使用
@injectable()
export class DatabaseService {
    constructor(@inject(DATABASE_CONFIG) private config: DatabaseConfig) {}
}
```

### 工厂模式

```typescript
import { instanceCachingFactory } from "@decopro/core";

// 定义工厂函数
function createLogger(container: DependencyContainer): Logger {
    const config = container.resolve(LoggerConfig);
    return new Logger(config);
}

// 注册工厂
container.register(Logger, {
    useFactory: instanceCachingFactory(createLogger)
});
```

### 条件注册

```typescript
// 根据环境注册不同的实现
if (process.env.NODE_ENV === "production") {
    container.register(Logger, { useClass: ProductionLogger });
} else {
    container.register(Logger, { useClass: DevelopmentLogger });
}
```

### 生命周期管理

```typescript
import { OnInit, OnDestroy } from "@decopro/core";

@injectable()
export class ResourceManager implements OnInit, OnDestroy {
    private resources: Resource[] = [];

    async onInit(): Promise<void> {
        console.log("初始化资源管理器");
        // 加载资源
    }

    async onDestroy(): Promise<void> {
        console.log("清理资源管理器");
        // 清理资源
        for (const resource of this.resources) {
            await resource.cleanup();
        }
    }
}
```

### 复杂序列化

```typescript
export class Order {
    @Input({})
    id: string;

    @Input({ target: () => User })
    customer: User;

    @Input({ target: () => OrderItem })
    items: OrderItem[];

    @Input({})
    createdAt: Date;

    constructor() {
        this.id = "";
        this.customer = new User();
        this.items = [];
        this.createdAt = new Date();
    }
}

export class OrderItem {
    @Input({})
    productId: string;

    @Input({})
    quantity: number;

    @Input({})
    price: number;

    constructor() {
        this.productId = "";
        this.quantity = 0;
        this.price = 0;
    }
}

// 序列化包含数组和嵌套对象的复杂结构
const order = new Order();
order.id = "ORD-001";
order.customer.name = "张三";
order.items.push(
    Object.assign(new OrderItem(), {
        productId: "P001",
        quantity: 2,
        price: 99.99
    }),
    Object.assign(new OrderItem(), {
        productId: "P002",
        quantity: 1,
        price: 149.99
    })
);

const json = injector.toJson(order, Order);
const restored = injector.fromJson(json) as Order;
```

## 🛡️ 错误处理

核心模块提供了详细的错误类型：

```typescript
import {
    DecoProError,
    InjectionError,
    CircularDependencyError,
    ClassNameNotFoundError,
    DuplicateClassNameError,
    JsonWithTypeNameError
} from "@decopro/core";

try {
    const service = injector.get(NonExistentService);
} catch (error) {
    if (error instanceof InjectionError) {
        console.error("依赖注入失败:", error.message);
        console.error("错误代码:", error.code);
        console.error("时间戳:", error.timestamp);
    }
}

try {
    const instance = injector.fromJson({ invalid: "json" });
} catch (error) {
    if (error instanceof JsonWithTypeNameError) {
        console.error("JSON 反序列化失败:", error.message);
    }
}
```

## 🧪 测试

### 单元测试

```typescript
import "reflect-metadata";
import { container, Injector } from "@decopro/core";

describe("UserService", () => {
    let injector: Injector;
    let userService: UserService;

    beforeEach(() => {
        // 创建测试容器
        injector = new Injector(container.createChildContainer());

        // 注册模拟依赖
        injector.injector.register(DatabaseService, {
            useValue: {
                connect: jest.fn().mockReturnValue("Mock connection")
            }
        });

        userService = injector.get(UserService);
    });

    it("should get users", () => {
        const users = userService.getUsers();
        expect(users).toHaveLength(3);
    });
});
```

### 集成测试

```typescript
describe("Application Bootstrap", () => {
    it("should initialize modules in correct order", async () => {
        const initOrder: string[] = [];

        @AppInit({ deps: [] })
        class ModuleA implements OnInit {
            async onInit() {
                initOrder.push("A");
            }
        }

        @AppInit({ deps: [ModuleA] })
        class ModuleB implements OnInit {
            async onInit() {
                initOrder.push("B");
            }
        }

        await bootstrap([ModuleB, ModuleA]);
        expect(initOrder).toEqual(["A", "B"]);
    });
});
```

## 🔍 调试

启用调试模式获取详细信息：

```typescript
await bootstrap([MyModule], {
    debug: true,
    timeout: 10000,
    errorStrategy: "warn"
});
```

调试输出示例：

```
[Bootstrap] Starting with 2 modules
[Bootstrap] Registered module: DatabaseModule
[Bootstrap] Registered module: UserModule
[Bootstrap] Found 2 app initializers
[Bootstrap] Prepared initializer: DatabaseModule
[Bootstrap] Prepared initializer: UserModule
[Bootstrap] Initialized: DatabaseModule
[Bootstrap] Initialized: UserModule
[Bootstrap] All modules initialized successfully
```

## 📈 性能优化

### 懒加载

```typescript
// 使用工厂进行懒加载
container.register(ExpensiveService, {
    useFactory: (container) => {
        console.log("创建昂贵的服务实例");
        return new ExpensiveService();
    }
});
```

### 单例模式

```typescript
import { singleton } from "@decopro/core";

@singleton()
@injectable()
export class ConfigService {
    // 这个服务在整个应用中只会有一个实例
}
```

### 作用域管理

```typescript
import { scoped, Lifecycle } from "@decopro/core";

@scoped(Lifecycle.ContainerScoped)
@injectable()
export class RequestScopedService {
    // 每个容器一个实例
}
```

## 🔗 与其他包集成

### 与 @decopro/rest 集成

```typescript
import { Controller } from "@decopro/rest";
import { injectable, inject } from "@decopro/core";

@Controller({ path: "/users" })
@injectable()
export class UserController {
    constructor(@inject(UserService) private userService: UserService) {}

    async getUsers() {
        return this.userService.getUsers();
    }
}
```

### 与 @decopro/commander 集成

```typescript
import { Commander, Action } from "@decopro/commander";
import { injectable, inject } from "@decopro/core";

@Commander({ name: "user" })
@injectable()
export class UserCommand {
    constructor(@inject(UserService) private userService: UserService) {}

    @Action({})
    async list() {
        const users = this.userService.getUsers();
        console.table(users);
    }
}
```

## 📄 许可证

ISC License - 详见 [LICENSE](../../LICENSE) 文件。

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](../../CONTRIBUTING.md) 了解详细信息。

---

<div align="center">
  <strong>🌟 如果这个包对你有帮助，请给我们一个 star！</strong>
</div>
