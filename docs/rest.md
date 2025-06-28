# @decopro/rest

**Version**: 1.1.0

## Main Exports

- `BodyOptions`
- `BODY_TOKEN`
- `Body`
- `BODY`
- `QueryOptions`
- `QUERY_TOKEN`
- `Query`
- `QUERY`
- `ParamOptions`
- `PARAM_TOKEN`
- `Param`
- `PARAM`
- `HeaderOptions`
- `HEADER_TOKEN`
- `Header`
- `HEADER`
- `ControllerOptions`
- `CONTROLLER_TOKEN`
- `UserController`
- `Controller`
- `HttpRouteOptions`
- `GetOptions`
- `GET_TOKEN`
- `Get`
- `PostOptions`
- `POST_TOKEN`
- `Post`
- `PutOptions`
- `PUT_TOKEN`
- `Put`
- `DeleteOptions`
- `DELETE_TOKEN`
- `Delete`
- `SseOptions`
- `SSE_TOKEN`
- `Sse`
- `PatchOptions`
- `PATCH_TOKEN`
- `Patch`
- `HeadOptions`
- `HEAD_TOKEN`
- `Head`
- `OptionsOptions`
- `OPTIONS_TOKEN`
- `Options`
- `HttpMethod`
- `HttpStatus`
- `HttpStatusCode`
- `HTTP_METHOD_TOKENS`
- `PARAMETER_TOKENS`
- `isHttpMethodToken`
- `isParameterToken`
- `getHttpMethodToken`

## Architecture Overview

This package contains the following components:

- **test**: 1 file(s)
- **controller**: 1 file(s)
- **module**: 1 file(s)

### Key Dependencies

- **@decopro/core**: used in 1 file(s)
- **zod**: used in 1 file(s)
- **tsup**: used in 1 file(s)


## API Reference

## Test

### src/__tests__/decorators.test.ts

**Tags**: test, controller, api, class, function

## Controller

### src/index.ts

### Interface: `BodyOptions`

HTTP 请求体参数选项


  - key?: string
    
    参数键名，如果不指定则使用参数名
    
  - zod?: ZodTypeAny
    
    Zod 验证模式
    

### Interface: `QueryOptions`

HTTP 查询参数选项


  - key?: string
    
    参数键名，如果不指定则使用参数名
    
  - zod?: ZodTypeAny
    
    Zod 验证模式
    

### Interface: `ParamOptions`

HTTP 路径参数选项


  - key?: string
    
    参数键名，如果不指定则使用参数名
    
  - zod?: ZodTypeAny
    
    Zod 验证模式
    

### Interface: `HeaderOptions`

HTTP 请求头参数选项


  - key?: string
    
    参数键名，如果不指定则使用参数名
    
  - zod?: ZodTypeAny
    
    Zod 验证模式
    

### Interface: `ControllerOptions`

控制器选项


  - path?: string
    
    控制器的基础路径
    

### Interface: `HttpRouteOptions`

HTTP 路由选项的基础接口


  - path?: string
    
    路由路径
    

### Interface: `GetOptions`

GET 请求选项



### Interface: `PostOptions`

POST 请求选项



### Interface: `PutOptions`

PUT 请求选项



### Interface: `DeleteOptions`

DELETE 请求选项



### Interface: `SseOptions`

Server-Sent Events 选项



### Interface: `PatchOptions`

PATCH 请求选项



### Interface: `HeadOptions`

HEAD 请求选项



### Interface: `OptionsOptions`

OPTIONS 请求选项



### Enum: `HttpMethod`

HTTP 方法枚举


  - Member: `GET`
  - Member: `POST`
  - Member: `PUT`
  - Member: `DELETE`
  - Member: `PATCH`
  - Member: `HEAD`
  - Member: `OPTIONS`
### Type Alias: `HttpStatusCode = typeof HttpStatus[keyof typeof HttpStatus]`

HTTP 状态码类型


### Function: `isHttpMethodToken(token: InjectionToken<any>): boolean`

检查给定的令牌是否为 HTTP 方法装饰器令牌


### Function: `isParameterToken(token: InjectionToken<any>): boolean`

检查给定的令牌是否为参数装饰器令牌


### Function: `getHttpMethodToken(method: HttpMethod): InjectionToken<MethodMetadata<HttpRouteOptions>> | undefined`

根据 HTTP 方法获取对应的装饰器令牌



**Tags**: controller, api, async, interface, types, class, function, export

## Module

### tsup.config.ts

**Tags**: export


## Usage Examples

```typescript
// Test: should return false for non-HTTP method tokens
expect(isHttpMethodToken(BODY_TOKEN)).toBe(false);
                expect(isHttpMethodToken(QUERY_TOKEN)).toBe(false);
                expect(isHttpMethodToken(PARAM_TOKEN)).toBe(false);
                expect(isHttpMethodToken(HEADER_TOKEN)).toBe(false);
                expect(isHttpMethodToken(CONTROLLER_TOKEN)).toBe(false);
```

```typescript
// Test: should return true for parameter tokens
expect(isParameterToken(BODY_TOKEN)).toBe(true);
                expect(isParameterToken(QUERY_TOKEN)).toBe(true);
                expect(isParameterToken(PARAM_TOKEN)).toBe(true);
                expect(isParameterToken(HEADER_TOKEN)).toBe(true);
```

```typescript
// Test: should return false for non-parameter tokens
expect(isParameterToken(GET_TOKEN)).toBe(false);
                expect(isParameterToken(POST_TOKEN)).toBe(false);
                expect(isParameterToken(CONTROLLER_TOKEN)).toBe(false);
```

```typescript
// Test: should have correct status codes
expect(HttpStatus.OK).toBe(200);
                expect(HttpStatus.CREATED).toBe(201);
                expect(HttpStatus.BAD_REQUEST).toBe(400);
                expect(HttpStatus.UNAUTHORIZED).toBe(401);
                expect(HttpStatus.NOT_FOUND).toBe(404);
                expect(HttpStatus.INTERNAL_SERVER_ERROR).toBe(500);
```

```typescript
// Test: should have correct method values
expect(HttpMethod.GET).toBe("GET");
                expect(HttpMethod.POST).toBe("POST");
                expect(HttpMethod.PUT).toBe("PUT");
                expect(HttpMethod.DELETE).toBe("DELETE");
                expect(HttpMethod.PATCH).toBe("PATCH");
                expect(HttpMethod.HEAD).toBe("HEAD");
                expect(HttpMethod.OPTIONS).toBe("OPTIONS");
```

```typescript
```typescript
```

```typescript
```typescript
```

```typescript
```typescript
```

```typescript
```typescript
```

```typescript
```typescript
```

```typescript
```typescript
```

```typescript
```typescript
```

```typescript
```typescript
```

```typescript
```typescript
```

```typescript
```typescript
```

```typescript
```typescript
```

```typescript
```typescript
```

```typescript
```typescript
```
