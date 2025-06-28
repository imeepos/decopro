import { defineConfig } from "tsup";

export default defineConfig([
    // Main library
    {
        entry: ["src/index.ts"],
        format: ["cjs", "esm"],
        dts: false,
        clean: true,
        splitting: false,
        treeshake: true,
        external: ["@decopro/core", "reflect-metadata", "tsyringe"]
    },
    // CLI tool
    {
        entry: ["src/cli.ts"],
        format: ["cjs"],
        dts: false,
        clean: false,
        splitting: false,
        treeshake: true,
        external: ["@decopro/core", "reflect-metadata", "tsyringe"],
        banner: {
            js: "#!/usr/bin/env node"
        }
    }
]);
