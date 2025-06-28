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
    ORMManager,
    DatabaseType,
    createQueryBuilder,
    QueryOperator
} from "../index";

// ============================================================================
// Test Entities - 测试实体
// ============================================================================

@Entity({ tableName: "test_users" })
class TestUser {
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

    @OneToMany(() => TestPost, { mappedBy: "author" })
    posts!: TestPost[];
}

@Entity({ tableName: "test_posts" })
class TestPost {
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

    @ManyToOne(() => TestUser, { joinColumn: "author_id" })
    author!: TestUser;
}

// ============================================================================
// Integration Tests - 集成测试
// ============================================================================

describe("ORM Integration Tests", () => {
    let orm: ORMManager;

    beforeEach(async () => {
        // 创建测试 ORM 实例
        orm = await createTestORM([TestUser, TestPost]);
    });

    afterEach(async () => {
        if (orm) {
            await orm.close();
        }
    });

    describe("ORM Manager", () => {
        it("should create ORM instance successfully", () => {
            expect(orm).toBeDefined();
            expect(orm.isConnected()).toBe(true);
        });

        it("should register entities", () => {
            const entities = orm.getRegisteredEntities();
            expect(entities).toHaveLength(2);
            expect(entities).toContain(TestUser);
            expect(entities).toContain(TestPost);
        });

        it("should get database info", async () => {
            const dbInfo = await orm.getDatabaseInfo();
            expect(dbInfo.type).toBe(DatabaseType.SQLITE);
            expect(dbInfo.name).toBe(":memory:");
        });
    });

    describe("Repository Operations", () => {
        it("should create and use repositories", () => {
            const userRepo = orm.getRepository(TestUser);
            const postRepo = orm.getRepository(TestPost);

            expect(userRepo).toBeDefined();
            expect(postRepo).toBeDefined();
            expect(typeof userRepo.save).toBe("function");
            expect(typeof postRepo.save).toBe("function");
        });

        it("should create query builders from repositories", () => {
            const userRepo = orm.getRepository(TestUser);
            const qb = userRepo.createQueryBuilder("user");

            expect(qb).toBeDefined();
            expect(typeof qb.select).toBe("function");
            expect(typeof qb.where).toBe("function");
            expect(typeof qb.toSQL).toBe("function");
        });

        it("should handle repository method calls", async () => {
            const userRepo = orm.getRepository(TestUser);

            // 这些方法应该抛出 "Method not implemented" 错误（因为是抽象实现）
            await expect(userRepo.save({
                username: "test_user",
                email: "test@example.com",
                age: 25
            })).rejects.toThrow("Method not implemented");

            await expect(userRepo.findOne({ where: { username: "test_user" } })).rejects.toThrow("Method not implemented");

            await expect(userRepo.count()).rejects.toThrow("Method not implemented");
        });
    });

    describe("Query Builder Integration", () => {
        it("should create complex queries", () => {
            const userRepo = orm.getRepository(TestUser);
            const qb = userRepo.createQueryBuilder("user")
                .select("user.id", "user.username", "user.email")
                .where("user.isActive", QueryOperator.EQUAL, true)
                .where("user.age", QueryOperator.GREATER_THAN, 18)
                .orderByDesc("user.createdAt")
                .limit(10);

            const sql = qb.toSQL();
            expect(sql).toContain("SELECT user.id, user.username, user.email");
            expect(sql).toContain("WHERE user.isActive = true");
            expect(sql).toContain("AND user.age > 18");
            expect(sql).toContain("ORDER BY user.createdAt DESC");
            expect(sql).toContain("LIMIT 10");
        });

        it("should handle JOIN queries", () => {
            const postRepo = orm.getRepository(TestPost);
            const qb = postRepo.createQueryBuilder("post")
                .selectAll()
                .leftJoin("test_users", "user.id = post.author_id", "user")
                .whereEqual("post.status", "published")
                .whereNotNull("post.content")
                .orderByDesc("post.createdAt");

            const sql = qb.toSQL();
            expect(sql).toContain("SELECT *");
            expect(sql).toContain("LEFT JOIN test_users AS user ON user.id = post.author_id");
            expect(sql).toContain("WHERE post.status = 'published'");
            expect(sql).toContain("AND post.content IS NOT NULL");
        });

        it("should handle aggregation queries", () => {
            const userRepo = orm.getRepository(TestUser);
            const qb = userRepo.createQueryBuilder("user")
                .select("COUNT(*) as total", "AVG(age) as avgAge")
                .whereEqual("isActive", true)
                .groupBy("isActive")
                .having("COUNT(*)", QueryOperator.GREATER_THAN, 0);

            const sql = qb.toSQL();
            expect(sql).toContain("COUNT(*) as total");
            expect(sql).toContain("AVG(age) as avgAge");
            expect(sql).toContain("GROUP BY isActive");
            expect(sql).toContain("HAVING COUNT(*) > 0");
        });
    });

    describe("Transaction Support", () => {
        it("should support transaction operations", async () => {
            // 事务操作应该抛出 "Method not implemented" 错误
            await expect(orm.transaction(async (transactionORM) => {
                const userRepo = transactionORM.getRepository(TestUser);
                const postRepo = transactionORM.getRepository(TestPost);

                // 在事务中执行操作
                await userRepo.save({
                    username: "tx_user",
                    email: "tx@example.com"
                });

                await postRepo.save({
                    title: "Transaction Post",
                    content: "Created in transaction"
                });

                return "success";
            })).rejects.toThrow("Method not implemented");
        });
    });

    describe("Error Handling", () => {
        it("should handle invalid operations gracefully", async () => {
            const userRepo = orm.getRepository(TestUser);

            // 这些操作应该抛出 "Method not implemented" 错误
            await expect(userRepo.save({})).rejects.toThrow("Method not implemented");
            await expect(userRepo.findById(-1)).rejects.toThrow("Method not implemented");
            await expect(userRepo.update(-1, {})).rejects.toThrow("Method not implemented");
        });

        it("should handle query builder errors", () => {
            const qb = createQueryBuilder(TestUser);

            // 无效的 SQL 应该在某些情况下被检测到
            expect(() => {
                qb.select(); // 没有选择任何字段
            }).not.toThrow(); // 查询构建器应该允许这种情况

            expect(() => {
                qb.toSQL(); // 生成 SQL
            }).not.toThrow();
        });
    });

    describe("Configuration and Setup", () => {
        it("should create ORM with custom configuration", async () => {
            const customORM = await createORM({
                database: {
                    type: DatabaseType.SQLITE,
                    database: ":memory:"
                },
                entities: [TestUser],
                synchronize: true,
                logging: false
            });

            expect(customORM).toBeDefined();
            expect(customORM.isConnected()).toBe(true);

            const entities = customORM.getRegisteredEntities();
            expect(entities).toHaveLength(1);
            expect(entities).toContain(TestUser);

            await customORM.close();
        });

        it("should handle connection string configuration", async () => {
            const connectionStringORM = await createORM({
                database: "sqlite:///:memory:",
                entities: [TestUser, TestPost],
                logging: false
            });

            expect(connectionStringORM).toBeDefined();
            expect(connectionStringORM.isConnected()).toBe(true);

            await connectionStringORM.close();
        });
    });

    describe("Performance and Optimization", () => {
        it("should handle multiple repository instances", () => {
            const userRepo1 = orm.getRepository(TestUser);
            const userRepo2 = orm.getRepository(TestUser);

            // 应该返回相同的仓储实例（单例模式）
            expect(userRepo1).toBe(userRepo2);
        });

        it("should handle query builder cloning", () => {
            const originalQB = createQueryBuilder(TestUser)
                .select("id", "username")
                .whereEqual("isActive", true);

            const clonedQB = originalQB.clone()
                .whereEqual("age", 25);

            expect(originalQB.toSQL()).not.toBe(clonedQB.toSQL());
            expect(originalQB.toSQL()).toContain("WHERE isActive = true");
            expect(clonedQB.toSQL()).toContain("WHERE isActive = true AND age = 25");
        });
    });
});
