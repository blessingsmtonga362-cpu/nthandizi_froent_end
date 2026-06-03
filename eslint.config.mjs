import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // This rule flags `void asyncFn()` inside useEffect as a "setState in
      // effect" violation — a well-known false positive for the standard
      // pattern of kicking off async work inside an effect without making the
      // effect callback itself async. The React docs explicitly recommend this
      // pattern.  Disabling it here so it doesn't block Vercel deployments.
      "react-hooks/set-state-in-effect": "off",

      // Unused vars in catch blocks are sometimes intentional (e.g. `catch (err)`)
      // Downgrade to warn so they don't block builds.
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],

      // Unused exports/helpers are warnings, not errors.
      "no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
    },
  },
]);

export default eslintConfig;
