import { defineConfig, Options } from "tsup";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * 获取包名称
 */
function getPackageName(): string {
    try {
        const packageJson = JSON.parse(
            readFileSync(join(process.cwd(), "package.json"), "utf-8")
        );
        return packageJson.name || "unknown";
    } catch {
        return "unknown";
    }
}

/**
 * 基础 tsup 配置
 */
export function createTsupConfig(options: Partial<Options> = {}): Options {
    const packageName = getPackageName();
    const isProduction = process.env.NODE_ENV === "production";

    return defineConfig({
        // 基础配置
        entry: ["src/index.ts"],
        format: ["cjs", "esm"],
        dts: true,
        clean: true,
        sourcemap: true,
        target: "es2020",
        outDir: "dist",

        // 性能优化
        minify: isProduction,
        splitting: true,
        treeshake: true,
        bundle: true,

        // 外部依赖
        external: [
            "reflect-metadata",
            "tsyringe",
            "@decopro/core",
            // 常见的 Node.js 内置模块
            "fs",
            "path",
            "url",
            "util",
            "events",
            "stream",
            "buffer",
            "crypto",
            "os",
            "child_process",
            "cluster",
            "worker_threads"
        ],

        // esbuild 选项
        esbuildOptions(esbuildOptions) {
            esbuildOptions.conditions = ["module"];
            esbuildOptions.mainFields = ["module", "main"];
            esbuildOptions.platform = "node";

            // 生产环境优化
            if (isProduction) {
                esbuildOptions.drop = ["console", "debugger"];
                esbuildOptions.legalComments = "none";
            }
        },

        // 构建钩子
        onSuccess: async () => {
            console.log(`✅ ${packageName} build completed`);
        },

        // 允许覆盖配置
        ...options
    }) as Options;
}

/**
 * 创建库配置（用于发布到 npm 的包）
 */
export function createLibraryConfig(options: Partial<Options> = {}): Options {
    return createTsupConfig({
        format: ["cjs", "esm"],
        dts: true,
        splitting: false, // 库通常不需要代码分割
        ...options
    });
}

/**
 * 创建应用配置（用于可执行应用）
 */
export function createApplicationConfig(
    options: Partial<Options> = {}
): Options {
    return createTsupConfig({
        format: ["cjs"],
        dts: false, // 应用通常不需要类型定义
        minify: true,
        ...options
    });
}

/**
 * 创建 CLI 配置（用于命令行工具）
 */
export function createCliConfig(options: Partial<Options> = {}): Options {
    return createApplicationConfig({
        banner: {
            js: "#!/usr/bin/env node"
        },
        ...options
    });
}

export default createTsupConfig;
