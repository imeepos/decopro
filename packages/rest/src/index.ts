import {
  ClassMetadata,
  InjectionToken,
  MethodMetadata,
  ParameterMetadata,
  createClassDecorator,
  createMethodDecorator,
  createParameterDecorator,
} from "@decopro/core";
import {ZodTypeAny} from "zod";

export interface BodyOptions {
  key?: string;
  zod?: ZodTypeAny;
}
export const BODY_TOKEN = `BODY_TOKEN` as InjectionToken<
  ParameterMetadata<BodyOptions>
>;
export const Body = createParameterDecorator(BODY_TOKEN);

export interface QueryOptions {
  key?: string;
  zod?: ZodTypeAny;
}
export const QUERY_TOKEN = `QUERY_TOKEN` as InjectionToken<
  ParameterMetadata<QueryOptions>
>;
export const Query = createParameterDecorator(BODY_TOKEN);

export interface ParamOptions {
  key?: string;
  zod?: ZodTypeAny;
}
export const PARAM_TOKEN = `PARAM_TOKEN` as InjectionToken<
  ParameterMetadata<ParamOptions>
>;
export const Param = createParameterDecorator(PARAM_TOKEN);

export interface HeaderOptions {
  key?: string;
  zod?: ZodTypeAny;
}
export const HEADER_TOKEN = `HEADER_TOKEN` as InjectionToken<
  ParameterMetadata<HeaderOptions>
>;
export const Header = createParameterDecorator(HEADER_TOKEN);

export interface ControllerOptions {
  path?: string;
}
export const CONTROLLER_TOKEN = `CONTROLLER_TOKEN` as InjectionToken<
  ClassMetadata<ControllerOptions>
>;
export const Controller = createClassDecorator(CONTROLLER_TOKEN);

export interface GetOptions {
  path?: string;
}
export const GET_TOKEN = `GET_TOKEN` as InjectionToken<
  MethodMetadata<GetOptions>
>;
export const Get = createMethodDecorator(GET_TOKEN);

export interface PostOptions {
  path?: string;
}
export const POST_TOKEN = `POST_TOKEN` as InjectionToken<
  MethodMetadata<PostOptions>
>;
export const Post = createMethodDecorator(POST_TOKEN);

export interface PutOptions {
  path?: string;
}
export const PUT_TOKEN = `PUT_TOKEN` as InjectionToken<
  MethodMetadata<PutOptions>
>;
export const Put = createMethodDecorator(PUT_TOKEN);

export interface DeleteOptions {
  path?: string;
}
export const DELETE_TOKEN = `DELETE_TOKEN` as InjectionToken<
  MethodMetadata<DeleteOptions>
>;
export const Delete = createMethodDecorator(DELETE_TOKEN);
