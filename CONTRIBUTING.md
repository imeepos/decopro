# 🤝 贡献指南

感谢您对 DecoPro 项目的关注！我们欢迎所有形式的贡献，包括但不限于：

- 🐛 Bug 报告
- 💡 功能建议
- 📝 文档改进
- 🔧 代码贡献
- 🧪 测试用例
- 🌐 翻译

## 📋 开始之前

### 环境要求

- Node.js >= 18
- pnpm >= 9
- Git
- TypeScript 基础知识

### 设置开发环境

1. **Fork 并克隆仓库**

```bash
git clone https://github.com/your-username/decopro.git
cd decopro
```

2. **安装依赖**

```bash
pnpm install
```

3. **构建项目**

```bash
pnpm run build
```

4. **运行测试**

```bash
pnpm run test
```

## 🐛 报告 Bug

在报告 Bug 之前，请：

1. 检查 [Issues](https://github.com/your-org/decopro/issues) 确保问题未被报告
2. 使用最新版本重现问题
3. 收集相关信息

### Bug 报告模板

```markdown
**描述**
简要描述遇到的问题

**重现步骤**

1. 执行 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

**期望行为**
描述您期望发生的情况

**实际行为**
描述实际发生的情况

**环境信息**

- OS: [e.g. macOS 13.0]
- Node.js: [e.g. 18.17.0]
- pnpm: [e.g. 9.0.0]
- DecoPro 版本: [e.g. 1.0.0]

**附加信息**
添加任何其他相关信息、截图等
```

## 💡 功能建议

我们欢迎新功能建议！请：

1. 检查现有的 [Issues](https://github.com/your-org/decopro/issues) 和 [Discussions](https://github.com/your-org/decopro/discussions)
2. 详细描述功能需求和使用场景
3. 考虑向后兼容性

## 🔧 代码贡献

### 开发流程

1. **创建分支**

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

2. **进行开发**

- 遵循现有的代码风格
- 添加必要的测试
- 更新相关文档

3. **提交代码**

```bash
# 运行预提交检查
pnpm run precommit

# 提交代码
git add .
git commit -m "feat: add amazing feature"
```

4. **推送并创建 PR**

```bash
git push origin feature/your-feature-name
```

### 提交信息规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**类型 (type):**

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例:**

```
feat(core): add new dependency injection feature

Add support for circular dependency detection and resolution.
This improves the robustness of the DI container.

Closes #123
```

### 代码规范

#### TypeScript 规范

- 使用严格的 TypeScript 配置
- 优先使用接口而非类型别名
- 为公共 API 提供完整的类型定义
- 使用 JSDoc 注释

```typescript
/**
 * 用户服务接口
 */
export interface IUserService {
    /**
     * 根据 ID 获取用户
     * @param id 用户 ID
     * @returns 用户信息或 null
     */
    getUserById(id: string): Promise<User | null>;
}
```

#### 命名规范

- 类名使用 PascalCase: `UserService`
- 方法和变量使用 camelCase: `getUserById`
- 常量使用 UPPER_SNAKE_CASE: `MAX_RETRY_COUNT`
- 接口使用 I 前缀: `IUserService`
- 类型使用 T 前缀: `TUserData`

#### 文件结构

```
packages/
├── package-name/
│   ├── src/
│   │   ├── __tests__/          # 测试文件
│   │   ├── types/              # 类型定义
│   │   ├── utils/              # 工具函数
│   │   ├── index.ts            # 主入口
│   │   └── ...
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
```

### 测试要求

- 新功能必须包含测试
- Bug 修复应包含回归测试
- 测试覆盖率应保持在 80% 以上

```typescript
describe("UserService", () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
    });

    it("should return user by id", async () => {
        const user = await userService.getUserById("123");
        expect(user).toBeDefined();
        expect(user.id).toBe("123");
    });
});
```

## 📝 文档贡献

### 文档类型

- **API 文档**: 使用 TSDoc 注释自动生成
- **用户指南**: Markdown 文件
- **示例代码**: 在 `examples/` 目录下

### 文档规范

- 使用清晰、简洁的语言
- 提供实际的代码示例
- 包含常见用例和最佳实践
- 保持文档与代码同步

## 🔍 代码审查

所有代码贡献都需要通过代码审查：

### 审查标准

- 代码质量和可读性
- 测试覆盖率
- 文档完整性
- 性能影响
- 向后兼容性

### 审查流程

1. 自动化检查 (CI/CD)
2. 维护者审查
3. 社区反馈
4. 最终批准和合并

## 🚀 发布流程

项目使用 [Changesets](https://github.com/changesets/changesets) 管理版本：

1. **添加变更集**

```bash
pnpm changeset
```

2. **版本发布**

```bash
pnpm run upgrade
```

## 📞 获取帮助

如果您有任何问题，可以通过以下方式获取帮助：

- 📧 邮件: [maintainer@example.com](mailto:maintainer@example.com)
- 💬 讨论: [GitHub Discussions](https://github.com/your-org/decopro/discussions)
- 🐛 问题: [GitHub Issues](https://github.com/your-org/decopro/issues)

## 🙏 致谢

感谢所有贡献者的努力！您的贡献让 DecoPro 变得更好。

---

**记住：每一个贡献都很重要，无论大小！** 🌟
