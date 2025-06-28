# @decopro/core

Core dependency injection and module system for decopro framework

**Version**: 1.1.0

## Main Exports

- `CoreModule`
- `BootstrapOptions`
- `container`
- `registry`
- `injectable`
- `inject`
- `singleton`
- `scoped`
- `Lifecycle`
- `instanceCachingFactory`
- `instancePerContainerCachingFactory`
- `InjectionToken`
- `Injector`

## Architecture Overview

This package contains the following components:

- **class**: 5 file(s)
- **test**: 4 file(s)
- **interface**: 4 file(s)
- **types**: 1 file(s)
- **module**: 1 file(s)

### Key Dependencies

- **tsyringe**: used in 8 file(s)
- **tsyringe/dist/typings/types**: used in 1 file(s)
- **path**: used in 1 file(s)
- **tsup**: used in 1 file(s)


## API Reference

## Class

### src/DirectedGraph.ts

### Class: `DirectedGraph`
  - Property: `adjacencyList: Map<T, T[]>`
  - Constructor: `constructor(): void`
  - Method: `addVertex(vertex: T): void`
  - Method: `addEdge(from: T, to: T): void`
  - Method: `removeEdge(from: T, to: T): void`
  - Method: `removeVertex(vertex: T): void`
  - Method: `getVertices(): T[]`
  - Method: `getNeighbors(vertex: T): T[]`
  - Method: `dfs(start: T, callback: (vertex: T) => void): void`
  - Method: `bfs(start: T, callback: (vertex: T) => void): void`
  - Method: `topologicalSort(): T[] | null`
  - Method: `hasCycle(): boolean`
  - Method: `hasCycleDFS(): boolean`


**Tags**: class, export

### src/LinkedList.ts

### Class: `ListNode`
  - Property: `value: T`
  - Property: `next: ListNode<T> | null`
  - Constructor: `constructor(value: T): void`
    - Parameter: `value: T`

### Class: `LinkedList`
  - Property: `head: ListNode<T> | null`
  - Property: `tail: ListNode<T> | null`
  - Property: `_size: number`
  - Constructor: `constructor(): void`
  - Method: `append(value: T): void`
  - Method: `prepend(value: T): void`
  - Method: `insertAt(index: number, value: T): void`
  - Method: `removeAt(index: number): T | null`
  - Method: `remove(value: T): T | null`
  - Method: `indexOf(value: T): number`
  - Method: `size(): number`
  - Method: `isEmpty(): boolean`
  - Method: `toArray(): T[]`
  - Method: `getNodeAt(index: number): ListNode<T> | null`


**Tags**: class, export

### src/UndirectedGraph.ts

### Class: `UndirectedGraph`
  - Property: `adjacencyList: Map<T, T[]>`
  - Constructor: `constructor(): void`
  - Method: `addVertex(vertex: T): void`
  - Method: `addEdge(vertex1: T, vertex2: T): void`
  - Method: `removeEdge(vertex1: T, vertex2: T): void`
  - Method: `removeVertex(vertex: T): void`
  - Method: `getNeighbors(vertex: T): T[]`
  - Method: `getVertices(): T[]`
  - Method: `dfs(startVertex: T, callback?: (vertex: T) => void): T[]`
  - Method: `bfs(startVertex: T, callback?: (vertex: T) => void): T[]`
  - Method: `print(): string`


**Tags**: class, export

### src/error.ts

### Class: `DecoProError`

基础错误类，提供更好的错误信息和调试支持


  - Property: `code: string`
  - Property: `timestamp: Date`
  - Constructor: `constructor(message: string, code: string): void`
    - Parameter: `message: string`
    - Parameter: `code: string`
  - Method: `toJSON(): void`
    
    获取结构化的错误信息
    

### Class: `DuplicateClassNameError`

类名重复错误


  - Constructor: `constructor(className: string): void`
    - Parameter: `className: string`

### Class: `ClassNameNotFoundError`

类名未找到错误


  - Constructor: `constructor(className: string): void`
    - Parameter: `className: string`

### Class: `JsonWithTypeNameError`

JSON类型名称错误


  - Constructor: `constructor(details?: string): void`
    - Parameter: `details: string`

### Class: `InjectionError`

依赖注入错误


  - Constructor: `constructor(token: string, details?: string): void`
    - Parameter: `token: string`
    - Parameter: `details: string`

### Class: `CircularDependencyError`

循环依赖错误


  - Constructor: `constructor(dependencyChain: string[]): void`
    - Parameter: `dependencyChain: string[]`


**Tags**: class, export

### src/injector.ts

### Class: `Injector`

增强的依赖注入器，提供类型安全的依赖解析和序列化功能


  - Constructor: `constructor(injector: DependencyContainer): void`
    - Parameter: `injector: DependencyContainer`
  - Method: `get(token: InjectionToken<T>): T`
    
    解析单个依赖
    
  - Method: `getAll(token: InjectionToken<T>): T[]`
    
    解析所有匹配的依赖
    
  - Method: `create(): Injector`
    
    创建子容器
    
  - Method: `canResolve(token: InjectionToken<T>): boolean`
    
    检查是否可以解析指定的令牌
    
  - Method: `toJson(instance: T, _type?: Type<T>): any`
    
    将实例序列化为JSON对象
    
  - Method: `fromJson(obj: any, type?: Type<T>): T`
    
    从JSON对象反序列化为实例
    
  - Method: `filterTypeByName(name: string): void`
    
    根据类名过滤类型
    
  - Method: `getRegisteredTypeNames(): string[]`
    
    获取所有已注册的类型名称
    
  - Method: `isTypeRegistered(type: Type<T>): boolean`
    
    检查指定类型是否已注册
    
  - Method: `cleanup(instance: any): Promise<void>`
    
    清理资源（如果实例实现了OnDestroy接口）
    


**Tags**: async, class, function, export

## Test

### src/__tests__/bootstrap-deps.test.ts

**Tags**: test, dependency-injection, service, async, class

### src/__tests__/decorator-advanced.test.ts

**Tags**: test, dependency-injection, service, async, class

### src/__tests__/injector.test.ts

**Tags**: test, async, class, function

### src/__tests__/setup.ts

**Tags**: test

## Interface

### src/decorator.ts

### Type Alias: `IPropertyDecorator = (target: any, propertyKey: any) => void`
### Interface: `ClassMetadata`

类元数据接口


  - target: Type<any>
  - options: O

### Interface: `BaseDecoratorOptions`

类装饰器选项的基础接口


  - token?: InjectionToken<any> | InjectionToken<any>[]

### Interface: `ClassDecoratorFactory`

类装饰器工厂函数的重载类型



### Function: `createClassDecorator(token: InjectionToken<ClassMetadata<O>>, defaultOptions?: Partial<O>): ClassDecoratorFactory<O>`

创建类装饰器，支持可选参数


### Interface: `PropertyMetadata`

属性元数据接口


  - target: Type<any>
  - property: string | symbol
  - options: O

### Interface: `BasePropertyOptions`

属性装饰器选项的基础接口


  - name?: string
  - required?: boolean
  - defaultValue?: any
  - validator?: (value: any) => boolean | string
  - transformer?: (value: any) => any

### Interface: `PropertyDecoratorFactory`

属性装饰器工厂函数的重载类型



### Function: `createPropertyDecorator(token: InjectionToken<PropertyMetadata<O>>, defaultOptions?: Partial<O>): PropertyDecoratorFactory<O>`

创建属性装饰器，支持可选参数


### Interface: `MethodMetadata`

方法元数据接口


  - target: Type<any>
  - property: string | symbol
  - descriptor: TypedPropertyDescriptor<any>
  - options: O

### Interface: `BaseMethodOptions`

方法装饰器选项的基础接口


  - async?: boolean
  - timeout?: number
  - retries?: number
  - cache?: boolean
  - middleware?: Array<
        (
            target: any,
            property: string | symbol,
            descriptor: PropertyDescriptor
        ) => void
    >

### Interface: `MethodDecoratorFactory`

方法装饰器工厂函数的重载类型



### Function: `createMethodDecorator(token: InjectionToken<MethodMetadata<O>>, defaultOptions?: Partial<O>): MethodDecoratorFactory<O>`

创建方法装饰器，支持可选参数


### Interface: `ParameterMetadata`

参数元数据接口


  - target: Type<any>
  - property: string | symbol | undefined
  - parameterIndex: number
  - options: O

### Interface: `BaseParameterOptions`

参数装饰器选项的基础接口


  - name?: string
  - type?: Type<any>
  - optional?: boolean
  - defaultValue?: any
  - validator?: (value: any) => boolean
  - transformer?: (value: any) => any

### Interface: `ParameterDecoratorFactory`

参数装饰器工厂函数的重载类型



### Function: `createParameterDecorator(token: InjectionToken<ParameterMetadata<O>>, defaultOptions?: Partial<O>): ParameterDecoratorFactory<O>`

创建参数装饰器，支持可选参数


### Function: `conditional(condition: boolean | (() => boolean), decorator: T): T`

条件装饰器：根据条件决定是否应用装饰器


### Function: `compose(decorators: Array<ClassDecorator>): ClassDecorator`

组合装饰器：将多个装饰器组合成一个


### Function: `async(asyncDecorator: (options?: O) => Promise<ClassDecorator>): (options?: O) => ClassDecorator`

异步装饰器：支持异步初始化的装饰器


### Function: `cached(decorator: T): T`
### Function: `validateOptions(validator: (options: O) => boolean | string, errorMessage?: string): (options: O) => O`

验证装饰器选项


### Function: `mergeOptions(defaultOptions: T, userOptions?: Partial<U>): T & Partial<U>`

类型安全的装饰器选项合并


### Function: `deepMergeOptions(defaultOptions: T, userOptions?: U): T & U`

装饰器选项的深度合并



**Tags**: async, interface, types, function, export

### src/index.ts

### Class: `CoreModule`

核心模块，提供基础的依赖注入功能



### Interface: `BootstrapOptions`

引导配置选项


  - debug?: boolean
    
    是否启用调试模式
    
  - timeout?: number
    
    初始化超时时间（毫秒）
    
  - errorStrategy?: "throw" | "warn" | "ignore"
    
    错误处理策略
    

### Function: `bootstrap(modules: Type<any>[], options: BootstrapOptions): Promise<Injector>`

引导应用程序



**Tags**: async, interface, types, class, function, export

### src/input.ts

### Interface: `InputOptions`

Input 装饰器选项接口


  - name?: string
    
    属性的序列化名称
    
  - target?: () => Type<T>
    
    目标类型工厂函数
    
  - description?: string
    
    属性描述
    
  - required?: boolean
    
    是否必需
    
  - defaultValue?: T
    
    默认值
    
  - validator?: (value: T) => boolean | string
    
    值验证器
    
  - transformer?: (value: any) => T
    
    值转换器
    
  - readonly?: boolean
    
    是否只读
    
  - min?: number
    
    最小值（用于数字类型）
    
  - max?: number
    
    最大值（用于数字类型）
    
  - minLength?: number
    
    最小长度（用于字符串/数组类型）
    
  - maxLength?: number
    
    最大长度（用于字符串/数组类型）
    
  - pattern?: RegExp
    
    正则表达式验证（用于字符串类型）
    
  - enum?: T[]
    
    枚举值
    

### Function: `ValidatedInput(options: InputOptions<T>): IPropertyDecorator`

创建带验证的 Input 装饰器


### Function: `ReadonlyInput(): IPropertyDecorator`

创建只读 Input 装饰器


### Function: `ReadonlyInput(options: Omit<InputOptions<T>, "readonly">): IPropertyDecorator`

创建只读 Input 装饰器


### Function: `ReadonlyInput(options?: Omit<InputOptions<T>, "readonly">): IPropertyDecorator`

创建只读 Input 装饰器


### Function: `RequiredInput(): IPropertyDecorator`

创建必需 Input 装饰器


### Function: `RequiredInput(options: Omit<InputOptions<T>, "required">): IPropertyDecorator`

创建必需 Input 装饰器


### Function: `RequiredInput(options?: Omit<InputOptions<T>, "required">): IPropertyDecorator`

创建必需 Input 装饰器


### Interface: `InjectableOptions`

Injectable 装饰器选项接口


  - token?: InjectionToken<any> | InjectionToken<any>[]
    
    注入令牌
    
  - singleton?: boolean
    
    是否为单例
    
  - scope?: "transient" | "singleton" | "container"
    
    作用域
    
  - factory?: (...args: any[]) => any
    
    工厂函数
    
  - deps?: Array<InjectionToken<any>>
    
    依赖项
    

### Function: `Singleton(options?: Omit<InjectableOptions, "singleton" | "scope">): ClassDecorator`

创建单例 Injectable 装饰器


### Function: `Transient(options?: Omit<InjectableOptions, "scope">): ClassDecorator`

创建瞬态 Injectable 装饰器



**Tags**: interface, types, function, export

### src/tokens.ts

### Interface: `AppInitOptions`
  - deps?: Type<any>[]

### Interface: `AppInit`

### Function: `isAppInit(val: any): val is AppInit`

**Tags**: async, interface, types, function, export

## Types

### src/types.ts

### Type Alias: `Type = constructor<T>`

表示一个可构造的类型


### Function: `isType(val: unknown): val is Type<T>`

类型守卫：检查值是否为构造函数类型


### Interface: `HasToken`

表示具有注入令牌的对象


  - token: InjectionToken<T> | InjectionToken<T>[]

### Function: `hasToken(val: unknown): val is HasToken<T>`

类型守卫：检查对象是否具有有效的注入令牌


### Interface: `OnInit`

生命周期接口：初始化



### Function: `isOnInit(val: unknown): val is OnInit`

类型守卫：检查对象是否实现了OnInit接口


### Interface: `OnDestroy`

生命周期接口：销毁（修正拼写错误）



### Function: `isOnDestroy(val: unknown): val is OnDestroy`

类型守卫：检查对象是否实现了OnDestroy接口


### Interface: `JsonWithTypeName`

带有类型名称的JSON对象接口


  - __typeName: string

### Function: `isJsonWithTypeName(val: unknown): val is JsonWithTypeName`

类型守卫：检查对象是否为带类型名称的JSON



**Tags**: async, interface, types, function, export

## Module

### tsup.config.ts

**Tags**: async, export


## Usage Examples

```typescript
// Test: should properly inject deps into AppInit modules
const initOrder: string[] = [];

        // 创建一个基础服务
        @Injectable()
        class DatabaseService {
            connect() {
                return "database-connected";
            }
        }

        // 创建一个依赖于 DatabaseService 的模块
        @AppInit({
            deps: [DatabaseService]
```

```typescript
// Test: should handle complex dependency chains
const initOrder: string[] = [];

        // 基础服务
        @Injectable()
        class ConfigService {
            getConfig() {
                return { env: "test" };
            }
        }

        @Injectable()
        class LoggerService {
            log(message: string) {
                return `[LOG] ${message}`;
            }
        }

        // 第一层模块
        @AppInit({
            deps: [ConfigService]
```

```typescript
// Test: should support optional parameters
class TestClass {
                @Input() // 无参数调用
                simpleProperty: string = "";

                @Input({ name: "customName" }) // 带参数调用
                namedProperty: string = "";
            }

            expect(TestClass).toBeDefined();
```

```typescript
// Test: should support validated input
class TestClass {
                @ValidatedInput({
                    required: true,
                    defaultValue: "default",
                    min: 0,
                    max: 100
```

```typescript
// Test: should support readonly input
class TestClass {
                @ReadonlyInput({ name: "readonlyProp" })
                readonlyProperty: string = "readonly";
            }

            expect(TestClass).toBeDefined();
```

```typescript
// Test: should support required input
class TestClass {
                @RequiredInput({ defaultValue: "required" })
                requiredProperty: string = "";
            }

            expect(TestClass).toBeDefined();
```

```typescript
// Test: should support optional parameters
@Injectable() // 无参数调用
            class SimpleService {}

            @Injectable({ singleton: true }) // 带参数调用
            class ConfiguredService {}

            expect(SimpleService).toBeDefined();
            expect(ConfiguredService).toBeDefined();
```

```typescript
// Test: should support singleton decorator
@Singleton()
            class SingletonService {}

            @Singleton({ deps: [] })
            class ConfiguredSingletonService {}

            expect(SingletonService).toBeDefined();
            expect(ConfiguredSingletonService).toBeDefined();
```

```typescript
// Test: should support transient decorator
@Transient()
            class TransientService {}

            expect(TransientService).toBeDefined();
```

```typescript
// Test: should support conditional decorators
const shouldApply = true;

            @conditional(shouldApply, Injectable())
            class ConditionalService {}

            expect(ConditionalService).toBeDefined();
```

```typescript
// Test: should support decorator composition
const combinedDecorator = compose(Injectable(), (target: any) => {
                target.prototype.composed = true;
                return target;
```

```typescript
// Test: should validate options correctly
const validator = validateOptions<{ min: number; max: number }>(
                (options) => {
                    return options.min <= options.max || "Min must be <= Max";
```

```typescript
// Test: should handle complex input validation
class UserModel {
                @ValidatedInput({
                    required: true,
                    defaultValue: "",
                    minLength: 2,
                    maxLength: 50,
                    pattern: /^[a-zA-Z\s]+$/,
                    validator: (value: string) => value.trim().length > 0
```

```typescript
// Test: should handle service with complex configuration
@Singleton({
                deps: [],
                factory: () => new DatabaseService("production")
```

```typescript
// Test: should handle AppInit with dependencies injection
// 创建一个依赖服务
            @Injectable()
            class ConfigService {
                getConfig() {
                    return { database: "test-db" };
                }
            }

            // 创建一个依赖于 ConfigService 的 AppInit 模块
            @AppInit({
                deps: [ConfigService]
```

```typescript
// Test: should resolve dependencies
const service = injector.get(TestService);
            expect(service).toBeInstanceOf(TestService);
            expect(service.getValue()).toBe("test-value");
```

```typescript
// Test: should check if token can be resolved
expect(injector.canResolve(TestService)).toBe(true);
```

```typescript
// Test: should return empty array for non-existent tokens
const NON_EXISTENT_TOKEN = Symbol("NON_EXISTENT");
            const result = injector.getAll(NON_EXISTENT_TOKEN);
            expect(result).toEqual([]);
```

```typescript
// Test: should handle null and undefined values
expect(injector.toJson(null)).toBe(null);
            expect(injector.toJson(undefined)).toBe(undefined);
            expect(injector.toJson("string")).toBe("string");
            expect(injector.toJson(123)).toBe(123);
```

```typescript
// Test: should handle arrays
const arr = [1, 2, 3];
            expect(injector.toJson(arr)).toEqual([1, 2, 3]);
```

```typescript
// Test: should handle Date objects
const date = new Date("2023-01-01T00:00:00.000Z");
            expect(injector.toJson(date)).toBe("2023-01-01T00:00:00.000Z");
```

```typescript
// Test: should handle basic types
expect(injector.fromJson(null)).toBe(null);
            expect(injector.fromJson(undefined)).toBe(undefined);
            expect(injector.fromJson("string")).toBe("string");
            expect(injector.fromJson(123)).toBe(123);
```

```typescript
// Test: should handle arrays
const arr = [1, 2, 3];
            expect(injector.fromJson(arr)).toEqual([1, 2, 3]);
```

```typescript
// Test: should cleanup objects with onDestroy method
const instance = new CleanupTest();
            await injector.cleanup(instance);
            expect(instance.cleaned).toBe(true);
```

```typescript
// Test: should handle objects without onDestroy method
const instance = { value: "test" };
            await expect(injector.cleanup(instance)).resolves.toBeUndefined();
```
