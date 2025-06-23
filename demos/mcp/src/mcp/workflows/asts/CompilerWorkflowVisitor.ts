import { Ast } from "@decopro/ast";
import {
    CloneVideoTaskAst,
    CreateHighLightTaskAst,
    CreateProductAssetTaskAst,
    DownloadProjectMarkerTaskAst,
    DownloadProjectProductTaskAst,
    MergeVideoTaskAst,
    WorkflowVisitor
} from "./ast";
import { DirectedGraph, injectable } from "@decopro/core";
export type CompilerWorkflowContext = DirectedGraph<Ast>;
/**
 * 创建任务执行 有向图
 */
@injectable()
export class CompilerWorkflowVisitor
    implements
        WorkflowVisitor<CompilerWorkflowContext, CompilerWorkflowContext>
{
    private async runWithTask(cb: () => Promise<void>) {
        try {
            await cb();
            // 发送任务完成通知
        } catch (e) {
            // 发送任务失败通知
        }
    }
    async visitDownloadProjectMarkerTaskAst(
        ast: DownloadProjectMarkerTaskAst,
        ctx: CompilerWorkflowContext
    ) {
        await this.runWithTask(async () => {
            ctx.addVertex(ast);
            // 下载 需要先获取下载连接
            // 生成 marker 首帧截屏
        });
        return ctx;
    }
    async visitDownloadProjectProductTaskAst(
        ast: DownloadProjectProductTaskAst,
        ctx: CompilerWorkflowContext
    ) {
        await this.runWithTask(async () => {
            ctx.addVertex(ast);
            // 下载 需要先获取下载连接
            // 生成 marker 首帧截屏
        });
        return ctx;
    }
    async visitCreateProductAssetTaskAst(
        ast: CreateProductAssetTaskAst,
        ctx: CompilerWorkflowContext
    ) {
        await this.runWithTask(async () => {
            ctx.addVertex(ast);
            // 同步素材
            // 提取音频
            // 提取字幕
        });
        return ctx;
    }
    async visitCreateHighLightTaskAst(
        ast: CreateHighLightTaskAst,
        ctx: CompilerWorkflowContext
    ) {
        await this.runWithTask(async () => {
            ctx.addVertex(ast);
            // 同步素材
            // 提取音频
            // 提取字幕
        });
        return ctx;
    }
    async visitMergeVideoTaskAst(
        ast: MergeVideoTaskAst,
        ctx: CompilerWorkflowContext
    ) {
        await this.runWithTask(async () => {
            ctx.addVertex(ast);
            // n8n
            // merge
            // 提取音频
            // 提取字幕
            // 去重
            // 字幕高光
        });
        return ctx;
    }
    async visitCloneVideoTaskAst(
        ast: CloneVideoTaskAst,
        ctx: CompilerWorkflowContext
    ) {
        await this.runWithTask(async () => {
            ctx.addVertex(ast);
            // n8n
            // merge
            // 提取音频
            // 提取字幕
            // 去重
            // 字幕高光
        });
        return ctx;
    }
    // 统一调用
    async visit(
        ast: Ast,
        ctx: CompilerWorkflowContext
    ): Promise<CompilerWorkflowContext> {
        return ast.visit(this, ctx);
    }
}
