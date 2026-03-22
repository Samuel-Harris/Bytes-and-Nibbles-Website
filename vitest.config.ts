import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Repo-relative paths (resolved from this config file). Matches Vitest
    // workspace docs and works reliably with the Vitest VS Code extension.
    projects: ["packages/shared", "apps/website"],
  },
});
