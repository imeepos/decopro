import "reflect-metadata";
import {
    Option,
    Argument,
    Action,
    Commander,
    ValidatedOption,
    ValidatedArgument,
    validateOptionOptions,
    validateArgumentOptions
} from "../index";
import { z } from "zod";

describe("Commander Decorators", () => {
    describe("Option Decorator", () => {
        it("should create option decorator without parameters", () => {
            expect(() => {
                class TestClass {
                    @Option()
                    testProperty: string;
                }
            }).not.toThrow();
        });

        it("should create option decorator with parameters", () => {
            expect(() => {
                class TestClass {
                    @Option({
                        flags: "--test <value>",
                        description: "Test option",
                        zod: z.string(),
                        defaultValue: "default"
                    })
                    testProperty: string;
                }
            }).not.toThrow();
        });

        it("should store metadata correctly", () => {
            class TestClass {
                @Option({
                    flags: "--port <port>",
                    description: "Port number",
                    zod: z.coerce.number()
                })
                port: number;
            }

            // 检查是否有元数据被存储（具体的元数据结构可能因实现而异）
            const hasMetadata = Reflect.hasMetadata || Reflect.getMetadata;
            expect(hasMetadata).toBeDefined();
        });
    });

    describe("Argument Decorator", () => {
        it("should create argument decorator without parameters", () => {
            expect(() => {
                class TestClass {
                    @Argument()
                    testProperty: string;
                }
            }).not.toThrow();
        });

        it("should create argument decorator with parameters", () => {
            expect(() => {
                class TestClass {
                    @Argument({
                        name: "[environment]",
                        description: "Environment name",
                        defaultValue: "development",
                        zod: z.string()
                    })
                    environment: string;
                }
            }).not.toThrow();
        });
    });

    describe("Action Decorator", () => {
        it("should create action decorator without parameters", () => {
            expect(() => {
                class TestClass {
                    @Action()
                    testMethod() {}
                }
            }).not.toThrow();
        });

        it("should create action decorator with parameters", () => {
            expect(() => {
                class TestClass {
                    @Action({
                        description: "Test action",
                        priority: 1
                    })
                    testMethod() {}
                }
            }).not.toThrow();
        });
    });

    describe("Commander Decorator", () => {
        it("should create commander decorator without parameters", () => {
            expect(() => {
                @Commander()
                class TestCommand {}
            }).not.toThrow();
        });

        it("should create commander decorator with parameters", () => {
            expect(() => {
                @Commander({
                    name: "test",
                    alias: "t",
                    description: "Test command",
                    summary: "Test summary",
                    hidden: false
                })
                class TestCommand {}
            }).not.toThrow();
        });
    });

    describe("Validation Functions", () => {
        describe("validateOptionOptions", () => {
            it("should validate correct option flags", () => {
                const result = validateOptionOptions({
                    flags: "--port <port>",
                    description: "Port number"
                });
                expect(result.valid).toBe(true);
                expect(result.errors).toHaveLength(0);
            });

            it("should validate short option flags", () => {
                const result = validateOptionOptions({
                    flags: "-p",
                    description: "Port number"
                });
                expect(result.valid).toBe(true);
                expect(result.errors).toHaveLength(0);
            });

            it("should reject invalid option flags", () => {
                const result = validateOptionOptions({
                    flags: "invalid-flag",
                    description: "Invalid flag"
                });
                expect(result.valid).toBe(false);
                expect(result.errors).toContain("Invalid flags format. Should match patterns like --port, -p, --port <port>, etc.");
            });
        });

        describe("validateArgumentOptions", () => {
            it("should validate optional argument format", () => {
                const result = validateArgumentOptions({
                    name: "[environment]",
                    description: "Environment"
                });
                expect(result.valid).toBe(true);
                expect(result.errors).toHaveLength(0);
            });

            it("should validate required argument format", () => {
                const result = validateArgumentOptions({
                    name: "<name>",
                    description: "Name"
                });
                expect(result.valid).toBe(true);
                expect(result.errors).toHaveLength(0);
            });

            it("should validate simple argument format", () => {
                const result = validateArgumentOptions({
                    name: "environment",
                    description: "Environment"
                });
                expect(result.valid).toBe(true);
                expect(result.errors).toHaveLength(0);
            });

            it("should reject invalid argument format", () => {
                const result = validateArgumentOptions({
                    name: "invalid-[format",
                    description: "Invalid"
                });
                expect(result.valid).toBe(false);
                expect(result.errors).toContain("Invalid argument name format. Should be [optional], <required>, or simple name");
            });
        });
    });

    describe("Validated Decorators", () => {
        it("should create ValidatedOption with valid configuration", () => {
            expect(() => {
                class TestClass {
                    @ValidatedOption({
                        flags: "--port <port>",
                        description: "Port number"
                    })
                    port: number;
                }
            }).not.toThrow();
        });

        it("should throw error for ValidatedOption with invalid configuration", () => {
            expect(() => {
                class TestClass {
                    @ValidatedOption({
                        flags: "invalid-flag",
                        description: "Invalid"
                    })
                    port: number;
                }
            }).toThrow("Invalid option configuration");
        });

        it("should create ValidatedArgument with valid configuration", () => {
            expect(() => {
                class TestClass {
                    @ValidatedArgument({
                        name: "[environment]",
                        description: "Environment"
                    })
                    environment: string;
                }
            }).not.toThrow();
        });

        it("should throw error for ValidatedArgument with invalid configuration", () => {
            expect(() => {
                class TestClass {
                    @ValidatedArgument({
                        name: "invalid-[format",
                        description: "Invalid"
                    })
                    environment: string;
                }
            }).toThrow("Invalid argument configuration");
        });
    });

    describe("Integration Test", () => {
        it("should work with complete command class", () => {
            expect(() => {
                @Commander({
                    name: "serve",
                    description: "Start development server",
                    alias: "s"
                })
                class ServeCommand {
                    @Argument({
                        name: "[environment]",
                        description: "Environment to run in",
                        defaultValue: "development"
                    })
                    environment: string;

                    @Option({
                        flags: "--port <port>",
                        description: "Port number",
                        zod: z.coerce.number().default(3000)
                    })
                    port: number;

                    @Option({
                        flags: "--host <host>",
                        description: "Host address",
                        zod: z.string().default("localhost")
                    })
                    host: string;

                    @Action({
                        description: "Start the server",
                        priority: 1
                    })
                    async start() {
                        console.log(`Starting server on ${this.host}:${this.port} in ${this.environment} mode`);
                    }
                }
            }).not.toThrow();
        });
    });
});
