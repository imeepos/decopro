import "reflect-metadata";
import {
    DatabaseType,
    DatabaseDriverRegistry
} from "@decopro/orm";
import {
    registerAllDrivers,
    registerSQLiteDriver,
    registerMySQLDriver,
    isDriverAvailable,
    getAvailableDrivers,
    createDatabaseManager
} from "../index";

describe("ORM Drivers", () => {
    beforeEach(() => {
        // 清除注册的驱动
        DatabaseDriverRegistry.clear();
    });

    describe("Driver Registration", () => {
        it("should register SQLite driver", () => {
            registerSQLiteDriver();
            expect(isDriverAvailable(DatabaseType.SQLITE)).toBe(true);
        });

        it("should register MySQL driver", () => {
            registerMySQLDriver();
            expect(isDriverAvailable(DatabaseType.MYSQL)).toBe(true);
        });

        it("should register all drivers", () => {
            registerAllDrivers();
            const availableDrivers = getAvailableDrivers();
            expect(availableDrivers).toContain(DatabaseType.SQLITE);
            expect(availableDrivers).toContain(DatabaseType.MYSQL);
        });

        it("should check driver availability", () => {
            expect(isDriverAvailable(DatabaseType.SQLITE)).toBe(false);
            registerSQLiteDriver();
            expect(isDriverAvailable(DatabaseType.SQLITE)).toBe(true);
        });

        it("should get available drivers", () => {
            expect(getAvailableDrivers()).toHaveLength(0);
            registerSQLiteDriver();
            expect(getAvailableDrivers()).toHaveLength(1);
            registerMySQLDriver();
            expect(getAvailableDrivers()).toHaveLength(2);
        });
    });

    describe("Database Manager Creation", () => {
        beforeEach(() => {
            registerAllDrivers();
        });

        it("should create SQLite database manager", async () => {
            const manager = await createDatabaseManager(DatabaseType.SQLITE);
            expect(manager).toBeDefined();
            expect(typeof manager.initialize).toBe("function");
            expect(typeof manager.getConnection).toBe("function");
            expect(typeof manager.close).toBe("function");
        });

        it("should create MySQL database manager", async () => {
            const manager = await createDatabaseManager(DatabaseType.MYSQL);
            expect(manager).toBeDefined();
            expect(typeof manager.initialize).toBe("function");
            expect(typeof manager.getConnection).toBe("function");
            expect(typeof manager.close).toBe("function");
        });

        it("should throw error for unsupported driver", async () => {
            DatabaseDriverRegistry.clear();
            await expect(createDatabaseManager(DatabaseType.SQLITE)).rejects.toThrow(
                "No driver registered for database type: sqlite"
            );
        });

        it("should throw error for PostgreSQL (not implemented)", async () => {
            await expect(createDatabaseManager(DatabaseType.POSTGRESQL)).rejects.toThrow(
                "No driver registered for database type: postgresql"
            );
        });
    });

    describe("Driver Interface Compliance", () => {
        beforeEach(() => {
            registerAllDrivers();
        });

        it("should have consistent interface for SQLite manager", async () => {
            const manager = await createDatabaseManager(DatabaseType.SQLITE);
            
            // 检查必需的方法
            expect(typeof manager.initialize).toBe("function");
            expect(typeof manager.getConnection).toBe("function");
            expect(typeof manager.query).toBe("function");
            expect(typeof manager.transaction).toBe("function");
            expect(typeof manager.close).toBe("function");
            expect(typeof manager.isConnected).toBe("function");
            expect(typeof manager.getDatabaseInfo).toBe("function");
        });

        it("should have consistent interface for MySQL manager", async () => {
            const manager = await createDatabaseManager(DatabaseType.MYSQL);
            
            // 检查必需的方法
            expect(typeof manager.initialize).toBe("function");
            expect(typeof manager.getConnection).toBe("function");
            expect(typeof manager.query).toBe("function");
            expect(typeof manager.transaction).toBe("function");
            expect(typeof manager.close).toBe("function");
            expect(typeof manager.isConnected).toBe("function");
            expect(typeof manager.getDatabaseInfo).toBe("function");
        });
    });

    describe("Error Handling", () => {
        it("should handle missing dependencies gracefully", async () => {
            registerAllDrivers();
            
            // SQLite 和 MySQL 管理器应该在没有依赖时抛出有意义的错误
            const sqliteManager = await createDatabaseManager(DatabaseType.SQLITE);
            const mysqlManager = await createDatabaseManager(DatabaseType.MYSQL);

            // 这些测试会在没有安装相应数据库驱动时失败，这是预期的行为
            expect(sqliteManager).toBeDefined();
            expect(mysqlManager).toBeDefined();
        });
    });
});
