import {
    BaseDecoratorOptions,
    BaseMethodOptions,
    BaseParameterOptions,
    ClassMetadata,
    InjectionToken,
    MethodMetadata,
    ParameterMetadata,
    createClassDecorator,
    createMethodDecorator,
    createParameterDecorator
} from "@decopro/core";
import { ZodTypeAny } from "zod";

// ============================================================================
// Parameter Decorators - 参数装饰器
// ============================================================================

/**
 * HTTP 请求体参数选项
 */
export interface BodyOptions extends BaseParameterOptions {
    /** 参数键名，如果不指定则使用参数名 */
    key?: string;
    /** Zod 验证模式 */
    zod?: ZodTypeAny;
}

/**
 * Body 装饰器的注入令牌
 */
export const BODY_TOKEN = Symbol.for(`BODY_TOKEN`) as InjectionToken<
    ParameterMetadata<BodyOptions>
>;

/**
 * Body 装饰器 - 用于标记 HTTP 请求体参数
 * 支持可选参数和 Zod 验证
 *
 * @example
 * ```typescript
 * @Post('/users')
 * async createUser(@Body() userData: CreateUserDto) {
 *   return this.userService.create(userData);
 * }
 *
 * @Post('/users')
 * async createUser(@Body({ zod: CreateUserSchema }) userData: any) {
 *   return this.userService.create(userData);
 * }
 * ```
 */
export const Body = createParameterDecorator(BODY_TOKEN);

/**
 * Body 数据的注入令牌
 */
export const BODY = Symbol.for(`BODY`) as InjectionToken<any>;

/**
 * HTTP 查询参数选项
 */
export interface QueryOptions extends BaseParameterOptions {
    /** 参数键名，如果不指定则使用参数名 */
    key?: string;
    /** Zod 验证模式 */
    zod?: ZodTypeAny;
}

/**
 * Query 装饰器的注入令牌
 */
export const QUERY_TOKEN = Symbol.for(`QUERY_TOKEN`) as InjectionToken<
    ParameterMetadata<QueryOptions>
>;

/**
 * Query 装饰器 - 用于标记 HTTP 查询参数
 * 支持可选参数和 Zod 验证
 *
 * @example
 * ```typescript
 * @Get('/users')
 * async getUsers(@Query() query: GetUsersQuery) {
 *   return this.userService.findMany(query);
 * }
 *
 * @Get('/users')
 * async getUsers(@Query({ key: 'page' }) page: number) {
 *   return this.userService.findMany({ page });
 * }
 * ```
 */
export const Query = createParameterDecorator(QUERY_TOKEN);

/**
 * Query 数据的注入令牌
 */
export const QUERY = Symbol.for(`QUERY`) as InjectionToken<any>;

/**
 * HTTP 路径参数选项
 */
export interface ParamOptions extends BaseParameterOptions {
    /** 参数键名，如果不指定则使用参数名 */
    key?: string;
    /** Zod 验证模式 */
    zod?: ZodTypeAny;
}

/**
 * Param 装饰器的注入令牌
 */
export const PARAM_TOKEN = Symbol.for(`PARAM_TOKEN`) as InjectionToken<
    ParameterMetadata<ParamOptions>
>;

/**
 * Param 装饰器 - 用于标记 HTTP 路径参数
 * 支持可选参数和 Zod 验证
 *
 * @example
 * ```typescript
 * @Get('/users/:id')
 * async getUser(@Param() params: { id: string }) {
 *   return this.userService.findById(params.id);
 * }
 *
 * @Get('/users/:id')
 * async getUser(@Param({ key: 'id' }) id: string) {
 *   return this.userService.findById(id);
 * }
 * ```
 */
export const Param = createParameterDecorator(PARAM_TOKEN);

/**
 * Param 数据的注入令牌
 */
export const PARAM = Symbol.for(`PARAM`) as InjectionToken<any>;

/**
 * HTTP 请求头参数选项
 */
export interface HeaderOptions extends BaseParameterOptions {
    /** 参数键名，如果不指定则使用参数名 */
    key?: string;
    /** Zod 验证模式 */
    zod?: ZodTypeAny;
}

/**
 * Header 装饰器的注入令牌
 */
export const HEADER_TOKEN = Symbol.for(`HEADER_TOKEN`) as InjectionToken<
    ParameterMetadata<HeaderOptions>
>;

/**
 * Header 装饰器 - 用于标记 HTTP 请求头参数
 * 支持可选参数和 Zod 验证
 *
 * @example
 * ```typescript
 * @Get('/users')
 * async getUsers(@Header() headers: RequestHeaders) {
 *   const auth = headers.authorization;
 *   return this.userService.findMany();
 * }
 *
 * @Get('/users')
 * async getUsers(@Header({ key: 'authorization' }) auth: string) {
 *   return this.userService.findMany();
 * }
 * ```
 */
export const Header = createParameterDecorator(HEADER_TOKEN);

/**
 * Header 数据的注入令牌
 */
export const HEADER = Symbol.for(`HEADER`) as InjectionToken<any>;

// ============================================================================
// Class Decorators - 类装饰器
// ============================================================================

/**
 * 控制器选项
 */
export interface ControllerOptions extends BaseDecoratorOptions {
    /** 控制器的基础路径 */
    path?: string;
}

/**
 * Controller 装饰器的注入令牌
 */
export const CONTROLLER_TOKEN = Symbol.for(
    `CONTROLLER_TOKEN`
) as InjectionToken<ClassMetadata<ControllerOptions>>;

/**
 * Controller 装饰器 - 用于标记 REST API 控制器类
 * 支持可选参数和路径配置
 *
 * @example
 * ```typescript
 * @Controller()
 * export class UserController {
 *   // 路由将基于类名自动生成
 * }
 *
 * @Controller({ path: '/api/users' })
 * export class UserController {
 *   // 所有路由都会以 /api/users 为前缀
 * }
 * ```
 */
export const Controller = createClassDecorator(CONTROLLER_TOKEN);

// ============================================================================
// HTTP Method Decorators - HTTP 方法装饰器
// ============================================================================

/**
 * HTTP 路由选项的基础接口
 */
export interface HttpRouteOptions extends BaseMethodOptions {
    /** 路由路径 */
    path?: string;
}

/**
 * GET 请求选项
 */
export interface GetOptions extends HttpRouteOptions {}

/**
 * GET 装饰器的注入令牌
 */
export const GET_TOKEN = Symbol.for(`GET_TOKEN`) as InjectionToken<
    MethodMetadata<GetOptions>
>;

/**
 * Get 装饰器 - 用于标记 HTTP GET 请求处理方法
 * 支持可选参数和路径配置
 *
 * @example
 * ```typescript
 * @Get()
 * async getUsers() {
 *   return this.userService.findAll();
 * }
 *
 * @Get({ path: '/active' })
 * async getActiveUsers() {
 *   return this.userService.findActive();
 * }
 * ```
 */
export const Get = createMethodDecorator(GET_TOKEN);

/**
 * POST 请求选项
 */
export interface PostOptions extends HttpRouteOptions {}

/**
 * POST 装饰器的注入令牌
 */
export const POST_TOKEN = Symbol.for(`POST_TOKEN`) as InjectionToken<
    MethodMetadata<PostOptions>
>;

/**
 * Post 装饰器 - 用于标记 HTTP POST 请求处理方法
 * 支持可选参数和路径配置
 *
 * @example
 * ```typescript
 * @Post()
 * async createUser(@Body() userData: CreateUserDto) {
 *   return this.userService.create(userData);
 * }
 *
 * @Post({ path: '/batch' })
 * async createUsers(@Body() usersData: CreateUserDto[]) {
 *   return this.userService.createMany(usersData);
 * }
 * ```
 */
export const Post = createMethodDecorator(POST_TOKEN);

/**
 * PUT 请求选项
 */
export interface PutOptions extends HttpRouteOptions {}

/**
 * PUT 装饰器的注入令牌
 */
export const PUT_TOKEN = Symbol.for(`PUT_TOKEN`) as InjectionToken<
    MethodMetadata<PutOptions>
>;

/**
 * Put 装饰器 - 用于标记 HTTP PUT 请求处理方法
 * 支持可选参数和路径配置
 *
 * @example
 * ```typescript
 * @Put({ path: '/:id' })
 * async updateUser(@Param({ key: 'id' }) id: string, @Body() userData: UpdateUserDto) {
 *   return this.userService.update(id, userData);
 * }
 * ```
 */
export const Put = createMethodDecorator(PUT_TOKEN);

/**
 * DELETE 请求选项
 */
export interface DeleteOptions extends HttpRouteOptions {}

/**
 * DELETE 装饰器的注入令牌
 */
export const DELETE_TOKEN = Symbol.for(`DELETE_TOKEN`) as InjectionToken<
    MethodMetadata<DeleteOptions>
>;

/**
 * Delete 装饰器 - 用于标记 HTTP DELETE 请求处理方法
 * 支持可选参数和路径配置
 *
 * @example
 * ```typescript
 * @Delete({ path: '/:id' })
 * async deleteUser(@Param({ key: 'id' }) id: string) {
 *   return this.userService.delete(id);
 * }
 * ```
 */
export const Delete = createMethodDecorator(DELETE_TOKEN);

/**
 * Server-Sent Events 选项
 */
export interface SseOptions extends HttpRouteOptions {}

/**
 * SSE 装饰器的注入令牌
 */
export const SSE_TOKEN = Symbol.for(`SSE_TOKEN`) as InjectionToken<
    MethodMetadata<SseOptions>
>;

/**
 * Sse 装饰器 - 用于标记 Server-Sent Events 处理方法
 * 支持可选参数和路径配置
 *
 * @example
 * ```typescript
 * @Sse({ path: '/events' })
 * async streamEvents() {
 *   return this.eventService.createStream();
 * }
 * ```
 */
export const Sse = createMethodDecorator(SSE_TOKEN);

// ============================================================================
// Additional HTTP Method Decorators - 额外的 HTTP 方法装饰器
// ============================================================================

/**
 * PATCH 请求选项
 */
export interface PatchOptions extends HttpRouteOptions {}

/**
 * PATCH 装饰器的注入令牌
 */
export const PATCH_TOKEN = Symbol.for(`PATCH_TOKEN`) as InjectionToken<
    MethodMetadata<PatchOptions>
>;

/**
 * Patch 装饰器 - 用于标记 HTTP PATCH 请求处理方法
 * 支持可选参数和路径配置
 *
 * @example
 * ```typescript
 * @Patch({ path: '/:id' })
 * async patchUser(@Param({ key: 'id' }) id: string, @Body() patchData: Partial<User>) {
 *   return this.userService.patch(id, patchData);
 * }
 * ```
 */
export const Patch = createMethodDecorator(PATCH_TOKEN);

/**
 * HEAD 请求选项
 */
export interface HeadOptions extends HttpRouteOptions {}

/**
 * HEAD 装饰器的注入令牌
 */
export const HEAD_TOKEN = Symbol.for(`HEAD_TOKEN`) as InjectionToken<
    MethodMetadata<HeadOptions>
>;

/**
 * Head 装饰器 - 用于标记 HTTP HEAD 请求处理方法
 * 支持可选参数和路径配置
 *
 * @example
 * ```typescript
 * @Head({ path: '/:id' })
 * async checkUser(@Param({ key: 'id' }) id: string) {
 *   const exists = await this.userService.exists(id);
 *   return exists ? 200 : 404;
 * }
 * ```
 */
export const Head = createMethodDecorator(HEAD_TOKEN);

/**
 * OPTIONS 请求选项
 */
export interface OptionsOptions extends HttpRouteOptions {}

/**
 * OPTIONS 装饰器的注入令牌
 */
export const OPTIONS_TOKEN = Symbol.for(`OPTIONS_TOKEN`) as InjectionToken<
    MethodMetadata<OptionsOptions>
>;

/**
 * Options 装饰器 - 用于标记 HTTP OPTIONS 请求处理方法
 * 支持可选参数和路径配置
 *
 * @example
 * ```typescript
 * @Options()
 * async getOptions() {
 *   return {
 *     allow: ['GET', 'POST', 'PUT', 'DELETE'],
 *     'access-control-allow-methods': 'GET, POST, PUT, DELETE'
 *   };
 * }
 * ```
 */
export const Options = createMethodDecorator(OPTIONS_TOKEN);

// ============================================================================
// Utility Types and Constants - 工具类型和常量
// ============================================================================

/**
 * HTTP 方法枚举
 */
export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS'
}

/**
 * HTTP 状态码常量
 */
export const HttpStatus = {
    // 2xx Success
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,

    // 3xx Redirection
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    NOT_MODIFIED: 304,

    // 4xx Client Error
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,

    // 5xx Server Error
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
} as const;

/**
 * HTTP 状态码类型
 */
export type HttpStatusCode = typeof HttpStatus[keyof typeof HttpStatus];

/**
 * 所有 HTTP 方法装饰器的令牌集合
 */
export const HTTP_METHOD_TOKENS = {
    GET: GET_TOKEN,
    POST: POST_TOKEN,
    PUT: PUT_TOKEN,
    DELETE: DELETE_TOKEN,
    PATCH: PATCH_TOKEN,
    HEAD: HEAD_TOKEN,
    OPTIONS: OPTIONS_TOKEN,
    SSE: SSE_TOKEN
} as const;

/**
 * 所有参数装饰器的令牌集合
 */
export const PARAMETER_TOKENS = {
    BODY: BODY_TOKEN,
    QUERY: QUERY_TOKEN,
    PARAM: PARAM_TOKEN,
    HEADER: HEADER_TOKEN
} as const;

/**
 * 检查给定的令牌是否为 HTTP 方法装饰器令牌
 * @param token 要检查的令牌
 * @returns 如果是 HTTP 方法装饰器令牌则返回 true
 */
export function isHttpMethodToken(token: InjectionToken<any>): boolean {
    return Object.values(HTTP_METHOD_TOKENS).includes(token as any);
}

/**
 * 检查给定的令牌是否为参数装饰器令牌
 * @param token 要检查的令牌
 * @returns 如果是参数装饰器令牌则返回 true
 */
export function isParameterToken(token: InjectionToken<any>): boolean {
    return Object.values(PARAMETER_TOKENS).includes(token as any);
}

/**
 * 根据 HTTP 方法获取对应的装饰器令牌
 * @param method HTTP 方法
 * @returns 对应的装饰器令牌，如果不存在则返回 undefined
 */
export function getHttpMethodToken(method: HttpMethod): InjectionToken<MethodMetadata<HttpRouteOptions>> | undefined {
    return HTTP_METHOD_TOKENS[method];
}

// ============================================================================
// Re-exports - 重新导出
// ============================================================================

// 从 core 包重新导出常用类型，方便使用
export type {
    BaseDecoratorOptions,
    BaseMethodOptions,
    BaseParameterOptions,
    ClassMetadata,
    MethodMetadata,
    ParameterMetadata,
    InjectionToken
} from "@decopro/core";
