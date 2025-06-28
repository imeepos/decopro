import "reflect-metadata";
import { Injector } from "../injector";
import { container, injectable } from "tsyringe";

describe("Injector", () => {
    let injector: Injector;

    beforeEach(() => {
        injector = new Injector(container.createChildContainer());
    });

    describe("Basic functionality", () => {
        @injectable()
        class TestService {
            getValue() {
                return "test-value";
            }
        }

        it("should resolve dependencies", () => {
            const service = injector.get(TestService);
            expect(service).toBeInstanceOf(TestService);
            expect(service.getValue()).toBe("test-value");
        });

        it("should check if token can be resolved", () => {
            expect(injector.canResolve(TestService)).toBe(true);
        });

        it("should return empty array for non-existent tokens", () => {
            const NON_EXISTENT_TOKEN = Symbol("NON_EXISTENT");
            const result = injector.getAll(NON_EXISTENT_TOKEN);
            expect(result).toEqual([]);
        });
    });

    describe("Serialization", () => {
        it("should handle null and undefined values", () => {
            expect(injector.toJson(null)).toBe(null);
            expect(injector.toJson(undefined)).toBe(undefined);
            expect(injector.toJson("string")).toBe("string");
            expect(injector.toJson(123)).toBe(123);
        });

        it("should handle arrays", () => {
            const arr = [1, 2, 3];
            expect(injector.toJson(arr)).toEqual([1, 2, 3]);
        });

        it("should handle Date objects", () => {
            const date = new Date("2023-01-01T00:00:00.000Z");
            expect(injector.toJson(date)).toBe("2023-01-01T00:00:00.000Z");
        });
    });

    describe("Deserialization", () => {
        it("should handle basic types", () => {
            expect(injector.fromJson(null)).toBe(null);
            expect(injector.fromJson(undefined)).toBe(undefined);
            expect(injector.fromJson("string")).toBe("string");
            expect(injector.fromJson(123)).toBe(123);
        });

        it("should handle arrays", () => {
            const arr = [1, 2, 3];
            expect(injector.fromJson(arr)).toEqual([1, 2, 3]);
        });
    });

    describe("Cleanup", () => {
        class CleanupTest {
            cleaned = false;

            async onDestroy() {
                this.cleaned = true;
            }
        }

        it("should cleanup objects with onDestroy method", async () => {
            const instance = new CleanupTest();
            await injector.cleanup(instance);
            expect(instance.cleaned).toBe(true);
        });

        it("should handle objects without onDestroy method", async () => {
            const instance = { value: "test" };
            await expect(injector.cleanup(instance)).resolves.toBeUndefined();
        });
    });
});
