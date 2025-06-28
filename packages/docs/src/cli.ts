import * as fs from "fs";
import * as path from "path";
import { generateProjectDocumentation, generatePackageDocumentation } from "./index";

interface CLIOptions {
    output?: string;
    format?: "json" | "markdown" | "both";
    package?: string;
    verbose?: boolean;
}

function parseArgs(): CLIOptions {
    const args = process.argv.slice(2);
    const options: CLIOptions = {
        format: "both",
        verbose: false
    };
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case "-o":
            case "--output":
                options.output = args[++i];
                break;
            case "-f":
            case "--format":
                const format = args[++i] as "json" | "markdown" | "both";
                if (["json", "markdown", "both"].includes(format)) {
                    options.format = format;
                } else {
                    console.error(`Invalid format: ${format}. Use json, markdown, or both.`);
                    process.exit(1);
                }
                break;
            case "-p":
            case "--package":
                options.package = args[++i];
                break;
            case "-v":
            case "--verbose":
                options.verbose = true;
                break;
            case "-h":
            case "--help":
                showHelp();
                process.exit(0);
                break;
            default:
                if (arg.startsWith("-")) {
                    console.error(`Unknown option: ${arg}`);
                    process.exit(1);
                }
                break;
        }
    }
    
    return options;
}

function showHelp() {
    console.log(`
Usage: decopro-docs [options]

Options:
  -o, --output <dir>     Output directory (default: ./docs)
  -f, --format <format>  Output format: json, markdown, or both (default: both)
  -p, --package <name>   Generate docs for specific package only
  -v, --verbose          Verbose output
  -h, --help             Show this help message

Examples:
  decopro-docs                           # Generate docs for entire project
  decopro-docs -o ./documentation        # Output to custom directory
  decopro-docs -p @decopro/core          # Generate docs for specific package
  decopro-docs -f markdown               # Generate only markdown docs
`);
}

function log(message: string, verbose: boolean = false) {
    if (!verbose || process.env.VERBOSE) {
        console.log(message);
    }
}

async function main() {
    const options = parseArgs();
    const projectRoot = process.cwd();
    const outputDir = options.output || path.join(projectRoot, "docs");
    
    log("🚀 Generating documentation...", options.verbose);
    
    try {
        // 确保输出目录存在
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        if (options.package) {
            // 生成单个包的文档
            const packagePath = path.join(projectRoot, "packages", options.package.replace("@decopro/", ""));
            if (!fs.existsSync(packagePath)) {
                console.error(`Package not found: ${options.package}`);
                process.exit(1);
            }
            
            log(`📦 Generating docs for package: ${options.package}`, options.verbose);
            const packageDoc = generatePackageDocumentation(packagePath);
            
            if (options.format === "json" || options.format === "both") {
                const jsonPath = path.join(outputDir, `${options.package.replace("@decopro/", "")}.json`);
                fs.writeFileSync(jsonPath, JSON.stringify(packageDoc, null, 2));
                log(`✅ JSON documentation saved to: ${jsonPath}`);
            }
            
            if (options.format === "markdown" || options.format === "both") {
                const mdPath = path.join(outputDir, `${options.package.replace("@decopro/", "")}.md`);
                const markdown = generatePackageMarkdown(packageDoc);
                fs.writeFileSync(mdPath, markdown);
                log(`✅ Markdown documentation saved to: ${mdPath}`);
            }
        } else {
            // 生成整个项目的文档
            log("📚 Generating project documentation...", options.verbose);
            const projectDoc = generateProjectDocumentation(projectRoot);
            
            if (options.format === "json" || options.format === "both") {
                const jsonPath = path.join(outputDir, "project.json");
                fs.writeFileSync(jsonPath, JSON.stringify(projectDoc, null, 2));
                log(`✅ JSON documentation saved to: ${jsonPath}`);
            }
            
            if (options.format === "markdown" || options.format === "both") {
                const mdPath = path.join(outputDir, "README.md");
                const markdown = generateProjectMarkdown(projectDoc);
                fs.writeFileSync(mdPath, markdown);
                log(`✅ Markdown documentation saved to: ${mdPath}`);
                
                // 为每个包生成单独的 markdown 文件
                projectDoc.packages.forEach(pkg => {
                    const pkgMdPath = path.join(outputDir, `${pkg.package_name.replace("@decopro/", "")}.md`);
                    const pkgMarkdown = generatePackageMarkdown(pkg);
                    fs.writeFileSync(pkgMdPath, pkgMarkdown);
                    log(`✅ Package docs saved to: ${pkgMdPath}`, options.verbose);
                });
            }
            
            // 生成大模型友好的知识库文件（排除测试文件）
            const knowledgePath = path.join(outputDir, "knowledge-base.json");
            const allKnowledges = projectDoc.packages
                .flatMap(p => p.knowledges)
                .filter(k => k.category !== "test");
            fs.writeFileSync(knowledgePath, JSON.stringify(allKnowledges, null, 2));
            log(`✅ Knowledge base saved to: ${knowledgePath}`);
        }
        
        log("🎉 Documentation generation completed!");
        
    } catch (error) {
        console.error("❌ Error generating documentation:", error);
        process.exit(1);
    }
}

function generatePackageMarkdown(pkg: any): string {
    const sections: string[] = [];
    
    sections.push(`# ${pkg.package_name}`);
    sections.push("");
    if (pkg.description) {
        sections.push(pkg.description);
        sections.push("");
    }
    
    sections.push(`**Version**: ${pkg.package_version}`);
    sections.push("");
    
    if (pkg.main_exports.length > 0) {
        sections.push("## Main Exports");
        sections.push("");
        pkg.main_exports.forEach((exp: string) => {
            sections.push(`- \`${exp}\``);
        });
        sections.push("");
    }
    
    if (pkg.architecture_overview) {
        sections.push(pkg.architecture_overview);
        sections.push("");
    }
    
    if (pkg.api_reference) {
        sections.push("## API Reference");
        sections.push("");
        sections.push(pkg.api_reference);
        sections.push("");
    }
    
    if (pkg.usage_examples.length > 0) {
        sections.push("## Usage Examples");
        sections.push("");
        pkg.usage_examples.forEach((example: string) => {
            sections.push("```typescript");
            sections.push(example);
            sections.push("```");
            sections.push("");
        });
    }
    
    return sections.join("\n");
}

function generateProjectMarkdown(project: any): string {
    const sections: string[] = [];
    
    sections.push(`# ${project.project_name}`);
    sections.push("");
    if (project.description) {
        sections.push(project.description);
        sections.push("");
    }
    
    sections.push(`**Version**: ${project.version}`);
    sections.push("");
    
    if (project.quick_start) {
        sections.push(project.quick_start);
        sections.push("");
    }
    
    if (project.architecture) {
        sections.push(project.architecture);
        sections.push("");
    }
    
    if (project.api_overview) {
        sections.push(project.api_overview);
        sections.push("");
    }
    
    return sections.join("\n");
}

if (require.main === module) {
    main().catch(console.error);
}

export { main as generateDocs };
