import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: false,
    clean: true,
    splitting: false,
    treeshake: true,
    external: ["@decopro/core", "reflect-metadata", "tsyringe"]
});
