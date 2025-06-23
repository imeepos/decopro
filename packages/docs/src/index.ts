import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
export interface Knowledge {
    package_name: string;
    package_version: string;
    filename: string;
    docs: string;
    hash: string;
}
export function generateTSKnowledges(projectRoot: string): Knowledge[] {
    const host: ts.LanguageServiceHost = {
        getCurrentDirectory: () => projectRoot,
        getDefaultLibFileName: options => ts.getDefaultLibFileName(options),
        getCompilationSettings: () => ts.getDefaultCompilerOptions(),
        getScriptFileNames: () => getAllTSFiles(projectRoot),
        getScriptSnapshot: fileName => {
            if (fs.existsSync(fileName)) {
                return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName, 'utf-8'));
            }
            return undefined;
        },
        readFile: path => fs.existsSync(path) ? fs.readFileSync(path, 'utf-8') : undefined,
        fileExists: path => fs.existsSync(path),
        getScriptVersion: () => "1.0",
        getScriptKind: fileName => {
            const ext = path.extname(fileName).toLowerCase();
            return ext === '.tsx' ? ts.ScriptKind.TSX :
                ext === '.ts' ? ts.ScriptKind.TS :
                    ts.ScriptKind.Unknown;
        }
    };

    const service = ts.createLanguageService(host);
    const program = service.getProgram();

    if (!program) {
        throw new Error("Failed to create TypeScript program");
    }

    const pkg = require(path.join(projectRoot, 'package.json'))

    const knowledges: Knowledge[] = [];
    const checker = program.getTypeChecker();

    // 处理所有文件
    const files = host.getScriptFileNames();
    files.forEach(file => {
        if (file.endsWith('d.ts')) {
            return;
        }
        if (file.includes('node_modules')) {
            return;
        }
        const sourceFile = program.getSourceFile(file);
        if (!sourceFile) return;

        const fileOuptput: string[] = []

        // 遍历 AST 节点
        ts.forEachChild(sourceFile, node => {
            visitNode(node, fileOuptput, checker, sourceFile);
        });

        const hash = createHash('md5').update(sourceFile.text).digest('hex')
        const embedding: number[] = []
        // 调用 embedding 生成知识库
        const knowledge: Knowledge = {
            package_name: pkg.name,
            package_version: pkg.version,
            filename: path.relative(projectRoot, file),
            docs: fileOuptput.join('\n'),
            hash: hash,
        }
        knowledges.push(knowledge)
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
    const indent = '  '.repeat(indentLevel);

    // 处理类声明
    if (ts.isClassDeclaration(node) && node.name) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (!symbol) return;

        const className = node.name.getText(sourceFile);
        const docs = getDocumentation(symbol, checker);

        output.push(`${indent}### Class: \`${className}\``);
        if (docs) output.push(`${indent}${docs}\n`);

        // 处理类成员
        node.members.forEach(member => {
            visitNode(member, output, checker, sourceFile, indentLevel + 1);
        });
        output.push('');
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
        node.members.forEach(member => {
            visitNode(member, output, checker, sourceFile, indentLevel + 1);
        });
        output.push('');
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
        if (docs) output.push(`${indent}  ${docs.replace(/\n/g, '\n' + indent + '  ')}`);
    }

    // 处理属性声明
    else if (ts.isPropertyDeclaration(node) && node.name) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (!symbol) return;

        const propName = node.name.getText(sourceFile);
        const docs = getDocumentation(symbol, checker);
        const type = node.type ? node.type.getText(sourceFile) : 'any';

        output.push(`${indent}- Property: \`${propName}: ${type}\``);
        if (docs) output.push(`${indent}  ${docs.replace(/\n/g, '\n' + indent + '  ')}`);
    }

    // 处理构造函数
    else if (ts.isConstructorDeclaration(node)) {
        const signature = getFunctionSignature(node, sourceFile);
        output.push(`${indent}- Constructor: \`constructor${signature}\``);

        // 处理参数
        node.parameters.forEach(param => {
            if (ts.isParameter(param) && param.name) {
                const paramSymbol = checker.getSymbolAtLocation(param.name);
                if (!paramSymbol) return;

                const paramName = param.name.getText(sourceFile);
                const paramType = param.type?.getText(sourceFile) || 'any';
                const paramDocs = getDocumentation(paramSymbol, checker);

                output.push(`${indent}  - Parameter: \`${paramName}: ${paramType}\``);
                if (paramDocs) output.push(`${indent}    ${paramDocs.replace(/\n/g, '\n' + indent + '    ')}`);
            }
        });
    }
    // 处理接口属性签名
    else if (ts.isPropertySignature(node) && node.name) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (!symbol) return;

        const propName = node.name.getText(sourceFile);
        const docs = getDocumentation(symbol, checker);
        const type = node.type ? node.type.getText(sourceFile) : 'any';
        const optional = node.questionToken ? '?' : '';

        output.push(`${indent}- ${propName}${optional}: ${type}`);
        if (docs) output.push(`${indent}  ${docs.replace(/\n/g, '\n' + indent + '  ')}`);
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
        node.members.forEach(member => {
            if (member.name) {
                const memberSymbol = checker.getSymbolAtLocation(member.name);
                if (!memberSymbol) return;

                const memberName = member.name.getText(sourceFile);
                const memberDocs = getDocumentation(memberSymbol, checker);

                output.push(`${indent}  - Member: \`${memberName}\``);
                if (memberDocs) output.push(`${indent}    ${memberDocs.replace(/\n/g, '\n' + indent + '    ')}`);
            }
        });
    }

    else {
        // console.log(ts.SyntaxKind[node.kind])
    }
}

// 获取函数/方法的签名
function getFunctionSignature(node: ts.FunctionLikeDeclaration, sourceFile: ts.SourceFile): string {
    const parameters = node.parameters.map(param => {
        const name = param.name.getText(sourceFile);
        const type = param.type?.getText(sourceFile) || 'any';
        const optional = param.questionToken ? '?' : '';
        return `${name}${optional}: ${type}`;
    });

    const returnType = node.type?.getText(sourceFile) || 'void';
    return `(${parameters.join(', ')}): ${returnType}`;
}

// 获取文档注释
function getDocumentation(symbol: ts.Symbol, checker: ts.TypeChecker): string {
    const docs = ts.displayPartsToString(symbol.getDocumentationComment(checker));
    return docs ? `\n${docs}\n` : '';
}

// 获取所有 TypeScript 文件
function getAllTSFiles(dir: string): string[] {
    return fs.readdirSync(dir).flatMap(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            return getAllTSFiles(fullPath);
        } else if (/\.tsx?$/.test(file)) {
            return [fullPath];
        }
        return [];
    });
}
