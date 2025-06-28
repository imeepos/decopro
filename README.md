# 🚀 DecoPro Framework

[![CI](https://github.com/your-org/decopro/workflows/CI/badge.svg)](https://github.com/your-org/decopro/actions)
[![codecov](https://codecov.io/gh/your-org/decopro/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/decopro)
[![npm version](https://badge.fury.io/js/%40decopro%2Fcore.svg)](https://badge.fury.io/js/%40decopro%2Fcore)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

DecoPro 是一个现代化的 TypeScript 框架，基于依赖注入和模块化设计，提供了强大的工具集来构建可扩展的应用程序。

## ✨ 特性

- 🏗️ **模块化架构**: 基于依赖注入的松耦合设计
- 🔧 **类型安全**: 完整的 TypeScript 支持和类型检查
- 🚀 **高性能**: 优化的构建和运行时性能
- 🧪 **测试友好**: 内置测试工具和模拟支持
- 📦 **Monorepo**: 使用 pnpm workspace 管理多包
- 🔄 **热重载**: 开发时的快速反馈
- 📚 **丰富的生态**: 多个专用包支持不同场景

## 📦 包结构

| 包名                                       | 描述                        | 版本                                                    |
| ------------------------------------------ | --------------------------- | ------------------------------------------------------- |
| [@decopro/core](./packages/core)           | 核心依赖注入和模块系统      | ![npm](https://img.shields.io/npm/v/@decopro/core)      |
| [@decopro/cli](./packages/cli)             | 命令行工具                  | ![npm](https://img.shields.io/npm/v/@decopro/cli)       |
| [@decopro/commander](./packages/commander) | 命令行应用框架              | ![npm](https://img.shields.io/npm/v/@decopro/commander) |
| [@decopro/rest](./packages/rest)           | REST API 框架               | ![npm](https://img.shields.io/npm/v/@decopro/rest)      |
| [@decopro/orm](./packages/orm)             | 对象关系映射                | ![npm](https://img.shields.io/npm/v/@decopro/orm)       |
| [@decopro/mcp](./packages/mcp)             | Model Context Protocol 支持 | ![npm](https://img.shields.io/npm/v/@decopro/mcp)       |
| [@decopro/dpml](./packages/dpml)           | 动态提示标记语言            | ![npm](https://img.shields.io/npm/v/@decopro/dpml)      |
| [@decopro/test](./packages/test)           | 测试工具                    | ![npm](https://img.shields.io/npm/v/@decopro/test)      |

## 🚀 快速开始

### 安装

```bash
# 使用 npm
npm install @decopro/core reflect-metadata

# 使用 pnpm
pnpm add @decopro/core reflect-metadata

# 使用 yarn
yarn add @decopro/core reflect-metadata
```

### 基础用法

#### 1. REST API 示例

```typescript
import "reflect-metadata";
import { bootstrap, Input } from "@decopro/core";
import { Controller } from "@decopro/rest";

@Controller({ path: "/api" })
export class HelloController {
    @Input({})
    message: string = "Hello, DecoPro!";

    async getHello() {
        return { message: this.message };
    }
}

async function main() {
    await bootstrap([HelloController]);
}

main();
```

#### 2. 命令行应用示例

```typescript
import "reflect-metadata";
import { bootstrap, Input } from "@decopro/core";
import {
    Commander,
    Argument,
    Option,
    Action,
    CommanderAppInit
} from "@decopro/commander";
import { z } from "zod";

@Commander({
    name: "serve",
    description: "启动开发服务器"
})
export class ServeCommand {
    @Argument({
        name: "environment",
        description: "运行环境"
    })
    @Input({})
    environment: string;

    @Option({
        flags: "--port <port>",
        description: "端口号",
        zod: z.coerce.number().default(3000)
    })
    @Input({})
    port: number;

    @Option({
        flags: "--host <host>",
        description: "主机地址",
        zod: z.string().default("localhost")
    })
    @Input({})
    host: string;

    @Action({})
    async execute() {
        console.log(`🚀 服务器启动在 http://${this.host}:${this.port}`);
        console.log(`📦 环境: ${this.environment}`);
    }
}

async function main() {
    await bootstrap([CommanderAppInit, ServeCommand]);
}

main();
```

## 🏗️ 核心概念

### 依赖注入

DecoPro 使用基于装饰器的依赖注入系统：

```typescript
import { injectable, inject, Injector } from "@decopro/core";

@injectable()
export class DatabaseService {
    connect() {
        return "Connected to database";
    }
}

@injectable()
export class UserService {
    constructor(@inject(DatabaseService) private db: DatabaseService) {}

    getUsers() {
        this.db.connect();
        return ["user1", "user2"];
    }
}
```

### 模块系统

使用 `@AppInit` 装饰器创建应用模块：

```typescript
import { AppInit, OnInit, inject, Injector } from "@decopro/core";

@AppInit({
    deps: [] // 依赖的其他模块
})
export class MyAppModule implements OnInit {
    constructor(@inject(Injector) private injector: Injector) {}

    async onInit(): Promise<void> {
        console.log("模块初始化完成");
    }
}
```

### 序列化支持

内置的 JSON 序列化和反序列化：

```typescript
import { Input, Injector } from "@decopro/core";

export class User {
    @Input({})
    name: string;

    @Input({})
    age: number;
}

const injector = new Injector(container);
const user = new User();
user.name = "张三";
user.age = 25;

// 序列化
const json = injector.toJson(user, User);
console.log(json); // { __typeName: "User", name: "张三", age: 25 }

// 反序列化
const restored = injector.fromJson(json);
console.log(restored instanceof User); // true
```

## 🛠️ 开发指南

### 环境要求

- Node.js >= 18
- pnpm >= 9
- TypeScript >= 5.0

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/your-org/decopro.git
cd decopro

# 安装依赖
pnpm install

# 构建所有包
pnpm run build

# 运行测试
pnpm run test

# 启动开发模式
pnpm run dev
```

### 使用 Docker

```bash
# 构建开发环境
docker-compose -f docker-compose.dev.yml up --build

# 或者直接使用 Docker
docker build -f Dockerfile.dev -t decopro-dev .
docker run -p 3000:3000 -v $(pwd):/app decopro-dev
```

### 代码规范

项目使用 ESLint 和 Prettier 进行代码格式化：

```bash
# 检查代码格式
pnpm run lint

# 自动修复
pnpm run lint:fix

# 格式化代码
pnpm run format
```

### 测试

```bash
# 运行所有测试
pnpm run test

# 监听模式
pnpm run test:watch

# 生成覆盖率报告
pnpm run test:coverage
```

## 📚 文档

- [核心概念](./packages/core/README.md)
- [CLI 工具](./packages/cli/README.md)
- [REST API](./packages/rest/README.md)
- [命令行框架](./packages/commander/README.md)
- [ORM 使用](./packages/orm/README.md)
- [MCP 协议](./packages/mcp/README.md)

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详细信息。

### 提交代码

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 开发流程

```bash
# 创建新分支
git checkout -b feature/new-feature

# 进行开发...

# 运行预提交检查
pnpm run precommit

# 提交代码
git add .
git commit -m "feat: add new feature"

# 推送并创建 PR
git push origin feature/new-feature
```

## 🔧 配置

### TypeScript 配置

项目使用严格的 TypeScript 配置，支持：

- 装饰器元数据
- 严格类型检查
- 项目引用
- 增量编译

### 构建配置

使用 Turbo 进行高效的 monorepo 构建：

- 并行构建
- 智能缓存
- 依赖图优化

## 🚀 部署

### 生产构建

```bash
# 构建所有包
pnpm run build

# 运行 CI 检查
pnpm run ci
```

### 发布

项目使用 Changesets 进行版本管理：

```bash
# 添加变更集
pnpm changeset

# 发布新版本
pnpm run upgrade
```

## 📄 许可证

本项目采用 [ISC 许可证](./LICENSE)。

## 🙏 致谢

感谢所有贡献者和以下开源项目：

- [tsyringe](https://github.com/microsoft/tsyringe) - 依赖注入容器
- [turbo](https://turbo.build/) - 高性能构建系统
- [pnpm](https://pnpm.io/) - 快速、节省磁盘空间的包管理器

---

<div align="center">
  <strong>🌟 如果这个项目对你有帮助，请给我们一个 star！</strong>
</div>
