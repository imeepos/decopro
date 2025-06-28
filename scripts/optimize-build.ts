#!/usr/bin/env tsx

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

interface OptimizationConfig {
    enableParallelBuild: boolean;
    enableTreeShaking: boolean;
    enableMinification: boolean;
    enableSourceMaps: boolean;
    enableCodeSplitting: boolean;
    targetEnvironment: "development" | "production";
}

/**
 * 默认优化配置
 */
const defaultConfig: OptimizationConfig = {
    enableParallelBuild: true,
    enableTreeShaking: true,
    enableMinification: process.env.NODE_ENV === "production",
    enableSourceMaps: true,
    enableCodeSplitting: true,
    targetEnvironment: (process.env.NODE_ENV as any) || "development"
};

/**
 * 获取包信息
 */
function getPackageInfo(packagePath: string) {
    const packageJsonPath = join(packagePath, "package.json");
    if (!existsSync(packageJsonPath)) {
        throw new Error(`Package.json not found at ${packageJsonPath}`);
    }
    return JSON.parse(readFileSync(packageJsonPath, "utf-8"));
}

/**
 * 更新 tsup 配置以启用优化
 */
function optimizeTsupConfig(packagePath: string, config: OptimizationConfig) {
    const tsupConfigPath = join(packagePath, "tsup.config.ts");

    if (!existsSync(tsupConfigPath)) {
        console.log(`⚠️ 未找到 tsup.config.ts，为 ${packagePath} 创建默认配置`);
        createDefaultTsupConfig(packagePath, config);
        return;
    }

    console.log(`🔧 优化 ${packagePath} 的构建配置`);

    // 读取现有配置
    let configContent = readFileSync(tsupConfigPath, "utf-8");

    // 应用优化
    if (config.enableMinification) {
        configContent = configContent.replace(
            /minify:\s*false/g,
            `minify: ${config.targetEnvironment === "production"}`
        );
    }

    if (config.enableTreeShaking) {
        if (!configContent.includes("treeshake")) {
            configContent = configContent.replace(
                /clean:\s*true,?/,
                "clean: true,\n    treeshake: true,"
            );
        }
    }

    if (config.enableCodeSplitting) {
        if (!configContent.includes("splitting")) {
            configContent = configContent.replace(
                /clean:\s*true,?/,
                "clean: true,\n    splitting: true,"
            );
        }
    }

    writeFileSync(tsupConfigPath, configContent);
}

/**
 * 创建默认的 tsup 配置
 */
function createDefaultTsupConfig(
    packagePath: string,
    config: OptimizationConfig
) {
    const packageInfo = getPackageInfo(packagePath);
    const isCli = packageInfo.bin !== undefined;

    const configContent = `import { ${isCli ? "createCliConfig" : "createLibraryConfig"} } from "../../tsup.config.base";

export default ${isCli ? "createCliConfig" : "createLibraryConfig"}({
  entry: ["src/index.ts"],
  minify: ${config.enableMinification},
  treeshake: ${config.enableTreeShaking},
  splitting: ${config.enableCodeSplitting},
  sourcemap: ${config.enableSourceMaps},
});
`;

    writeFileSync(join(packagePath, "tsup.config.ts"), configContent);
}

/**
 * 优化 package.json 脚本
 */
function optimizePackageScripts(
    packagePath: string,
    config: OptimizationConfig
) {
    const packageJsonPath = join(packagePath, "package.json");
    const packageJson = getPackageInfo(packagePath);

    // 添加或更新构建脚本
    if (!packageJson.scripts) {
        packageJson.scripts = {};
    }

    // 基础脚本
    packageJson.scripts.build = "tsup";
    packageJson.scripts["build:watch"] = "tsup --watch";
    packageJson.scripts.clean =
        "rm -rf ./.turbo && rm -rf ./dist && rm -rf ./node_modules";

    // 开发脚本
    if (config.targetEnvironment === "development") {
        packageJson.scripts.dev = "tsup --watch --sourcemap";
    }

    // 生产脚本
    if (config.targetEnvironment === "production") {
        packageJson.scripts["build:prod"] = "NODE_ENV=production tsup";
    }

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

/**
 * 优化 Turbo 配置
 */
function optimizeTurboConfig(config: OptimizationConfig) {
    const turboConfigPath = "turbo.json";

    if (!existsSync(turboConfigPath)) {
        console.log("⚠️ 未找到 turbo.json，跳过 Turbo 优化");
        return;
    }

    console.log("🚀 优化 Turbo 配置");

    const turboConfig = JSON.parse(readFileSync(turboConfigPath, "utf-8"));

    // 启用并行构建
    if (config.enableParallelBuild) {
        turboConfig.tasks = turboConfig.tasks || {};

        // 优化构建任务
        turboConfig.tasks.build = {
            dependsOn: ["^build"],
            outputs: ["dist/**"],
            env: ["NODE_ENV"]
        };

        // 优化测试任务
        turboConfig.tasks.test = {
            dependsOn: ["^build"],
            outputs: ["coverage/**"],
            inputs: ["src/**/*.ts", "src/**/*.test.ts", "jest.config.js"]
        };

        // 添加缓存配置
        turboConfig.globalDependencies = [
            "tsconfig.json",
            "turbo.json",
            "pnpm-workspace.yaml",
            "tsup.config.base.ts"
        ];
    }

    writeFileSync(turboConfigPath, JSON.stringify(turboConfig, null, 2));
}

/**
 * 分析依赖并提供优化建议
 */
function analyzeDependencies() {
    console.log("📊 分析依赖关系...");

    try {
        console.log("📦 依赖分析结果:");

        // 检查重复依赖
        const duplicates = findDuplicateDependencies();
        if (duplicates.length > 0) {
            console.log("⚠️ 发现重复依赖:");
            duplicates.forEach((dep) => console.log(`  - ${dep}`));
            console.log("💡 建议: 使用 pnpm dedupe 去重");
        }

        // 检查未使用的依赖
        console.log("🔍 检查未使用的依赖...");
        try {
            execSync("npx depcheck", { stdio: "inherit" });
        } catch {
            console.log("💡 建议: 安装 depcheck 来检查未使用的依赖");
        }
    } catch (error) {
        console.log("⚠️ 依赖分析失败:", error);
    }
}

/**
 * 查找重复依赖
 */
function findDuplicateDependencies(): string[] {
    try {
        const output = execSync("pnpm list --depth=Infinity --json", {
            encoding: "utf-8"
        });
        const data = JSON.parse(output);

        const allDeps = new Map<string, Set<string>>();

        function collectDeps(deps: any, path = "") {
            if (!deps) return;

            for (const [name, info] of Object.entries(deps)) {
                if (
                    typeof info === "object" &&
                    info !== null &&
                    "version" in info
                ) {
                    const version = (info as any).version;
                    if (!allDeps.has(name)) {
                        allDeps.set(name, new Set());
                    }
                    allDeps.get(name)!.add(version);

                    if ((info as any).dependencies) {
                        collectDeps(
                            (info as any).dependencies,
                            `${path}/${name}`
                        );
                    }
                }
            }
        }

        collectDeps(data.dependencies);

        return Array.from(allDeps.entries())
            .filter(([_, versions]) => versions.size > 1)
            .map(
                ([name, versions]) =>
                    `${name} (${Array.from(versions).join(", ")})`
            );
    } catch {
        return [];
    }
}

/**
 * 运行构建优化
 */
async function runOptimization(config: OptimizationConfig) {
    console.log("🚀 开始构建优化...\n");

    // 获取所有包
    const packages = execSync("find packages -name package.json -type f")
        .toString()
        .trim()
        .split("\n")
        .map((path) => path.replace("/package.json", ""))
        .filter((path) => path !== "packages");

    console.log(`发现 ${packages.length} 个包`);

    // 优化每个包
    for (const packagePath of packages) {
        try {
            optimizeTsupConfig(packagePath, config);
            optimizePackageScripts(packagePath, config);
        } catch (error) {
            console.error(`❌ 优化 ${packagePath} 失败:`, error);
        }
    }

    // 优化 Turbo 配置
    optimizeTurboConfig(config);

    // 分析依赖
    analyzeDependencies();

    console.log("\n✅ 构建优化完成！");
    console.log("\n💡 优化建议:");
    console.log("- 运行 'pnpm run build' 测试构建");
    console.log("- 运行 'pnpm run performance-analysis' 分析性能");
    console.log("- 考虑启用 Turbo 远程缓存以加速 CI/CD");
}

/**
 * 主函数
 */
async function main() {
    const args = process.argv.slice(2);
    const config: OptimizationConfig = { ...defaultConfig };

    // 解析命令行参数
    for (const arg of args) {
        switch (arg) {
            case "--production":
                config.targetEnvironment = "production";
                config.enableMinification = true;
                break;
            case "--development":
                config.targetEnvironment = "development";
                config.enableMinification = false;
                break;
            case "--no-parallel":
                config.enableParallelBuild = false;
                break;
            case "--no-treeshake":
                config.enableTreeShaking = false;
                break;
            case "--no-sourcemap":
                config.enableSourceMaps = false;
                break;
            case "--help":
                console.log(`
构建优化工具

用法: tsx scripts/optimize-build.ts [选项]

选项:
  --production     生产环境优化
  --development    开发环境优化
  --no-parallel    禁用并行构建
  --no-treeshake   禁用 tree-shaking
  --no-sourcemap   禁用 source map
  --help           显示帮助信息
        `);
                return;
        }
    }

    console.log("🔧 构建优化配置:");
    console.log(JSON.stringify(config, null, 2));
    console.log();

    await runOptimization(config);
}

// 运行优化
if (require.main === module) {
    main().catch(console.error);
}
