import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Match only the package entry — a string alias would also match
    // `react-syntax-highlighter/dist/...` and break style subpath imports.
    alias: [
      {
        find: /^react-syntax-highlighter$/,
        replacement: path.join(rootDir, "__mocks__/react-syntax-highlighter.js"),
      },
      { find: "@", replacement: path.join(rootDir, "app") },
      {
        find: "react-markdown",
        replacement: path.join(rootDir, "__mocks__/react-markdown.js"),
      },
      {
        find: "remark-gfm",
        replacement: path.join(rootDir, "__mocks__/remark-gfm.js"),
      },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [path.join(rootDir, "vitest.setup.ts")],
    include: ["app/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["app/**/*.{ts,tsx}"],
    },
  },
});
