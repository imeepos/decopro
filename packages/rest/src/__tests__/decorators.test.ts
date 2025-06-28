import "reflect-metadata";
import {
    Body, Query, Param, Header,
    Controller, Get, Post, Put, Delete, Patch, Head, Options, Sse,
    HttpMethod, HttpStatus,
    isHttpMethodToken, isParameterToken, getHttpMethodToken,
    BODY_TOKEN, QUERY_TOKEN, PARAM_TOKEN, HEADER_TOKEN,
    CONTROLLER_TOKEN, GET_TOKEN, POST_TOKEN, PUT_TOKEN, DELETE_TOKEN,
    PATCH_TOKEN, HEAD_TOKEN, OPTIONS_TOKEN, SSE_TOKEN
} from "../index";

describe("REST Decorators", () => {
    describe("Decorator Functions", () => {
        it("should be functions that can be called", () => {
            // 测试装饰器是否为函数
            expect(typeof Body).toBe("function");
            expect(typeof Query).toBe("function");
            expect(typeof Param).toBe("function");
            expect(typeof Header).toBe("function");
            expect(typeof Controller).toBe("function");
            expect(typeof Get).toBe("function");
            expect(typeof Post).toBe("function");
            expect(typeof Put).toBe("function");
            expect(typeof Delete).toBe("function");
            expect(typeof Patch).toBe("function");
            expect(typeof Head).toBe("function");
            expect(typeof Options).toBe("function");
            expect(typeof Sse).toBe("function");
        });

        it("should be able to create decorators without throwing", () => {
            // 测试装饰器可以被调用而不抛出错误
            expect(() => Body()).not.toThrow();
            expect(() => Body({ key: "test" })).not.toThrow();
            expect(() => Query()).not.toThrow();
            expect(() => Query({ key: "test" })).not.toThrow();
            expect(() => Param()).not.toThrow();
            expect(() => Param({ key: "test" })).not.toThrow();
            expect(() => Header()).not.toThrow();
            expect(() => Header({ key: "test" })).not.toThrow();
            expect(() => Controller()).not.toThrow();
            expect(() => Controller({ path: "/test" })).not.toThrow();
            expect(() => Get()).not.toThrow();
            expect(() => Get({ path: "/test" })).not.toThrow();
            expect(() => Post()).not.toThrow();
            expect(() => Put()).not.toThrow();
            expect(() => Delete()).not.toThrow();
            expect(() => Patch()).not.toThrow();
            expect(() => Head()).not.toThrow();
            expect(() => Options()).not.toThrow();
            expect(() => Sse()).not.toThrow();
        });

        it("should be able to apply decorators to classes and methods", () => {
            // 测试装饰器可以应用到类和方法上而不抛出错误
            expect(() => {
                @Controller()
                class TestController {
                    @Get()
                    getUsers(@Body() _body: any, @Query() _query: any) {}

                    @Post({ path: "/create" })
                    createUser(@Body({ key: "userData" }) _userData: any) {}

                    @Put()
                    updateUser(@Param({ key: "id" }) _id: string) {}

                    @Delete()
                    deleteUser(@Header({ key: "auth" }) _auth: string) {}

                    @Patch()
                    patchUser() {}

                    @Head()
                    checkUser() {}

                    @Options()
                    getOptions() {}

                    @Sse()
                    streamEvents() {}
                }
            }).not.toThrow();
        });
    });

    describe("Utility Functions", () => {
        describe("isHttpMethodToken", () => {
            it("should return true for HTTP method tokens", () => {
                expect(isHttpMethodToken(GET_TOKEN)).toBe(true);
                expect(isHttpMethodToken(POST_TOKEN)).toBe(true);
                expect(isHttpMethodToken(PUT_TOKEN)).toBe(true);
                expect(isHttpMethodToken(DELETE_TOKEN)).toBe(true);
                expect(isHttpMethodToken(PATCH_TOKEN)).toBe(true);
                expect(isHttpMethodToken(HEAD_TOKEN)).toBe(true);
                expect(isHttpMethodToken(OPTIONS_TOKEN)).toBe(true);
                expect(isHttpMethodToken(SSE_TOKEN)).toBe(true);
            });

            it("should return false for non-HTTP method tokens", () => {
                expect(isHttpMethodToken(BODY_TOKEN)).toBe(false);
                expect(isHttpMethodToken(QUERY_TOKEN)).toBe(false);
                expect(isHttpMethodToken(PARAM_TOKEN)).toBe(false);
                expect(isHttpMethodToken(HEADER_TOKEN)).toBe(false);
                expect(isHttpMethodToken(CONTROLLER_TOKEN)).toBe(false);
            });
        });

        describe("isParameterToken", () => {
            it("should return true for parameter tokens", () => {
                expect(isParameterToken(BODY_TOKEN)).toBe(true);
                expect(isParameterToken(QUERY_TOKEN)).toBe(true);
                expect(isParameterToken(PARAM_TOKEN)).toBe(true);
                expect(isParameterToken(HEADER_TOKEN)).toBe(true);
            });

            it("should return false for non-parameter tokens", () => {
                expect(isParameterToken(GET_TOKEN)).toBe(false);
                expect(isParameterToken(POST_TOKEN)).toBe(false);
                expect(isParameterToken(CONTROLLER_TOKEN)).toBe(false);
            });
        });

        describe("getHttpMethodToken", () => {
            it("should return correct tokens for HTTP methods", () => {
                expect(getHttpMethodToken(HttpMethod.GET)).toBe(GET_TOKEN);
                expect(getHttpMethodToken(HttpMethod.POST)).toBe(POST_TOKEN);
                expect(getHttpMethodToken(HttpMethod.PUT)).toBe(PUT_TOKEN);
                expect(getHttpMethodToken(HttpMethod.DELETE)).toBe(DELETE_TOKEN);
                expect(getHttpMethodToken(HttpMethod.PATCH)).toBe(PATCH_TOKEN);
                expect(getHttpMethodToken(HttpMethod.HEAD)).toBe(HEAD_TOKEN);
                expect(getHttpMethodToken(HttpMethod.OPTIONS)).toBe(OPTIONS_TOKEN);
            });
        });
    });

    describe("Constants", () => {
        describe("HttpStatus", () => {
            it("should have correct status codes", () => {
                expect(HttpStatus.OK).toBe(200);
                expect(HttpStatus.CREATED).toBe(201);
                expect(HttpStatus.BAD_REQUEST).toBe(400);
                expect(HttpStatus.UNAUTHORIZED).toBe(401);
                expect(HttpStatus.NOT_FOUND).toBe(404);
                expect(HttpStatus.INTERNAL_SERVER_ERROR).toBe(500);
            });
        });

        describe("HttpMethod", () => {
            it("should have correct method values", () => {
                expect(HttpMethod.GET).toBe("GET");
                expect(HttpMethod.POST).toBe("POST");
                expect(HttpMethod.PUT).toBe("PUT");
                expect(HttpMethod.DELETE).toBe("DELETE");
                expect(HttpMethod.PATCH).toBe("PATCH");
                expect(HttpMethod.HEAD).toBe("HEAD");
                expect(HttpMethod.OPTIONS).toBe("OPTIONS");
            });
        });
    });
});
