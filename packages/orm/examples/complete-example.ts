/**
 * @decopro/orm 完整使用示例
 * 
 * 这个示例展示了如何使用 @decopro/orm 的所有主要功能：
 * - 实体定义和装饰器
 * - 查询构建器
 * - 仓储模式
 * - 事务处理
 * - 测试支持
 */

import "reflect-metadata";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    ColumnType,
    createORM,
    createTestORM,
    createQueryBuilder,
    QueryOperator,
    ORMManager,
    DatabaseType
} from "../src/index";

// ============================================================================
// 1. 实体定义
// ============================================================================

@Entity({ tableName: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: ColumnType.VARCHAR, length: 100, nullable: false })
    username!: string;

    @Column({ type: ColumnType.VARCHAR, length: 255, nullable: false })
    email!: string;

    @Column({ type: ColumnType.INT, default: 18 })
    age!: number;

    @Column({ type: ColumnType.BOOLEAN, default: true })
    isActive!: boolean;

    @Column({ type: ColumnType.DATETIME, default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @OneToMany(() => Post, { mappedBy: "author" })
    posts!: Post[];
}

@Entity({ tableName: "posts" })
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: ColumnType.VARCHAR, length: 255, nullable: false })
    title!: string;

    @Column({ type: ColumnType.TEXT, nullable: true })
    content!: string;

    @Column({ type: ColumnType.VARCHAR, length: 50, default: "draft" })
    status!: "draft" | "published" | "archived";

    @Column({ type: ColumnType.DATETIME, default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @ManyToOne(() => User, { joinColumn: "author_id" })
    author!: User;
}

// ============================================================================
// 2. 自定义仓储类
// ============================================================================

class UserRepository {
    constructor(private orm: ORMManager) {}

    private get repository() {
        return this.orm.getRepository(User);
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.repository.findOne({
            where: { username }
        });
    }

    async findActiveUsers(): Promise<User[]> {
        return this.repository.find({
            where: { isActive: true },
            orderBy: { createdAt: "DESC" }
        });
    }

    async getUsersWithPosts(): Promise<User[]> {
        // 使用查询构建器进行复杂查询
        const qb = this.repository.createQueryBuilder("user")
            .selectAll()
            .leftJoin("posts", "post.author_id = user.id", "post")
            .whereEqual("user.isActive", true)
            .orderByDesc("user.createdAt");

        console.log("Generated SQL:", qb.toSQL());
        return qb.execute();
    }

    async getUserStats() {
        const qb = this.repository.createQueryBuilder("user")
            .select("COUNT(*) as total", "AVG(age) as avgAge", "MAX(age) as maxAge")
            .whereEqual("isActive", true);

        console.log("Stats SQL:", qb.toSQL());
        return qb.execute();
    }
}

class PostRepository {
    constructor(private orm: ORMManager) {}

    private get repository() {
        return this.orm.getRepository(Post);
    }

    async findPublishedPosts(): Promise<Post[]> {
        return this.repository.find({
            where: { status: "published" },
            orderBy: { createdAt: "DESC" }
        });
    }

    async findPostsByAuthor(authorId: number): Promise<Post[]> {
        const qb = this.repository.createQueryBuilder("post")
            .selectAll()
            .whereEqual("author_id", authorId)
            .orderByDesc("createdAt");

        return qb.execute();
    }

    async searchPosts(keyword: string): Promise<Post[]> {
        const qb = this.repository.createQueryBuilder("post")
            .selectAll()
            .whereLike("title", `%${keyword}%`)
            .orWhere("content", QueryOperator.LIKE, `%${keyword}%`)
            .whereEqual("status", "published")
            .orderByDesc("createdAt");

        console.log("Search SQL:", qb.toSQL());
        return qb.execute();
    }
}

// ============================================================================
// 3. 服务层
// ============================================================================

class BlogService {
    private userRepo: UserRepository;
    private postRepo: PostRepository;

    constructor(private orm: ORMManager) {
        this.userRepo = new UserRepository(orm);
        this.postRepo = new PostRepository(orm);
    }

    async createUser(userData: Partial<User>): Promise<User> {
        const userRepository = this.orm.getRepository(User);
        return userRepository.save(userData);
    }

    async createPost(postData: Partial<Post>, authorId: number): Promise<Post> {
        return this.orm.transaction(async (transactionORM) => {
            const userRepo = transactionORM.getRepository(User);
            const postRepo = transactionORM.getRepository(Post);

            // 验证作者存在
            const author = await userRepo.findById(authorId);
            if (!author) {
                throw new Error("Author not found");
            }

            // 创建文章
            const post = await postRepo.save({
                ...postData,
                author_id: authorId
            });

            return post;
        });
    }

    async publishPost(postId: number): Promise<Post | null> {
        const postRepository = this.orm.getRepository(Post);
        return postRepository.update(postId, { status: "published" });
    }

    async getUserDashboard(userId: number) {
        const user = await this.userRepo.findByUsername(`user_${userId}`);
        if (!user) {
            throw new Error("User not found");
        }

        const posts = await this.postRepo.findPostsByAuthor(userId);
        const stats = await this.userRepo.getUserStats();

        return {
            user,
            posts,
            stats: stats[0] || { total: 0, avgAge: 0, maxAge: 0 }
        };
    }

    async searchContent(keyword: string) {
        const posts = await this.postRepo.searchPosts(keyword);
        return { posts };
    }
}

// ============================================================================
// 4. 主要示例函数
// ============================================================================

async function runCompleteExample() {
    console.log("🚀 开始 @decopro/orm 完整示例...\n");

    // 创建 ORM 实例
    const orm = await createTestORM([User, Post]);
    console.log("✅ ORM 实例创建成功");

    try {
        // 创建服务实例
        const blogService = new BlogService(orm);
        console.log("✅ 服务实例创建成功\n");

        // 1. 创建用户
        console.log("📝 创建用户...");
        const user1 = await blogService.createUser({
            username: "john_doe",
            email: "john@example.com",
            age: 25
        });
        console.log("用户创建成功:", user1);

        const user2 = await blogService.createUser({
            username: "jane_smith",
            email: "jane@example.com",
            age: 30
        });
        console.log("用户创建成功:", user2);

        // 2. 创建文章
        console.log("\n📄 创建文章...");
        const post1 = await blogService.createPost({
            title: "我的第一篇文章",
            content: "这是我的第一篇技术博客文章。",
            status: "draft"
        }, user1.id);
        console.log("文章创建成功:", post1);

        const post2 = await blogService.createPost({
            title: "TypeScript 最佳实践",
            content: "分享一些 TypeScript 开发的最佳实践。",
            status: "draft"
        }, user2.id);
        console.log("文章创建成功:", post2);

        // 3. 发布文章
        console.log("\n📢 发布文章...");
        await blogService.publishPost(post1.id);
        await blogService.publishPost(post2.id);
        console.log("文章发布成功");

        // 4. 查询数据
        console.log("\n🔍 查询数据...");
        
        // 查找活跃用户
        const userRepo = new UserRepository(orm);
        const activeUsers = await userRepo.findActiveUsers();
        console.log("活跃用户数量:", activeUsers.length);

        // 查找已发布的文章
        const postRepo = new PostRepository(orm);
        const publishedPosts = await postRepo.findPublishedPosts();
        console.log("已发布文章数量:", publishedPosts.length);

        // 5. 复杂查询示例
        console.log("\n🔧 复杂查询示例...");
        
        // 搜索文章
        const searchResults = await blogService.searchContent("TypeScript");
        console.log("搜索结果:", searchResults.posts.length, "篇文章");

        // 获取用户统计
        const stats = await userRepo.getUserStats();
        console.log("用户统计:", stats);

        // 6. 查询构建器示例
        console.log("\n🏗️ 查询构建器示例...");
        
        const complexQuery = createQueryBuilder(User)
            .select("user.id", "user.username", "COUNT(post.id) as postCount")
            .leftJoin("posts", "post.author_id = user.id", "post")
            .whereEqual("user.isActive", true)
            .groupBy("user.id", "user.username")
            .having("COUNT(post.id)", QueryOperator.GREATER_THAN, 0)
            .orderByDesc("postCount")
            .limit(10);

        console.log("复杂查询 SQL:");
        console.log(complexQuery.toSQL());

        // 7. 获取用户仪表板
        console.log("\n📊 用户仪表板...");
        try {
            const dashboard = await blogService.getUserDashboard(user1.id);
            console.log("用户仪表板:", {
                username: dashboard.user.username,
                postsCount: dashboard.posts.length,
                stats: dashboard.stats
            });
        } catch (error) {
            console.log("获取仪表板时出错:", error.message);
        }

        console.log("\n✅ 示例执行完成！");

    } catch (error) {
        console.error("❌ 示例执行出错:", error);
    } finally {
        // 关闭 ORM 连接
        await orm.close();
        console.log("🔒 ORM 连接已关闭");
    }
}

// ============================================================================
// 5. 测试示例
// ============================================================================

export async function runTestExample() {
    console.log("🧪 开始测试示例...\n");

    describe("Blog Service Tests", () => {
        let orm: ORMManager;
        let blogService: BlogService;

        beforeEach(async () => {
            orm = await createTestORM([User, Post]);
            blogService = new BlogService(orm);
        });

        afterEach(async () => {
            await orm.close();
        });

        it("should create user successfully", async () => {
            const user = await blogService.createUser({
                username: "test_user",
                email: "test@example.com",
                age: 25
            });

            expect(user.username).toBe("test_user");
            expect(user.email).toBe("test@example.com");
            expect(user.age).toBe(25);
        });

        it("should create and publish post", async () => {
            // 创建用户
            const user = await blogService.createUser({
                username: "author",
                email: "author@example.com"
            });

            // 创建文章
            const post = await blogService.createPost({
                title: "Test Post",
                content: "Test content"
            }, user.id);

            expect(post.title).toBe("Test Post");
            expect(post.status).toBe("draft");

            // 发布文章
            const publishedPost = await blogService.publishPost(post.id);
            expect(publishedPost?.status).toBe("published");
        });

        it("should search posts by keyword", async () => {
            // 创建用户和文章
            const user = await blogService.createUser({
                username: "author",
                email: "author@example.com"
            });

            await blogService.createPost({
                title: "TypeScript Guide",
                content: "Learn TypeScript"
            }, user.id);

            await blogService.createPost({
                title: "JavaScript Basics",
                content: "Learn JavaScript"
            }, user.id);

            // 搜索文章
            const results = await blogService.searchContent("TypeScript");
            expect(results.posts.length).toBeGreaterThan(0);
        });
    });

    console.log("✅ 测试示例完成！");
}

// ============================================================================
// 6. 运行示例
// ============================================================================

if (require.main === module) {
    runCompleteExample().catch(console.error);
}

export { runCompleteExample, User, Post, BlogService };
