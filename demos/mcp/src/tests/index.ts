import { Injector, inject, injectable } from "@decopro/core";
import { Test } from "@decopro/test";
import { RunJsCodeTool } from "../mcp/tools";


@injectable()
export class McpTest {
    constructor(@inject(Injector) private injector: Injector) {}
    @Test({})
    async test() {
        const runJsCodeTool = this.injector.get(RunJsCodeTool);
        const result = runJsCodeTool.runJsCode({ code: `1 + 2;` });
        return result === 2;
    }
}
