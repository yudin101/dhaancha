import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [
        "src/server.ts",
        "src/swagger/**",
        "src/db/schema.ts",
        "src/routes/**",
        "src/types/**",
      ],
      reporter: ["text-summary", "html", "lcov"],
      thresholds: { statements: 85, branches: 80, functions: 80, lines: 85 },
    },
    server: {
      deps: {
        inline: ["zod"],
      },
    },
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
  },
});
