import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/main.ts"],
    format: ["cjs", "esm"],
    dts: false,
    clean: true,
    external: ["@decopro/core", "@decopro/mcp", "reflect-metadata", "tsyringe"]
});
