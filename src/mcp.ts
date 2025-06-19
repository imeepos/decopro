import {Tool, Resource, Prompt, Agent, Workflow} from "@decopro/mcp";

@Tool({
  token: ``,
  description: ``
})
export class DemoTool {}

@Resource({})
export class DemoResource {}

@Prompt({})
export class DemoPrompt {}

@Agent({
  token: `nava`,
  description: `女娲`,
  tools: [DemoTool],
  resources: [DemoResource],
  prompts: [DemoPrompt],
  children: []
})
export class DemoAgent {}

@Workflow({})
export class DemoWorkflow {}
