/**
 * 基础错误类，提供更好的错误信息和调试支持
 */
export abstract class DecoProError extends Error {
    public readonly code: string;
    public readonly timestamp: Date;

    constructor(message: string, code: string) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.timestamp = new Date();

        // 确保错误堆栈正确显示
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    /**
     * 获取结构化的错误信息
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            timestamp: this.timestamp.toISOString(),
            stack: this.stack
        };
    }
}

/**
 * 类名重复错误
 */
export class DuplicateClassNameError extends DecoProError {
    constructor(className: string) {
        super(
            `Duplicate class name detected: "${className}". Each class must have a unique name within the container.`,
            "DUPLICATE_CLASS_NAME"
        );
    }
}

/**
 * 类名未找到错误
 */
export class ClassNameNotFoundError extends DecoProError {
    constructor(className: string) {
        super(
            `Class name not found: "${className}". Make sure the class is properly registered.`,
            "CLASS_NAME_NOT_FOUND"
        );
    }
}

/**
 * JSON类型名称错误
 */
export class JsonWithTypeNameError extends DecoProError {
    constructor(details?: string) {
        const message = details
            ? `Invalid JSON with type name: ${details}`
            : "Object must have a valid __typeName property for deserialization.";
        super(message, "INVALID_JSON_TYPE_NAME");
    }
}

/**
 * 依赖注入错误
 */
export class InjectionError extends DecoProError {
    constructor(token: string, details?: string) {
        const message = details
            ? `Injection failed for token "${token}": ${details}`
            : `Failed to resolve dependency for token: "${token}"`;
        super(message, "INJECTION_ERROR");
    }
}

/**
 * 循环依赖错误
 */
export class CircularDependencyError extends DecoProError {
    constructor(dependencyChain: string[]) {
        const chain = dependencyChain.join(" -> ");
        super(`Circular dependency detected: ${chain}`, "CIRCULAR_DEPENDENCY");
    }
}
