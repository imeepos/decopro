export class DuplicateClassNameError extends Error {
    constructor(name: string) {
        super(`${name}类名重复`);
    }
}

export class ClassNameNotFoundError extends Error {
    constructor(name: string) {
        super(`${name}类名没找到`);
    }
}

export class JsonWithTypeNameError extends Error {
    constructor() {
        super();
    }
}
