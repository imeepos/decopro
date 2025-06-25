#!/usr/bin/env node
import "reflect-metadata";
import { bootstrap } from "@decopro/core";
import { CliAppInit } from "./cliAppInit";
import { McpAppInit } from "./mcpAppInit";
export interface Decopro {
    tests?: string[];
}
async function main() {
    await bootstrap([CliAppInit, McpAppInit]);
}

main();
