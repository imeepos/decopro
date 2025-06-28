import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import { createHash } from "crypto";

export interface Knowledge {
    package_name: string;
    package_version: string;
    filename: string;
    docs: string;
    hash: string;
    category: string;
    tags: string[];
    examples: string[];
    dependencies: string[];
}

export interface PackageDocumentation {
    package_name: string;
    package_version: string;
    description: string;
    main_exports: string[];
    api_reference: string;
    usage_examples: string[];
    architecture_overview: string;
    dependencies: string[];
    knowledges: Knowledge[];
}

export interface ProjectDocumentation {
    project_name: string;
    version: string;
    description: string;
    architecture: string;
    packages: PackageDocumentation[];
    quick_start: string;
    api_overview: string;
    examples: string[];
}
export function generateTSKnowledges(projectRoot: string): Knowledge[] {
    const host: ts.LanguageServiceHost = {
        getCurrentDirectory: () => projectRoot,
        getDefaultLibFileName: (options) => ts.getDefaultLibFileName(options),
        getCompilationSettings: () => ts.getDefaultCompilerOptions(),
        getScriptFileNames: () => getAllTSFiles(projectRoot),
        getScriptSnapshot: (fileName) => {
            if (fs.existsSync(fileName)) {
                return ts.ScriptSnapshot.fromString(
                    fs.readFileSync(fileName, "utf-8")
                );
            }
            return undefined;
        },
        readFile: (path) =>
            fs.existsSync(path) ? fs.readFileSync(path, "utf-8") : undefined,
        fileExists: (path) => fs.existsSync(path),
        getScriptVersion: () => "1.0",
        getScriptKind: (fileName) => {
            const ext = path.extname(fileName).toLowerCase();
            return ext === ".tsx"
                ? ts.ScriptKind.TSX
                : ext === ".ts"
                  ? ts.ScriptKind.TS
                  : ts.ScriptKind.Unknown;
        }
    };

    const service = ts.createLanguageService(host);
    const program = service.getProgram();

    if (!program) {
        throw new Error("Failed to create TypeScript program");
    }

    const pkg = require(path.join(projectRoot, "package.json"));

    const knowledges: Knowledge[] = [];
    const checker = program.getTypeChecker();

    // 处理所有文件
    const files = host.getScriptFileNames();
    files.forEach((file) => {
        if (file.endsWith("d.ts")) {
            return;
        }
        if (file.includes("node_modules")) {
            return;
        }
        const sourceFile = program.getSourceFile(file);
        if (!sourceFile) return;

        const fileOuptput: string[] = [];

        // 遍历 AST 节点
        ts.forEachChild(sourceFile, (node) => {
            visitNode(node, fileOuptput, checker, sourceFile);
        });

        const hash = createHash("md5").update(sourceFile.text).digest("hex");
        const relativePath = path.relative(projectRoot, file);

        // 分析文件类型和标签
        const category = determineFileCategory(relativePath, sourceFile);
        const tags = extractFileTags(sourceFile, relativePath);
        const examples = extractCodeExamples(sourceFile);
        const dependencies = extractFileDependencies(sourceFile);

        const knowledge: Knowledge = {
            package_name: pkg.name,
            package_version: pkg.version,
            filename: relativePath,
            docs: fileOuptput.join("\n"),
            hash: hash,
            category: category,
            tags: tags,
            examples: examples,
            dependencies: dependencies
        };
        knowledges.push(knowledge);
    });

    // 写入输出文件
    return knowledges;
}

function visitNode(
    node: ts.Node,
    output: string[],
    checker: ts.TypeChecker,
    sourceFile: ts.SourceFile,
    indentLevel: number = 0
) {
    const indent = "  ".repeat(indentLevel);

    // 处理类声明
    if (ts.isClassDeclaration(node) && node.name) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (!symbol) return;

        const className = node.name.getText(sourceFile);
        const docs = getDocumentation(symbol, checker);

        output.push(`${indent}### Class: \`${className}\``);
        if (docs) output.push(`${indent}${docs}\n`);

        // 处理类成员
        node.members.forEach((member) => {
            visitNode(member, output, checker, sourceFile, indentLevel + 1);
        });
        output.push("");
    }

    // 处理接口声明
    else if (ts.isInterfaceDeclaration(node) && node.name) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (!symbol) return;

        const interfaceName = node.name.getText(sourceFile);
        const docs = getDocumentation(symbol, checker);

        output.push(`${indent}### Interface: \`${interfaceName}\``);
        if (docs) output.push(`${indent}${docs}\n`);

        // 处理接口成员
        node.members.forEach((member) => {
            visitNode(member, output, checker, sourceFile, indentLevel + 1);
        });
        output.push("");
    }

    // 处理函数声明
    else if (ts.isFunctionDeclaration(node) && node.name) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (!symbol) return;

        const functionName = node.name.getText(sourceFile);
        const docs = getDocumentation(symbol, checker);
        const signature = getFunctionSignature(node, sourceFile);

        output.push(`${indent}### Function: \`${functionName}${signature}\``);
        if (docs) output.push(`${indent}${docs}\n`);
    }

    // 处理方法声明
    else if (ts.isMethodDeclaration(node) && node.name) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (!symbol) return;

        const methodName = node.name.getText(sourceFile);
        const docs = getDocumentation(symbol, checker);
        const signature = getFunctionSignature(node, sourceFile);

        output.push(`${indent}- Method: \`${methodName}${signature}\``);
        if (docs)
            output.push(
                `${indent}  ${docs.replace(/\n/g, "\n" + indent + "  ")}`
            );
    }

    // 处理属性声明
    else if (ts.isPropertyDeclaration(node) && node.name) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (!symbol) return;

        const propName = node.name.getText(sourceFile);
        const docs = getDocumentation(symbol, checker);
        const type = node.type ? node.type.getText(sourceFile) : "any";

        output.push(`${indent}- Property: \`${propName}: ${type}\``);
        if (docs)
            output.push(
                `${indent}  ${docs.replace(/\n/g, "\n" + indent + "  ")}`
            );
    }

    // 处理构造函数
    else if (ts.isConstructorDeclaration(node)) {
        const signature = getFunctionSignature(node, sourceFile);
        output.push(`${indent}- Constructor: \`constructor${signature}\``);

        // 处理参数
        node.parameters.forEach((param) => {
            if (ts.isParameter(param) && param.name) {
                const paramSymbol = checker.getSymbolAtLocation(param.name);
                if (!paramSymbol) return;

                const paramName = param.name.getText(sourceFile);
                const paramType = param.type?.getText(sourceFile) || "any";
                const paramDocs = getDocumentation(paramSymbol, checker);

                output.push(
                    `${indent}  - Parameter: \`${paramName}: ${paramType}\``
                );
                if (paramDocs)
                    output.push(
                        `${indent}    ${paramDocs.replace(/\n/g, "\n" + indent + "    ")}`
                    );
            }
        });
    }
    // 处理接口属性签名
    else if (ts.isPropertySignature(node) && node.name) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (!symbol) return;

        const propName = node.name.getText(sourceFile);
        const docs = getDocumentation(symbol, checker);
        const type = node.type ? node.type.getText(sourceFile) : "any";
        const optional = node.questionToken ? "?" : "";

        output.push(`${indent}- ${propName}${optional}: ${type}`);
        if (docs)
            output.push(
                `${indent}  ${docs.replace(/\n/g, "\n" + indent + "  ")}`
            );
    }

    // 处理类型别名
    else if (ts.isTypeAliasDeclaration(node) && node.name) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (!symbol) return;

        const typeName = node.name.getText(sourceFile);
        const docs = getDocumentation(symbol, checker);
        const type = node.type.getText(sourceFile);

        output.push(`${indent}### Type Alias: \`${typeName} = ${type}\``);
        if (docs) output.push(`${indent}${docs}\n`);
    }

    // 处理枚举
    else if (ts.isEnumDeclaration(node) && node.name) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (!symbol) return;

        const enumName = node.name.getText(sourceFile);
        const docs = getDocumentation(symbol, checker);

        output.push(`${indent}### Enum: \`${enumName}\``);
        if (docs) output.push(`${indent}${docs}\n`);

        // 处理枚举成员
        node.members.forEach((member) => {
            if (member.name) {
                const memberSymbol = checker.getSymbolAtLocation(member.name);
                if (!memberSymbol) return;

                const memberName = member.name.getText(sourceFile);
                const memberDocs = getDocumentation(memberSymbol, checker);

                output.push(`${indent}  - Member: \`${memberName}\``);
                if (memberDocs)
                    output.push(
                        `${indent}    ${memberDocs.replace(/\n/g, "\n" + indent + "    ")}`
                    );
            }
        });
    } else {
        // console.log(ts.SyntaxKind[node.kind])
    }
}

// 获取函数/方法的签名
function getFunctionSignature(
    node: ts.FunctionLikeDeclaration,
    sourceFile: ts.SourceFile
): string {
    const parameters = node.parameters.map((param) => {
        const name = param.name.getText(sourceFile);
        const type = param.type?.getText(sourceFile) || "any";
        const optional = param.questionToken ? "?" : "";
        return `${name}${optional}: ${type}`;
    });

    const returnType = node.type?.getText(sourceFile) || "void";
    return `(${parameters.join(", ")}): ${returnType}`;
}

// 获取文档注释
function getDocumentation(symbol: ts.Symbol, checker: ts.TypeChecker): string {
    const docs = ts.displayPartsToString(
        symbol.getDocumentationComment(checker)
    );
    return docs ? `\n${docs}\n` : "";
}

// 获取所有 TypeScript 文件
function getAllTSFiles(dir: string): string[] {
    return fs.readdirSync(dir).flatMap((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            return getAllTSFiles(fullPath);
        } else if (/\.tsx?$/.test(file)) {
            return [fullPath];
        }
        return [];
    });
}

// 确定文件类别
function determineFileCategory(filePath: string, sourceFile: ts.SourceFile): string {
    if (filePath.includes("__tests__") || filePath.includes(".test.") || filePath.includes(".spec.")) {
        return "test";
    }
    if (filePath.includes("examples") || filePath.includes("demo")) {
        return "example";
    }
    if (filePath.includes("types") || filePath.includes("interfaces")) {
        return "types";
    }
    if (filePath.includes("utils") || filePath.includes("helpers")) {
        return "utility";
    }
    if (filePath.includes("decorators")) {
        return "decorator";
    }
    if (filePath.includes("orm") || filePath.includes("database")) {
        return "orm";
    }
    if (filePath.includes("rest") || filePath.includes("api")) {
        return "api";
    }
    if (filePath.includes("core")) {
        return "core";
    }

    // 基于文件内容分析
    const text = sourceFile.getFullText();
    if (text.includes("@Entity") || text.includes("@Table")) {
        return "entity";
    }
    if (text.includes("@Injectable") || text.includes("@Service")) {
        return "service";
    }
    if (text.includes("@Controller") || text.includes("@RestController")) {
        return "controller";
    }
    if (text.includes("interface") && text.includes("export")) {
        return "interface";
    }
    if (text.includes("class") && text.includes("export")) {
        return "class";
    }

    return "module";
}

// 提取文件标签
function extractFileTags(sourceFile: ts.SourceFile, filePath: string): string[] {
    const tags: string[] = [];
    const text = sourceFile.getFullText();

    // 基于路径的标签
    if (filePath.includes("orm")) tags.push("orm");
    if (filePath.includes("rest")) tags.push("rest", "api");
    if (filePath.includes("core")) tags.push("core");
    if (filePath.includes("cli")) tags.push("cli", "command");
    if (filePath.includes("test")) tags.push("test");

    // 基于内容的标签
    if (text.includes("@Entity")) tags.push("entity", "database");
    if (text.includes("@Column")) tags.push("column", "database");
    if (text.includes("@OneToMany") || text.includes("@ManyToOne")) tags.push("relationship", "database");
    if (text.includes("@Injectable")) tags.push("dependency-injection", "service");
    if (text.includes("@Controller")) tags.push("controller", "api");
    if (text.includes("QueryBuilder")) tags.push("query-builder", "database");
    if (text.includes("Repository")) tags.push("repository", "database");
    if (text.includes("async") || text.includes("Promise")) tags.push("async");
    if (text.includes("interface")) tags.push("interface", "types");
    if (text.includes("class")) tags.push("class");
    if (text.includes("function")) tags.push("function");
    if (text.includes("export")) tags.push("export");

    return [...new Set(tags)]; // 去重
}

// 提取代码示例
function extractCodeExamples(sourceFile: ts.SourceFile): string[] {
    const examples: string[] = [];
    const text = sourceFile.getFullText();

    // 提取 JSDoc 中的 @example 标签
    const exampleRegex = /@example\s*\n([\s\S]*?)(?=\n\s*\*\s*@|\n\s*\*\/)/g;
    let match;
    while ((match = exampleRegex.exec(text)) !== null) {
        const example = match[1]
            .split('\n')
            .map(line => line.replace(/^\s*\*\s?/, ''))
            .join('\n')
            .trim();
        if (example) {
            examples.push(example);
        }
    }

    // 提取测试用例作为示例
    if (sourceFile.fileName.includes("test")) {
        const testRegex = /it\s*\(\s*["'`]([^"'`]+)["'`]\s*,\s*(?:async\s+)?\(\s*\)\s*=>\s*\{([\s\S]*?)\n\s*\}\s*\)/g;
        while ((match = testRegex.exec(text)) !== null) {
            const testName = match[1];
            const testCode = match[2].trim();
            if (testCode.length < 500) { // 只包含较短的测试用例
                examples.push(`// Test: ${testName}\n${testCode}`);
            }
        }
    }

    return examples;
}

// 提取文件依赖
function extractFileDependencies(sourceFile: ts.SourceFile): string[] {
    const dependencies: string[] = [];
    const text = sourceFile.getFullText();

    // 提取 import 语句
    const importRegex = /import\s+(?:[\s\S]*?)\s+from\s+["'`]([^"'`]+)["'`]/g;
    let match;
    while ((match = importRegex.exec(text)) !== null) {
        const dep = match[1];
        if (!dep.startsWith('.') && !dep.startsWith('/')) {
            dependencies.push(dep);
        }
    }

    // 提取 require 语句
    const requireRegex = /require\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g;
    while ((match = requireRegex.exec(text)) !== null) {
        const dep = match[1];
        if (!dep.startsWith('.') && !dep.startsWith('/')) {
            dependencies.push(dep);
        }
    }

    return [...new Set(dependencies)]; // 去重
}

// 生成包级别的文档
export function generatePackageDocumentation(packageRoot: string): PackageDocumentation {
    const pkg = require(path.join(packageRoot, "package.json"));
    const knowledges = generateTSKnowledges(packageRoot);

    // 分析主要导出
    const mainExports = extractMainExports(packageRoot);

    // 生成 API 参考
    const apiReference = generateAPIReference(knowledges);

    // 提取使用示例
    const usageExamples = extractUsageExamples(knowledges);

    // 生成架构概览
    const architectureOverview = generateArchitectureOverview(knowledges);

    // 提取依赖
    const dependencies = Object.keys(pkg.dependencies || {});

    return {
        package_name: pkg.name,
        package_version: pkg.version,
        description: pkg.description || "",
        main_exports: mainExports,
        api_reference: apiReference,
        usage_examples: usageExamples,
        architecture_overview: architectureOverview,
        dependencies: dependencies,
        knowledges: knowledges
    };
}

// 提取主要导出
function extractMainExports(packageRoot: string): string[] {
    const indexPath = path.join(packageRoot, "src", "index.ts");
    if (!fs.existsSync(indexPath)) {
        return [];
    }

    const content = fs.readFileSync(indexPath, "utf-8");
    const exports: string[] = [];

    // 提取 export 语句
    const exportRegex = /export\s+(?:(?:default\s+)?(?:class|interface|function|const|let|var|type|enum)\s+(\w+)|{\s*([^}]+)\s*}(?:\s+from\s+["'`][^"'`]+["'`])?|\*\s+(?:as\s+(\w+)\s+)?from\s+["'`][^"'`]+["'`])/g;
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
        if (match[1]) {
            exports.push(match[1]);
        } else if (match[2]) {
            const namedExports = match[2].split(',').map(e => e.trim().split(' as ')[0].trim());
            exports.push(...namedExports);
        } else if (match[3]) {
            exports.push(match[3]);
        }
    }

    return [...new Set(exports)];
}

// 生成 API 参考
function generateAPIReference(knowledges: Knowledge[]): string {
    const sections: string[] = [];

    // 按类别分组
    const categories = knowledges.reduce((acc, k) => {
        if (!acc[k.category]) acc[k.category] = [];
        acc[k.category].push(k);
        return acc;
    }, {} as Record<string, Knowledge[]>);

    Object.entries(categories).forEach(([category, items]) => {
        sections.push(`## ${category.charAt(0).toUpperCase() + category.slice(1)}`);
        sections.push("");

        items.forEach(item => {
            sections.push(`### ${item.filename}`);
            sections.push("");
            if (item.docs) {
                sections.push(item.docs);
                sections.push("");
            }
            if (item.tags.length > 0) {
                sections.push(`**Tags**: ${item.tags.join(", ")}`);
                sections.push("");
            }
        });
    });

    return sections.join("\n");
}

// 提取使用示例
function extractUsageExamples(knowledges: Knowledge[]): string[] {
    const examples: string[] = [];

    knowledges.forEach(k => {
        examples.push(...k.examples);
    });

    return examples;
}

// 生成架构概览
function generateArchitectureOverview(knowledges: Knowledge[]): string {
    const overview: string[] = [];

    // 统计各类别的文件数量
    const categoryStats = knowledges.reduce((acc, k) => {
        acc[k.category] = (acc[k.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    overview.push("## Architecture Overview");
    overview.push("");
    overview.push("This package contains the following components:");
    overview.push("");

    Object.entries(categoryStats).forEach(([category, count]) => {
        overview.push(`- **${category}**: ${count} file(s)`);
    });

    overview.push("");

    // 分析依赖关系
    const allDeps = knowledges.flatMap(k => k.dependencies);
    const depCounts = allDeps.reduce((acc, dep) => {
        acc[dep] = (acc[dep] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    if (Object.keys(depCounts).length > 0) {
        overview.push("### Key Dependencies");
        overview.push("");
        Object.entries(depCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .forEach(([dep, count]) => {
                overview.push(`- **${dep}**: used in ${count} file(s)`);
            });
        overview.push("");
    }

    return overview.join("\n");
}

// 生成项目级别的文档
export function generateProjectDocumentation(projectRoot: string): ProjectDocumentation {
    const rootPkg = require(path.join(projectRoot, "package.json"));
    const packagesDir = path.join(projectRoot, "packages");

    const packages: PackageDocumentation[] = [];

    if (fs.existsSync(packagesDir)) {
        const packageDirs = fs.readdirSync(packagesDir)
            .filter(dir => fs.statSync(path.join(packagesDir, dir)).isDirectory())
            .filter(dir => fs.existsSync(path.join(packagesDir, dir, "package.json")));

        packageDirs.forEach(dir => {
            const packagePath = path.join(packagesDir, dir);
            try {
                const packageDoc = generatePackageDocumentation(packagePath);
                packages.push(packageDoc);
            } catch (error) {
                console.warn(`Failed to generate docs for package ${dir}:`, error);
            }
        });
    }

    // 生成快速开始指南
    const quickStart = generateQuickStartGuide(packages);

    // 生成 API 概览
    const apiOverview = generateProjectAPIOverview(packages);

    // 收集所有示例
    const examples = packages.flatMap(p => p.usage_examples);

    // 生成架构描述
    const architecture = generateProjectArchitecture(packages);

    return {
        project_name: rootPkg.name || "Unknown Project",
        version: rootPkg.version || "0.0.0",
        description: rootPkg.description || "",
        architecture: architecture,
        packages: packages,
        quick_start: quickStart,
        api_overview: apiOverview,
        examples: examples
    };
}

// 生成快速开始指南
function generateQuickStartGuide(packages: PackageDocumentation[]): string {
    const guide: string[] = [];

    guide.push("# Quick Start Guide");
    guide.push("");
    guide.push("## Installation");
    guide.push("");
    guide.push("```bash");
    guide.push("npm install " + packages.map(p => p.package_name).join(" "));
    guide.push("```");
    guide.push("");

    // 找到核心包
    const corePackage = packages.find(p => p.package_name.includes("core"));
    if (corePackage) {
        guide.push("## Basic Usage");
        guide.push("");
        guide.push("```typescript");
        guide.push(`import { bootstrap } from "${corePackage.package_name}";`);
        guide.push("");
        guide.push("// Initialize your application");
        guide.push("const app = await bootstrap([");
        guide.push("  // Your modules here");
        guide.push("]);");
        guide.push("```");
        guide.push("");
    }

    // 添加主要包的使用示例
    packages.slice(0, 3).forEach(pkg => {
        if (pkg.usage_examples.length > 0) {
            guide.push(`## ${pkg.package_name}`);
            guide.push("");
            guide.push(pkg.usage_examples[0]);
            guide.push("");
        }
    });

    return guide.join("\n");
}

// 生成项目 API 概览
function generateProjectAPIOverview(packages: PackageDocumentation[]): string {
    const overview: string[] = [];

    overview.push("# API Overview");
    overview.push("");

    packages.forEach(pkg => {
        overview.push(`## ${pkg.package_name}`);
        overview.push("");
        if (pkg.description) {
            overview.push(pkg.description);
            overview.push("");
        }

        if (pkg.main_exports.length > 0) {
            overview.push("### Main Exports");
            overview.push("");
            pkg.main_exports.forEach(exp => {
                overview.push(`- \`${exp}\``);
            });
            overview.push("");
        }

        // 按类别显示知识点
        const categories = pkg.knowledges.reduce((acc, k) => {
            if (!acc[k.category]) acc[k.category] = [];
            acc[k.category].push(k);
            return acc;
        }, {} as Record<string, Knowledge[]>);

        Object.entries(categories).forEach(([category, items]) => {
            overview.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)}`);
            overview.push("");
            items.slice(0, 5).forEach(item => { // 只显示前5个
                overview.push(`- ${item.filename}`);
            });
            if (items.length > 5) {
                overview.push(`- ... and ${items.length - 5} more`);
            }
            overview.push("");
        });
    });

    return overview.join("\n");
}

// 生成项目架构描述
function generateProjectArchitecture(packages: PackageDocumentation[]): string {
    const arch: string[] = [];

    arch.push("# Project Architecture");
    arch.push("");
    arch.push("This project follows a modular architecture with the following packages:");
    arch.push("");

    // 按依赖关系排序包
    const sortedPackages = sortPackagesByDependency(packages);

    sortedPackages.forEach(pkg => {
        arch.push(`## ${pkg.package_name}`);
        arch.push("");
        if (pkg.description) {
            arch.push(pkg.description);
            arch.push("");
        }

        // 显示架构概览
        if (pkg.architecture_overview) {
            arch.push(pkg.architecture_overview);
            arch.push("");
        }

        // 显示依赖
        if (pkg.dependencies.length > 0) {
            arch.push("### Dependencies");
            arch.push("");
            pkg.dependencies.forEach(dep => {
                arch.push(`- ${dep}`);
            });
            arch.push("");
        }
    });

    // 生成依赖图
    arch.push("## Dependency Graph");
    arch.push("");
    arch.push("```mermaid");
    arch.push("graph TD");
    packages.forEach(pkg => {
        const internalDeps = pkg.dependencies.filter(dep =>
            packages.some(p => p.package_name === dep)
        );
        internalDeps.forEach(dep => {
            const pkgName = pkg.package_name.replace(/[@\/]/g, "_");
            const depName = dep.replace(/[@\/]/g, "_");
            arch.push(`    ${depName} --> ${pkgName}`);
        });
    });
    arch.push("```");
    arch.push("");

    return arch.join("\n");
}

// 按依赖关系排序包
function sortPackagesByDependency(packages: PackageDocumentation[]): PackageDocumentation[] {
    const sorted: PackageDocumentation[] = [];
    const visited = new Set<string>();

    function visit(pkg: PackageDocumentation) {
        if (visited.has(pkg.package_name)) return;
        visited.add(pkg.package_name);

        // 先访问依赖
        pkg.dependencies.forEach(depName => {
            const dep = packages.find(p => p.package_name === depName);
            if (dep) visit(dep);
        });

        sorted.push(pkg);
    }

    packages.forEach(visit);
    return sorted;
}
