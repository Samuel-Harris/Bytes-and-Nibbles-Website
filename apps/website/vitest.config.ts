import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.join(rootDir, "app"),
      "react-markdown": path.join(rootDir, "__mocks__/react-markdown.js"),
      "remark-gfm": path.join(rootDir, "__mocks__/remark-gfm.js"),
      "react-syntax-highlighter": path.join(
        rootDir,
        "__mocks__/react-syntax-highlighter.js",
      ),
      "react-syntax-highlighter/dist/esm/styles/prism": path.join(
        rootDir,
        "__mocks__/react-syntax-highlighter-style.js",
      ),
    },
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
