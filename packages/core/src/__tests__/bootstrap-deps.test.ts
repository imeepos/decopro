import "reflect-metadata";
import { bootstrap } from "../index";
import { AppInit } from "../tokens";
import { Injectable } from "../input";
import { inject } from "tsyringe";

describe('Bootstrap Dependencies Injection', () => {
    it('should properly inject deps into AppInit modules', async () => {
        const initOrder: string[] = [];

        // 创建一个基础服务
        @Injectable()
        class DatabaseService {
            connect() {
                return 'database-connected';
            }
        }

        // 创建一个依赖于 DatabaseService 的模块
        @AppInit({
            deps: [DatabaseService]
        })
        class DatabaseModule implements AppInit {
            constructor(@inject(DatabaseService) private dbService: DatabaseService) {}

            async onInit(): Promise<void> {
                const result = this.dbService.connect();
                expect(result).toBe('database-connected');
                initOrder.push('DatabaseModule');
            }
        }

        // 创建一个依赖于 DatabaseModule 的模块
        @AppInit({
            deps: [DatabaseModule]
        })
        class UserModule implements AppInit {
            async onInit(): Promise<void> {
                initOrder.push('UserModule');
            }
        }

        // 启动应用
        const injector = await bootstrap([DatabaseModule, UserModule], { debug: true });

        // 验证初始化顺序
        expect(initOrder).toEqual(['DatabaseModule', 'UserModule']);
        expect(injector).toBeDefined();
    });

    it('should handle complex dependency chains', async () => {
        const initOrder: string[] = [];

        // 基础服务
        @Injectable()
        class ConfigService {
            getConfig() {
                return { env: 'test' };
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
        })
        class ConfigModule implements AppInit {
            constructor(@inject(ConfigService) private configService: ConfigService) {}

            async onInit(): Promise<void> {
                const config = this.configService.getConfig();
                expect(config.env).toBe('test');
                initOrder.push('ConfigModule');
            }
        }

        @AppInit({
            deps: [LoggerService]
        })
        class LoggerModule implements AppInit {
            constructor(@inject(LoggerService) private loggerService: LoggerService) {}

            async onInit(): Promise<void> {
                const result = this.loggerService.log('Logger initialized');
                expect(result).toBe('[LOG] Logger initialized');
                initOrder.push('LoggerModule');
            }
        }

        // 第二层模块，依赖于前两个模块
        @AppInit({
            deps: [ConfigModule, LoggerModule]
        })
        class AppModule implements AppInit {
            async onInit(): Promise<void> {
                initOrder.push('AppModule');
            }
        }

        // 启动应用
        const injector = await bootstrap([ConfigModule, LoggerModule, AppModule], { debug: true });

        // 验证初始化顺序（ConfigModule 和 LoggerModule 可以并行，但都要在 AppModule 之前）
        expect(initOrder).toHaveLength(3);
        expect(initOrder.slice(0, 2)).toEqual(expect.arrayContaining(['ConfigModule', 'LoggerModule']));
        expect(initOrder[2]).toBe('AppModule');
        expect(injector).toBeDefined();
    });

    it('should handle modules without dependencies', async () => {
        const initOrder: string[] = [];

        @AppInit({})
        class SimpleModule implements AppInit {
            async onInit(): Promise<void> {
                initOrder.push('SimpleModule');
            }
        }

        @AppInit()
        class AnotherSimpleModule implements AppInit {
            async onInit(): Promise<void> {
                initOrder.push('AnotherSimpleModule');
            }
        }

        const injector = await bootstrap([SimpleModule, AnotherSimpleModule]);

        expect(initOrder).toHaveLength(2);
        expect(initOrder).toEqual(expect.arrayContaining(['SimpleModule', 'AnotherSimpleModule']));
        expect(injector).toBeDefined();
    });
});
