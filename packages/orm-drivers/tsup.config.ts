import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'es2020',
  external: [
    '@decopro/orm',
    'reflect-metadata',
    'sqlite3',
    'mysql2',
    'pg'
  ],
  esbuildOptions(options) {
    options.conditions = ['module'];
  },
});
