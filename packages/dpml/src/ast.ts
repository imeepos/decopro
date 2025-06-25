import { Ast, Visitor } from "@decopro/ast";
import { Input } from "@decopro/core";

export interface Attributes {
    name: string;
    value: string;
}
@Ast({})
export class GuidelineElement {
    @Input({})
    attributes: Attributes[] = [];
}
@Ast({})
export class ProcessElement {
    @Input({})
    attributes: Attributes[] = [];
}
@Ast({})
export class ExecutionElement {
    @Input({})
    attributes: Attributes[] = [];
    visit<O, C>(visitor: Visitor<O, C>, ctx: C): Promise<O> {
        throw new Error("Method not implemented.");
    }
}
