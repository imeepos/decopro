import "reflect-metadata";

// 全局测试设置
beforeAll(() => {
    // 设置测试环境
    process.env.NODE_ENV = 'test';
});

afterAll(() => {
    // 清理测试环境
});

// 全局错误处理
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// 添加一个空测试以满足 Jest 要求
describe('Setup', () => {
    it('should setup test environment', () => {
        expect(process.env.NODE_ENV).toBe('test');
    });
});
