#!/usr/bin/env node
import "reflect-metadata";
import { bootstrap } from "@decopro/core";
import { CliAppInit } from "./cliAppInit";
import { join } from "path";
import { existsSync } from "fs";
import { glob } from "glob";
export interface Decopro {
    tests?: string[];
}
async function main() {
    const root = process.cwd();
    const decopro = join(root, "decopro.json");
    if (existsSync(decopro)) {
        const config: Decopro = require(join(root, "decopro.json"));
        if (config && config.tests) {
            const paths = config.tests.map((t) => join(root, t));
            const tests = await glob(paths, { ignore: ["node_modules/**"] });
            await Promise.all(
                tests.map((file: string) => {
                    return import(file).then((res) => res.default);
                })
            );
        }
    }
    await bootstrap([CliAppInit]);
}

main();
