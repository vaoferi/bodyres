import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/app/services/**/*.tsx"],
    rules: {
      // Static pages use native links so shared hosting never requests unavailable RSC prefetch paths.
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Design donors, static vendor assets, and Playwright output are not application source.
    "Elements/**",
    "public/sharp-template/**",
    "test-results/**",
    "deploy-artifacts/**",
  ]),
]);

export default eslintConfig;
