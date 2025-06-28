import "reflect-metadata";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    QueryBuilder,
    QueryOperator,
    SortDirection,
    JoinType,
    ColumnType,
    createQueryBuilder,
    createRepository,
    isEntityToken,
    isColumnToken,
    isRelationToken,
    ENTITY_TOKEN,
    COLUMN_TOKEN,
    ONE_TO_MANY_TOKEN,
    MANY_TO_ONE_TOKEN
} from "../index";

describe("ORM Package", () => {
    describe("Decorators", () => {
        it("should create entity decorators without throwing", () => {
            expect(() => {
                @Entity()
                class TestEntity {
                    @PrimaryGeneratedColumn()
                    id!: number;

                    @Column()
                    name!: string;
                }
            }).not.toThrow();
        });

        it("should create entity decorators with options", () => {
            expect(() => {
                @Entity({ tableName: "test_table", comment: "Test table" })
                class TestEntity {
                    @PrimaryGeneratedColumn({ strategy: "uuid" })
                    id!: string;

                    @Column({ type: ColumnType.VARCHAR, length: 100, nullable: false })
                    name!: string;

                    @Column({ type: ColumnType.INT, default: 0 })
                    age!: number;
                }
            }).not.toThrow();
        });

        it("should create relationship decorators", () => {
            expect(() => {
                @Entity()
                class User {
                    @PrimaryGeneratedColumn()
                    id!: number;

                    @OneToMany(() => Post, { mappedBy: "author" })
                    posts!: Post[];
                }

                @Entity()
                class Post {
                    @PrimaryGeneratedColumn()
                    id!: number;

                    @ManyToOne(() => User, { joinColumn: "author_id" })
                    author!: User;
                }
            }).not.toThrow();
        });

        it("should support alternative decorator syntax", () => {
            expect(() => {
                @Entity()
                class Department {
                    @PrimaryGeneratedColumn()
                    id!: number;

                    @OneToMany({ type: () => User, mappedBy: "department" })
                    employees!: User[];
                }

                @Entity()
                class User {
                    @PrimaryGeneratedColumn()
                    id!: number;

                    @ManyToOne({ type: () => Department, joinColumn: "department_id" })
                    department!: Department;
                }
            }).not.toThrow();
        });
    });

    describe("Query Builder", () => {
        let qb: QueryBuilder<any>;

        beforeEach(() => {
            qb = new QueryBuilder();
        });

        it("should create a query builder", () => {
            expect(qb).toBeInstanceOf(QueryBuilder);
        });

        it("should build basic SELECT query", () => {
            const sql = qb
                .select("id", "name", "email")
                .from("users")
                .toSQL();

            expect(sql).toBe("SELECT id, name, email FROM users");
        });

        it("should build query with WHERE conditions", () => {
            const sql = qb
                .select("*")
                .from("users")
                .whereEqual("isActive", true)
                .whereNotNull("email")
                .toSQL();

            expect(sql).toBe("SELECT * FROM users WHERE isActive = true AND email IS NOT NULL");
        });

        it("should build query with JOIN", () => {
            const sql = qb
                .select("u.name", "p.title")
                .from("users", "u")
                .leftJoin("posts", "p.author_id = u.id", "p")
                .toSQL();

            expect(sql).toBe("SELECT u.name, p.title FROM users AS u LEFT JOIN posts AS p ON p.author_id = u.id");
        });

        it("should build query with ORDER BY", () => {
            const sql = qb
                .select("*")
                .from("users")
                .orderByDesc("createdAt")
                .orderByAsc("name")
                .toSQL();

            expect(sql).toBe("SELECT * FROM users ORDER BY createdAt DESC, name ASC");
        });

        it("should build query with LIMIT and OFFSET", () => {
            const sql = qb
                .select("*")
                .from("users")
                .limit(10)
                .offset(20)
                .toSQL();

            expect(sql).toBe("SELECT * FROM users LIMIT 10 OFFSET 20");
        });

        it("should build query with pagination", () => {
            const sql = qb
                .select("*")
                .from("users")
                .paginate(3, 10) // page 3, 10 items per page
                .toSQL();

            expect(sql).toBe("SELECT * FROM users LIMIT 10 OFFSET 20");
        });

        it("should build query with GROUP BY and HAVING", () => {
            const sql = qb
                .select("department", "COUNT(*) as count")
                .from("users")
                .groupBy("department")
                .having("COUNT(*)", QueryOperator.GREATER_THAN, 5)
                .toSQL();

            expect(sql).toBe("SELECT department, COUNT(*) as count FROM users GROUP BY department HAVING COUNT(*) > 5");
        });

        it("should build query with DISTINCT", () => {
            const sql = qb
                .distinct()
                .select("department")
                .from("users")
                .toSQL();

            expect(sql).toBe("SELECT DISTINCT department FROM users");
        });

        it("should build query with IN condition", () => {
            const sql = qb
                .select("*")
                .from("users")
                .whereIn("status", ["active", "pending"])
                .toSQL();

            expect(sql).toBe("SELECT * FROM users WHERE status IN ('active', 'pending')");
        });

        it("should build query with BETWEEN condition", () => {
            const sql = qb
                .select("*")
                .from("users")
                .whereBetween("age", 18, 65)
                .toSQL();

            expect(sql).toBe("SELECT * FROM users WHERE age BETWEEN 18 AND 65");
        });

        it("should clone query builder", () => {
            const original = qb
                .select("*")
                .from("users")
                .whereEqual("isActive", true);

            const cloned = original.clone();
            cloned.whereEqual("age", 25);

            expect(original.toSQL()).toBe("SELECT * FROM users WHERE isActive = true");
            expect(cloned.toSQL()).toBe("SELECT * FROM users WHERE isActive = true AND age = 25");
        });
    });

    describe("Repository", () => {
        @Entity()
        class TestEntity {
            @PrimaryGeneratedColumn()
            id!: number;

            @Column()
            name!: string;
        }

        let repository: any;

        beforeEach(() => {
            repository = createRepository(TestEntity);
        });

        it("should create a repository", () => {
            expect(repository).toBeDefined();
            expect(typeof repository.save).toBe("function");
            expect(typeof repository.findById).toBe("function");
            expect(typeof repository.find).toBe("function");
        });

        it("should create query builder from repository", () => {
            const qb = repository.createQueryBuilder("entity");
            expect(qb).toBeInstanceOf(QueryBuilder);
        });

        it("should have all required repository methods", () => {
            const methods = [
                "save",
                "saveMany",
                "findById",
                "findOne",
                "find",
                "findAll",
                "findAndCount",
                "count",
                "exists",
                "update",
                "updateMany",
                "delete",
                "deleteMany",
                "softDelete",
                "restore",
                "createQueryBuilder",
                "query",
                "aggregate"
            ];

            methods.forEach(method => {
                expect(typeof repository[method]).toBe("function");
            });
        });
    });

    describe("Utility Functions", () => {
        it("should identify entity tokens", () => {
            expect(isEntityToken(ENTITY_TOKEN)).toBe(true);
            expect(isEntityToken(COLUMN_TOKEN)).toBe(false);
        });

        it("should identify column tokens", () => {
            expect(isColumnToken(COLUMN_TOKEN)).toBe(true);
            expect(isColumnToken(ENTITY_TOKEN)).toBe(false);
        });

        it("should identify relation tokens", () => {
            expect(isRelationToken(ONE_TO_MANY_TOKEN)).toBe(true);
            expect(isRelationToken(MANY_TO_ONE_TOKEN)).toBe(true);
            expect(isRelationToken(ENTITY_TOKEN)).toBe(false);
        });
    });

    describe("Enums and Constants", () => {
        it("should have correct column types", () => {
            expect(ColumnType.VARCHAR).toBe("varchar");
            expect(ColumnType.INT).toBe("int");
            expect(ColumnType.BOOLEAN).toBe("boolean");
            expect(ColumnType.DATETIME).toBe("datetime");
            expect(ColumnType.JSON).toBe("json");
        });

        it("should have correct query operators", () => {
            expect(QueryOperator.EQUAL).toBe("=");
            expect(QueryOperator.NOT_EQUAL).toBe("!=");
            expect(QueryOperator.GREATER_THAN).toBe(">");
            expect(QueryOperator.LIKE).toBe("LIKE");
            expect(QueryOperator.IN).toBe("IN");
            expect(QueryOperator.IS_NULL).toBe("IS NULL");
        });

        it("should have correct sort directions", () => {
            expect(SortDirection.ASC).toBe("ASC");
            expect(SortDirection.DESC).toBe("DESC");
        });

        it("should have correct join types", () => {
            expect(JoinType.INNER).toBe("INNER JOIN");
            expect(JoinType.LEFT).toBe("LEFT JOIN");
            expect(JoinType.RIGHT).toBe("RIGHT JOIN");
            expect(JoinType.FULL).toBe("FULL JOIN");
        });
    });

    describe("Factory Functions", () => {
        it("should create query builder with entity class", () => {
            @Entity()
            class TestEntity {
                @PrimaryGeneratedColumn()
                id!: number;
            }

            const qb = createQueryBuilder(TestEntity);
            expect(qb).toBeInstanceOf(QueryBuilder);
        });

        it("should create query builder without entity class", () => {
            const qb = createQueryBuilder();
            expect(qb).toBeInstanceOf(QueryBuilder);
        });
    });

    describe("Complex Query Scenarios", () => {
        it("should handle complex multi-table queries", () => {
            const qb = createQueryBuilder()
                .select("u.name", "p.title", "c.name as category")
                .from("users", "u")
                .innerJoin("posts", "p.author_id = u.id", "p")
                .leftJoin("categories", "c.id = p.category_id", "c")
                .whereEqual("u.isActive", true)
                .whereEqual("p.status", "published")
                .whereNotNull("p.publishedAt")
                .orderByDesc("p.publishedAt")
                .limit(20);

            const sql = qb.toSQL();
            expect(sql).toContain("SELECT u.name, p.title, c.name as category");
            expect(sql).toContain("FROM users AS u");
            expect(sql).toContain("INNER JOIN posts AS p ON p.author_id = u.id");
            expect(sql).toContain("LEFT JOIN categories AS c ON c.id = p.category_id");
            expect(sql).toContain("WHERE u.isActive = true");
            expect(sql).toContain("AND p.status = 'published'");
            expect(sql).toContain("AND p.publishedAt IS NOT NULL");
            expect(sql).toContain("ORDER BY p.publishedAt DESC");
            expect(sql).toContain("LIMIT 20");
        });

        it("should handle aggregation queries", () => {
            const qb = createQueryBuilder()
                .select("department", "COUNT(*) as employee_count", "AVG(salary) as avg_salary")
                .from("employees")
                .whereEqual("isActive", true)
                .groupBy("department")
                .having("COUNT(*)", QueryOperator.GREATER_THAN_OR_EQUAL, 5)
                .orderByDesc("employee_count");

            const sql = qb.toSQL();
            expect(sql).toContain("COUNT(*) as employee_count");
            expect(sql).toContain("AVG(salary) as avg_salary");
            expect(sql).toContain("GROUP BY department");
            expect(sql).toContain("HAVING COUNT(*) >= 5");
        });
    });
});
