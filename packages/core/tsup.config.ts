import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: false,
    clean: true,
    sourcemap: true,
    minify: process.env.NODE_ENV === "production",
    splitting: false,
    treeshake: true,
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
