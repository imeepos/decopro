#!/usr/bin/env node
import "reflect-metadata";
import { bootstrap } from "@decopro/core";
import { CliAppInit } from "./cliAppInit";
export interface Decopro {
    tests?: string[];
}
async function main() {
    const root = process.cwd();
    await bootstrap([CliAppInit]);
}

main();
