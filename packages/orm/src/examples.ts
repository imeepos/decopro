import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    ManyToMany,
    Index,
    Unique,
    BeforeInsert,
    AfterLoad,
    ColumnType,
    CascadeType,
    createQueryBuilder,
    createRepository,
    QueryOperator
} from "./index";

// ============================================================================
// Example Entities - 示例实体
// ============================================================================

/**
 * 用户实体
 */
@Entity({ tableName: "users", comment: "用户表" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: ColumnType.VARCHAR, length: 100, nullable: false })
    @Unique({ name: "uq_user_username" })
    @Index()
    username: string;

    @Column({ type: ColumnType.VARCHAR, length: 255, nullable: false })
    @Unique()
    email: string;

    @Column({ type: ColumnType.VARCHAR, length: 255, nullable: true })
    password: string;

    @Column({ type: ColumnType.VARCHAR, length: 50, nullable: true })
    firstName: string;

    @Column({ type: ColumnType.VARCHAR, length: 50, nullable: true })
    lastName: string;

    @Column({ type: ColumnType.INT, default: 18 })
    age: number;

    @Column({ type: ColumnType.BOOLEAN, default: true })
    isActive: boolean;

    @Column({ type: ColumnType.DATETIME, default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ type: ColumnType.DATETIME, nullable: true })
    updatedAt: Date;

    // 关系
    @OneToMany(() => Post, { mappedBy: "author", cascade: [CascadeType.ALL] })
    posts: Post[];

    @OneToMany(() => Comment, { mappedBy: "author" })
    comments: Comment[];

    @ManyToMany(() => Role, { joinTable: "user_roles" })
    roles: Role[];

    @ManyToOne(() => Department, { joinColumn: "department_id", nullable: true })
    department: Department;

    // 生命周期钩子
    @BeforeInsert()
    generateTimestamps() {
        this.createdAt = new Date();
    }

    @AfterLoad()
    computeFullName() {
        // 计算全名等逻辑
    }

    // 业务方法
    getFullName(): string {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    isAdult(): boolean {
        return this.age >= 18;
    }
}

/**
 * 文章实体
 */
@Entity({ tableName: "posts" })
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: ColumnType.VARCHAR, length: 255, nullable: false })
    @Index()
    title: string;

    @Column({ type: ColumnType.TEXT, nullable: true })
    content: string;

    @Column({ type: ColumnType.VARCHAR, length: 50, default: "draft" })
    @Index()
    status: "draft" | "published" | "archived";

    @Column({ type: ColumnType.INT, default: 0 })
    viewCount: number;

    @Column({ type: ColumnType.DATETIME, default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ type: ColumnType.DATETIME, nullable: true })
    publishedAt: Date;

    // 关系
    @ManyToOne(() => User, { joinColumn: "author_id", nullable: false })
    @Index()
    author: User;

    @OneToMany(() => Comment, { mappedBy: "post", cascade: [CascadeType.ALL] })
    comments: Comment[];

    @ManyToMany(() => Tag, { joinTable: "post_tags" })
    tags: Tag[];

    @ManyToOne(() => Category, { joinColumn: "category_id", nullable: true })
    category: Category;

    // 生命周期钩子
    @BeforeInsert()
    setDefaults() {
        if (!this.status) {
            this.status = "draft";
        }
    }

    // 业务方法
    publish() {
        this.status = "published";
        this.publishedAt = new Date();
    }

    isPublished(): boolean {
        return this.status === "published";
    }
}

/**
 * 评论实体
 */
@Entity({ tableName: "comments" })
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: ColumnType.TEXT, nullable: false })
    content: string;

    @Column({ type: ColumnType.BOOLEAN, default: true })
    isApproved: boolean;

    @Column({ type: ColumnType.DATETIME, default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    // 关系
    @ManyToOne(() => User, { joinColumn: "author_id", nullable: false })
    author: User;

    @ManyToOne(() => Post, { joinColumn: "post_id", nullable: false })
    post: Post;

    @ManyToOne(() => Comment, { joinColumn: "parent_id", nullable: true })
    parent: Comment;

    @OneToMany(() => Comment, { mappedBy: "parent" })
    replies: Comment[];
}

/**
 * 角色实体
 */
@Entity({ tableName: "roles" })
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: ColumnType.VARCHAR, length: 50, nullable: false })
    @Unique()
    name: string;

    @Column({ type: ColumnType.VARCHAR, length: 255, nullable: true })
    description: string;

    @Column({ type: ColumnType.JSON, nullable: true })
    permissions: string[];

    // 关系
    @ManyToMany(() => User, { mappedBy: "roles" })
    users: User[];
}

/**
 * 标签实体
 */
@Entity({ tableName: "tags" })
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: ColumnType.VARCHAR, length: 50, nullable: false })
    @Unique()
    name: string;

    @Column({ type: ColumnType.VARCHAR, length: 7, nullable: true })
    color: string;

    // 关系
    @ManyToMany(() => Post, { mappedBy: "tags" })
    posts: Post[];
}

/**
 * 分类实体
 */
@Entity({ tableName: "categories" })
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: ColumnType.VARCHAR, length: 100, nullable: false })
    @Unique()
    name: string;

    @Column({ type: ColumnType.VARCHAR, length: 255, nullable: true })
    description: string;

    @Column({ type: ColumnType.VARCHAR, length: 100, nullable: true })
    slug: string;

    // 关系
    @OneToMany(() => Post, { mappedBy: "category" })
    posts: Post[];

    @ManyToOne(() => Category, { joinColumn: "parent_id", nullable: true })
    parent: Category;

    @OneToMany(() => Category, { mappedBy: "parent" })
    children: Category[];
}

/**
 * 部门实体
 */
@Entity({ tableName: "departments" })
export class Department {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: ColumnType.VARCHAR, length: 100, nullable: false })
    @Unique()
    name: string;

    @Column({ type: ColumnType.VARCHAR, length: 255, nullable: true })
    description: string;

    @Column({ type: ColumnType.VARCHAR, length: 50, nullable: true })
    location: string;

    // 关系
    @OneToMany(() => User, { mappedBy: "department" })
    employees: User[];

    @ManyToOne(() => Department, { joinColumn: "parent_id", nullable: true })
    parent: Department;

    @OneToMany(() => Department, { mappedBy: "parent" })
    subDepartments: Department[];
}

// ============================================================================
// Example Usage - 使用示例
// ============================================================================

/**
 * 用户仓储示例
 */
export class UserRepository {
    private baseRepo = createRepository(User);

    // 代理基础仓储方法
    async save(entity: Partial<User>) {
        return this.baseRepo.save(entity);
    }

    async findOne(options: any) {
        return this.baseRepo.findOne(options);
    }

    async find(options: any) {
        return this.baseRepo.find(options);
    }

    async findAndCount(options: any) {
        return this.baseRepo.findAndCount(options);
    }

    createQueryBuilder(alias?: string) {
        return this.baseRepo.createQueryBuilder(alias);
    }

    async aggregate(options: any) {
        return this.baseRepo.aggregate(options);
    }

    async count(options?: any) {
        return this.baseRepo.count(options);
    }

    /**
     * 根据用户名查找用户
     */
    async findByUsername(username: string): Promise<User | null> {
        return this.baseRepo.findOne({
            where: { username },
            relations: ["roles", "department"]
        });
    }

    /**
     * 查找活跃用户
     */
    async findActiveUsers(): Promise<User[]> {
        return this.baseRepo.find({
            where: { isActive: true },
            order: { createdAt: "DESC" }
        });
    }

    /**
     * 分页查找用户
     */
    async findUsersWithPagination(page: number, pageSize: number) {
        return this.baseRepo.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { createdAt: "DESC" }
        });
    }

    /**
     * 使用查询构建器的复杂查询
     */
    async findUsersByDepartmentAndRole(departmentName: string, roleName: string): Promise<User[]> {
        const qb = this.baseRepo.createQueryBuilder("user")
            .leftJoin("departments", "dept", "user.department_id = dept.id")
            .leftJoin("user_roles", "ur", "user.id = ur.user_id")
            .leftJoin("roles", "role", "ur.role_id = role.id")
            .whereEqual("dept.name", departmentName)
            .whereEqual("role.name", roleName)
            .orderByDesc("user.createdAt");

        // 这里需要执行查询并返回结果
        console.log("Generated SQL:", qb.toSQL());
        return [];
    }
}

/**
 * 文章仓储示例
 */
export class PostRepository {
    private baseRepo = createRepository(Post);

    // 代理基础仓储方法
    async save(entity: Partial<Post>) {
        return this.baseRepo.save(entity);
    }

    async find(options: any) {
        return this.baseRepo.find(options);
    }

    /**
     * 查找已发布的文章
     */
    async findPublishedPosts(): Promise<Post[]> {
        return this.baseRepo.find({
            where: { status: "published" },
            relations: ["author", "category", "tags"],
            order: { publishedAt: "DESC" }
        });
    }

    /**
     * 根据标签查找文章
     */
    async findPostsByTag(tagName: string): Promise<Post[]> {
        const qb = this.baseRepo.createQueryBuilder("post")
            .leftJoin("post_tags", "pt", "post.id = pt.post_id")
            .leftJoin("tags", "tag", "pt.tag_id = tag.id")
            .whereEqual("tag.name", tagName)
            .whereEqual("post.status", "published")
            .orderByDesc("post.publishedAt");

        console.log("Generated SQL:", qb.toSQL());
        return [];
    }

    /**
     * 获取热门文章
     */
    async getPopularPosts(limit: number = 10): Promise<Post[]> {
        return this.baseRepo.find({
            where: { status: "published" },
            order: { viewCount: "DESC" },
            take: limit
        });
    }
}

/**
 * 查询构建器使用示例
 */
export function queryBuilderExamples() {
    // 基础查询
    const basicQuery = createQueryBuilder(User)
        .select("id", "username", "email")
        .whereEqual("isActive", true)
        .orderByDesc("createdAt")
        .limit(10);

    console.log("Basic Query:", basicQuery.toSQL());

    // 复杂查询
    const complexQuery = createQueryBuilder(Post)
        .selectAll()
        .leftJoin("users", "user.id = post.author_id", "author")
        .leftJoin("categories", "category.id = post.category_id", "category")
        .whereEqual("post.status", "published")
        .whereLike("post.title", "%技术%")
        .whereNotNull("post.publishedAt")
        .orderByDesc("post.publishedAt")
        .paginate(1, 20);

    console.log("Complex Query:", complexQuery.toSQL());

    // 聚合查询
    const aggregateQuery = createQueryBuilder(User)
        .select("COUNT(*) as total", "department_id")
        .whereEqual("isActive", true)
        .groupBy("department_id")
        .having("COUNT(*)", QueryOperator.GREATER_THAN, 5)
        .orderByDesc("total");

    console.log("Aggregate Query:", aggregateQuery.toSQL());
}

// ============================================================================
// Complete ORM Usage Example - 完整 ORM 使用示例
// ============================================================================

import {
    createORM,
    createTestORM,
    ORMManager,
    InjectRepository,
    Transactional
} from "./orm-manager";
import { DatabaseType } from "./database";

/**
 * 完整的 ORM 使用示例
 */
export async function completeORMExample() {
    console.log("=== Complete ORM Usage Example ===");

    // 1. 创建 ORM 实例
    const orm = await createORM({
        database: {
            type: DatabaseType.SQLITE,
            database: ":memory:"
        },
        entities: [User, Post, Comment, Role, Tag, Category, Department],
        synchronize: true,
        logging: true
    });

    try {
        // 2. 获取仓储
        const userRepo = new UserRepository();
        const postRepo = new PostRepository();
        const commentRepo = orm.getRepository(Comment);

        // 3. 创建用户
        console.log("\n--- Creating Users ---");
        const user1 = await userRepo.save({
            username: "john_doe",
            email: "john@example.com",
            firstName: "John",
            lastName: "Doe",
            age: 25
        });
        console.log("Created user:", user1);

        const user2 = await userRepo.save({
            username: "jane_smith",
            email: "jane@example.com",
            firstName: "Jane",
            lastName: "Smith",
            age: 28
        });
        console.log("Created user:", user2);

        // 4. 查询用户
        console.log("\n--- Querying Users ---");
        const activeUsers = await userRepo.findActiveUsers();
        console.log("Active users:", activeUsers);

        const userByUsername = await userRepo.findByUsername("john_doe");
        console.log("User by username:", userByUsername);

        // 5. 分页查询
        console.log("\n--- Pagination ---");
        const paginatedUsers = await userRepo.findUsersWithPagination(1, 10);
        console.log("Paginated users:", paginatedUsers);

        // 6. 创建文章
        console.log("\n--- Creating Posts ---");
        const post1 = await postRepo.save({
            title: "Getting Started with TypeScript",
            content: "TypeScript is a powerful superset of JavaScript...",
            status: "published"
        });
        console.log("Created post:", post1);

        // 7. 查询文章
        console.log("\n--- Querying Posts ---");
        const publishedPosts = await postRepo.findPublishedPosts();
        console.log("Published posts:", publishedPosts);

        // 8. 使用查询构建器
        console.log("\n--- Query Builder ---");
        const complexQuery = userRepo.createQueryBuilder("user")
            .select("user.id", "user.username", "user.email")
            .whereEqual("user.isActive", true)
            .where("user.age", QueryOperator.GREATER_THAN, 18)
            .orderByDesc("user.createdAt")
            .limit(5);

        console.log("Complex query SQL:", complexQuery.toSQL());

        // 9. 聚合查询
        console.log("\n--- Aggregation ---");
        const userStats = await userRepo.aggregate({
            count: true,
            avg: "age",
            where: { isActive: true }
        });
        console.log("User statistics:", userStats);

        // 10. 事务示例
        console.log("\n--- Transaction Example ---");
        await orm.transaction(async (transactionORM) => {
            const txUserRepo = transactionORM.getRepository(User);
            const txPostRepo = transactionORM.getRepository(Post);

            // 在事务中创建用户和文章
            const newUser = await txUserRepo.save({
                username: "tx_user",
                email: "tx@example.com",
                firstName: "Transaction",
                lastName: "User"
            });

            const newPost = await txPostRepo.save({
                title: "Transaction Post",
                content: "This post was created in a transaction",
                status: "draft"
            });

            console.log("Created in transaction:", { newUser, newPost });
        });

        // 11. 数据库信息
        console.log("\n--- Database Info ---");
        const dbInfo = await orm.getDatabaseInfo();
        console.log("Database info:", dbInfo);

    } finally {
        // 12. 关闭 ORM
        await orm.close();
        console.log("\n--- ORM Closed ---");
    }
}

/**
 * 服务类示例 - 展示如何在业务逻辑中使用 ORM
 */
export class UserService {
    @InjectRepository(User)
    private userRepository!: UserRepository;

    @InjectRepository(Post)
    private postRepository!: PostRepository;

    /**
     * 创建用户
     */
    @Transactional()
    async createUser(userData: Partial<User>): Promise<User> {
        // 检查用户名是否已存在
        const existingUser = await this.userRepository.findByUsername(userData.username!);
        if (existingUser) {
            throw new Error("Username already exists");
        }

        // 创建用户
        return this.userRepository.save(userData);
    }

    /**
     * 获取用户的文章
     */
    async getUserPosts(userId: number): Promise<Post[]> {
        return this.postRepository.find({
            where: { author: { id: userId } },
            relations: ["author", "category", "tags"],
            order: { createdAt: "DESC" }
        });
    }

    /**
     * 用户统计
     */
    async getUserStatistics(): Promise<{
        totalUsers: number;
        activeUsers: number;
        averageAge: number;
    }> {
        const totalUsers = await this.userRepository.count();
        const activeUsers = await this.userRepository.count({ where: { isActive: true } });
        const ageStats = await this.userRepository.aggregate({
            avg: "age",
            where: { isActive: true }
        });

        return {
            totalUsers,
            activeUsers,
            averageAge: ageStats.avg || 0
        };
    }
}

/**
 * 测试 ORM 示例
 */
export async function testORMExample() {
    console.log("=== Test ORM Example ===");

    // 创建测试 ORM
    const testORM = await createTestORM([User, Post, Comment]);

    try {
        const userRepo = testORM.getRepository(User);

        // 创建测试数据
        const testUser = await userRepo.save({
            username: "test_user",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            age: 30
        });

        console.log("Test user created:", testUser);

    } finally {
        await testORM.close();
        console.log("Test ORM closed");
    }
}
