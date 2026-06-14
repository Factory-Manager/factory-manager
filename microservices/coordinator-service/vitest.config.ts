import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },

  test: {
    coverage: {
      provider: "v8",

      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },

      reporter: ["text", "html"],

      exclude: [
        "node_modules/",
        "test/",
      ],
    },

    environment: "node",
  },
});