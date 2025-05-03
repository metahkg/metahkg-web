// src/types/prettier.d.ts

/**
 * Provides type declarations for Prettier internal modules that might not be
 * automatically picked up by TypeScript, resolving TS7016 errors.
 */

declare module "prettier/standalone" {
    import * as prettier from "prettier";
    export = prettier;
}

declare module "prettier/parser-postcss" {
    import { Plugin } from "prettier";
    const plugin: Plugin;
    // Use ES Module default export style in declaration
    export default plugin;
}
