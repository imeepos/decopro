import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts", "src/bin.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
});
