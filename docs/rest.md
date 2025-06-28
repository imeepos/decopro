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

- **controller**: 1 file(s)
- **module**: 1 file(s)

### Key Dependencies

- **@decopro/core**: used in 1 file(s)
- **zod**: used in 1 file(s)
- **tsup**: used in 1 file(s)


## API Reference

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
