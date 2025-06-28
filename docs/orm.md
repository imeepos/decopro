# @decopro/orm

**Version**: 1.1.0

## Architecture Overview

This package contains the following components:

- **test**: 1 file(s)
- **entity**: 1 file(s)
- **module**: 2 file(s)

### Key Dependencies

- **@decopro/core**: used in 1 file(s)
- **zod**: used in 1 file(s)
- **tsup**: used in 1 file(s)


## API Reference

## Test

### src/__tests__/decorator.test.ts

**Tags**: test, entity, database, column, relationship, class

## Entity

### src/decorator.ts

### Enum: `ColumnType`

数据库列类型枚举


  - Member: `INT`
  - Member: `BIGINT`
  - Member: `FLOAT`
  - Member: `DOUBLE`
  - Member: `DECIMAL`
  - Member: `VARCHAR`
  - Member: `TEXT`
  - Member: `CHAR`
  - Member: `DATE`
  - Member: `TIME`
  - Member: `DATETIME`
  - Member: `TIMESTAMP`
  - Member: `BOOLEAN`
  - Member: `JSON`
  - Member: `JSONB`
  - Member: `BLOB`
  - Member: `BINARY`
### Enum: `RelationType`

关系类型枚举


  - Member: `ONE_TO_ONE`
  - Member: `ONE_TO_MANY`
  - Member: `MANY_TO_ONE`
  - Member: `MANY_TO_MANY`
### Enum: `IndexType`

索引类型枚举


  - Member: `PRIMARY`
  - Member: `UNIQUE`
  - Member: `INDEX`
  - Member: `FULLTEXT`
  - Member: `SPATIAL`
### Enum: `CascadeType`

级联操作类型


  - Member: `PERSIST`
  - Member: `REMOVE`
  - Member: `UPDATE`
  - Member: `REFRESH`
  - Member: `ALL`
### Enum: `FetchType`

获取策略


  - Member: `LAZY`
  - Member: `EAGER`
### Interface: `EntityOptions`

实体装饰器选项


  - tableName?: string
    
    表名，如果不指定则使用类名
    
  - schema?: string
    
    数据库模式名
    
  - abstract?: boolean
    
    是否为抽象实体（不创建表）
    
  - comment?: string
    
    表注释
    
  - engine?: string
    
    表引擎（MySQL）
    
  - charset?: string
    
    字符集
    
  - collation?: string
    
    排序规则
    

### Interface: `BaseColumnOptions`

基础列选项


  - name?: string
    
    列名，如果不指定则使用属性名
    
  - type?: ColumnType | string
    
    列类型
    
  - length?: number
    
    列长度
    
  - precision?: number
    
    精度（用于 decimal 类型）
    
  - scale?: number
    
    小数位数（用于 decimal 类型）
    
  - nullable?: boolean
    
    是否可为空
    
  - default?: any
    
    默认值
    
  - comment?: string
    
    列注释
    
  - charset?: string
    
    字符集
    
  - collation?: string
    
    排序规则
    
  - unsigned?: boolean
    
    是否为无符号数（MySQL）
    
  - zerofill?: boolean
    
    是否自动填充零（MySQL）
    
  - validator?: (value: any) => boolean | string
    
    数据验证器
    
  - zodValidator?: ZodTypeAny
    
    Zod 验证模式
    

### Interface: `ColumnOptions`

普通列选项


  - primary?: boolean
    
    是否为主键
    
  - unique?: boolean
    
    是否唯一
    
  - generated?: boolean | "increment" | "uuid" | "rowid"
    
    是否为生成列
    
  - generationStrategy?: "increment" | "uuid" | "rowid"
    
    生成策略
    
  - select?: boolean
    
    是否为选择列（查询时是否默认选择）
    
  - insert?: boolean
    
    是否为插入列（插入时是否包含）
    
  - update?: boolean
    
    是否为更新列（更新时是否包含）
    
  - enum?: string[] | Record<string, string | number>
    
    枚举值（用于 enum 类型）
    
  - array?: boolean
    
    数组类型（PostgreSQL）
    

### Interface: `PrimaryColumnOptions`

主键列选项


  - generated?: boolean | "increment" | "uuid" | "rowid"
    
    生成策略
    

### Interface: `PrimaryGeneratedColumnOptions`

自增主键列选项


  - strategy?: "increment" | "uuid" | "rowid"
    
    生成策略
    

### Interface: `BaseRelationOptions`

基础关系选项


  - type?: () => Function
    
    目标实体类型
    
  - eager?: boolean
    
    获取策略
    
  - cascade?: CascadeType[] | boolean
    
    级联操作
    
  - nullable?: boolean
    
    关系是否可为空
    
  - onDelete?: "RESTRICT" | "CASCADE" | "SET NULL" | "NO ACTION" | "SET DEFAULT"
    
    当目标实体被删除时的行为
    
  - onUpdate?: "RESTRICT" | "CASCADE" | "SET NULL" | "NO ACTION" | "SET DEFAULT"
    
    当目标实体被更新时的行为
    

### Interface: `OneToOneOptions`

一对一关系选项


  - joinColumn?: string
    
    外键列名
    
  - owner?: boolean
    
    是否为关系的拥有方
    
  - inverseSide?: string
    
    反向关系的属性名
    

### Function: `OneToOne(): PropertyDecorator`

OneToOne 装饰器 - 用于标记一对一关系


### Function: `OneToOne(type: () => Function, options?: Omit<OneToOneOptions, 'type'>): PropertyDecorator`

OneToOne 装饰器 - 用于标记一对一关系


### Function: `OneToOne(options: OneToOneOptions): PropertyDecorator`

OneToOne 装饰器 - 用于标记一对一关系


### Function: `OneToOne(typeOrOptions?: (() => Function) | OneToOneOptions, options?: Omit<OneToOneOptions, 'type'>): PropertyDecorator`

OneToOne 装饰器 - 用于标记一对一关系


### Interface: `OneToManyOptions`

一对多关系选项


  - mappedBy?: string
    
    反向关系的属性名
    

### Function: `OneToMany(): PropertyDecorator`

OneToMany 装饰器 - 用于标记一对多关系


### Function: `OneToMany(type: () => Function, options?: Omit<OneToManyOptions, 'type'>): PropertyDecorator`

OneToMany 装饰器 - 用于标记一对多关系


### Function: `OneToMany(options: OneToManyOptions): PropertyDecorator`

OneToMany 装饰器 - 用于标记一对多关系


### Function: `OneToMany(typeOrOptions?: (() => Function) | OneToManyOptions, options?: Omit<OneToManyOptions, 'type'>): PropertyDecorator`

OneToMany 装饰器 - 用于标记一对多关系


### Interface: `ManyToOneOptions`

多对一关系选项


  - joinColumn?: string
    
    外键列名
    

### Function: `ManyToOne(): PropertyDecorator`

ManyToOne 装饰器 - 用于标记多对一关系


### Function: `ManyToOne(type: () => Function, options?: Omit<ManyToOneOptions, 'type'>): PropertyDecorator`

ManyToOne 装饰器 - 用于标记多对一关系


### Function: `ManyToOne(options: ManyToOneOptions): PropertyDecorator`

ManyToOne 装饰器 - 用于标记多对一关系


### Function: `ManyToOne(typeOrOptions?: (() => Function) | ManyToOneOptions, options?: Omit<ManyToOneOptions, 'type'>): PropertyDecorator`

ManyToOne 装饰器 - 用于标记多对一关系


### Interface: `ManyToManyOptions`

多对多关系选项


  - joinTable?: string
    
    中间表名
    
  - joinColumn?: string
    
    当前实体的外键列名
    
  - inverseJoinColumn?: string
    
    目标实体的外键列名
    
  - mappedBy?: string
    
    反向关系的属性名
    

### Function: `ManyToMany(): PropertyDecorator`

ManyToMany 装饰器 - 用于标记多对多关系


### Function: `ManyToMany(type: () => Function, options?: Omit<ManyToManyOptions, 'type'>): PropertyDecorator`

ManyToMany 装饰器 - 用于标记多对多关系


### Function: `ManyToMany(options: ManyToManyOptions): PropertyDecorator`

ManyToMany 装饰器 - 用于标记多对多关系


### Function: `ManyToMany(typeOrOptions?: (() => Function) | ManyToManyOptions, options?: Omit<ManyToManyOptions, 'type'>): PropertyDecorator`

ManyToMany 装饰器 - 用于标记多对多关系


### Interface: `IndexOptions`

索引选项


  - name?: string
    
    索引名称
    
  - type?: IndexType
    
    索引类型
    
  - unique?: boolean
    
    是否唯一索引
    
  - columns?: string[]
    
    索引列（用于复合索引）
    
  - where?: string
    
    索引条件（部分索引）
    
  - using?: "btree" | "hash" | "gist" | "gin" | "spgist" | "brin"
    
    索引方法（PostgreSQL）
    

### Interface: `UniqueOptions`

唯一索引选项


  - name?: string
    
    约束名称
    
  - columns?: string[]
    
    约束列（用于复合唯一约束）
    

### Interface: `LifecycleOptions`

生命周期钩子选项


  - async?: boolean
    
    是否异步执行
    
  - order?: number
    
    执行顺序
    

### Function: `isEntityToken(token: InjectionToken<any>): boolean`

检查给定的令牌是否为实体装饰器令牌


### Function: `isColumnToken(token: InjectionToken<any>): boolean`

检查给定的令牌是否为列装饰器令牌


### Function: `isRelationToken(token: InjectionToken<any>): boolean`

检查给定的令牌是否为关系装饰器令牌


### Function: `isIndexToken(token: InjectionToken<any>): boolean`

检查给定的令牌是否为索引装饰器令牌


### Function: `isLifecycleToken(token: InjectionToken<any>): boolean`

检查给定的令牌是否为生命周期装饰器令牌


### Function: `createEntity(entityClass: new () => T, options?: EntityOptions): new () => T`

创建实体类的工厂函数


### Function: `getTableName(entityClass: new () => T): string`

获取实体的表名


### Function: `getEntityColumns(entityClass: new () => T): Array<{
    propertyName: string;
    columnName: string;
    type: ColumnType | string;
    options: ColumnOptions;
}>`

获取实体的列信息


### Function: `getEntityRelations(entityClass: new () => T): Array<{
    propertyName: string;
    type: RelationType;
    targetEntity: Function;
    options: BaseRelationOptions;
}>`

获取实体的关系信息


### Function: `getEntityIndexes(entityClass: new () => T): Array<{
    name?: string;
    columns: string[];
    unique?: boolean;
    options: IndexOptions;
}>`

获取实体的索引信息



**Tags**: entity, database, column, relationship, async, interface, types, class, function, export

## Module

### src/index.ts

**Tags**: export

### tsup.config.ts

**Tags**: export


## Usage Examples

```typescript
// Test: should apply Entity decorator with default options
expect(() => {
                @Entity()
                class TestEntity {
                    id: number;
                }
```

```typescript
// Test: should apply Entity decorator with custom options
expect(() => {
                @Entity({
                    tableName: "custom_table",
                    schema: "public",
                    comment: "Test entity"
```

```typescript
// Test: should work with createEntity factory
expect(() => {
                class TestEntity {
                    id: number;
                }

                const EntityClass = createEntity(TestEntity, {
                    tableName: "test_table"
```

```typescript
// Test: should apply Column decorator
expect(() => {
                class TestEntity {
                    @Column()
                    name: string;

                    @Column({ type: ColumnType.VARCHAR, length: 100, nullable: false })
                    email: string;
                }
```

```typescript
// Test: should apply PrimaryColumn decorator
expect(() => {
                class TestEntity {
                    @PrimaryColumn()
                    id: number;

                    @PrimaryColumn({ type: ColumnType.VARCHAR, length: 36 })
                    uuid: string;
                }
```

```typescript
// Test: should apply PrimaryGeneratedColumn decorator
expect(() => {
                class TestEntity {
                    @PrimaryGeneratedColumn()
                    id: number;

                    @PrimaryGeneratedColumn({ strategy: "uuid" })
                    uuid: string;
                }
```

```typescript
// Test: should apply OneToOne decorator
expect(() => {
                class TestEntity {
                    @OneToOne(() => Profile)
                    profile: Profile;

                    @OneToOne(() => User, { cascade: true })
                    user: User;
                }
```

```typescript
// Test: should apply OneToMany decorator
expect(() => {
                class TestEntity {
                    @OneToMany(() => Post, { mappedBy: "author" })
                    posts: Post[];
                }
```

```typescript
// Test: should apply ManyToOne decorator
expect(() => {
                class TestEntity {
                    @ManyToOne(() => User, { joinColumn: "author_id" })
                    author: User;
                }
```

```typescript
// Test: should apply ManyToMany decorator
expect(() => {
                class TestEntity {
                    @ManyToMany(() => Role, { joinTable: "user_roles" })
                    roles: Role[];
                }
```

```typescript
// Test: should apply Index decorator
expect(() => {
                class TestEntity {
                    @Index()
                    @Column()
                    email: string;

                    @Index({ unique: true, name: "idx_username" })
                    @Column()
                    username: string;
                }
```

```typescript
// Test: should apply Unique decorator
expect(() => {
                class TestEntity {
                    @Unique()
                    @Column()
                    email: string;

                    @Unique({ name: "uq_phone" })
                    @Column()
                    phone: string;
                }
```

```typescript
// Test: should get table name
class TestEntity {}
            expect(getTableName(TestEntity)).toBe("testentity");
```

```typescript
// Test: should get entity columns (placeholder)
class TestEntity {}
            expect(getEntityColumns(TestEntity)).toEqual([]);
```

```typescript
// Test: should get entity relations (placeholder)
class TestEntity {}
            expect(getEntityRelations(TestEntity)).toEqual([]);
```

```typescript
// Test: should have correct ColumnType values
expect(ColumnType.INT).toBe("int");
            expect(ColumnType.VARCHAR).toBe("varchar");
            expect(ColumnType.TEXT).toBe("text");
            expect(ColumnType.BOOLEAN).toBe("boolean");
            expect(ColumnType.JSON).toBe("json");
```

```typescript
// Test: should have correct RelationType values
expect(RelationType.ONE_TO_ONE).toBe("one-to-one");
            expect(RelationType.ONE_TO_MANY).toBe("one-to-many");
            expect(RelationType.MANY_TO_ONE).toBe("many-to-one");
            expect(RelationType.MANY_TO_MANY).toBe("many-to-many");
```

```typescript
// Test: should have correct IndexType values
expect(IndexType.PRIMARY).toBe("primary");
            expect(IndexType.UNIQUE).toBe("unique");
            expect(IndexType.INDEX).toBe("index");
            expect(IndexType.FULLTEXT).toBe("fulltext");
```

```typescript
// Test: should have correct CascadeType values
expect(CascadeType.PERSIST).toBe("persist");
            expect(CascadeType.REMOVE).toBe("remove");
            expect(CascadeType.UPDATE).toBe("update");
            expect(CascadeType.ALL).toBe("all");
```

```typescript
// Test: should have correct FetchType values
expect(FetchType.LAZY).toBe("lazy");
            expect(FetchType.EAGER).toBe("eager");
```

```typescript
```typescript
```

```typescript
```typescript
export class User {
```

```typescript
```typescript
export class User {
```

```typescript
```typescript
export class User {
```

```typescript
```typescript
export class User {
```

```typescript
```typescript
export class User {
```

```typescript
```typescript
export class Post {
```

```typescript
```typescript
export class User {
```

```typescript
```typescript
export class User {
```

```typescript
```typescript
export class User {
```

```typescript
```typescript
export class User {
```
