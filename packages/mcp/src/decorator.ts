import {
    BaseMethodOptions,
    ClassMetadata,
    InjectionToken,
    MethodMetadata,
    ParameterMetadata,
    Type,
    createClassDecorator,
    createMethodDecorator,
    createParameterDecorator
} from "@decopro/core";
import {
    Resource as McpResource,
    ToolAnnotations
} from "@modelcontextprotocol/sdk/types";
import { ZodRawShape, ZodTypeAny } from "zod";

export interface McpArgOptions {
    name: string;
    zod: ZodTypeAny;
}
export function isMcpArgOptions(val: any): val is McpArgOptions {
    return val && val.zod;
}
export const MCP_ARG_TOKEN = Symbol.for(`MCP_ARG_TOKEN`) as InjectionToken<
    ParameterMetadata<McpArgOptions | ZodRawShape>
>;
export const McpArg = createParameterDecorator(MCP_ARG_TOKEN);

/**
 * tool
 */

export interface ToolOptions<R = any> extends BaseMethodOptions {
    token: InjectionToken<R>;
    title?: string;
    description?: string;
    annotations?: ToolAnnotations;
}
export const TOOL_TOKEN = `TOOL_TOKEN` as InjectionToken<
    MethodMetadata<ToolOptions>
>;
export const Tool = createMethodDecorator(TOOL_TOKEN);

/**
 * resource 静态资源
 */
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
export type ResourceMetadata = Omit<McpResource, "uri" | "name">;
export interface ResourceOptions extends BaseMethodOptions {
    name: string;
    uriOrTemplate: string | ResourceTemplate;
    config: ResourceMetadata;
}
export const RESOURCE_TOKEN = `RESOURCE_TOKEN` as InjectionToken<
    MethodMetadata<ResourceOptions>
>;
export const Resource = createMethodDecorator(RESOURCE_TOKEN);

/**
 * prompt
 */
export interface PromptOptions extends BaseMethodOptions {
    name: string;
    title?: string;
    description?: string;
}
export const PROMPT_TOKEN = `PROMPT_TOKEN` as InjectionToken<
    MethodMetadata<PromptOptions>
>;
export const Prompt = createMethodDecorator(PROMPT_TOKEN);

/**
 * agent
 */
export interface AgentOptions {
    token: string;
    description: string;
    tools?: Type<any>[];
    prompts?: Type<any>[];
    resources?: Type<any>[];
    children?: Type<any>[];
}
export const AGENT_TOKEN = `AGENT_TOKEN` as InjectionToken<
    ClassMetadata<AgentOptions>
>;
export const Agent = createClassDecorator(AGENT_TOKEN);

export interface WorkflowOptions {}
export const WORKFLOW_TOKEN = `WORKFLOW_TOKEN` as InjectionToken<
    ClassMetadata<WorkflowOptions>
>;
export const Workflow = createClassDecorator(WORKFLOW_TOKEN);
