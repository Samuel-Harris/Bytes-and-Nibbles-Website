import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    // Resolve from this file so Vitest still finds workspace packages when the
    // extension runs with cwd elsewhere (e.g. under `apps/website`).
    projects: [
      path.join(repoRoot, "packages/shared"),
      path.join(repoRoot, "apps/website"),
    ],
  },
});
