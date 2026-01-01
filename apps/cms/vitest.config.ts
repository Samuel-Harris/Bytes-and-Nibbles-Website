/// <reference types="vitest" />
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      coverage: {
        enabled: true,
        provider: "istanbul",
        reporter: ["text", "json", "html"],
        include: ["src/**/*.{ts,tsx}"],
        exclude: [
          "src/setupTests.ts",
          "src/vite-env.d.ts",
          "src/main.tsx",
          "**/*.test.ts",
          "**/*.test.tsx",
        ],
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  }),
);
