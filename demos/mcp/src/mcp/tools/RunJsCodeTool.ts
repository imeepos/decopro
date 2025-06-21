import { injectable } from "@decopro/core";
import { McpArg, Tool } from "@decopro/mcp";
import { z } from "zod";
import { createContext, runInContext } from "vm";
@injectable()
export class RunJsCodeTool {
    @Tool({
        token: `runJsCode`,
        title: `runJsCode`,
        description: `run js code in vm`
    })
    runJsCode(@McpArg({ code: z.string() }) args: { code: string }) {
        const ctx = createContext({});
        return runInContext(args.code, ctx);
    }
}
