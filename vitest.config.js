import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // Test file patterns
    include: ["src/**/*.spec.js", "server/**/*.spec.js", "e2e/**/*.e2e.spec.js"],

    // Exclude patterns
    exclude: ["node_modules", "dist"],

    // Environment for server tests
    environment: "node",

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["server/**/*.js"],
      exclude: [
        "server/**/*.spec.js",
        "server/**/*.test.js",
        "server/db/**",
      ],
    },

    // Global test timeout
    testTimeout: 10000,

    // Reporter
    reporters: ["verbose"],
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
