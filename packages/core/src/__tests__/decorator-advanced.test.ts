import "reflect-metadata";
import {
    Input,
    ValidatedInput,
    ReadonlyInput,
    RequiredInput,
    Injectable,
    Singleton,
    Transient,
    Inject
} from "../input";
import {
    conditional,
    compose,
    validateOptions,
    deepMergeOptions
} from "../decorator";
import { AppInit } from "../tokens";
import { inject } from "tsyringe";

describe('Advanced Decorator Features', () => {
    describe('Input Decorator Variations', () => {
        it('should support optional parameters', () => {
            class TestClass {
                @Input() // 无参数调用
                simpleProperty: string = '';

                @Input({ name: 'customName' }) // 带参数调用
                namedProperty: string = '';
            }

            expect(TestClass).toBeDefined();
        });

        it('should support validated input', () => {
            class TestClass {
                @ValidatedInput({
                    required: true,
                    defaultValue: 'default',
                    min: 0,
                    max: 100
                })
                validatedProperty: number = 0;
            }

            expect(TestClass).toBeDefined();
        });

        it('should support readonly input', () => {
            class TestClass {
                @ReadonlyInput({ name: 'readonlyProp' })
                readonlyProperty: string = 'readonly';
            }

            expect(TestClass).toBeDefined();
        });

        it('should support required input', () => {
            class TestClass {
                @RequiredInput({ defaultValue: 'required' })
                requiredProperty: string = '';
            }

            expect(TestClass).toBeDefined();
        });
    });

    describe('Injectable Decorator Variations', () => {
        it('should support optional parameters', () => {
            @Injectable() // 无参数调用
            class SimpleService {}

            @Injectable({ singleton: true }) // 带参数调用
            class ConfiguredService {}

            expect(SimpleService).toBeDefined();
            expect(ConfiguredService).toBeDefined();
        });

        it('should support singleton decorator', () => {
            @Singleton()
            class SingletonService {}

            @Singleton({ deps: [] })
            class ConfiguredSingletonService {}

            expect(SingletonService).toBeDefined();
            expect(ConfiguredSingletonService).toBeDefined();
        });

        it('should support transient decorator', () => {
            @Transient()
            class TransientService {}

            expect(TransientService).toBeDefined();
        });
    });

    describe('Decorator Utilities', () => {
        it('should support conditional decorators', () => {
            const shouldApply = true;
            
            @conditional(shouldApply, Injectable())
            class ConditionalService {}

            expect(ConditionalService).toBeDefined();
        });

        it('should support decorator composition', () => {
            const combinedDecorator = compose(
                Injectable(),
                (target: any) => {
                    target.prototype.composed = true;
                    return target;
                }
            );

            @combinedDecorator
            class ComposedService {}

            expect(ComposedService).toBeDefined();
        });

        it('should validate options correctly', () => {
            const validator = validateOptions<{ min: number; max: number }>((options) => {
                return options.min <= options.max || 'Min must be <= Max';
            });

            expect(() => validator({ min: 5, max: 10 })).not.toThrow();
            expect(() => validator({ min: 10, max: 5 })).toThrow('Min must be <= Max');
        });

        it('should deep merge options correctly', () => {
            const defaultOptions = {
                a: 1,
                b: {
                    c: 2,
                    d: 3
                }
            };

            const userOptions = {
                b: {
                    c: 2, // 保持类型兼容性
                    d: 4
                },
                e: 5
            };

            const merged = deepMergeOptions(defaultOptions, userOptions);

            expect(merged).toEqual({
                a: 1,
                b: {
                    c: 2,
                    d: 4
                },
                e: 5
            });
        });
    });

    describe('Complex Decorator Scenarios', () => {
        it('should handle complex input validation', () => {
            class UserModel {
                @ValidatedInput({
                    required: true,
                    defaultValue: '',
                    minLength: 2,
                    maxLength: 50,
                    pattern: /^[a-zA-Z\s]+$/,
                    validator: (value: string) => value.trim().length > 0
                })
                name: string = '';

                @ValidatedInput({
                    required: true,
                    defaultValue: 0,
                    min: 0,
                    max: 150,
                    validator: (value: number) => Number.isInteger(value)
                })
                age: number = 0;

                @ValidatedInput({
                    required: false,
                    enum: ['admin', 'user', 'guest'],
                    defaultValue: 'user'
                })
                role: string = 'user';
            }

            expect(UserModel).toBeDefined();
        });

        it('should handle service with complex configuration', () => {
            @Singleton({
                deps: [],
                factory: () => new DatabaseService('production')
            })
            class DatabaseService {
                constructor(private environment: string) {}

                @Input({
                    name: 'connectionString',
                    required: true,
                    validator: (value: string) => value.startsWith('mongodb://') || value.startsWith('postgresql://')
                })
                connectionString: string = '';

                @ReadonlyInput({
                    name: 'maxConnections',
                    defaultValue: 10
                })
                maxConnections: number = 10;
            }

            expect(DatabaseService).toBeDefined();
        });

        it('should handle AppInit with dependencies injection', () => {
            // 创建一个依赖服务
            @Injectable()
            class ConfigService {
                getConfig() {
                    return { database: 'test-db' };
                }
            }

            // 创建一个依赖于 ConfigService 的 AppInit 模块
            @AppInit({
                deps: [ConfigService]
            })
            class TestModule implements AppInit {
                constructor(@Inject(ConfigService) private configService: ConfigService) {}

                async onInit(): Promise<void> {
                    // 验证依赖注入是否正常工作
                    const config = this.configService.getConfig();
                    expect(config.database).toBe('test-db');
                }
            }

            expect(TestModule).toBeDefined();
            expect(ConfigService).toBeDefined();
        });
    });
});
