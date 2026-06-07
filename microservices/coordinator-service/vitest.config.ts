import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@test": fileURLToPath(new URL("./test", import.meta.url))
        }
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
    },
});