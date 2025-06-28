import path from "path";
import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    clean: true,
    sourcemap: true,
    minify: process.env.NODE_ENV === "production",
    splitting: true,
    treeshake: true,
    dts: false,
    target: "es2020",
    outDir: "dist",
    external: ["reflect-metadata", "tsyringe"],
    esbuildOptions(options) {
        options.conditions = ["module"];
        options.mainFields = ["module", "main"];
    },
    onSuccess: async () => {
        console.log("✅ @decopro/core build completed");
    }
});
