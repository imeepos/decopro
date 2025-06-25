import {
    ClassMetadata,
    InjectionToken,
    Type,
    createClassDecorator
} from "@decopro/core";

export interface Exploration {
    title: string;
    description: string;
}
export interface Reasoning {
    title: string;
    description: string;
}
export interface Plan {
    title: string;
    description: string;
}
export interface Challenge {
    title: string;
    description: string;
}
export interface ThoughtOptions {
    name: string;
    exploration: Exploration[];
    reasoning: Reasoning[];
    plan: Plan[];
    challenge: Challenge[];
}
export const THOUGHT_TOKEN = Symbol.for(`THOUGHT_TOKEN`) as InjectionToken<
    ClassMetadata<ThoughtOptions>
>;
export const Thought = createClassDecorator(THOUGHT_TOKEN);

/**
 * -------------------------------------------------
 */
// 流程
export interface Process {
    title: string;
    description: string;
}
// 指导原则
export interface Guideline {
    title: string;
    description: string;
}
// 规则
export interface Rule {
    title: string;
    description: string;
}
// 标准
export interface Criteria {
    title: string;
    description: string;
}
// 约束
export interface Constraint {
    title: string;
    description: string;
}
export interface ExecutionOptions {
    name: string;
    constraint: Constraint[];
    process: Process[];
    guideline: Guideline[];
    rule: Rule[];
    criteria: Criteria[];
}
export const EXECUTION_TOKEN = Symbol.for(`EXECUTION_TOKEN`) as InjectionToken<
    ClassMetadata<ExecutionOptions>
>;
export const Execution = createClassDecorator(EXECUTION_TOKEN);

export interface Personality {
    title: string;
    types: Type<any>[];
}
export interface Principle {
    title: string;
    types: Type<any>[];
}
export interface Knowledge {
    title: string;
    description: string;
}
export interface RoleOptions {
    name: string;
    personality: Personality[];
    principle: Principle[];
    knowledge: Knowledge[];
}
export const ROLE_TOKEN = Symbol.for(`ROLE_TOKEN`) as InjectionToken<
    ClassMetadata<RoleOptions>
>;
export const Role = createClassDecorator(ROLE_TOKEN);
