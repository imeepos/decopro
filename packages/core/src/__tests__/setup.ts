import "reflect-metadata";

// 全局测试设置
beforeEach(() => {
    // 清理容器状态
    jest.clearAllMocks();
});

// 扩展Jest匹配器
expect.extend({
    toBeInstanceOf(received, expected) {
        const pass = received instanceof expected;
        return {
            message: () =>
                pass
                    ? `Expected ${received} not to be instance of ${expected.name}`
                    : `Expected ${received} to be instance of ${expected.name}`,
            pass
        };
    }
});
