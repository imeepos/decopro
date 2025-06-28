import "reflect-metadata";
import {
    Entity,
    Column,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    OneToOne,
    OneToMany,
    ManyToOne,
    ManyToMany,
    Index,
    Unique,
    BeforeInsert,
    AfterInsert,
    BeforeUpdate,
    AfterUpdate,
    BeforeRemove,
    AfterRemove,
    AfterLoad,
    ColumnType,
    RelationType,
    IndexType,
    CascadeType,
    FetchType,
    getTableName,
    getEntityColumns,
    getEntityRelations,
    isEntityToken,
    isColumnToken,
    isRelationToken,
    isIndexToken,
    isLifecycleToken,
    ORM_TOKENS,
    createEntity,
    ENTITY_TOKEN,
    COLUMN_TOKEN,
    PRIMARY_COLUMN_TOKEN,
    PRIMARY_GENERATED_COLUMN_TOKEN,
    ONE_TO_ONE_TOKEN,
    ONE_TO_MANY_TOKEN,
    MANY_TO_ONE_TOKEN,
    MANY_TO_MANY_TOKEN,
    INDEX_TOKEN,
    UNIQUE_TOKEN,
    BEFORE_INSERT_TOKEN,
    AFTER_INSERT_TOKEN,
    BEFORE_UPDATE_TOKEN,
    AFTER_UPDATE_TOKEN,
    BEFORE_REMOVE_TOKEN,
    AFTER_REMOVE_TOKEN,
    AFTER_LOAD_TOKEN
} from "../decorator";

describe("ORM Decorators", () => {
    describe("Entity Decorator", () => {
        it("should apply Entity decorator with default options", () => {
            expect(() => {
                @Entity()
                class TestEntity {
                    id: number;
                }
            }).not.toThrow();
        });

        it("should apply Entity decorator with custom options", () => {
            expect(() => {
                @Entity({
                    tableName: "custom_table",
                    schema: "public",
                    comment: "Test entity"
                })
                class TestEntity {
                    id: number;
                }
            }).not.toThrow();
        });

        it("should work with createEntity factory", () => {
            expect(() => {
                class TestEntity {
                    id: number;
                }

                const EntityClass = createEntity(TestEntity, {
                    tableName: "test_table"
                });
            }).not.toThrow();
        });
    });

    describe("Column Decorators", () => {
        it("should apply Column decorator", () => {
            expect(() => {
                class TestEntity {
                    @Column()
                    name: string;

                    @Column({ type: ColumnType.VARCHAR, length: 100, nullable: false })
                    email: string;
                }
            }).not.toThrow();
        });

        it("should apply PrimaryColumn decorator", () => {
            expect(() => {
                class TestEntity {
                    @PrimaryColumn()
                    id: number;

                    @PrimaryColumn({ type: ColumnType.VARCHAR, length: 36 })
                    uuid: string;
                }
            }).not.toThrow();
        });

        it("should apply PrimaryGeneratedColumn decorator", () => {
            expect(() => {
                class TestEntity {
                    @PrimaryGeneratedColumn()
                    id: number;

                    @PrimaryGeneratedColumn({ strategy: "uuid" })
                    uuid: string;
                }
            }).not.toThrow();
        });
    });

    describe("Relationship Decorators", () => {
        class User {
            id: number;
        }

        class Profile {
            id: number;
        }

        class Post {
            id: number;
        }

        class Role {
            id: number;
        }

        it("should apply OneToOne decorator", () => {
            expect(() => {
                class TestEntity {
                    @OneToOne(() => Profile)
                    profile: Profile;

                    @OneToOne(() => User, { cascade: true })
                    user: User;
                }
            }).not.toThrow();
        });

        it("should apply OneToMany decorator", () => {
            expect(() => {
                class TestEntity {
                    @OneToMany(() => Post, { mappedBy: "author" })
                    posts: Post[];
                }
            }).not.toThrow();
        });

        it("should apply ManyToOne decorator", () => {
            expect(() => {
                class TestEntity {
                    @ManyToOne(() => User, { joinColumn: "author_id" })
                    author: User;
                }
            }).not.toThrow();
        });

        it("should apply ManyToMany decorator", () => {
            expect(() => {
                class TestEntity {
                    @ManyToMany(() => Role, { joinTable: "user_roles" })
                    roles: Role[];
                }
            }).not.toThrow();
        });
    });

    describe("Index Decorators", () => {
        it("should apply Index decorator", () => {
            expect(() => {
                class TestEntity {
                    @Index()
                    @Column()
                    email: string;

                    @Index({ unique: true, name: "idx_username" })
                    @Column()
                    username: string;
                }
            }).not.toThrow();
        });

        it("should apply Unique decorator", () => {
            expect(() => {
                class TestEntity {
                    @Unique()
                    @Column()
                    email: string;

                    @Unique({ name: "uq_phone" })
                    @Column()
                    phone: string;
                }
            }).not.toThrow();
        });
    });

    describe("Lifecycle Decorators", () => {
        it("should apply lifecycle decorators", () => {
            expect(() => {
                class TestEntity {
                    @BeforeInsert()
                    beforeInsert() {}

                    @AfterInsert()
                    afterInsert() {}

                    @BeforeUpdate()
                    beforeUpdate() {}

                    @AfterUpdate()
                    afterUpdate() {}

                    @BeforeRemove()
                    beforeRemove() {}

                    @AfterRemove()
                    afterRemove() {}

                    @AfterLoad()
                    afterLoad() {}
                }
            }).not.toThrow();
        });
    });

    describe("Utility Functions", () => {
        it("should identify token types correctly", () => {
            expect(isEntityToken(ENTITY_TOKEN)).toBe(true);
            expect(isEntityToken(COLUMN_TOKEN)).toBe(false);

            expect(isColumnToken(COLUMN_TOKEN)).toBe(true);
            expect(isColumnToken(PRIMARY_COLUMN_TOKEN)).toBe(true);
            expect(isColumnToken(PRIMARY_GENERATED_COLUMN_TOKEN)).toBe(true);
            expect(isColumnToken(ENTITY_TOKEN)).toBe(false);

            expect(isRelationToken(ONE_TO_ONE_TOKEN)).toBe(true);
            expect(isRelationToken(ONE_TO_MANY_TOKEN)).toBe(true);
            expect(isRelationToken(MANY_TO_ONE_TOKEN)).toBe(true);
            expect(isRelationToken(MANY_TO_MANY_TOKEN)).toBe(true);
            expect(isRelationToken(COLUMN_TOKEN)).toBe(false);

            expect(isIndexToken(INDEX_TOKEN)).toBe(true);
            expect(isIndexToken(UNIQUE_TOKEN)).toBe(true);
            expect(isIndexToken(COLUMN_TOKEN)).toBe(false);

            expect(isLifecycleToken(BEFORE_INSERT_TOKEN)).toBe(true);
            expect(isLifecycleToken(AFTER_INSERT_TOKEN)).toBe(true);
            expect(isLifecycleToken(COLUMN_TOKEN)).toBe(false);
        });

        it("should have all tokens in ORM_TOKENS", () => {
            expect(ORM_TOKENS.ENTITY).toBe(ENTITY_TOKEN);
            expect(ORM_TOKENS.COLUMN).toBe(COLUMN_TOKEN);
            expect(ORM_TOKENS.PRIMARY_COLUMN).toBe(PRIMARY_COLUMN_TOKEN);
            expect(ORM_TOKENS.PRIMARY_GENERATED_COLUMN).toBe(PRIMARY_GENERATED_COLUMN_TOKEN);
            expect(ORM_TOKENS.ONE_TO_ONE).toBe(ONE_TO_ONE_TOKEN);
            expect(ORM_TOKENS.ONE_TO_MANY).toBe(ONE_TO_MANY_TOKEN);
            expect(ORM_TOKENS.MANY_TO_ONE).toBe(MANY_TO_ONE_TOKEN);
            expect(ORM_TOKENS.MANY_TO_MANY).toBe(MANY_TO_MANY_TOKEN);
            expect(ORM_TOKENS.INDEX).toBe(INDEX_TOKEN);
            expect(ORM_TOKENS.UNIQUE).toBe(UNIQUE_TOKEN);
            expect(ORM_TOKENS.BEFORE_INSERT).toBe(BEFORE_INSERT_TOKEN);
            expect(ORM_TOKENS.AFTER_INSERT).toBe(AFTER_INSERT_TOKEN);
            expect(ORM_TOKENS.BEFORE_UPDATE).toBe(BEFORE_UPDATE_TOKEN);
            expect(ORM_TOKENS.AFTER_UPDATE).toBe(AFTER_UPDATE_TOKEN);
            expect(ORM_TOKENS.BEFORE_REMOVE).toBe(BEFORE_REMOVE_TOKEN);
            expect(ORM_TOKENS.AFTER_REMOVE).toBe(AFTER_REMOVE_TOKEN);
            expect(ORM_TOKENS.AFTER_LOAD).toBe(AFTER_LOAD_TOKEN);
        });

        it("should get table name", () => {
            class TestEntity {}
            expect(getTableName(TestEntity)).toBe("testentity");
        });

        it("should get entity columns (placeholder)", () => {
            class TestEntity {}
            expect(getEntityColumns(TestEntity)).toEqual([]);
        });

        it("should get entity relations (placeholder)", () => {
            class TestEntity {}
            expect(getEntityRelations(TestEntity)).toEqual([]);
        });
    });

    describe("Enums", () => {
        it("should have correct ColumnType values", () => {
            expect(ColumnType.INT).toBe("int");
            expect(ColumnType.VARCHAR).toBe("varchar");
            expect(ColumnType.TEXT).toBe("text");
            expect(ColumnType.BOOLEAN).toBe("boolean");
            expect(ColumnType.JSON).toBe("json");
        });

        it("should have correct RelationType values", () => {
            expect(RelationType.ONE_TO_ONE).toBe("one-to-one");
            expect(RelationType.ONE_TO_MANY).toBe("one-to-many");
            expect(RelationType.MANY_TO_ONE).toBe("many-to-one");
            expect(RelationType.MANY_TO_MANY).toBe("many-to-many");
        });

        it("should have correct IndexType values", () => {
            expect(IndexType.PRIMARY).toBe("primary");
            expect(IndexType.UNIQUE).toBe("unique");
            expect(IndexType.INDEX).toBe("index");
            expect(IndexType.FULLTEXT).toBe("fulltext");
        });

        it("should have correct CascadeType values", () => {
            expect(CascadeType.PERSIST).toBe("persist");
            expect(CascadeType.REMOVE).toBe("remove");
            expect(CascadeType.UPDATE).toBe("update");
            expect(CascadeType.ALL).toBe("all");
        });

        it("should have correct FetchType values", () => {
            expect(FetchType.LAZY).toBe("lazy");
            expect(FetchType.EAGER).toBe("eager");
        });
    });
});
