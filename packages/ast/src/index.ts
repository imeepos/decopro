import {Injector, container, createClassDecorator} from "@decopro/core";

export const Ast = createClassDecorator(`Ast`);
export interface Context {}
export interface Ast {
  visit<O, C extends Context>(visitor: Visitor<O, C>, ctx: C): O;
}
export interface Visitor<O = any, C extends Context = any> {
  visit(ast: Ast, ctx: C): Promise<O>;
}
export async function runAst<T, C extends Context>(
  ast: Ast,
  visitor: Visitor<T, C>,
  ctx: C
): Promise<T> {
  return visitor.visit(ast, ctx);
}

export async function runAstJson<T, C extends Context>(
  json: unknown,
  visitor: Visitor<T, C>,
  ctx: C
): Promise<T> {
  const injector = container.resolve(Injector);
  const ast = injector.fromJson(json);
  return await runAst(ast, visitor, ctx);
}
