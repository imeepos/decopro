import "reflect-metadata";
import { CliAppInit } from "../cliAppInit";
import { Injector } from "@decopro/core";
import { EnvService } from "../services";

// Mock commander
jest.mock("commander", () => ({
    Command: jest.fn().mockImplementation(() => ({
        name: jest.fn().mockReturnThis(),
        alias: jest.fn().mockReturnThis(),
        description: jest.fn().mockReturnThis(),
        summary: jest.fn().mockReturnThis(),
        addArgument: jest.fn().mockReturnThis(),
        addOption: jest.fn().mockReturnThis(),
        action: jest.fn().mockReturnThis(),
    })),
    program: {
        addCommand: jest.fn(),
        parse: jest.fn(),
        Argument: jest.fn().mockImplementation(() => ({
            defaultValue: undefined,
        })),
        Option: jest.fn().mockImplementation(() => ({
            argParser: jest.fn().mockReturnThis(),
        })),
    },
}));

// Mock EnvService
jest.mock("../services", () => ({
    EnvService: jest.fn().mockImplementation(() => ({
        onInit: jest.fn().mockResolvedValue(undefined),
    })),
}));

describe("CliAppInit", () => {
    let cliAppInit: CliAppInit;
    let mockInjector: jest.Mocked<Injector>;
    let mockEnvService: jest.Mocked<EnvService>;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Create mock injector
        mockInjector = {
            get: jest.fn(),
            getAll: jest.fn(),
        } as any;

        // Create mock env service
        mockEnvService = {
            onInit: jest.fn().mockResolvedValue(undefined),
        } as any;

        // Setup injector mocks
        mockInjector.get.mockImplementation((token) => {
            if (token === EnvService) {
                return mockEnvService;
            }
            return {};
        });

        mockInjector.getAll.mockReturnValue([]);

        // Create instance
        cliAppInit = new CliAppInit(mockInjector);
    });

    describe("constructor", () => {
        it("should create instance with injector", () => {
            expect(cliAppInit).toBeInstanceOf(CliAppInit);
        });
    });

    describe("forRoot", () => {
        it("should add command types to commanders array", () => {
            class TestCommand {}
            const result = CliAppInit.forRoot([TestCommand]);
            expect(result).toBe(CliAppInit);
        });
    });

    describe("onInit", () => {
        it("should initialize environment and register commands", async () => {
            await cliAppInit.onInit();

            // Verify environment initialization
            expect(mockInjector.get).toHaveBeenCalledWith(EnvService);
            expect(mockEnvService.onInit).toHaveBeenCalled();

            // Verify command registration
            expect(mockInjector.getAll).toHaveBeenCalledWith(expect.any(Symbol));
        });

        it("should handle initialization errors gracefully", async () => {
            // Mock console.error to avoid noise in tests
            const consoleSpy = jest.spyOn(console, "error").mockImplementation();
            const processExitSpy = jest.spyOn(process, "exit").mockImplementation();

            // Make env service throw an error
            mockEnvService.onInit.mockRejectedValue(new Error("Test error"));

            await cliAppInit.onInit();

            expect(consoleSpy).toHaveBeenCalledWith("CLI initialization failed:", expect.any(Error));
            expect(processExitSpy).toHaveBeenCalledWith(1);

            // Restore mocks
            consoleSpy.mockRestore();
            processExitSpy.mockRestore();
        });
    });

    describe("command registration", () => {
        it("should handle empty command list", async () => {
            mockInjector.getAll.mockReturnValue([]);

            await cliAppInit.onInit();

            expect(mockInjector.getAll).toHaveBeenCalled();
        });

        it("should handle command registration errors", async () => {
            const consoleSpy = jest.spyOn(console, "error").mockImplementation();

            // Mock a command that will cause registration to fail
            mockInjector.getAll.mockReturnValue([
                {
                    target: class TestCommand {},
                    options: { name: "test" },
                },
            ]);

            // Make getArgumentsForCommand throw an error by mocking it
            const originalGetArgumentsForCommand = (cliAppInit as any).getArgumentsForCommand;
            (cliAppInit as any).getArgumentsForCommand = jest.fn().mockImplementation(() => {
                throw new Error("Test registration error");
            });

            await cliAppInit.onInit();

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining("Failed to register command"),
                expect.any(Error)
            );

            // Restore
            (cliAppInit as any).getArgumentsForCommand = originalGetArgumentsForCommand;
            consoleSpy.mockRestore();
        });
    });
});
