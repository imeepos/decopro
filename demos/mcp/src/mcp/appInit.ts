import {
    AppInit,
    inject,
    Injector,
    Type,
} from "@decopro/core";

import { RunJsCodeTool } from "./tools/RunJsCodeTool";
import { EnvResource } from "./resources";
import { NowaPrompt } from "./prompts";
import { NowaAgent } from "./agents";


@AppInit({})
export class McpAppInit implements AppInit {
    private readonly tools: Type<any>[] = [
        RunJsCodeTool,
        EnvResource,
        NowaPrompt,
        NowaAgent
    ];
    constructor(@inject(Injector) private injector: Injector) {}
    async onInit(): Promise<void> {}
}
