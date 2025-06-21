import { Workflow } from "@decopro/mcp";
import { Ast, Context, Visitor } from "@decopro/ast";
import { Input } from "@decopro/core";
export interface WorkflowVisitor<O = any, C extends Context = any>
    extends Visitor<O, C> {
    visitChatAst(ast: ChatAst, ctx: C): Promise<O>;
}

@Ast({
    description: `大模型聊天节点`
})
export class ChatAst implements Ast {
    @Input({})
    id: string = crypto.randomUUID();
    @Input({})
    status: "wait" | "runing" | "success" | "failed" = "wait";
    @Input({})
    messages: { role: string; content: string }[] = [];
    visit<O, C extends Context>(
        visitor: WorkflowVisitor<O, C>,
        ctx: C
    ): Promise<O> {
        return visitor.visitChatAst(this, ctx);
    }
}
@Workflow({})
export class NowaWorkflow {}
