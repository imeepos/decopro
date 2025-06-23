import { Ast, Visitor } from "@decopro/ast";
import { Input } from "@decopro/core";
export interface WorkflowVisitor<O = any, C = any> extends Visitor<O, C> {
    visitDownloadProjectMarkerTaskAst(
        ast: DownloadProjectMarkerTaskAst,
        ctx: C
    ): Promise<O>;
    visitDownloadProjectProductTaskAst(
        ast: DownloadProjectProductTaskAst,
        ctx: C
    ): Promise<O>;
    visitCreateProductAssetTaskAst(
        ast: CreateProductAssetTaskAst,
        ctx: C
    ): Promise<O>;
    visitCreateHighLightTaskAst(
        ast: CreateHighLightTaskAst,
        ctx: C
    ): Promise<O>;
    visitMergeVideoTaskAst(ast: MergeVideoTaskAst, ctx: C): Promise<O>;
    visitCloneVideoTaskAst(ast: CloneVideoTaskAst, ctx: C): Promise<O>;
}

@Ast({
    description: `下载切片任务`
})
export class DownloadProjectMarkerTaskAst implements Ast {
    @Input({})
    id: string = crypto.randomUUID();
    @Input({})
    status: "wait" | "runing" | "success" | "failed" = "wait";
    @Input({})
    markerId: string;
    visit<O, C>(visitor: WorkflowVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitDownloadProjectMarkerTaskAst(this, ctx);
    }
}

@Ast({
    description: `下载商品素材任务`
})
export class DownloadProjectProductTaskAst implements Ast {
    @Input({})
    id: string = crypto.randomUUID();
    @Input({})
    status: "wait" | "runing" | "success" | "failed" = "wait";
    @Input({
        description: `商品ID`
    })
    productId: string;
    @Input({
        description: `直播ID`
    })
    projectId: string;
    visit<O, C>(visitor: WorkflowVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitDownloadProjectProductTaskAst(this, ctx);
    }
}

@Ast({
    description: `创建商品素材后执行`
})
export class CreateProductAssetTaskAst implements Ast {
    @Input({})
    id: string = crypto.randomUUID();
    @Input({})
    status: "wait" | "runing" | "success" | "failed" = "wait";
    @Input({})
    assetId: string;
    visit<O, C>(visitor: WorkflowVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitCreateProductAssetTaskAst(this, ctx);
    }
}

@Ast({
    description: `创建高光素材后执行`
})
export class CreateHighLightTaskAst implements Ast {
    @Input({})
    id: string = crypto.randomUUID();
    @Input({})
    status: "wait" | "runing" | "success" | "failed" = "wait";
    @Input({})
    highLight: string;
    visit<O, C>(visitor: WorkflowVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitCreateHighLightTaskAst(this, ctx);
    }
}

@Ast({
    description: `精拼视频`
})
export class MergeVideoTaskAst implements Ast {
    @Input({})
    id: string = crypto.randomUUID();
    @Input({})
    status: "wait" | "runing" | "success" | "failed" = "wait";
    visit<O, C>(visitor: WorkflowVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitMergeVideoTaskAst(this, ctx);
    }
}

@Ast({
    description: `克隆食品`
})
export class CloneVideoTaskAst implements Ast {
    @Input({})
    id: string = crypto.randomUUID();
    @Input({})
    status: "wait" | "runing" | "success" | "failed" = "wait";
    visit<O, C>(visitor: WorkflowVisitor<O, C>, ctx: C): Promise<O> {
        return visitor.visitCloneVideoTaskAst(this, ctx);
    }
}
