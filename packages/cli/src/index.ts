#!/usr/bin/env tsx
import "reflect-metadata"
import { bootstrap } from "@decopro/core";
import { CliAppInit } from "./cliAppInit";

async function main() {
    await bootstrap([
        CliAppInit
    ])
}

main();