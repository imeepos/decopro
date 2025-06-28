import "reflect-metadata";
import {
    Commander,
    Option,
    Argument,
    Action,
    ValidatedOption,
    ValidatedArgument,
    ValidatedCommander,
    CommonSchemas,
    createOptionConfig,
    createArgumentConfig
} from "../src/index";
import { z } from "zod";

// ============================================================================
// 基础用法示例
// ============================================================================

@Commander({
    name: "serve",
    alias: "s",
    description: "启动开发服务器",
    summary: "快速启动本地开发服务器"
})
export class ServeCommand {
    @Argument({
        name: "[environment]",
        description: "运行环境 (development, production, test)",
        defaultValue: "development",
        zod: CommonSchemas.environment
    })
    environment: string;

    @Option({
        flags: "--port <port>",
        description: "服务器端口号",
        zod: CommonSchemas.port.default(3000)
    })
    port: number;

    @Option({
        flags: "--host <host>",
        description: "服务器主机地址",
        zod: CommonSchemas.host.default("localhost")
    })
    host: string;

    @Option({
        flags: "--watch",
        description: "启用文件监听模式",
        zod: CommonSchemas.boolean.default(false)
    })
    watch: boolean;

    @Action({
        description: "启动服务器",
        priority: 1
    })
    async start() {
        console.log(`🚀 服务器启动在 http://${this.host}:${this.port}`);
        console.log(`📦 环境: ${this.environment}`);
        console.log(`👀 监听模式: ${this.watch ? '开启' : '关闭'}`);
    }
}

// ============================================================================
// 高级用法示例 - 使用验证装饰器
// ============================================================================

@ValidatedCommander({
    name: "deploy",
    description: "部署应用到指定环境",
    alias: "d"
})
export class DeployCommand {
    @ValidatedArgument({
        name: "<target>",
        description: "部署目标环境",
        zod: z.enum(["staging", "production"])
    })
    target: "staging" | "production";

    @ValidatedOption({
        flags: "--config <path>",
        description: "配置文件路径",
        zod: CommonSchemas.filePath
    })
    configPath: string;

    @ValidatedOption({
        flags: "--dry-run",
        description: "仅模拟部署，不实际执行",
        zod: CommonSchemas.boolean.default(false)
    })
    dryRun: boolean;

    @ValidatedOption({
        flags: "--timeout <seconds>",
        description: "部署超时时间（秒）",
        zod: CommonSchemas.positiveInt.default(300)
    })
    timeout: number;

    @Action({
        description: "执行部署",
        priority: 1
    })
    async deploy() {
        if (this.dryRun) {
            console.log(`🔍 模拟部署到 ${this.target} 环境`);
        } else {
            console.log(`🚀 开始部署到 ${this.target} 环境`);
        }
        
        console.log(`📁 配置文件: ${this.configPath}`);
        console.log(`⏱️  超时时间: ${this.timeout}秒`);
    }
}

// ============================================================================
// 复杂用法示例 - 多个动作和自定义验证
// ============================================================================

const customEmailSchema = z.string().email().refine(
    (email) => email.endsWith('@company.com'),
    { message: "邮箱必须是公司域名" }
);

@Commander({
    name: "user",
    description: "用户管理命令"
})
export class UserCommand {
    @Option({
        flags: "--email <email>",
        description: "用户邮箱地址",
        zod: customEmailSchema
    })
    email: string;

    @Option({
        flags: "--role <role>",
        description: "用户角色",
        zod: z.enum(["admin", "user", "guest"]).default("user")
    })
    role: "admin" | "user" | "guest";

    @Option({
        flags: "--active",
        description: "用户是否激活",
        zod: CommonSchemas.boolean.default(true)
    })
    active: boolean;

    @Action({
        description: "创建新用户",
        priority: 1
    })
    async create() {
        console.log(`👤 创建用户: ${this.email}`);
        console.log(`🔑 角色: ${this.role}`);
        console.log(`✅ 状态: ${this.active ? '激活' : '未激活'}`);
    }

    @Action({
        description: "更新用户信息",
        priority: 2
    })
    async update() {
        console.log(`📝 更新用户: ${this.email}`);
        console.log(`🔄 新角色: ${this.role}`);
    }

    @Action({
        description: "删除用户",
        priority: 3
    })
    async delete() {
        console.log(`🗑️  删除用户: ${this.email}`);
    }
}

// ============================================================================
// 工具函数使用示例
// ============================================================================

// 使用工具函数创建配置
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

@Commander({
    name: "build",
    description: "构建项目"
})
export class BuildCommand {
    @Argument(envArgument)
    environment: string;

    @Option(portOption)
    port: number;

    @Option({
        flags: "--output <dir>",
        description: "输出目录",
        zod: CommonSchemas.filePath.default("./dist")
    })
    outputDir: string;

    @Option({
        flags: "--minify",
        description: "是否压缩代码",
        zod: CommonSchemas.boolean.default(true)
    })
    minify: boolean;

    @Action({
        description: "执行构建"
    })
    async build() {
        console.log(`🔨 开始构建项目`);
        console.log(`📦 环境: ${this.environment}`);
        console.log(`📁 输出目录: ${this.outputDir}`);
        console.log(`🗜️  代码压缩: ${this.minify ? '开启' : '关闭'}`);
    }
}

// ============================================================================
// 使用示例
// ============================================================================

export const commands = [
    ServeCommand,
    DeployCommand,
    UserCommand,
    BuildCommand
];

// 在实际应用中，这些命令会通过 CommanderAppInit 自动注册和处理
console.log("命令装饰器重构完成！");
console.log("新增功能:");
console.log("- 更强的类型安全");
console.log("- 内置验证功能");
console.log("- 常用 Zod 模式");
console.log("- 工具函数支持");
console.log("- 更好的错误处理");
