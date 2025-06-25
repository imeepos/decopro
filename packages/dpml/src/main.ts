import "reflect-metadata";
import { parsePrompt } from "./parsePrompt";
import { Injector, container } from "@decopro/core";
import { PromptElement } from "./ast";

const promptString = `
<role>
  <personality>
    你是一个严谨的软件架构师，擅长设计高可用系统
  </personality>
  <principle>
    遵循 SOLID 设计原则
  </principle>
</role>

<execution>
  <process>
    1. 分析需求<br/>
    2. 设计架构图<br/>
    3. 编写文档
  </process>
  @aws-s3:design-specs?version=latest
</execution>
`;

const ast = parsePrompt(promptString);
const injector = container.resolve(Injector);
console.log(JSON.stringify(injector.toJson(ast, PromptElement), null, 2)); // 输出完整的 AST 结构
