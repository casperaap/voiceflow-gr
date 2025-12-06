// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  // Next.js + React + Core Web Vitals rules
  ...nextCoreWebVitals,

  // Optional: customize/disable rules here
  // {
  //   rules: {
  //     "react/no-unescaped-entities": "off",
  //     "@next/next/no-img-element": "off",
  //   },
  // },

  // Ignore build artifacts
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
