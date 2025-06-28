#!/usr/bin/env node

const { performance } = require("perf_hooks");
const { readFileSync, writeFileSync, existsSync, readdirSync, statSync } = require("fs");
const { join } = require("path");
const { execSync } = require("child_process");

/**
 * 获取文件大小（字节）
 */
function getFileSize(filePath) {
  try {
    if (!existsSync(filePath)) {
      return 0;
    }
    const stats = statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

/**
 * 格式化文件大小
 */
function formatSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * 格式化时间
 */
function formatTime(ms) {
  if (ms < 0) return "失败";
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * 获取所有包
 */
function getPackages() {
  const packages = [];
  const packagesDir = "packages";
  
  if (!existsSync(packagesDir)) {
    console.log("packages 目录不存在");
    return packages;
  }
  
  try {
    const dirs = readdirSync(packagesDir);
    for (const dir of dirs) {
      const packagePath = join(packagesDir, dir);
      const packageJsonPath = join(packagePath, "package.json");
      
      if (existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
          packages.push({
            name: packageJson.name || dir,
            path: packagePath,
            distPath: join(packagePath, "dist"),
          });
        } catch (error) {
          console.warn(`无法解析 ${packageJsonPath}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.warn("扫描包目录失败:", error.message);
  }
  
  return packages;
}

/**
 * 分析包大小
 */
function analyzeBundleSize(packages) {
  const bundleSize = {};

  for (const pkg of packages) {
    const cjsPath = join(pkg.distPath, "index.js");
    const esmPath = join(pkg.distPath, "index.mjs");
    const dtsPath = join(pkg.distPath, "index.d.ts");

    bundleSize[pkg.name] = {
      cjs: getFileSize(cjsPath),
      esm: getFileSize(esmPath),
      dts: getFileSize(dtsPath),
    };
  }

  return bundleSize;
}

/**
 * 测量构建时间
 */
function measureBuildTime() {
  console.log("📦 测量构建时间...");
  const start = performance.now();
  
  try {
    execSync("pnpm run build", { stdio: "pipe" });
    const end = performance.now();
    return end - start;
  } catch (error) {
    console.error("构建失败:", error.message);
    return -1;
  }
}

/**
 * 测量测试时间
 */
function measureTestTime() {
  console.log("🧪 测量测试时间...");
  const start = performance.now();
  
  try {
    execSync("pnpm run test", { stdio: "pipe" });
    const end = performance.now();
    return end - start;
  } catch (error) {
    console.error("测试失败:", error.message);
    return -1;
  }
}

/**
 * 生成性能报告
 */
function generateReport(metrics) {
  let report = `# 性能分析报告\n\n`;
  report += `生成时间: ${metrics.timestamp}\n\n`;

  // 构建时间
  report += `## 构建性能\n\n`;
  report += `- 构建时间: ${formatTime(metrics.buildTime)}\n`;
  report += `- 测试时间: ${formatTime(metrics.testTime)}\n\n`;

  // 包大小
  report += `## 包大小分析\n\n`;
  report += `| 包名 | CommonJS | ES Module | TypeScript 定义 |\n`;
  report += `|------|----------|-----------|----------------|\n`;

  for (const [packageName, sizes] of Object.entries(metrics.bundleSize)) {
    report += `| ${packageName} | ${formatSize(sizes.cjs)} | ${formatSize(sizes.esm)} | ${formatSize(sizes.dts)} |\n`;
  }

  report += `\n## 优化建议\n\n`;

  // 分析并提供建议
  const totalCjsSize = Object.values(metrics.bundleSize).reduce((sum, sizes) => sum + sizes.cjs, 0);
  const totalEsmSize = Object.values(metrics.bundleSize).reduce((sum, sizes) => sum + sizes.esm, 0);

  if (totalCjsSize > 1024 * 1024) { // 1MB
    report += `- ⚠️ CommonJS 总大小较大 (${formatSize(totalCjsSize)})，考虑代码分割\n`;
  }

  if (totalEsmSize > 1024 * 1024) { // 1MB
    report += `- ⚠️ ES Module 总大小较大 (${formatSize(totalEsmSize)})，考虑 tree-shaking 优化\n`;
  }

  if (metrics.buildTime > 30000) { // 30秒
    report += `- ⚠️ 构建时间较长 (${formatTime(metrics.buildTime)})，考虑并行构建优化\n`;
  }

  if (metrics.testTime > 60000) { // 1分钟
    report += `- ⚠️ 测试时间较长 (${formatTime(metrics.testTime)})，考虑测试并行化\n`;
  }

  return report;
}

/**
 * 主函数
 */
async function main() {
  console.log("🚀 开始性能分析...\n");

  const packages = getPackages();
  console.log(`发现 ${packages.length} 个包`);

  // 测量各项指标
  const buildTime = measureBuildTime();
  const testTime = measureTestTime();
  
  console.log("📊 分析包大小...");
  const bundleSize = analyzeBundleSize(packages);

  const metrics = {
    buildTime,
    bundleSize,
    testTime,
    timestamp: new Date().toISOString(),
  };

  // 生成报告
  const report = generateReport(metrics);
  
  // 保存报告
  const reportPath = "performance-report.md";
  writeFileSync(reportPath, report);
  
  // 保存原始数据
  const dataPath = "performance-metrics.json";
  writeFileSync(dataPath, JSON.stringify(metrics, null, 2));

  console.log(`\n✅ 性能分析完成！`);
  console.log(`📄 报告已保存到: ${reportPath}`);
  console.log(`📊 数据已保存到: ${dataPath}`);
  
  // 输出简要信息
  console.log(`\n📈 性能概览:`);
  console.log(`- 构建时间: ${formatTime(buildTime)}`);
  console.log(`- 测试时间: ${formatTime(testTime)}`);
  
  const totalSize = Object.values(bundleSize).reduce(
    (sum, sizes) => sum + sizes.cjs + sizes.esm + sizes.dts, 
    0
  );
  console.log(`- 总包大小: ${formatSize(totalSize)}`);
}

// 运行分析
if (require.main === module) {
  main().catch(console.error);
}
