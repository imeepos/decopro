import {
  ClassMetadata,
  InjectionToken,
  ParameterMetadata,
  Type,
  createClassDecorator,
  createParameterDecorator
} from "@decopro/core";

export interface McpArgOptions {}
export const MCP_ARG_TOKEN = Symbol.for(`MCP_ARG_TOKEN`) as InjectionToken<
  ParameterMetadata<McpArgOptions>
>;
export const McpArg = createParameterDecorator(MCP_ARG_TOKEN);

/**
 * tool
 */
export interface ToolOptions<R = any> {
  token: InjectionToken<R>;
  description: string;
}
export const TOOL_TOKEN = `TOOL_TOKEN` as InjectionToken<
  ClassMetadata<ToolOptions>
>;
export const Tool = createClassDecorator(TOOL_TOKEN);

/**
 * resource 静态资源
 */
export interface ResourceOptions {}
export const RESOURCE_TOKEN = `RESOURCE_TOKEN` as InjectionToken<
  ClassMetadata<ResourceOptions>
>;
export const Resource = createClassDecorator(RESOURCE_TOKEN);

/**
 * prompt
 */
export interface PromptOptions {}
export const PROMPT_TOKEN = `PROMPT_TOKEN` as InjectionToken<
  ClassMetadata<PromptOptions>
>;
export const Prompt = createClassDecorator(PROMPT_TOKEN);

/**
 * agent
 */
export interface AgentOptions {
  token: string;
  description: string;
  tools: Type<any>[];
  prompts: Type<any>[];
  resources: Type<any>[];
  children: Type<any>[];
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
