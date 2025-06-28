// Jest 全局设置
require('reflect-metadata');

// 设置测试超时
jest.setTimeout(10000);

// 全局测试设置
beforeEach(() => {
  // 清理模拟
  jest.clearAllMocks();
});

// 扩展 Jest 匹配器
expect.extend({
  toBeInstanceOf(received, expected) {
    const pass = received instanceof expected;
    return {
      message: () => 
        pass 
          ? `Expected ${received} not to be instance of ${expected.name}`
          : `Expected ${received} to be instance of ${expected.name}`,
      pass,
    };
  },
});
